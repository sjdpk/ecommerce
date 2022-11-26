const router = require('express').Router();
const { addToCart,getCarts,getCart,removeFromCart } = require('../controllers/cart.controller');

router.post('/cart',addToCart);
router.get('/cart',getCarts);
router.get('/cart/:id',getCart);
router.put('/cart',removeFromCart);


module.exports = router;