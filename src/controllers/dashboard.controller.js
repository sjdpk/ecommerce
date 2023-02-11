const db = require('../models');
require('dotenv').config({ path: "config/config.env" });
const jsonwebtoken = require('jsonwebtoken');

const BannerModel = db.banner;
const CategoryModel = db.category;
const ProductModel = db.product;
const UserModel = db.user;
const FavouriteModel = db.favourite;

const OrderModel = db.order;
const PaymentModel = db.payment;



const dashboard = async (req, res) => {
    try {
        const banner = await BannerModel.findAll({});
        const category = await CategoryModel.findAll({ order: db.sequelize.random(), limit: 9, attributes: { exclude: ['createdAt', 'updatedAt', 'visibility'] }, });
        // @desc : find Out fav product list
        let favList = await checkFavourite(req);
        const product = await ProductModel.findAll({
            order: db.sequelize.random(),
            limit: 12,
            attributes: ['id', 'name', 'slug', 'price', 'discountType', 'discount', 'image', 'vendorId'],
            include: [{ model: db.user, attributes: ["first_name", "last_name"] }]
        });
        banner.forEach(element => {
            element.banner = `${req.protocol}://${req.get('host')}/${element.banner}`
        });
        category.forEach(element => {
            element.image = `${req.protocol}://${req.get('host')}/${element.image}`
        });

        let productJson = [];
        product.forEach(async (element) => {
            productJson.push({
                "id": element.id,
                'name': element.name,
                'slug': element.slug,
                'price': element.price,
                'discountType': element.discountType,
                'discount': element.discount,
                'image': `${req.protocol}://${req.get('host')}/${element.image}`,
                'vendorId': element.vendorId,
                'vendorname': element.user.first_name + " " + element.user.last_name,
                'vedorimage': null,
                "isFav": favList.includes(element.id) ? true : false

            });
        });

        res.status(200).json({
            banner: banner,
            category: category,
            product: productJson,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


async function checkFavourite(req) {
    // @desc :  first fetch favourite product id's list
    let favList = [];
    if (req.headers.authorization) {
        let token = req.headers.authorization;
        token = token.split(' ')[1];
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        await jsonwebtoken.verify(token, JWT_SECRET_KEY, async function (err, decoded) {
            if (!err) {
                const userId = decoded.userId;
                const fav = await FavouriteModel.findOne({ where: { userId: userId } });
                if (fav) favList = fav.favouriteList.reverse();
            }
        });
    }
    return favList;
}


const vendorDashboard = async(req,res)=>{
    const paymentDataYear = req.body.year;
    try {
        const statuses = ['ordered', 'accepted', 'preparing', 'ontheway', 'delivered', 'returnrequest'];
        const orderCounts = await Promise.all(statuses.map(status => OrderModel.count({ where: { orderStatus: status } })));
        const orderCountMap = {};
        statuses.forEach((status, index) => {
          orderCountMap[status] = orderCounts[index];
        });
      
        const payment = await PaymentModel.findAll({});
        let totalAmountByMonth = {};
        const currentYear = new Date().getFullYear();
        for (const entry of payment) {
          const date = new Date(entry.createdAt);
          const year = date.getFullYear();
          const compareYear = paymentDataYear?paymentDataYear:currentYear;
          if (year !== compareYear) {
            continue;
          }
          const month = date.getMonth() + 1;
          const key = `${year}-${month}`;
          if (key in totalAmountByMonth) {
            totalAmountByMonth[key] += entry.amount;
          } else {
            totalAmountByMonth[key] = entry.amount;
          }
        }
        res.status(200).json({
          order: orderCountMap,
          payment: totalAmountByMonth
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }      
}

module.exports = { dashboard,vendorDashboard };
