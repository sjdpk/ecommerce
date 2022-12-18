const router = require('express').Router();
const AuthMiddleware =require('../middlewares/auth.middleware');
const {
    addToCart,
    getCart,
    } = require('../controllers/cart.controller');

router.post('/cart',AuthMiddleware.IsAuthenticated, addToCart);
router.get('/cart',AuthMiddleware.IsAuthenticated,getCart);


module.exports = router;