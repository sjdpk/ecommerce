// const { Sequelize } = require("sequelize");

module.exports = (sequelize,DataTypes) => {
    const User = sequelize.define("user",{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate : {
                notNull : {
                    msg : 'please enter first name',     
                }
            }
        },
        middle_name:DataTypes.STRING,
        last_name:{
            type: DataTypes.STRING,
            allowNull: false, 
            validate : {
                notNull : {
                    msg : 'please enter last name',     
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            unique : {
                args: true,
                msg : "email address is already in use"
            },
            isEmail: true, 
            allowNull: false,
            validate : {
                notNull : {
                    msg : 'please enter email',     
                },
                isEmail : {
                    msg : "please enter valid email"
                },  
            }
        },
        phone_number: {
            type: DataTypes.STRING,
            unique:{
                args : true,
                msg : 'phone number must be unique', 
            },
            allowNull:false,
            validate : {
                notNull : {
                    msg : 'please enter phone number',     
                }
            }
        },
        address :{
            type:DataTypes.STRING,
            allowNull:false,
            validate : {
                notNull : {
                    msg : 'please enter your address',     
                }
            }
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            validate : {
                notNull : {
                    msg : 'password must be filled',     
                }
            }
        },
        role:{
            type:DataTypes.INTEGER, //[0,1,2]- [admin,vendor,user]
            defaultValue :process.env.NORMAL_USER_ID ||  2, 
        },
        active:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
        },
        disable:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        },
        deletedAt : DataTypes.DATE,
    });
    return User
 }
