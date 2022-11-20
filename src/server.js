const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const categoryRoute = require('./routes/category.route');
const productRoute = require('./routes/product.route');

//load env variable
dotenv.config({path:'./config/config.env'});
const app = express();
app.use(express.json());
app.use('/uploads',express.static('uploads'));
app.use(morgan('dev'));

// routes handler
app.use('/api/v1',categoryRoute);
app.use('/api/v1',productRoute);
// app.use('/api/v1/sub-category',subCategoryRoute);

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
  console.log(`Server is running on ${PORT}`);
});
