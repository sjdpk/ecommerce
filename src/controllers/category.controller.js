const createCategory = async(req,res)=>{
    try {
        res.status(201).json({
            name:req.body.name,
            image:`${req.protocol}://${req.get('host')}/${req.file.path}`,
        })
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

module.exports = {
    createCategory
};

