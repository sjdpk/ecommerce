const router  = require("express").Router();
const upload = require('../config/fileupload.handler');
const {createCategory,createSubCategory,createSubSubCategory,getCategories,updateCategory,updateSubCategory,updateSubSubCategory} = require('../controllers/category.controller')

router.post('/category',upload.single('image'),createCategory);
router.post('/sub-category',upload.single('image'),createSubCategory);
router.post('/subsub-category',upload.single('image'),createSubSubCategory);
router.get('/category',getCategories);

router.put('/category/:id',upload.single('image'),updateCategory);
router.put('/sub-category/:id',upload.single('image'),updateSubCategory);
router.put('/subsub-category/:id',upload.single('image'),updateSubSubCategory);



module.exports = router;