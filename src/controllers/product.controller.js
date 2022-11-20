const db = require("../models/index");
const {isEmpty} = require('../config/common.config');

ProductModel = db.product;
CategoryModel = db.category;
SubCategoryModel = db.subcategory;
SubSubCategoryModel = db.subSubcategory;

const createProduct = async(req,res)=>{
    if(isEmpty(req)) return res.status(400).json({error:'please provide a valid body'});
    if(!req.file) return res.status(400).json({error:"select product image"});
    let categoryId = req.body.categoryId;
    let subcategoryId = req.body.subcategoryId;
    let subsubcategoryId = req.body.subsubcategoryId;

    if(!categoryId) categoryId = null;
     if(!subcategoryId) subcategoryId = null;
     if(!subsubcategoryId) subsubcategoryId= null;
    if(categoryId === null &&subcategoryId === null && subsubcategoryId === null) return res.status(400).json({error:"please select subcategory"});

    try {
        const category = await CategoryModel.findOne({where:{id:categoryId}});
        const subcategory = await SubCategoryModel.findOne({where:{id:subcategoryId}});
        const subsubcategory = await SubSubCategoryModel.findOne({where:{id:subsubcategoryId},include :[{model:SubCategoryModel,attributes:['categoryId']}]});

        if(categoryId!=null && !category) return res.status(404).json({error:"category not found"});
        if(subcategoryId!=null && !subcategory) return res.status(404).json({error:"subcategory not found"});
        if(subcategory) categoryId = subcategory.categoryId; // assign sub category parent category to categoryId

        if(subsubcategoryId!=null && !subsubcategory) return res.status(404).json({error:"sub-sub category not found"});
        if(subsubcategory) subcategoryId = subsubcategory.subcategoryId; categoryId = subsubcategory.subcategory.categoryId;  // assign sub category parent category to categoryId

        let productData = {
            name :req.body.name,
            description:req.body.description,
            categoryId:categoryId,
            subcategoryId:subcategoryId,
            subsubcategoryId : subsubcategoryId,
            price:req.body.price,
            department:req.body.department,
            productStock:req.body.productStock,
            discountType:req.body.discountType,
            discount:req.body.discount,
            image:req.file.path,
        }
        const product  = await ProductModel.create(productData);
        res.status(201).json(product);
    } catch (error) {
       res.status(400).json({error:error.message}) 
    }
}

module.exports = {
    createProduct,
}