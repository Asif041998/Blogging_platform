const router = require('express').Router();
const UsersController = require('../controllers/usersController');
const Verify = require('../middlewares/authMiddleware');

router.post('/signup', UsersController.register);
router.post('/signin', UsersController.loginUser);
// router.get('/users', UsersController.getAllUsers);
// router.get('/users/:id', UsersController.getUserById);
// router.put('/users/:id', UsersController.updateUser);
// router.delete('/users/:id', UsersController.deleteUser);

module.exports = router;
