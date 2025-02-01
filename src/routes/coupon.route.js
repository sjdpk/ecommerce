const router = require('express').Router();
const AuthMiddleware =require('../middlewares/auth.middleware');
const  {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
} =  require('../controllers/coupon.controller');

router.post('/coupon',AuthMiddleware.IsAuthenticated, createCoupon);
router.get('/coupon',getCoupons);
router.get('/coupon/:id',getCoupon);
router.put('/coupon/:id',AuthMiddleware.IsAuthenticated, updateCoupon);
router.delete('/coupon/:id',AuthMiddleware.IsAuthenticated, deleteCoupon);


module.exports = router;