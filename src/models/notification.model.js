module.exports = (sequelize,DataTypes)=>{
    const Notification =  sequelize.define("notification",{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        notification : {
            type : DataTypes.STRING,
            allowNull: false,
            validate :{
                notNull : {
                    msg : "notification can not be empty"
                }
            },
        },
        data :DataTypes.JSON,
        isSeen : {
            type: DataTypes.BOOLEAN,
            defaultValue: 'false',
        },
        userId : {
            type : DataTypes.UUID,
            allowNull:false,
            validate : {
                notNull : {
                    msg:"user id can not be empty"
                }
            }
        }
    });
    return Notification;
}