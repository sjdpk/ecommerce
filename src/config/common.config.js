function isEmpty(req){
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) return true;
    else return false;
}

module.exports = {
    isEmpty,
}