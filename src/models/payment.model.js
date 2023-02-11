module.exports = (sequelize,DataTypes)=>{
    const Payment =  sequelize.define("payment",{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        method : {
            type: DataTypes.STRING,
            defaultValue: 'cod',
        },
        userId : {
            type : DataTypes.UUID,
            allowNull:false,
            validate : {
                notNull : {
                    msg:"user id can not be empty"
                }
            }
        },
        vendorId : {
            type : DataTypes.UUID,
            allowNull:false,
            validate : {
                notNull : {
                    msg:"vendor id can not be empty"
                }
            }
        },
        orderId : {
            type : DataTypes.UUID,
            allowNull:false,
            validate : {
                notNull : {
                    msg:"order id can not be empty"
                }
            }
        },
        remark : DataTypes.STRING,
    });
    return Payment;
}