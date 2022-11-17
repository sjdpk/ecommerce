// @desc : Category Model 
// @fields : [name*,image*]
module.exports = ( sequelize, DataTypes ,tableName ) =>{
    const Category = sequelize.define(tableName,{
        name : { 
            type : DataTypes.STRING,
            allowNull : false,
            unique :  {
                args: true,
                msg : "category is already defined"
            },
            validate:{
                notNull:{
                    msg:"name cannot be empty"
                }
            }

        },
        visibility : {
            type : DataTypes.BOOLEAN,
            defaultValue :true,
        },
        image :tableName === 'category'? { 
            type : DataTypes.STRING,
            allowNull : false,
            validate:{notNull:{msg:"name cannot be empty"}}
        }:DataTypes.STRING,

    });
    return Category;
}

