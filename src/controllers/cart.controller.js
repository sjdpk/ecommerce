const db = require('../models');
const {checkIfValidUUID} = require('../config/common.config');
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

    const productIds = req.body.products;
    if(!productIds) return res.status(400).json({error:"please add product"});
    if(productIds.length<=0) return res.status(400).json({error:"product cart can not be empty"});
    try {
        for (let i = 0; i < productIds.length; i++) {
            const product = await ProductModel.findOne({where:{id:productIds[i]}});
            if(!product) return res.status(404).json({error:`product id of #${productIds[i]} not found`});  
        }
        const user = await UserModel.findOne({where:{id:userId}});
        if(!user) return res.status(404).json({error:"user not found"});
        const cart = await CartModel.findOne({where:{userId:userId}});
        if(!cart){
            let cartData = {
                userId :userId,
                products : productIds,
            };
            const cart = await CartModel.create(cartData);
            return res.status(201).json(cart);
        }
        cart.products = [
            ...cart.products,
            ...productIds
        ];
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// @desc : get cart list 
// @route : /api/v1/cart
// @access : Provate  [ADMIN]
// @Method : [ GET ]
const getCarts = async (req, res) => {
    try {
        const {count,rows} = await CartModel.findAndCountAll({});
        res.status(200).json({
            count: count,
            data: rows
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// @desc : get cart list 
// @route : /api/v1/cart/:id
// @access : public 
// @Method : [ GET ]
const getCart = async (req, res) => {
    const token = req.token;
    const role = token.role;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid id"});
    try {
        const cart = await CartModel.findOne({where:{userId:userId}});
        if(!cart) return res.status(404).json({error:"cart not found"});
        var newCart =[];
        var count = {};
        cart.products.forEach(function(i) { 
            count[i] = (count[i]||0) + 1;
        });
        for (const [key, value] of Object.entries(count)) {
            newCart.push({
                "productId":parseInt(key),
                "quantity":value
            });
        }
        res.status(200).json({
            total: new Set(cart.products).size,
            data: newCart
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// @desc : Delete cart 
// @route : /api/v1/cart/:id
// @access : Private [ User ]
// @Method : [ PUT ]
const removeFromCart = async (req, res) => {
    const token = req.token;
    const role = token.role;
    const userId = token.userId;
    const uuid = checkIfValidUUID(userId);
    if (!uuid) return res.status(400).json({error:"invalid id"});

    const productIds = req.body.products;
    if(!productIds) return res.status(400).json({error:"please add product"});
    if(productIds.length<=0) return res.status(400).json({error:"product cart can not be empty"});
    try {
        const cart = await CartModel.findOne({where:{userId:userId}});
        if (!cart) return res.status(404).json({ error: "cart not found" });
        for (let index = 0; index < productIds.length; index++) {
            const removeId =  cart.products.indexOf(productIds[index])
            if(removeId>-1){
                cart.products.splice(removeId,1);
            }
        }
        cart.products = cart.products;
    
        await CartModel.update({products :cart.products},{where:{userId:userId}});
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    addToCart,
    getCarts,
    getCart,
    removeFromCart,
    // getDepartment,
    // updateDepartment,
    // deleteDepartment,
};
