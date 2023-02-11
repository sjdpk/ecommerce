const db = require('../models');
const pagination = require('../config/pagination.handler');
const {checkIfValidUUID} = require('../config/common.config');
require('dotenv').config({path : "config/config.env"});
const PerPageLimit = parseInt(process.env.PER_PAGE_LIMIT);

// create main models
const NotificationModel = db.notification;


// @desc : Create Notification
// @route : /api/v1/notiifcation
// @access : Private [ user ]
// @Method : [ POST ]
const createNotification = async (req, res) => {
    const token = req.token;
    const userId = req.body.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid user id"});

    try {
        let notificationRequest = {
            notification:req.body.notification,
            userId :userId,
            isSeen : req.body.isSeen,
            data:  req.body.data,
        };
        
        const notification = await NotificationModel.create(notificationRequest);
        return res.status(201).json(notification);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// @desc :  function from where we can call and generate notification
const generateNotification = async (notif, userId, data) => {
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return console.error("Invalid user id");

    try {
        let notificationRequest = {
            "notification": notif,
            "userId": userId,
            "data": data,
        };

        const notification = await NotificationModel.create(notificationRequest);
        console.log("Notification created successfully:", notification);
    } catch (error) {
        console.error("Error creating notification:", error.message);
    }
};
// @desc : get notification List
// @route : /api/v1/notification
// @access : Private 
// @Method : [ GET ]
const getNotifications = async (req, res) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1
    const token = req.token;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid user id"});
    try {
        const offset = (parseInt(currentPage) - 1) * PerPageLimit;
        const condn = { userId: userId };
        const notification = await NotificationModel.findAll({
            limit: PerPageLimit,
            offset: offset,
            where: condn,
        });
        const { totalPage, count } = await pagination(NotificationModel, PerPageLimit, { where: condn });
        res.status(200).json({
            currentpage: currentPage,
            totalpage: totalPage,
            count: count,
            data: notification,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// @desc : Update notification seen Status
// @route : /api/v1/notification
// @access : Private 
// @Method : [ PUT ]
const updateNotificationSeen = async(req,res)=>{
    const notificationId = req.params.id;
    const token = req.token;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid user id"});
        try {
            const notification = await NotificationModel.findOne({where:{ id : notificationId ,userId : userId }});
            if(!notification)  return res.status(400).json({"error" : "notification not found"});
            notification.isSeen = true;
            await notification.save();
            return res.status(200).json({msg:"notification seen"}); 
        } catch (error) {
            res.status(400).json({error:error.message});
        }
}

// @desc : Update notification seen Status
// @route : /api/v1/unread-notification
// @access : Private 
// @Method : [ Get ]
const countUnSeenNotification = async(req,res)=>{
    const token = req.token;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid user id"});
        try {
            const   { count } = await NotificationModel.findAndCountAll({
                where: { userId : userId, isSeen : false },
              });
            return res.status(200).json({"count": count}); 
        } catch (error) {
            res.status(400).json({error:error.message});
        }
}

module.exports = {
    createNotification,
    getNotifications,
    updateNotificationSeen,
    countUnSeenNotification,
    generateNotification,
};
