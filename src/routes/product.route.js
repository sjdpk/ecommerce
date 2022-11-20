const router  = require("express").Router();
const upload = require('../config/fileupload.handler');
const {createProduct,getProducts,getProduct,updateProduct} = require('../controllers/product.controller')

router.post('/product',upload.single('image'),createProduct);
router.get('/product',getProducts);
router.get('/product/:id',getProduct);
router.put('/product/:id',upload.single('image'),updateProduct);
// router.post('/sub-category',upload.single('image'),createSubCategory);
// router.post('/subsub-category',upload.single('image'),createSubSubCategory);
// router.get('/category',getCategories);

// router.put('/category/:id',upload.single('image'),updateCategory);
// router.put('/sub-category/:id',upload.single('image'),updateSubCategory);
// router.put('/subsub-category/:id',upload.single('image'),updateSubSubCategory);



module.exports = router;