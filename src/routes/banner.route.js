const router =  require('express').Router();
const {createBanner,getBanners,getBanner,updateBanner,deleteBanner} = require('../controllers/banner.controller');
const upload = require('../config/fileupload.handler');

router.post('/banner',upload.single('banner'),createBanner);
router.get('/banner',getBanners);
router.get('/banner/:id',getBanner);
router.put('/banner/:id',upload.single('banner'),updateBanner);
router.delete('/banner/:id',deleteBanner);

module.exports = router;