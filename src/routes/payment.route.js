const router = require('express').Router();
const AuthMiddleware =require('../middlewares/auth.middleware');
const {
    createPayment,
    getPayments,
    getPayment,
    } = require('../controllers/payment.controller');

router.post('/payment',AuthMiddleware.IsAuthenticated, createPayment);
router.get('/payment',AuthMiddleware.IsAuthenticated,getPayments);
router.get('/payment/:id',AuthMiddleware.IsAuthenticated,getPayment);

module.exports = router;