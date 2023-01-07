const db = require('../models/');
require('dotenv').config({ path: "config/config.env" });
const { hashPassword, comparePassword } = require('../config/bcrypt.config');
const pagination = require('../config/pagination.handler');
const { checkIfValidUUID } = require('../config/common.config');
const jsonwebtoken = require('jsonwebtoken');

const UserModel = db.user;

const PerPageLimit = parseInt(process.env.PER_PAGE_LIMIT);
JWT_EXPIRYDATE = process.env.JWT_EXPIRYDATE;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const ADMINID = parseInt(process.env.ADMIN_ID);
const VENDORID = parseInt(process.env.VENDOR_ID);
const USERID = parseInt(process.env.NORMAL_USER_ID);

// @desc  : create new user 
// @route : /api/v1/user/
// @access : Public
// @Method : [ POST ]
const createUser = async (req, res) => {
    let role = parseInt(req.body.role);
    if (role === 0) return res.send({ error: "this role cannot be created!" });
    if (role > 2) return res.send({ error: "role does not exit" });
    if (role < 0) return res.send({ error: "role does not exit" });
    let email = req.body.email.trim();
    let UserPassword = req.body.password;
    try {
        let password = await hashPassword(UserPassword);
        let userInfo = {
            first_name: req.body.first_name.trim(),
            middle_name: req.body.middle_name,
            last_name: req.body.last_name.trim(),
            email: email,
            phone_number: req.body.phone_number.trim(),
            address: req.body.address.trim(),
            password: password,
            role: role ? role : 2,
            active: role === VENDORID ? false : true,
            // disable : req.body.disable,
        };
        const user = await UserModel.create(userInfo);
        // user.password = undefined;
        user.deletedAt = undefined;
        user.role = undefined;

        // direct send access toke after sucessful register
        const userData = await UserModel.findOne({ where: { email: email, deletedAt: null } });
        const checkPassword = await comparePassword(UserPassword, userData.password);
        if (!checkPassword) return res.status(400).send({ error: "invalid password" });
        let jwtdata = {
            authorized: true,
            sub: 'signup',
            iss: userData.email,
            role: userData.role,
            userId: userData.id,
        };
        const token = jsonwebtoken.sign(jwtdata, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRYDATE });
        res.status(201).json({ access_token: token, });




        // res.status(201).json(user);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// @desc : Get all users 
// @route : /api/v1/user
// @access : Private [ ADMIN ]
// @Method : [ GET ]
const getUsers = async (req, res) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1
    try {
        const offset = (parseInt(currentPage) - 1) * PerPageLimit;
        const condn = { deletedAt: null };
        const users = await UserModel.findAll({
            limit: PerPageLimit,
            offset: offset,
            where: condn,
            attributes: ["id", "first_name", "middle_name", "last_name", "email", "phone_number", "address", "createdAt","role","active"],
        });
        const { totalPage, count } = await pagination(UserModel, PerPageLimit, { where: condn });
        res.status(200).json({
            currentpage: currentPage,
            totalpage: totalPage,
            count: count,
            data: users,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// @desc : get single user
// @route :/api/v1/user/:id
// @access : Private [ADMIN,SELF]
// @Method : [ GET ]
const getUser = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    try {
        const user = await UserModel.findOne({
            attributes: ["id", "first_name", "middle_name", "last_name", "email", "phone_number", "address", "createdAt"],
            where: { id: id, deletedAt: null }
        });
        if (!user) return res.status(400).send({ error: "user not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


// @desc :  update user information
// @route : /api/v1/user/:id 
// @access : Private [ Self, Admin]
// @Method : [ PUT ]
const updateUser = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    let role = parseInt(req.body.role);
    if (role === 0) return res.send({ error: "this role cannot be created!" });
    if (role > 2) return res.send({ error: "role does not exit" });
    if (role < 0) return res.send({ error: "role does not exit" });
    try {
        const user = await UserModel.findOne({ where: { id: id, deletedAt: null } });
        if (!user) return res.status(404).send({ error: "user not found" });
        await user.update(req.body);
        user.password = undefined;
        user.deletedAt = undefined;
        user.disable = undefined;
        user.role = undefined;
        return res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// @desc : Deactive account and make unvisible to others
// @route : /api/v1/user/deactive/:id
// @access : Private [ Self, Admin]
// @Method : [ PUT ]
const deactiveUser = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    try {
        const user = await UserModel.findOne({ where: { id: id, deletedAt: null, disable: false, active: true } });
        if (!user) return res.status(404).send({ error: "user not found" });
        user.active = false;
        await user.save();
        res.status(204).json({ msg: "user deactivated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// @desc : Disable account and make unvisible to others
// @route : /api/v1/user/disable/:id
// @access : Private [ Admin]
// @Method : [ PUT ]
const disableUser = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    try {
        const user = await UserModel.findOne({ where: { id: id, deletedAt: null } });
        if (!user) { res.status(404).send({ error: "user not found" }); return; }
        user.disable = true;
        await user.save();
        res.status(204).json({ msg: 'user disable' });
    } catch (err) {
        res.status(400).send({ err: err.message });
    }
}

// @desc : UnDisable account and make visible to others
// @route : /api/v1/user/undisable/:id
// @access : Private [ Admin]
// @Method : [ PUT ]
const undisableUser = async (req, res) => {
    let id = req.params.id;
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    try {
        const user = await UserModel.findOne({ where: { id: id, deletedAt: null, disable: true } });
        if (!user) return res.status(404).send({ error: "user not found" });
        user.disable = false;
        await user.save();
        user.password = undefined;
        user.role = undefined;
        user.disable = undefined;
        user.deletedAt = undefined;
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}


// @desc : Delte account from db
// @route : /api/v1/user/:id
// @access : Private [ Admin, Self]
// @Method : [ DELETE ]
const deleteUser = async (req, res) => {
    let id = req.params.id
    const uuid = checkIfValidUUID(id);
    if (!uuid) return res.status(400).json({ error: "invalid id" });
    try {
        const user = await UserModel.update({ deletedAt: new Date() }, { where: { id: id, deletedAt: null } });
        if (!user) return res.status(404).send({ error: 'user not found !' });
        res.status(204).send({ msg: "user deleted sucessfully" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

// @desc : user Login  [if user is deactivate auto activate after login]
// @route : /api/v1/user/login
// @access : Public [Self]
// @Method : [ POST ]
const loginUser = async (req, res) => {
    try {
        if (!(req.body.email)) return res.status(400).send({ error: "email is required" });
        if (!(req.body.password)) return res.status(400).send({ error: "password is required" });
        let email = req.body.email;
        let password = req.body.password;
        const user = await UserModel.findOne({ where: { email: email, deletedAt: null } });
        if (!user) { res.status(404).send({ error: "email not found" }); return; }
        if (user.disable) return res.status(400).send({ error: "user is disable" });
        if (!user.active) return res.status(400).send({ error: "user is inactive" });

        checkPassword = await comparePassword(password, user.password);
        if (!checkPassword) return res.status(400).send({ error: "invalid password" });
        let jwtdata = {
            authorized: true,
            sub: 'login',
            iss: user.email,
            role: user.role,
            userId: user.id,
        };
        const token = jsonwebtoken.sign(jwtdata, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRYDATE });
        // check whether user is activate or not?
        // if deactivate when credential is right reactivate account self
        if (!user.active) {
            await UserModel.update({ active: true }, { where: { id: user.id, disable: false, active: false, deletedAt: null } });
        }
        res.status(200).send({ access_token: token, });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

// @desc : get self information
// @route :/api/v1/user/me
// @access : Private [SELF]
// @Method : [ GET ]
const me = async (req, res) => {
    let token = req.token;
    try {
        const userId = token.userId;
        const user = await UserModel.findOne({
            attributes: { exclude: ['password', , 'role', 'disable', 'deletedAt'] },
            where: { id: userId, deletedAt: null, disable: false, active: true }
        });
        if (!user) return res.status(400).send({ error: "user not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}



module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deactiveUser,
    disableUser,
    undisableUser,
    deleteUser,

    loginUser,
    me,
}