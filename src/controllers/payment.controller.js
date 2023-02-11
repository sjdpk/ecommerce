const db = require('../models');
const pagination = require('../config/pagination.handler');
const {checkIfValidUUID} = require('../config/common.config');
require('dotenv').config({path : "config/config.env"});
const PerPageLimit = parseInt(process.env.PER_PAGE_LIMIT);

// create main models
const PaymentModel = db.payment;
const OrderModel = db.order;


// @desc : Create payment
// @route : /api/v1/payment
// @access : Private [ user ]
// @Method : [ POST ]
const createPayment = async (req, res) => {
    const token = req.token;
    // const role = token.role;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid user id"});

    try {
        let paymentRequest = {
            method: req.body.method,
            userId :userId,
            vendorId : req.body.vendorId,
            orderId : req.body.orderId,
            remark:  req.body.remark,
        };
        // make payemnt status true in order table
        const order = await OrderModel.findOne({ where: { id: req.body.orderId, userId: userId } });
        if(!order) return res.status(400).json({"error":"orser not found"});
        const payment = await PaymentModel.create(paymentRequest);
        order.paymentStatus= true;
        await order.save();
        return res.status(201).json(payment);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// @desc : get payment List
// @route : /api/v1/payment
// @access : Private 
// @Method : [ GET ]
const getPayments = async (req, res) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1
    const token = req.token;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid user id"});
    try {
        const offset = (parseInt(currentPage) - 1) * PerPageLimit;
        const condn = { userId: userId };
        const payment = await PaymentModel.findAll({
            limit: PerPageLimit,
            offset: offset,
            where: condn,
        });
        const { totalPage, count } = await pagination(PaymentModel, PerPageLimit, { where: condn });
        res.status(200).json({
            currentpage: currentPage,
            totalpage: totalPage,
            count: count,
            data: payment,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


// @desc : get payment List
// @route : /api/v1/payment
// @access : Private 
// @Method : [ GET ]
const getPayment = async (req, res) => {
    const paymentId = req.params.id; 
    const token = req.token;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid user id"});
    try {
        const condn = { userId: userId,id : paymentId };
        const payment = await PaymentModel.findOne({
            where: condn,
        });
        res.status(200).json(payment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}




module.exports = {
    createPayment,
    getPayments,
    getPayment,
};
