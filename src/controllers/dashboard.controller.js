const db = require('../models');

const BannerModel = db.banner;
const CategoryModel = db.category;
const ProductModel  = db.product;


const dashboard = async(req,res)=>{
    try {
        const banner = await BannerModel.findAll({});
        const category  = await CategoryModel.findAll({ order: db.sequelize.random(), limit: 6, attributes : { exclude : ['createdAt','updatedAt','visibility']},});
        const product  = await ProductModel.findAll({ order: db.sequelize.random(), limit: 12, attributes :['id','name','slug','price','discountType','discount','image','vendorId'],});
        banner.forEach(element=>{
            element.banner =`${req.protocol}://${req.get('host')}/${element.banner}`
        });
        category.forEach(element=>{
            element.image =`${req.protocol}://${req.get('host')}/${element.image}`
        });
        product.forEach(element => {
            element.image =`${req.protocol}://${req.get('host')}/${element.image}`
        }); 
        res.status(200).json({
            banner : banner,
            category:category,
            product: product,
        });
    } catch (error) {
        res.status(400).json({error:error.message});
    }
}

module.exports = {dashboard};