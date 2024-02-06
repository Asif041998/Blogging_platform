const User = require('../models/users');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const registrationValidation = require('../validations/registrationValidation');
const loginValidation = require('../validations/loginValidation');

// REGISTER USERS
exports.register = async (req, res) => {
    try {
        const { error } = registrationValidation(req.body);
        if (error)
            return res.status(400).send({ error: error.details[0].message });

        const { username, password, role } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const user = new User({
            username,
            password,
            role
        });
        user.password = await bcrypt.hash(password, 10);

        await user.save();

        return res.status(201).json({
            message: 'User registered successfully',
            data: user
        });
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
}

// LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Incorrect username or password" });
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(401).json({ message: "Incorrect username or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, createdAt: user.createdAt },
            process.env.SECRET_TOKEN,
            {
                expiresIn: "30d",
            }
        );

        user.token = token;
        await user.save();

        res.header("auth-token", token);

        const userInfo = {
            user_id: user._id,
            username: user.username,
            access_token: token,
        };

        return res.status(200).json({
            message: "Successfully logged in",
            data: userInfo,
            expiresIn: "30d",
        });
    } catch (err) {
        res.status(400).json(err.message);
    }
};