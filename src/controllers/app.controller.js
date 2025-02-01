const db = require('../models');
const {checkIfValidUUID} = require('../config/common.config');

// create main models

const AppModel = db.application;
// @desc : add new Application 
// @route : /api/v1/app
// @access : Private [ Admin ]
// @Method : [ POST ]
const createApp = async (req, res) => {
    let logo = req.file;
    if(!logo) return res.status(400).json({error:"logo is required"});
    try {
        let appData = {
            appname: dash,
            logo: req.file.path,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            additionalInfo: JSON.parse(req.body.additionalInfo),
        };
        const app = await AppModel.create(appData);
        app.deletedAt = undefined;
        res.status(201).json(app);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// @desc : get app list 
// @route : /api/v1/app
// @access : Private [vendor]
// @Method : [ GET ]
const getApps = async (req, res) => {
    try {
        const { count, rows } = await AppModel.findAndCountAll({
            where:{deletedAt:null},
            attributes : {exclude:['deletedAt']}
        });
        res.status(200).json({
            count: count,
            data: rows
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

// @desc : get single  app 
// @route : /api/v1/app/:id
// @access : Private [ Vendor ]
// @Method : [ GET ]
const getApp = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({error:"invalid id"});
    try {
        const app = await AppModel.findOne({ where: { id: id ,deletedAt:null} });
        if (!app) return res.status(404).send({ error: "application not found" });
        app.deletedAt = undefined;
        res.status(200).json(app);

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


// @desc : Update single visible app 
// @route : /api/v1/app/:id
// @access : Private
// @Method : [ PUT ]
const updateApp = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({error:"invalid id"});
    try {
        const app = await AppModel.findOne({ where: { id: id ,deletedAt:null} });
        if (!app) return res.status(404).send({ error: "app not found" });
        // await application.update(req.body, { where: { id: id } });
        app.appname = req.body.appname? req.body.appname:app.appname,
        app.logo = req.file?req.file.path:app.logo,
        app.email = req.body.email?req.body.email:app.email,
        app.phoneNumber = req.body.phoneNumber?req.body.phoneNumber:app.phoneNumber,
        app.additionalInfo = req.body.additionalInfo?JSON.parse(req.body.additionalInfo):app.additionalInfo,
        await app.save();
        app.deletedAt =undefined;
        res.status(200).json(app);
    } catch (error) {
        res.status(400).json({ error: err.message });
    }
}

// @desc : Delete app 
// @route : /api/v1/app/:id
// @access : Private [ Vendor,Admin ]
// @Method : [ DELETE ]
const deleteApp = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({error:"invalid application id"});
    try {
        const app = await AppModel.findOne({where:{id:id,deletedAt:null}});
        if (!app) return res.status(404).json({ error: "application not found" });
        app.deletedAt = new Date();
        await app.save();
        res.status(204).send({ msg: "app deleted sucessfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}





module.exports = {
    createApp,
    getApps,
    getApp,
    updateApp,
    deleteApp,
};
