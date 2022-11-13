const { Sequelize,Datatypes } = require('sequelize');
require('dotenv').config({path:"config/config.env"});


// database connection
const sequelize = new Sequelize(
    process.env.DATABASE, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
  });


//   check connection 
sequelize.authenticate().then(()=>{
    console.log("Databse COnnection Sucessful");
})
.catch(err =>{
    console.log("Database Connection error "+err);
});


// database instance
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;



// sysncing database
db.sequelize.sync({force:false}).then(()=>{
    console.log("re-sync done");
});

module.exports = db;