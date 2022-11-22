
const router = require('express').Router();
const  {createDepartment,getDepartments,getDepartment,updateDepartment,deleteDepartment} =  require('../controllers/department.controller');

router.post('/department',createDepartment);
router.get('/department',getDepartments);
router.get('/department/:id',getDepartment);
router.put('/department/:id',updateDepartment);
router.delete('/department/:id',deleteDepartment);


module.exports = router;