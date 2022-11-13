const multer = require('multer');


const storage =  multer.diskStorage({
    destination : function(req,file,cb){
      cb(null,'./uploads')
    },
    filename : function(req,file,cb){
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,file.fieldname+"-"+uniqueSuffix+"-"+file.originalname)
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