const db = require('../models');
const {checkIfValidUUID} = require('../config/common.config');
require('dotenv').config({path : "config/config.env"});
const ADMINID = parseInt(process.env.ADMIN_ID);
const VENDORID = parseInt(process.env.VENDOR_ID);
const USERID = parseInt(process.env.NORMAL_USER_ID);
// create main models
const CartModel = db.cart;
const UserModel = db.user;
const ProductModel  = db.product;


// @desc : add new cart 
// @route : /api/v1/cart
// @access : Private [ user ]
// @Method : [ POST ]
const addToCart = async (req, res) => {
    const token = req.token;
    const role = token.role;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid id"});

    const productId = req.body.productId;
    const quantity = req.body.quantity?req.body.quantity:1;
    const additionalInfo = req.body.additionalInfo;
    const remark = req.body.remark;
    // if(!productIds) return res.status(400).json({error:"please add product"});
    if(!productId) return res.status(400).json({error:"product cart can not be empty"});
    try {
        const product = await ProductModel.findOne({where:{id:productId}});
        if(!product) return res.status(404).json({error:`${productId} not found`});  

        const user = await UserModel.findOne({where:{id:userId}});
        if(!user) return res.status(404).json({error:"user not found"});
        
        const cart = await CartModel.findOne({where:{userId:userId,productId : productId,additionalInfo:additionalInfo}});
        if(!cart){
        if(quantity<0) return res.status(400).json({error:"quantity cannot be negative"});
            let cartData = {
                userId :userId,
                productId : productId,
                quantity:quantity,
                additionalInfo:additionalInfo,
                remark:remark,
            };
            const cart = await CartModel.create(cartData);
            cart.deleted = undefined;
            return res.status(201).json(cart);
        }else{
            cart.quantity = parseInt(cart.quantity) + parseInt(quantity);
            cart.additionalInfo = additionalInfo,
            cart.remark = remark,
            cart.deleted = undefined;
            if(cart.quantity>0) cart.deleted = false;
            if(cart.quantity<=0){
                cart.deleted = true;
                cart.quantity = 0;
                await cart.save();
                return res.status(204).json({msg:"cart removed"});
            }
            await cart.save();
            return res.status(200).json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// @desc : get cart list 
// @route : /api/v1/cart/:id
// @access : public 
// @Method : [ GET ]
const getCart = async (req, res) => {
    const token = req.token;
    const role = parseInt(token.role);
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid id"});
        try {
            // @desc : admin 
           if(role === ADMINID){
            const {count,rows} = await CartModel.findAndCountAll({where:{deleted:false},attributes:{ exclude: ['deleted'] }});
            res.status(200).json({
                count: count,
                data: rows
            });
           }
            // @desc : Normal user 
           else if(role === USERID){
            const {count,rows} = await CartModel.findAndCountAll({where:{userId:userId,deleted:false},attributes:{ exclude: ['deleted'] }});
            res.status(200).json({
                count: count,
                data: rows
            });
           }
           else{
            res.status(401).send({ error: "un-authorized" });
           }
        } catch (error) {
            res.status(400).send({ error: error.message });
        }

   
}


module.exports = {
    addToCart,
    getCart
};
