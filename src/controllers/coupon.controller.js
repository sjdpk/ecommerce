const db = require('../models');
const {checkIfValidUUID} = require('../config/common.config');

// create main models
const CouponModel = db.coupon;
// @desc : order status map
const DISCOUNTSTATUS = {
    PERCENTAGE : 'percentage', //user order good
    FIXED : 'fixed', //vendor accept or reject order
};

// @desc : add new Coupon 
// @route : /api/v1/coupon
// @access : Private [ Vendor, Admin ]
// @Method : [ POST ]
const createCoupon = async (req, res) => {
    const exists =  checkDiscountType(req);
    if(!exists) return res.status(400).json({error:"coupon type must be percentage or fixed"});
    try {
        let couponData = {
            couponCode: req.body.couponCode,
            startFrom: req.body.startFrom,
            endAt: req.body.endAt,
            visibility: req.body.visibility,
            discountType: req.body.discountType,
            discount: req.body.discount,

        };
        const coupon = await CouponModel.create(couponData);
        coupon.deletedAt = undefined;
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// @desc : get Coupon list 
// @route : /api/v1/coupon
// @access : public 
// @Method : [ GET ]
const getCoupons = async (req, res) => {
    try {
        const { count, rows } = await CouponModel.findAndCountAll({
            where:{deletedAt :null},
            attributes : { exclude : ['deletedAt']},
        });
        res.status(200).json({
            count: count,
            data: rows
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// @desc : get single visible Coupon 
// @route : /api/v1/coupon/id
// @access : Public
// @Method : [ GET ]
const getCoupon = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({error:"invalid id"});
    try {
        const coupon = await CouponModel.findOne({ where: { id: id ,deletedAt:null} });
        if (!coupon) return res.status(404).send({ error: "coupon not found" });
        coupon.deletedAt = undefined;
        res.status(200).json(coupon);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


// @desc : Update single visible Coupon 
// @route : /api/v1/department:id
// @access : Private
// @Method : [ PUT ]
const updateCoupon = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({error:"invalid id"});
    const exists =  checkDiscountType(req);
    if(!exists) return res.status(400).json({error:"coupon type must be percentage or fixed"});
    try {
        const coupon = await CouponModel.findOne({ where: { id: id ,deletedAt:null} });
        if (!coupon) return res.status(404).send({ error: "coupon not found" });
        await coupon.update(req.body, { where: { id: id } });
        coupon.deletedAt = undefined;
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// @desc : Delete Coupon 
// @route : /api/v1/department/:id
// @access : Private [ Vendor,Admin ]
// @Method : [ DELETE ]
const deleteCoupon = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({error:"invalid id"});
    try {
        // const coupon = await CouponModel.destroy({ where: { id: id } });
        const coupon = await CouponModel.update({deletedAt:new Date().toJSON()},{ where: { id: id ,deletedAt:null} });
        if (!coupon) return res.status(404).json({ error: "coupon not found" });
        res.status(204).send({ msg: "coupon deleted sucessfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}





module.exports = {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
};


function checkDiscountType(req){
    const discountType = req.body.discountType;
    const exists = Object.values(DISCOUNTSTATUS).includes(discountType);
    return exists;   
}