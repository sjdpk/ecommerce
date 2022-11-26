const router = require('express').Router();
const { createOrder,getOrders,getOrder,updateOrder } = require('../controllers/order.controller');

router.post('/order',createOrder);
router.get('/order',getOrders);
router.get('/order/:id',getOrder);
router.put('/order/:id',updateOrder);

module.exports = router;