const router = require('express').Router();
const upload = require('../config/fileupload.handler');
const AuthMiddleware =require('../middlewares/auth.middleware');
const {
    createApp,
    getApps,
    getApp,
    updateApp,
    deleteApp,
} = require('../controllers/app.controller');

router.post('/app',AuthMiddleware.IsAuthenticated, upload.single('logo'),createApp);
router.get('/app',AuthMiddleware.IsAuthenticated,getApps);
router.get('/app/:id',AuthMiddleware.IsAuthenticated, getApp);
router.put('/app/:id',AuthMiddleware.IsAuthenticated, upload.single('logo'),updateApp);
router.delete('/app/:id',AuthMiddleware.IsAuthenticated, deleteApp);

module.exports =router;