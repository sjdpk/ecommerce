const db = require("../models/index");
const {isEmpty} = require('../config/common.config');
const pagination = require('../config/pagination.handler');
const {checkIfValidUUID} = require('../config/common.config');
require('dotenv').config({path:"config/config.env"});
const PerPageLimit  = process.env.PER_PAGE_LIMIT

ProductModel = db.product;
CategoryModel = db.category;
SubCategoryModel = db.subcategory;
SubSubCategoryModel = db.subSubcategory;
DepartModel = db.department;

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

const getProducts = async(req,res) =>{
    const currentpage = req.query.page?parseInt(req.query.page):1;
    const categoryId = req.query.categoryId;
    const subcategoryId = req.query.subcategoryId;
    const subsubcategoryId = req.query.subsubcategoryId;

    const offset = (parseInt(currentpage)-1)*PerPageLimit;
    const condn = categoryId?{deletedAt:null,categoryId:categoryId}: subcategoryId?{deletedAt:null,subcategoryId:subcategoryId}: subsubcategoryId?{deletedAt:null,subsubcategoryId:subsubcategoryId}:{deletedAt:null};
    try {
        // const condn = {deletedAt:null};
        const product = await ProductModel.findAll({
            where:condn,
            limit: PerPageLimit,
            offset:offset,
            attributes : { exclude : ['deletedAt']},
        });
        const { totalPage,count } =await pagination(ProductModel,PerPageLimit, {where:condn});
        res.status(200).json({
            currentpage :currentpage,
            totalpage:totalPage,
            count:count,
            data:product,
        });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const getProduct = async(req,res)=>{
    const id = req.params.id;
    try {
        const product = await ProductModel.findOne({where:{id:id,deletedAt:null},attributes : { exclude : ['deletedAt']}});
        if(!product) return res.status(404).json({error:"product not found"});
        res.status(200).json(product);
    } catch (error){
        res.status(500).json({error :error.message})
    }
} 
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
       res.status(500).json({error:error.message}); 
    }
}

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

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
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