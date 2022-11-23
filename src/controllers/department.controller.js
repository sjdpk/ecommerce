const db = require('../models');

// create main models
const DepartmentModel = db.department;
const UserModel = db.user;


// @desc : add new Department 
// @route : /api/v1/department
// @access : Private [ Vendor, Admin ]
// @Method : [ POST ]
const createDepartment = async (req, res) => {
    try {
        const user = await UserModel.findOne({where :{id:departmentHeadId}});
        if(!user) return res.status(404).json({error:"user not found"});
        let departmentData = {
            departmentName: req.body.departmentName,
            departmentHeadId: req.body.departmentHeadId,
        };
        const department = await DepartmentModel.create(departmentData);
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// @desc : get department list 
// @route : /api/v1/department
// @access : public 
// @Method : [ GET ]
const getDepartments = async (req, res) => {
    try {
        const { count, rows } = await DepartmentModel.findAndCountAll({});
        res.status(200).json({
            count: count,
            data: rows
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// @desc : get single visible deparrtment 
// @route : /api/v1/department:id
// @access : Public
// @Method : [ GET ]
const getDepartment = async (req, res) => {
    let id = req.params.id;
    try {
        const deparment = await DepartmentModel.findOne({ where: { id: id } });
        if (!deparment) return res.status(404).send({ error: "department not found" });
        res.status(200).json(deparment);

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


// @desc : Update single visible department 
// @route : /api/v1/department:id
// @access : Private
// @Method : [ PUT ]
const updateDepartment = async (req, res) => {
    let id = req.params.id
    try {
        const department = await DepartmentModel.findOne({ where: { id: id } });
        if (!department) return res.status(404).send({ error: "department not found" });
        await department.update(req.body, { where: { id: id } });
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

// @desc : Delete department 
// @route : /api/v1/department/:id
// @access : Private [ Vendor,Admin ]
// @Method : [ DELETE ]
const deleteDepartment = async (req, res) => {
    let id = req.params.id
    try {
        const deparment = await DepartmentModel.destroy({ where: { id: id } });
        if (!deparment) return res.status(404).json({ error: "department not found" });
        res.status(204).send({ msg: "product deleted sucessfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}





module.exports = {
    createDepartment,
    getDepartments,
    getDepartment,
    updateDepartment,
    deleteDepartment,
};
