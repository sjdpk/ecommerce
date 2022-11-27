const router = require('express').Router();
const upload = require('../config/fileupload.handler');
const {createApp,getApps,getApp,updateApp,deleteApp,} = require('../controllers/app.controller');

router.post('/app',upload.single('logo'),createApp);
router.get('/app',getApps);
router.get('/app/:id',getApp);
router.put('/app/:id',upload.single('logo'),updateApp);
router.delete('/app/:id',deleteApp);

module.exports =router;