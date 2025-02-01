const router =  require('express').Router();
const AuthMiddleware =require('../middlewares/auth.middleware');
const {
    createBanner,
    getBanners,
    getBanner,
    updateBanner,
    deleteBanner
} = require('../controllers/banner.controller');
const upload = require('../config/fileupload.handler');

router.post('/banner',AuthMiddleware.IsAuthenticated, upload.single('banner'),createBanner);
router.get('/banner',getBanners);
router.get('/banner/:id',getBanner);
router.put('/banner/:id',AuthMiddleware.IsAuthenticated, upload.single('banner'),updateBanner);
router.delete('/banner/:id',AuthMiddleware.IsAuthenticated,deleteBanner);

module.exports = router;