const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const invalidPathHandler  =  require('./middlewares/errorhandler');

//load env variable
dotenv.config({path:'./config/config.env'});
const app = express();
app.use(morgan('dev'));

// undefined path handler
app.use(invalidPathHandler);
const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
  console.log(`Server is running on ${PORT}`);
});
