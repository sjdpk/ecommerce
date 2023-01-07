const router = require('express').Router();
const AuthMiddleware =require('../middlewares/auth.middleware');
const  {
    createPopular,
    getPopulars,
    getPopular,
    updatePopular,
    deletePopular
} =  require('../controllers/popular.controller');

router.post('/popular',AuthMiddleware.IsAuthenticated,createPopular);
router.get('/popular',getPopulars);
router.get('/popular/:id',getPopular);
router.put('/popular/:id',AuthMiddleware.IsAuthenticated,updatePopular);
router.delete('/popular/:id',AuthMiddleware.IsAuthenticated,deletePopular);


module.exports = router;