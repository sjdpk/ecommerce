const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const AuthMiddleware =require('../middlewares/auth.middleware');

router.post('/user',UserController.createUser);
router.post('/login',UserController.loginUser);
router.get('/me',AuthMiddleware.IsAuthenticated,UserController.me);

// must be loggedIn and role as admin
router.get('/user', UserController.getUsers);
router.get('/user/:id', UserController.getUser);
router.put('/user/:id', UserController.updateUser);
router.put('/user/deactive/:id', UserController.deactiveUser);
router.put('/user/disable/:id',UserController.disableUser);
router.put('/user/undisable/:id', UserController.undisableUser);

router.delete('/user/:id',UserController.deleteUser);

module.exports = router;