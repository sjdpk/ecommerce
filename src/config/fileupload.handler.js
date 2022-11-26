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
      }else{
        cb(null,uploadDir);
      }
    },
    filename : function(req,file,cb){
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const fileprefix = req.originalUrl.includes('category')?"category":req.originalUrl.includes('product')?'product':req.originalUrl.includes('banner')?'banner':'image';
      cb(null,fileprefix+"-"+uniqueSuffix+"-"+file.originalname)
    }
  });

  const upload = multer({
    storage:storage,
    limits : {fileSize : 1024 * 1024 *2},
    fileFilter : (req,file,cb)=>{
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null,true);
      } else {
        cb(null,false)
      }
    }
  });


  module.exports = upload;