const multer = require('multer');
const fs = require('fs');

const storage =  multer.diskStorage({
    destination : function(req,file,cb){
      const uploadDir ='./uploads';
      if (!fs.existsSync(uploadDir))fs.mkdirSync(uploadDir);

      if(req.originalUrl.includes('category')){
        const dir = './uploads/category';
        if (!fs.existsSync(dir))fs.mkdirSync(dir);
        cb(null,dir); 
      }else if(req.originalUrl.includes('product')){
        const dir = './uploads/product';
        if (!fs.existsSync(dir))fs.mkdirSync(dir);
        cb(null,dir); 
      }else if(req.originalUrl.includes('banner')){
        const dir = './uploads/banner';
        if (!fs.existsSync(dir))fs.mkdirSync(dir);
        cb(null,dir); 
      }
      else if(req.originalUrl.includes('app')){
        const dir = './uploads/application';
        if (!fs.existsSync(dir))fs.mkdirSync(dir);
        cb(null,dir); 
      }else{
        cb(null,uploadDir);
      }
    },
    filename : function(req,file,cb){
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      let fileprefix ='image';
      if (req.originalUrl.includes('category')) {
        fileprefix = `category-${req.body.name.replace(" ","-").toLowerCase()}`;
      }
      if (req.originalUrl.includes('product')) {
        fileprefix = `product-${req.body.name.replace(" ","-").toLowerCase()}`;
      }
      if (req.originalUrl.includes('banner')) {
        fileprefix = "banner";
      }
      if (req.originalUrl.includes('app')) {
        fileprefix = `app-${req.body.appname.toLowerCase()}`;
      }
      cb(null,fileprefix+"-"+uniqueSuffix+"-"+file.originalname)
    }
  });

  const upload = multer({
    storage:storage,
    limits : {fileSize : 1024 * 1024 *2},
    fileFilter : (req,file,cb)=>{
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
        cb(null,true);
      } else {
        cb(null,false)
      }
    }
  });


  module.exports = upload;