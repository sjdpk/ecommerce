const router = require('express').Router();

const  {dashboard} =  require('../controllers/dashboard.controller');
router.get('/user-dashboard',dashboard);

module.exports = router;
