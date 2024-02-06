const router = require('express').Router();
const BlogsController = require('../controllers/blogsController');
const Verify = require('../middlewares/authMiddleware');
const Cache = require('../middlewares/cacheMiddleware');

router.post('/blogs', Verify, BlogsController.createBlog);
router.get('/blogs', Verify, Cache, BlogsController.getAllBlogsPost);
// router.get('/blogs/:id', BlogsController.getBlogPostById);
router.put('/blogs/:_id', Verify, BlogsController.updateBlog);
router.delete('/blogs/:_id', Verify, BlogsController.deleteBlog);

module.exports = router;
