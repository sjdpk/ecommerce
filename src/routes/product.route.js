const router  = require("express").Router();
const upload = require('../config/fileupload.handler');
const AuthMiddleware =require('../middlewares/auth.middleware');
const {
    createProduct,
    getProducts,
    getAutoSugessionList,
    getProduct,
    updateProduct,
    deleteProduct,
    addToFavourite,
} = require('../controllers/product.controller')

router.post('/product',AuthMiddleware.IsAuthenticated,upload.single('image'),createProduct);
router.get('/product',getProducts);
router.put('/fav-product',AuthMiddleware.IsAuthenticated,addToFavourite);
router.get('/product/all',getAutoSugessionList);
router.get('/product/:id',getProduct);
router.put('/product/:id',AuthMiddleware.IsAuthenticated,upload.single('image'),updateProduct);
router.delete('/product/:id',AuthMiddleware.IsAuthenticated,deleteProduct);

module.exports = router;