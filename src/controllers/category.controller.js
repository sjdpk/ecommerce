const db = require('../models/index');
const paginationConfig = require('../config/pagination.handler');
const { sequelize } = require('../models/index');
require('dotenv').config({path:"config/config.env"});
const perPageLimit = parseInt(process.env.PER_PAGE_LIMIT) ;


const Category = db.category;
const SubCategory = db.subcategory;
const SubSubCategory = db.subSubcategory;


// @desc : add new category 
// @route : /api/v1/category
// @access : Private [ Admin ]
// @Method : [ POST ]
const createCategory = async(req,res)=>{
    if(req.file == null) return res.status(400).json({error:"select image"});
    let categoryData = {
        name:req.body.name.trim(),
        image:`${req.protocol}://${req.get('host')}/${req.file.path}`,
    }
    try {
        const category = await Category.create(categoryData);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// @desc : add new sub-category 
// @route : /api/v1/sub-category
// @access : Private [ Admin ]
// @Method : [ POST ]
const createSubCategory = async(req,res)=>{
    const categoryId = req.body.categoryId;
    if(!categoryId) return res.status(400).json({error:"categoryId is required"});
    const imagePath =req.file !=null?`${req.protocol}://${req.get('host')}/${req.file.path}`:null;
    let subCategoryData = {
        name:req.body.name,
        image:imagePath,
        categoryId:categoryId,
    }
    try {
        const subCategory = await SubCategory.create(subCategoryData);
        res.status(201).json(subCategory);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// @desc : add new sub-category 
// @route : /api/v1/sub-category
// @access : Private [ Admin ]
// @Method : [ POST ]
const createSubSubCategory = async(req,res)=>{
    const subcategoryId = req.body.subcategoryId;
    if(!subcategoryId) return res.status(400).json({error:"subcategoryId is required"});
    const imagePath =req.file !=null?`${req.protocol}://${req.get('host')}/${req.file.path}`:null;
    let subCategoryData = {
        name:req.body.name,
        image:imagePath,
        subcategoryId:subcategoryId,
    }
    try {
        const subCategory = await SubSubCategory.create(subCategoryData);
        res.status(201).json(subCategory);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}


async function update(req,res,DbModel,label="id"){
    const id = req.params.id;
    const data = await DbModel.findOne({where:{id:id}});
    if(!data) return res.status(404).json({error:`${label} not found`});
    let updatedData = {
        name:req.body.name !=null?req.body.name.trim():data.name,
        image:req.file!=null?`${req.protocol}://${req.get('host')}/${req.file.path}`:data.image,
    }
    await data.update(updatedData);
    res.status(200).json(data);
}

// update category
const updateCategory = async(req,res)=>{
    try {
        await update(req,res,Category,label='category');
    } catch (error) {
       res.status(500).json({error:error.message}); 
    }
}



const updateSubCategory = async(req,res)=>{
    try {
        await update(req,res,SubCategory,label='category');
    } catch (error) {
       res.status(500).json({error:error.message}); 
    }
}

const updateSubSubCategory = async(req,res)=>{
    try {
        await update(req,res,SubSubCategory,label='category');
    } catch (error) {
       res.status(500).json({error:error.message}); 
    }
}

//  @desc : Get All category 
// @route : /api/v1/category
// @access : Public 
// @Method : [ Get ]
async function getCategory(res,DbModel,condn={}){
    const { count, rows } = await DbModel.findAndCountAll({
        where: condn,
        attributes : { exclude : ['createdAt','updatedAt']},
      });
      res.status(200).json({count:count,data:rows});
}

const getCategories = async(req,res)=>{
    try {
        const categoryId =  req.query.categoryId;
        const subcategoryId =  req.query.subcategoryId;
        if (categoryId) {
            const condn = { visibility:true,categoryId:categoryId };
          return  await getCategory(res,SubCategory,condn);
        }
        if(subcategoryId){
            const condn = { visibility:true,subcategoryId:subcategoryId };
          return  await getCategory(res,SubSubCategory,condn);
        }
        await getCategory(res,Category,{visibility:true});
    } catch (error) {
        res.status(500).json({"error":error.message});
    }
}




module.exports = {
    createCategory,
    createSubCategory,
    createSubSubCategory,
    getCategories,
    updateCategory,
    updateSubCategory,
    updateSubSubCategory
};



