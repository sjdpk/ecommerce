const router = require('express').Router();
const AuthMiddleware =require('../middlewares/auth.middleware');

const  {dashboard,vendorDashboard} =  require('../controllers/dashboard.controller');
router.get('/user-dashboard',dashboard);
router.get('/vendor-dashboard',AuthMiddleware.IsAuthenticated, vendorDashboard);

module.exports = router;
