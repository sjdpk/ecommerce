const router = require('express').Router();
const AuthMiddleware =require('../middlewares/auth.middleware');
const  {
    createDepartment,
    getDepartments,
    getDepartment,
    updateDepartment,
    deleteDepartment
} =  require('../controllers/department.controller');

router.post('/department',AuthMiddleware.IsAuthenticated,createDepartment);
router.get('/department',getDepartments);
router.get('/department/:id',getDepartment);
router.put('/department/:id',AuthMiddleware.IsAuthenticated,updateDepartment);
router.delete('/department/:id',AuthMiddleware.IsAuthenticated,deleteDepartment);


module.exports = router;