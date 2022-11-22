module.exports = (sequelize,Datatypes)=>{
    const Department = sequelize.define("deparment",{
        departmentName:{
            type : Datatypes.STRING,
            allowNull : false,
            unique :  {
                args: true,
                msg : "department is already defined"
            },
            validate:{
                notNull:{
                    msg:"department cannot be empty"
                }
            }
        },
        departmentHeadId:{
            type : Datatypes.INTEGER,
            allowNull : false,
            validate:{
                notNull:{
                    msg:"department head cannot be empty"
                }
            }
        }
    });
    return Department;
}