
const router = require('express').Router();
const  {createCoupon,getCoupons,getCoupon,updateCoupon,deleteCoupon} =  require('../controllers/coupon.controller');

router.post('/coupon',createCoupon);
router.get('/coupon',getCoupons);
router.get('/coupon/:id',getCoupon);
router.put('/coupon/:id',updateCoupon);
router.delete('/coupon/:id',deleteCoupon);


module.exports = router;