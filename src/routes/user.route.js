const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const AuthMiddleware =require('../middlewares/auth.middleware');

router.post('/register',UserController.createUser);
router.post('/login',UserController.loginUser);
router.get('/me',AuthMiddleware.IsAuthenticated,UserController.me);

// must be loggedIn and role as admin
router.get('/user',AuthMiddleware.IsAuthenticated, UserController.getUsers);
router.get('/user/:id',AuthMiddleware.IsAuthenticated, UserController.getUser);
router.put('/user/:id',AuthMiddleware.IsAuthenticated, UserController.updateUser);
router.put('/user/deactive/:id',AuthMiddleware.IsAuthenticated, UserController.deactiveUser);
router.put('/user/disable/:id',AuthMiddleware.IsAuthenticated, UserController.disableUser);
router.put('/user/undisable/:id',AuthMiddleware.IsAuthenticated, UserController.undisableUser);

router.delete('/user/:id',AuthMiddleware.IsAuthenticated, UserController.deleteUser);

module.exports = router;