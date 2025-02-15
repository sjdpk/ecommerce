const db = require('../models');
require('dotenv').config({ path: "config/config.env" });
const pagination = require('../config/pagination.handler');
const { checkIfValidUUID } = require('../config/common.config');
const {generateNotification} =  require('./notification.controller')


const PerPageLimit = parseInt(process.env.PER_PAGE_LIMIT);
const OrderStatus = {
    Ordered: 'ordered', //user order good
    Accept: 'accepted', //vendor accept or reject order
    Prepare: 'preparing', //vendor make order prepare
    OnTheWay: 'ontheway', //The order is on its way to the recipient.
    Delivered: 'delivered',
    Canceled: 'canceled', //user cancel good
    Reject: 'rejected',
    ReturnRequest: 'returnrequest',
    Return: 'returned',
    undefined: undefined,
};


// create order model
const OrderModel = db.order;
const ProductModel = db.product;
const UserModel = db.user;
const CartModel = db.cart;

// @desc : Simple  one product order
// @route : /api/v1/order/productId
// @access : Private [ Normal user ]
// @Method : [ POST ]
const createOrder = async (req, res) => {
    // let userId = req.body.userId;
    const token = req.token;
    const role = parseInt(token.role);
    // role 2 customer
    if (role != 2) return res.status(401).json({ error: "unauthorized" });
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({ error: "invalid id" });

    let orderBody = req.body.order;
    let productIds = [];
    let productQty = [];
    if (orderBody.length <= 0) return res.status(400).json({ error: "order cannot be empty" });
    try {
        for (let i = 0; i < orderBody.length; i++) {
            // @desc :  check if order json contains productid ,quantity price 
            const pid = !orderBody[i].hasOwnProperty('productId');
            const qty = !orderBody[i].hasOwnProperty('quantity');
            const price = !orderBody[i].hasOwnProperty('price');
            const additionalInfo = !orderBody[i].hasOwnProperty('additionalInfo');
            if (pid) return res.status(400).json({ error: `order object ${i + 1} must contain productId` });
            const product = await ProductModel.findOne({ where: { id: orderBody[i].productId } });
            if (!product) return res.status(404).json({ error: `object ${i + 1} product not found` });
            // @desc : add product id into array : to remove from cart and decrease qtry from stock 
            productIds.push(orderBody[i]["productId"]);
            if (price) return res.status(400).json({ error: `order object ${i + 1} must contain price` });
            if (qty) orderBody[i]['quantity'] = 1;
            productQty.push(orderBody[i]["quantity"])

        }
        // @desc : wheather user is present or not
        const user = await UserModel.findOne({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "user not found" });
        const orderData = {
            order: req.body.order,
            userName: req.body.userName,
            email: req.body.email,
            phone: req.body.phone,
            deliveryAddress: req.body.deliveryAddress,
            orderStatus: req.body.orderStatus,
            userId: userId,
        }
        const order = await OrderModel.create(orderData);

        // @desc : remove product from cart after product is ordered
        for (let index = 0; index < productIds.length; index++) {
            const cart = await CartModel.findOne({ where: { productId: productIds[index], deleted: false } });
            if (cart) { cart.deleted = true; cart.quantity = 0; cart.remark = "ordered"; await cart.save(); }
        }
        // @desc : decrease product stock
        for (let i = 0; i < productIds.length; i++) {
            const product = await ProductModel.findOne({ where: { id: productIds[i], deletedAt: null } });
            if (product) { product.productStock = product.productStock - productQty[i]; await product.save(); }
        }
        
        
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}

// @date : 21-jans-023
// @desc : get singlr product order by vendor specific
// @route : /api/v1/order/get-order
// @access : Private [ vendor ]
// @Method : [ get ]
const getProductWiseOrderByVendor = async (req, res) => {
    const token = req.token;
    const role = token.role;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    try {
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const orderStatus = req.query.status;
        const exists = Object.values(OrderStatus).includes(orderStatus);

        if (!exists) return res.status(400).send({ error: "status type not found" });
        if (currentPage <= 0) return res.status(400).send({ error: "invalid page" });


        // const offset = (parseInt(currentPage) - 1) * PerPageLimit;
        const condn = orderStatus ? { orderStatus: orderStatus, userId: userId } : { userId: userId };
        const orders = await OrderModel.findAll({
            limit: PerPageLimit,
            // offset: offset,
            order: [['updatedAt', 'DESC']],
            where: condn,
        });

        let vendorWiseOrderList = []
        let vendorOrder = []
        for (let index = 0; index < orders.length; index++) {
            const order = orders[index].order
            // @desc :  check wheather order  productId is belongs to respective vendor            
            for (let orderIndex = 0; orderIndex < order.length; orderIndex++) {
                const orderProductId = order[orderIndex].productId
                // get vendor id from productId
                const product = await ProductModel.findOne({ where: { id: orderProductId }, attributes: ["vendorId"] });
                const vendorId = product.vendorId;
                if (userId === vendorId) {
                    vendorOrder = orders[index].order[orderIndex]
                    vendorWiseOrderList.push({
                        id: orders[index].id,
                        order: [vendorOrder],
                        deliveryAddress: orders[index].deliveryAddress,
                        orderStatus: orders[index].orderStatus,
                        remark: orders[index].remark,
                        userName: orders[index].userName,
                        email: orders[index].email,
                        phone: orders[index].phone,
                        userId: orders[index].userId,
                        createdAt: orders[index].createdAt,
                        updatedAt: orders[index].updatedAt
                    })
                }
            }

        }
        // const { totalPage,count } =await pagination(OrderModel,PerPageLimit, {where:condn});
        const count = vendorWiseOrderList.length;
        res.status(200).json({
            currentpage: currentPage,
            totalpage: Math.ceil(count / (PerPageLimit)),
            count: vendorWiseOrderList.length,
            // data: vendorWiseOrderList,
            data: paginate(vendorWiseOrderList, (PerPageLimit), currentPage),
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
// @desc : Get All product Order List
// @route : /api/v1/order?status=ordered [status from ORDERSTATUS Map ^ ]
// @access : Private [ user, Vendor,Admin ]
// @Method : [ GET ]
const getOrders = async (req, res) => {
    const token = req.token;
    const role = token.role;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    try {
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const orderStatus = req.query.status;
        const exists = Object.values(OrderStatus).includes(orderStatus);

        if (!exists) return res.status(400).send({ error: "status type not found" });
        if (currentPage <= 0) return res.status(400).send({ error: "invalid page" });


        const offset = (parseInt(currentPage) - 1) * PerPageLimit;
        const condn = orderStatus ? { orderStatus: orderStatus, userId: userId } : { userId: userId };
        const orders = await OrderModel.findAll({
            limit: PerPageLimit,
            offset: offset,
            order: [['updatedAt', 'DESC']],
            where: condn,
        });
        const { totalPage, count } = await pagination(OrderModel, PerPageLimit, { where: condn });

        res.status(200).json({
            currentpage: currentPage,
            totalpage: totalPage,
            count: count,
            data: orders,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// @desc : Get All product Order List
// @route : /api/v1/order?status=ordered [status from ORDERSTATUS Map ^ ]
// @access : Private [ user, Vendor,Admin ]
// @Method : [ GET ]
const getOrdersByVendor = async (req, res) => {
    const token = req.token;
    const role = token.role;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    if(role != 1) return res.status(400).json({ error: "unauthorized access" });
    try {
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const orderStatus = req.query.status;
        const exists = Object.values(OrderStatus).includes(orderStatus);

        if (!exists) return res.status(400).send({ error: "status type not found" });
        if (currentPage <= 0) return res.status(400).send({ error: "invalid page" });


        const offset = (parseInt(currentPage) - 1) * PerPageLimit;
        const condn = { orderStatus: orderStatus };
        const orders = await OrderModel.findAll({
            limit: PerPageLimit,
            offset: offset,
            order: [['updatedAt', 'DESC']],
            where: condn,
        });
        const { totalPage, count } = await pagination(OrderModel, PerPageLimit, { where: condn });

        res.status(200).json({
            currentpage: currentPage,
            totalpage: totalPage,
            count: count,
            data: orders,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// @desc : Get Single product Order 
// @route : /api/v1/order/orderId
// @access : Private [ Vendor,Admin ]
// @Method : [ GET ]
const getOrder = async (req, res) => {
    const token = req.token;
    const role = token.role;
    const userId = token.userId;
    const useruid = checkIfValidUUID(userId);
    if (!useruid) return res.status(400).json({ error: "invalid id" });

    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    try {
        const order = await OrderModel.findOne({ where: { id: id, userId: userId } });
        if (!order) return res.status(404).json({ error: "order not found" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// @desc : Update product Order Details
// only product order specific vendor change status 
// @route : : http://localhost:4000/api/v1/order/status/orderId
// @access : Private [ Vendor,Admin ]
// @Method : [ PUT ]
const updateOrder = async (req, res) => {
    // @desc : get authentic user 
    const token = req.token;
    const role = token.role;
    const userId = token.userId;
    const useruid = checkIfValidUUID(userId);
    if (!useruid) return res.status(400).json({ error: "invalid id" });

    let orderId = req.params.id;
    const uuid = checkIfValidUUID(orderId);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    let status = req.body.orderStatus;
    if (!status) return res.status(400).send({ error: 'status can not be null' });
    const exists = Object.values(OrderStatus).includes(status);
    if (!exists) return res.status(404).send({ error: 'status not found' });
    const remark = req.body.remark;
    try {
        const order = await OrderModel.findOne({ where: { id: orderId, userId: userId } });
        if (!order) return res.status(404).json({ error: "order not found" });
        if (status === 'canceled' && !remark) return res.status(400).json({ error: "remark is required" });
        if (status === 'rejected' && !remark) return res.status(400).json({ error: "remark is required" });
        if (status === 'returnrequest' && !remark) return res.status(400).json({ error: "remark is required" });
        order.orderStatus = status;
        order.remark = remark;

        await order.save();
        // create notification
        const data = {
            orderId: order.id,
        };
       await generateNotification(`order status change to ${status}`,order.userId,data)
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateOrderPaymentStatus = async (req, res) => {
    // @desc : get authentic user 
    checkAndReturnUserId(req)
    let orderId = req.params.id;
    const uuid = checkIfValidUUID(orderId);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    try {
        const order = await OrderModel.findOne({ where: { id: orderId, userId: userId } });
        if (!order) return res.status(404).json({ error: "order not found" });
        order.paymentStatus = req.body.paymentStatus?req.body.paymentStatus:false;
        await order.save();
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// @desc : orders sataus List
const orderStatusList = (req, res) => {
    try {
        res.status(200).json(OrderStatus);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


function checkAndReturnUserId(req){
    const token = req.token;
    const role = token.role;
    const userId = token.userId;
    const useruid = checkIfValidUUID(userId);
    if (!useruid) return res.status(400).json({ error: "invalid id" });  
    return userId;
}
module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    orderStatusList,
    getProductWiseOrderByVendor,
    updateOrderPaymentStatus,
    getOrdersByVendor,

}