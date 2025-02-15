const router = require('express').Router();
const AuthMiddleware =require('../middlewares/auth.middleware');
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    orderStatusList,
    getProductWiseOrderByVendor,
    updateOrderPaymentStatus,
    getOrdersByVendor,
} = require('../controllers/order.controller');

router.post('/order',AuthMiddleware.IsAuthenticated, createOrder);
router.get('/order',AuthMiddleware.IsAuthenticated,getOrders);
router.get('/vendor-order',AuthMiddleware.IsAuthenticated,getOrdersByVendor);
router.get('/get-order',AuthMiddleware.IsAuthenticated,getProductWiseOrderByVendor);
router.get('/orders-status',AuthMiddleware.IsAuthenticated,orderStatusList);
router.get('/order/:id',AuthMiddleware.IsAuthenticated,getOrder);
router.put('/order/:id',AuthMiddleware.IsAuthenticated,updateOrder);
router.put('/order-payment/:id',AuthMiddleware.IsAuthenticated,updateOrderPaymentStatus);

module.exports = router;