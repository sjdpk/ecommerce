const router  = require("express").Router();
const upload = require('../config/fileupload.handler');
const AuthMiddleware =require('../middlewares/auth.middleware');

const {
    createCategory,
    createSubCategory,
    createSubSubCategory,
    getCategories,
    updateCategory,
    updateSubCategory,
    updateSubSubCategory
} = require('../controllers/category.controller')

router.post('/category',AuthMiddleware.IsAuthenticated,upload.single('image'),createCategory);
router.post('/sub-category',AuthMiddleware.IsAuthenticated,upload.single('image'),createSubCategory);
router.post('/subsub-category',AuthMiddleware.IsAuthenticated,upload.single('image'),createSubSubCategory);
router.get('/category',getCategories);

router.put('/category/:id',AuthMiddleware.IsAuthenticated,upload.single('image'),updateCategory);
router.put('/sub-category/:id',AuthMiddleware.IsAuthenticated,upload.single('image'),updateSubCategory);
router.put('/subsub-category/:id',AuthMiddleware.IsAuthenticated,upload.single('image'),updateSubSubCategory);



module.exports = router;