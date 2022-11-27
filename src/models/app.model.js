module.exports = (sequelize,DataTypes)=>{
    const FrontendAppConfig = sequelize.define('application',{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        appname : {
            type: DataTypes.STRING,
            allowNull:false,
            unique : {
                args: true,
                msg : "application name is already in use"
            },
            vaidate :{
                notNull : {
                    msg : 'please enter appname',     
                },
            }
        },
        logo:DataTypes.STRING,
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
        phoneNumber: {
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
        additionalInfo :{
            type :DataTypes.JSON,
        },
        deletedAt : DataTypes.DATE,
    });
return FrontendAppConfig;
}