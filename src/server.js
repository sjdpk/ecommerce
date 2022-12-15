const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const categoryRoute = require('./routes/category.route');
const productRoute = require('./routes/product.route');
const departmentRoute = require('./routes/department.route');
const couponRoute = require('./routes/coupon.route');
const userRoute = require('./routes/user.route');
const cartRoute = require('./routes/cart.route');
const orderRoute = require('./routes/order.route');
const BannerRoute = require('./routes/banner.route');
const AppRoute = require('./routes/app.route');
const DashboardRoute = require('./routes/dashboard.route');


//load env variable
dotenv.config({path:'./config/config.env'});
const app = express();
app.use(express.json());
app.use('/uploads/', express.static('uploads'));
app.use(morgan('dev'));

// routes handler
app.use('/api/v1',categoryRoute);
app.use('/api/v1',productRoute);
app.use('/api/v1',departmentRoute);
app.use('/api/v1',couponRoute);
app.use('/api/v1',userRoute);
app.use('/api/v1',cartRoute);
app.use('/api/v1',orderRoute);
app.use('/api/v1',BannerRoute);
app.use('/api/v1',AppRoute);
app.use('/api/v1',DashboardRoute);
// app.use('/api/v1/sub-category',subCategoryRoute);

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
  console.log(`Server is running on ${PORT}`);
});
