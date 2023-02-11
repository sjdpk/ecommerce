const router = require('express').Router();
const AuthMiddleware =require('../middlewares/auth.middleware');
const {
        createNotification,
        getNotifications,
        updateNotificationSeen,
        countUnSeenNotification,
    } = require('../controllers/notification.controller');

router.post('/notification',AuthMiddleware.IsAuthenticated, createNotification);
router.get('/notification',AuthMiddleware.IsAuthenticated,getNotifications);
router.put('/unread-notification',AuthMiddleware.IsAuthenticated,countUnSeenNotification);
router.put('/notification/:id',AuthMiddleware.IsAuthenticated,updateNotificationSeen);

module.exports = router;