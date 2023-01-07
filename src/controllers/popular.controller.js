const db = require('../models');
const {checkIfValidUUID} = require('../config/common.config');

// create main models
const PopularModel = db.Popular;

// @desc : add new Popular 
// @route : /api/v1/Popular
// @access : Private [ Admin ]
// @Method : [ POST ]
const createPopular = async (req, res) => {
    const token = req.token;
    const role = token.role;
    if(role !=1) return res.status(401).json({error:"unauthorized"});
    try {
        let PopularData = {
            name: req.body.name,
            description: req.body.description,
            button1Text:req.body.button1Text,
            button2Text:req.body.button2Text,
            tagList:req.body.tagList,
            image:req.body.image,
        };
        const popular = await PopularModel.create(PopularData);
        res.status(201).json(popular);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// @desc : get Popular list 
// @route : /api/v1/Popular
// @access : public 
// @Method : [ GET ]
const getPopulars = async (req, res) => {
    try {
        const { count, rows } = await PopularModel.findAndCountAll({});
        res.status(200).json({
            count: count,
            data: rows
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// @desc : get single visible Popular 
// @route : /api/v1/Popular:id
// @access : Public
// @Method : [ GET ]
const getPopular = async (req, res) => {
    let id = req.params.id;
    try {
        const popular = await PopularModel.findOne({ where: { id: id } });
        if (!popular) return res.status(404).send({ error: "Popular not found" });
        res.status(200).json(popular);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


// @desc : Update single visible Popular 
// @route : /api/v1/Popular:id
// @access : Private
// @Method : [ PUT ]
const updatePopular = async (req, res) => {
    let id = req.params.id
    try {
        const popular = await PopularModel.findOne({ where: { id: id } });
        if (!popular) return res.status(404).send({ error: "Popular not found" });
        await popular.update(req.body, { where: { id: id } });
        res.status(200).json(popular);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

// @desc : Delete Popular 
// @route : /api/v1/Popular/:id
// @access : Private [ Vendor,Admin ]
// @Method : [ DELETE ]
const deletePopular = async (req, res) => {
    let id = req.params.id
    try {
        const popular = await PopularModel.destroy({ where: { id: id } });
        if (!popular) return res.status(404).json({ error: "Popular not found" });
        res.status(204).send({ msg: "Popular deleted sucessfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}





module.exports = {
    createPopular,
    getPopulars,
    getPopular,
    updatePopular,
    deletePopular,
};
