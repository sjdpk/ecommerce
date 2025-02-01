const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config({ path: "config/config.env" });



// user's id from env file
const ADMIN_ID = parseInt(process.env.ADMIN_ID) || 0;
const VENDOR_ID = parseInt(process.env.VENDOR_ID) || 1;
const NORMAL_USER_ID = parseInt(process.env.NORMAL_USER_ID) || 2;

// @desc -> check user have valid token or not
// @middlewate -> to validate user 
const IsAuthenticated = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).send({ error: "Access Denied / Unauthorized request" });
    try {
        token = token.split(' ')[1] // Remove Bearer from string
        if (token === 'null' || !token) return res.status(401).send({ error: 'Unauthorized request' });
        //token vverification
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        const verified = jsonwebtoken.verify(token, JWT_SECRET_KEY);
        if (!verified) return res.status(401).send({ error: 'Unauthorized request' });
        if (verified.exp <= verified.iat) return res.send({ error: "token is expired " });
        req.token = verified; // user_id & user_type_id
        next();
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
}



const haveToken = async (req, res, next) => {
    if(req.headers.authorization){
        let token = req.headers.authorization;
        if (token) {
            token = token.split(' ')[1];
            const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
            const verified = jsonwebtoken.verify(token, JWT_SECRET_KEY);
            req.token = verified;
        }
    }
    next();
}
// @desc -> check user role as admin
// @middlewate -> validate and authorize user 
const IsAdmin = async (req, res, next) => {
    try {
        let tokenData = req.token;
        let role = tokenData.role;
        if (role === ADMIN_ID) {
            return next();
        }
        return res.status(401).send({ error: "unauthorized!" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// @desc -> check user role as vendor userId =2
// @middlewate -> validate and authorize user 
const IsVendor = async (req, res, next) => {
    try {
        let tokenData = req.token;
        let role = tokenData.role;
        if (role === VENDOR_ID || role === ADMIN_ID) {
            return next();
        }
        return res.status(401).send({ error: "unauthorized! venor" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}



// @desc -> check user role as nortmal user userId =3
// @middlewate -> validate and authorize user 
const IsUser = async (req, res, next) => {
    try {
        let tokenData = req.token;
        let role = tokenData.role;
        if (role === NORMAL_USER_ID || role === ADMIN_ID) {
            return next();
        }
        return res.status(401).send({ error: "unauthorized! user" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}




module.exports = {
    haveToken,
    IsAuthenticated,
    IsAdmin,
    IsVendor,
    IsUser,
}