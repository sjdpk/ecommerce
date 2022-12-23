const db = require("../models/index");
const {isEmpty} = require('../config/common.config');
const pagination = require('../config/pagination.handler');
const {checkIfValidUUID} = require('../config/common.config');
const sequelize = db.Sequelize;
const { Op } = db.Sequelize;
require('dotenv').config({path:"config/config.env"});



const PerPageLimit  = process.env.PER_PAGE_LIMIT

ProductModel = db.product;
CategoryModel = db.category;
SubCategoryModel = db.subcategory;
SubSubCategoryModel = db.subSubcategory;
DepartModel = db.department;

// @desc : add new product 
// @route : /api/v1/product
// @access : Private [ Vendor, Admin ]
// @Method : [ POST ]
const createProduct = async(req,res)=>{
    const token = req.token;
    const role = token.role;
    if(role !=1) return res.status(401).json({error:"you have to access to add product"});
    const vendorId = token.userId;
    const uuid = checkIfValidUUID(vendorId);
    if (!uuid) return res.status(400).json({error:"invalid id"});

    if(isEmpty(req)) return res.status(400).json({error:'please provide a valid body'});
    if(!req.file) return res.status(400).json({error:"select product image"});  
    let categoryId = req.body.categoryId;
    let subcategoryId = req.body.subcategoryId;
    let subsubcategoryId = req.body.subsubcategoryId;
    let departmentId = req.body.departmentId;
    if(!departmentId) return res.status(400).json({error:"departmentId is required"});

    if(!categoryId) categoryId = null;
     if(!subcategoryId) subcategoryId = null;
     if(!subsubcategoryId) subsubcategoryId= null;
    if(categoryId === null &&subcategoryId === null && subsubcategoryId === null) return res.status(400).json({error:"please select category"});

    try {
        const department = await DepartModel.findOne({where:{id:departmentId}});
        if(!department) return res.status(404).json({error:"department not found"});
        const {category_Id,subcategory_Id,subsubcategory_Id} = await categoryHandler(res,categoryId,subcategoryId,subsubcategoryId);
        const additionalInfo = req.body.additionalInfo;
        let productData = {
            name :req.body.name,
            description:req.body.description,
            categoryId:category_Id,
            subcategoryId:subcategory_Id,
            subsubcategoryId : subsubcategory_Id,
            price:req.body.price,
            departmentId:req.body.departmentId,
            productStock:req.body.productStock,
            discountType:req.body.discountType,
            discount:req.body.discount,
            image:req.file.path,
            vendorId : vendorId,
            additionalInfo : !additionalInfo?null:JSON.parse(additionalInfo),
        }
        const product  = await ProductModel.create(productData);
        product.deletedAt = undefined;
        res.status(201).json(product);
    } catch (error) {
       res.status(400).json({error:error.message}) 
    }
}

// @desc : get visible product list 
// @route : /api/v1/product
// @access : Public
// @Method : [ GET ]
const getProducts = async(req,res) =>{
    const currentpage = req.query.page?parseInt(req.query.page):1;
    const categoryId = req.query.categoryId;
    const subcategoryId = req.query.subcategoryId;
    const subsubcategoryId = req.query.subsubcategoryId;
    const search = req.query.search;
    const vendorId = req.query.vendorId;
    const departmentId = req.query.departmentId;
    const priceFrom = req.query.priceFrom;
    const priceTo = req.query.priceTo;
    const priceOrder = req.query.priceOrder;
    const nameOrder = req.query.nameOrder;
    const offset = (parseInt(currentpage)-1)*PerPageLimit;
    let condn = { deletedAt:null };
    let order = [];
    if(vendorId) condn = { deletedAt:null,vendorId:vendorId };
    if(departmentId) condn = { deletedAt:null,departmentId:departmentId };
    if (search) condn = { deletedAt:null,name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + search.toLowerCase() + '%')};
    if(priceFrom&&priceTo) condn = {deletedAt:null, "price": {[Op.and]: {[Op.gte]: priceFrom,[Op.lte]: priceTo}}};
    if(priceFrom) condn = {deletedAt:null, "price": {[Op.and]: {[Op.gte]: priceFrom}}};
    if(priceTo) condn = {deletedAt:null, "price": {[Op.and]: {[Op.lte]: priceTo}}};
    if(categoryId)  condn = {deletedAt:null,categoryId:categoryId};
    if(subcategoryId) condn = {deletedAt:null,subcategoryId:subcategoryId};
    if(subsubcategoryId) condn = { deletedAt:null,subsubcategoryId:subsubcategoryId};
    if(priceOrder==='asc')  order = [['price', 'ASC']];
    if(priceOrder==='desc')  order = [['price', 'DESC']];
    if(nameOrder==='asc')  order = [['name', 'ASC']];
    if(nameOrder==='desc')  order = [['name', 'DESC']];
    if(search && priceFrom && priceTo) condn = { 
        deletedAt:null,name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + search.toLowerCase() + '%'),
        "price": {[Op.and]: {[Op.gte]: priceFrom,[Op.lte]: priceTo}}
    };
    if(search && priceFrom) condn = { 
        deletedAt:null,name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + search.toLowerCase() + '%'),
        "price": {[Op.and]: {[Op.gte]: priceFrom}}
    };
    if(search && priceTo) condn = { 
        deletedAt:null,name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + search.toLowerCase() + '%'),
        "price": {[Op.and]: {[Op.lte]: priceTo}}
    };
    
    try {
        const product  = await ProductModel.findAll({
            where:condn,
            order:order, 
            limit: PerPageLimit, 
            attributes :['id','name','slug','price','discountType','discount','image','vendorId'],
            include :[{model: db.user,attributes : ["first_name","last_name"]}]
        });
        const { totalPage,count } =await pagination(ProductModel,PerPageLimit, {where:condn});
        let productJson = [];
        product.forEach(async(element)  => {
            productJson.push({
                "id":element.id,
                'name':element.name,
                'slug':element.slug,
                'price':element.price,
                'discountType':element.discountType,
                'discount':element.discount,
                'image':`${req.protocol}://${req.get('host')}/${element.image}`,
                'vendorId':element.vendorId,
                'vendorname': element.user.first_name+" "+element.user.last_name,
                'vedorimage':null,
            });
        });
        res.status(200).json({
            currentpage :currentpage,
            totalpage:totalPage,
            count:count,
            data:productJson,
        });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// @desc : get single visible product 
// @route : /api/v1/product:id
// @access : Public
// @Method : [ GET ]
const getProduct = async(req,res)=>{
    const id = req.params.id;
    try {
        const product = await ProductModel.findOne({
            where:{id:id,deletedAt:null},
            attributes : { exclude : ['deletedAt']},
            include :[
                {model: db.user,attributes : ["first_name","last_name"]},
                {model: db.category,attributes : ["name"]},
                {model: db.subcategory,attributes : ["name"]},
                {model: db.subSubcategory,attributes : ["name"]},
                {model: db.department,attributes : ["departmentName"]},
            ],
        });
        if(!product) return res.status(404).json({error:"product not found"});
        
        const productResponse  ={
            "id": product.id,
            "name": product.name,
            "slug":product.slug,
            "description": product.description,
            "price": product.price,
            "productStock": product.productStock,
            "discountType": product.discountType,
            "discount": product.discount,
            "visibility": product.visibility,
            "image": `${req.protocol}://${req.get('host')}/${product.image}`,
            "additionalInfo": product.additionalInfo,
            "vendorId":product.vendorId,
            "vendorName":product.user.first_name +" "+ product.user.last_name,
            "createdAt": product.createdAt,
            "updatedAt":product.updatedAt,
            "categoryId": product.categoryId,
            "categoryName": product.category.name,
            "subcategoryId": product.subcategoryId,
            "subcategoryName": product.subcategory !=null ?product.subcategory.name:null,
            "subsubcategoryId": product.subsubcategoryId,
            "subsubcategoryName":product.subsubcategory !=null? product.subsubcategory.name:null,
            "departmentId": product.departmentId,
            "departmentName": product.department.departmentName,  
        }
        res.status(200).json(productResponse);
    } catch (error){
        res.status(500).json({error :error.message})
    }
}


// @desc : get search list product  for autosugession
// @route : /api/v1/product/all
// @access : Public
// @Method : [ GET ]

const getAutoSugessionList = async (req,res)=>{
    try {
        const product = await ProductModel.findAll({
            where:{deletedAt:null},
            order: db.sequelize.random(), 
            limit: 644, 
            attributes : ["id","name"]
        })
        res.status(200).json({data:product}); 
    } catch (error) {
       res.status(400).json({error:error.message}); 
        
    }
}

// @desc : Update single visible product Form Data
// @route : /api/v1/product:id
// @access : Private
// @Method : [ PUT ]
const updateProduct = async (req,res)=>{
    const id =  req.params.id;
    try {
        const product = await ProductModel.findOne({where:{id:id,deletedAt:null},attributes : { exclude : ['deletedAt']},}); 
        if(!product) return res.status(404).json({error:"product not found"});

        let categoryId = req.body.categoryId?req.body.categoryId:product.categoryId;
        let subcategoryId = req.body.subcategoryId?req.body.subcategoryId:product.subcategoryId;
        let subsubcategoryId = req.body.subsubcategoryId?req.body.subsubcategoryId:product.subsubcategoryId;
        const {category_Id,subcategory_Id,subsubcategory_Id} = await categoryHandler(res,categoryId,subcategoryId,subsubcategoryId);
        const additionalInfo = req.body.additionalInfo;

        product.set( {
            name :req.body.name?req.body.name:product.name,
            description:req.body.description?req.body.description:product.description,
            categoryId:category_Id,
            subcategoryId:subcategory_Id,
            subsubcategoryId : subsubcategory_Id,
            price:req.body.price?req.body.price:product.price,
            departmentId:req.body.departmentId?req.body.departmentId:product.departmentId,
            productStock:req.body.productStock?req.body.productStock:product.productStock,
            discountType:req.body.discountType?req.body.discountType:product.discountType,
            discount:req.body.discount?req.body.discount:product.discount,
            image:req.file.path?req.file.path:product.image,
            additionalInfo : additionalInfo?JSON.parse(additionalInfo):product.additionalInfo,
        });
        await product.save();
        res.status(200).json(product);
    } catch (error) {
       res.status(400).json({error:error.message}); 
    }
}

// @desc : Deete product 
// @route : /api/v1/product//:id
// @access : Private [ Vendor,Admin ]
// @Method : [ DELETE ]
const deleteProduct = async(req,res)=>{
    const id =  req.params.id;
    try {
        const product = await ProductModel.findOne({where:{id:id}});
        if(!product) return res.status(404).json({error:"product not found"});
        product.deletedAt = new Date();
        await product.save();
        res.status(204).json({msg:"product deleted"});

    } catch (error) {
        res.status(400).json({error:error.message});
    }
}


async function categoryHandler(res,categoryId,subcategoryId,subsubcategoryId){
    const category = await CategoryModel.findOne({where:{id:categoryId}});
    const subcategory = await SubCategoryModel.findOne({where:{id:subcategoryId}});
    const subsubcategory = await SubSubCategoryModel.findOne({where:{id:subsubcategoryId},include :[{model:SubCategoryModel,attributes:['categoryId']}]});

    if(categoryId!=null && !category) return res.status(404).json({error:"category not found"});
    if(categoryId){
        subcategoryId = null;
        subsubcategoryId = null;
    }
    if(subcategoryId!=null && !subcategory) return res.status(404).json({error:"subcategory not found"});
    if(subcategory) {
        categoryId = subcategory.categoryId;
        subsubcategoryId = null;
    } // assign sub category parent category to categoryId

    if(subsubcategoryId!=null && !subsubcategory) return res.status(404).json({error:"sub-sub category not found"});
    if(subsubcategory && !categoryId){
        subcategoryId = subsubcategory.subcategoryId; 
        categoryId = subsubcategory.subcategory.categoryId;
    }  // assign sub category parent category to categoryId
    return {
        category_Id : categoryId,
        subcategory_Id : subcategoryId,
        subsubcategory_Id : subsubcategoryId,
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    getAutoSugessionList,
    updateProduct,
    deleteProduct,
}

