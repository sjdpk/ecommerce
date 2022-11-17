const router  = require("express").Router();
const upload = require('../config/fileupload.handler');
const {createCategory,createSubCategory,createSubSubCategory,getCategories} = require('../controllers/category.controller')

router.post('/category',upload.single('image'),createCategory);
router.post('/sub-category',upload.single('image'),createSubCategory);
router.post('/subsub-category',upload.single('image'),createSubSubCategory);
router.get('/category',getCategories);


module.exports = router;