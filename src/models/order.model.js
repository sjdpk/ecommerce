module.exports = (sequelize,DataTypes)=>{
    const Order =  sequelize.define("order",{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        order : {
            type :  DataTypes.ARRAY(DataTypes.JSON),
            allowNull: false,
            validate :{
                notNull : {
                    msg : "order can not be empty"
                }
            },
        },
        deliveryAddress : {
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                notNull : {
                    msg : 'please enter delivery address',
                }
            }
        },
        orderStatus : {
            type: DataTypes.STRING,
            defaultValue: 'ordered',
        },
        paymentStatus : {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        remark : DataTypes.STRING,
        userName: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
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
    return Order;
}