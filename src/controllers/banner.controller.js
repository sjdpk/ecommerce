const db = require('../models');
const {checkIfValidUUID} = require('../config/common.config');


// create main models
const BannerModel = db.banner;
const UserModel = db.user;
const ProductModel = db.product;
const CategoryModel = db.category;


// @desc : add new Banner 
// @route : /api/v1/banner
// @access : Private [ Vendor, Admin ]
// @Method : [ POST ]
const createBanner = async (req, res) => {
    if(req.file == null) return res.status(400).json({error:"select image"});
    const categoryId = req.body.categoryId;
    const userId= req.body.userId;
    const productId = req.body.productId;

    try {
        if (categoryId) {
            const category = await CategoryModel.findOne({where:{id:categoryId}});
            if(!category) return res.status(404).json({error:"category not found"});
        }   
        if (userId) {
            const uuid = checkIfValidUUID(userId);
            if (!uuid) return res.status(400).json({error:"invalid user id"});
            const user = await UserModel.findOne({where:{id:userId}});
            if(!user) return res.status(404).json({error:"user not found"});
        }
        if (productId) {
            const product = await ProductModel.findOne({where:{id:productId}});
            if(!product) return res.status(404).json({error:"product not found"});
        }
        let bannerData = {
            banner: req.file.path,
            categoryId: categoryId,
            userId: userId,
            productId : productId,
            remark : req.body.remark,
        };
        const banner = await BannerModel.create(bannerData);
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// @desc : get banner list 
// @route : /api/v1/banner
// @access : public 
// @Method : [ GET ]
const getBanners = async (req, res) => {
    try {
        const { count, rows } = await BannerModel.findAndCountAll({});
        res.status(200).json({
            count: count,
            data: rows
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// @desc : get single  banner 
// @route : /api/v1/banner/:id
// @access : Public
// @Method : [ GET ]
const getBanner = async (req, res) => {
    let id = req.params.id;
    try {
        const banner = await BannerModel.findOne({ where: { id: id } });
        if (!banner) return res.status(404).json({ error: "banner not found" });
        res.status(200).json(banner);

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


// @desc : Update single visible department 
// @route : /api/v1/department:id
// @access : Private
// @Method : [ PUT ]
const updateBanner = async (req, res) => {
    let id = req.params.id
    try {
        const banner = await BannerModel.findOne({ where: { id: id } });
        if (!banner) return res.status(404).send({ error: "banner not found" });
        if(req.file) {
            banner.banner = req.file.path;
        }
        if(req.body.categoryId) banner.categoryId = req.body.categoryId;
        if(req.body.userId) banner.userId = req.body.userId;
        if(req.body.productId) banner.productId  = req.body.productId;
        if(req.body.remark) banner.remark  = req.body.remark,
        await banner.save();
        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// @desc : Delete Banner 
// @route : /api/v1/banner/:id
// @access : Private [ Vendor,Admin ]
// @Method : [ DELETE ]
const deleteBanner = async (req, res) => {
    let id = req.params.id
    try {
        const banner = await BannerModel.destroy({ where: { id: id } });
        if (!banner) return res.status(404).json({ error: "banner not found" });
        res.status(204).send({ msg: "banner deleted sucessfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}





module.exports = {
    createBanner,
    getBanners,
    getBanner,
    updateBanner,
    deleteBanner,
};
