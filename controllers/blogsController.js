const Post = require('../models/blogs');
const { post } = require('../routers/users');
const memoryCache = require('memory-cache');
const { ObjectId } = require('mongoose').Types;
const blogPostValidations = require('../validations/blogPostValidation');
const blogPutValidations = require('../validations/blogPutValidation');

// CREATE BLOG POSTS
exports.createBlog = async (req, res) => {
    try {
        const { error } = blogPostValidations(req.body);
        if (error)
            return res.status(400).send({ error: error.details[0].message });

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
        }

        const { title, content } = req.body;
        const newPost = new Post({
            title,
            content,
            author: req.user._id
        });
        await newPost.save();

        return res.status(201).json({
            message: 'Post created successfully',
            data: newPost
        });
    } catch (err) {
        return res.status(400).json(err.message);
    }
};

// GET ALL THE POSTS BY SPECIFIC-USER
exports.getAllBlogsPost = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
        }

        const key = req.originalUrl || req.url;
        const cachedData = memoryCache.get(key);

        if (cachedData) {
            return res.status(200).json({
                message: 'Data fetched from cache',
                data: cachedData
            });
        }

        const pipeline = [
            { $match: { author: new ObjectId(req.user._id) } },
        ];

        const posts = await Post.aggregate(pipeline);

        memoryCache.put(key, posts, 10 * 60 * 1000);

        return res.status(200).json({
            message: 'Blogs fetched from database',
            data: posts
        });
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

// UPDATE THE POSTS BY SPECIFIC-USER
exports.updateBlog = async (req, res) => {
    try {
        const { error } = blogPutValidations(req.body);
        if (error)
            return res.status(400).send({ error: error.details[0].message });

        const postId = req.params._id;

        if (!/^[a-z0-9]*$/.test(postId)) {
            return res.status(400).json({
                message: "Invalid ID format",
            });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId, author: req.user._id },
            { $set: req.body },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        return res.status(200).json({
            message: 'Deleted successfully',
            data: updatedPost
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// DELETE THE POSTS BY SPECIFIC-USER
exports.deleteBlog = async (req, res) => {
    try {
        const postId = req.params._id;

        if (!/^[a-z0-9]*$/.test(postId)) {
            return res.status(400).json({
                message: "Invalid ID format",
            });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
        }

        const deletedPost = await Post.findOneAndDelete({
            _id: postId,
            author: req.user._id
        });

        if (!deletedPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        return res.status(200).json({
            message: 'Deleted successfully',
            data: deletedPost
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
