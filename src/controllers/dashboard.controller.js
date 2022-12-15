const db = require('../models');


const BannerModel = db.banner;
const CategoryModel = db.category;
const ProductModel  = db.product;
const UserModel = db.user;


const dashboard = async(req,res)=>{
    try {
        const banner = await BannerModel.findAll({});
        const category  = await CategoryModel.findAll({ order: db.sequelize.random(), limit: 9, attributes : { exclude : ['createdAt','updatedAt','visibility']},});
        const product  = await ProductModel.findAll({
            order: db.sequelize.random(), 
            limit: 12, 
            attributes :['id','name','slug','price','discountType','discount','image','vendorId'],
            include :[{model: db.user,attributes : ["first_name","last_name"]}]
        });
        banner.forEach(element=>{
            element.banner =`${req.protocol}://${req.get('host')}/${element.banner}`
        });
        category.forEach(element=>{
            element.image =`${req.protocol}://${req.get('host')}/${element.image}`
        });
       
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
            banner : banner,
            category:category,
            product:  productJson,
        });
    } catch (error) {
        res.status(400).json({error:error.message});
    }
}

module.exports = {dashboard};
