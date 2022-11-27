const { Sequelize,DataTypes } = require('sequelize');
require('dotenv').config({path:"src/config/config.env"});

// database connection
const sequelize = new Sequelize(process.env.DB_URL,{logging:false});

//   check connection 
sequelize.authenticate().then(()=>{
    console.log("Databse Connection Sucessful");
})
.catch(err =>{
    console.log("Database Connection error "+err);
});


// database instance
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


// databse migration
db.category = require('./category.model')(sequelize,DataTypes,'category');
db.subcategory = require('./category.model')(sequelize,DataTypes,'subcategory');
db.subSubcategory = require('./category.model')(sequelize,DataTypes,'subsubcategory');

db.department = require('./department.model')(sequelize,DataTypes);
db.banner = require('./banner.model')(sequelize,DataTypes);

db.product = require('./product.model')(sequelize,DataTypes);
db.cart = require('./cart.model')(sequelize,DataTypes);
db.coupon = require('./coupon.model')(sequelize,DataTypes);
db.order = require('./order.model')(sequelize,DataTypes);

db.user = require('./user.model')(sequelize,DataTypes);
db.application = require('./app.model')(sequelize,DataTypes);


// Associations
Category = db.category;
SubCategory = db.subcategory; 
SubSubCategory = db.subSubcategory;
Department = db.department;
Product = db.product;
Cart = db.cart;
Coupon = db.coupon;
Order = db.order;
User = db.user;
Banner = db.banner;


/* 1.one category have many sub category but 
    one subcategory belongs to only one category
    and subcategory have many subsub category
    relation : [ category-subcategory : one to many ]
    relation : [ subcategory-subsubcategory : one to many ]
*/
Category.hasMany(SubCategory,{
    foreignKey: 'categoryId',
    allowNull: false,
  });
SubCategory.belongsTo(Category);

SubCategory.hasMany(SubSubCategory,{
    foreignKey: 'subcategoryId',
    allowNull: false,
  });
SubSubCategory.belongsTo(SubCategory);


/*
  * product and category,subcategory,subsubcategory relation
  * one category contains many product
  * many product belongs to one category
  * relaton : [ category hasMany product ]
  * relation : [ product belongsTo Category ]
*/
Category.hasMany(Product,{
    foreignKey: 'categoryId'
});
Product.belongsTo(Category);

SubCategory.hasMany(Product,{
    foreignKey: 'subcategoryId'
});
Product.belongsTo(SubCategory);

SubSubCategory.hasMany(Product,{
    foreignKey: 'subsubcategoryId'
});
Product.belongsTo(SubSubCategory);

/*
  * product and dpartment relation
  * one department contains many product
  * many product belongs to one department
  * relaton : [ department hasMany product ]
  * relation : [ product belongsTo Department ]
*/
Department.hasMany(Product,{
    foreignKey: 'departmentId'
});
Product.belongsTo(Department,{foreignKey: 'departmentId'});

/* 
    *department and user relationship
    *user has many department
    *many department belongs to one user
    *relation [ user hasmany department]
    *relation [department belongs to user]
*/
User.hasMany(Department,{
    foreignKey:'departmentHeadId'
});
Department.belongsTo(User,{foreignKey:'departmentHeadId'});

/*
    * product and coupon relationship
    * one coupon have many product
    * one product have many coupon
    * relation [ Many-To-Many ]
*/
Coupon.belongsToMany(Product, { through: 'coupon_product' });
Product.belongsToMany(Coupon, { through: 'coupon_product' });

/*
    * category and coupon relationship
    * one coupon have many category
    * one category have many coupon
    * relation [ Many-To-Many ]
*/
Coupon.belongsToMany(Category, { through: 'coupon_category' });
Category.belongsToMany(Coupon, { through: 'coupon_category' });


/**
 * Cart and user relationship
 * one user have only one cart
 * one cart belong to one person
 * relation [ one to one ]
 */
User.hasOne(Cart);
Cart.belongsTo(User);
 /**
  * User and Order Relationship
  * user have one or many order
  * one order belongs to one user
  * relation [ one to many]
  */
 User.hasMany(Order,{
    foreignKey: "userId",
    as :"userorder",
 });
 Order.belongsTo(User);

/**
 * Banner Must contain category,productid,userId
 * Banner may have one of the above
 * Banner have One Category,ProductId,UserId
 */
Category.hasOne(Banner);
Product.hasOne(Banner);
User.hasOne(Banner);
Banner.belongsTo(Category);
Banner.belongsTo(Product);
Banner.belongsTo(User);

// sysncing database
db.sequelize.sync({force:false}).then(()=>{
    console.log("re-sync done");
});

module.exports = db;