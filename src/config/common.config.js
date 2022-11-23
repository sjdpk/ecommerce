function isEmpty(req){
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) return true;
    else return false;
}

/* Check if string is valid UUID */
function checkIfValidUUID(str) {
    // Regular expression to check if string is a valid UUID
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  
    return regexExp.test(str);
  }

module.exports = {
    isEmpty,
    checkIfValidUUID,
}