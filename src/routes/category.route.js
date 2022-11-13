const router  = require("express").Router();
const upload = require('../config/fileupload.handler');
const {createCategory} = require('../controllers/category.controller')

router.post('/',upload.single('image'),createCategory);

module.exports = router;