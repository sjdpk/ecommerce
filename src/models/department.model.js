module.exports = (sequelize,DataTypes)=>{
    const Department = sequelize.define("department",{
        departmentName:{
            type : DataTypes.STRING,
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
            type : DataTypes.UUID,
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