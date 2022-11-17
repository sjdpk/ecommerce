const { Sequelize,DataTypes } = require('sequelize');
require('dotenv').config({path:"src/config/config.env"});

// database connection
const sequelize = new Sequelize(process.env.DB_URL,{logging:true});

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


// Associations
Category = db.category;
SubCategory = db.subcategory; 
SubSubCategory = db.subSubcategory;

/* 1.one category have many sub category but 
    one subcategory belongs to only one category
    and subcategory have many subsub category
    relation : [ category-subcategory : one to many ]
    relation : [ subcategory-subsubcategory : one to many ]
*/
Category.hasMany(SubCategory,{
    foreignKey: 'categoryId',
    as:'subcategory',
    allowNull: false,
  });
SubCategory.belongsTo(Category);

SubCategory.hasMany(SubSubCategory,{
    foreignKey: 'subcategoryId',
    as:'subsubcategory',
    allowNull: false,
  });
SubSubCategory.belongsTo(SubCategory);



// sysncing database
db.sequelize.sync({force:false}).then(()=>{
    console.log("re-sync done");
});

module.exports = db;