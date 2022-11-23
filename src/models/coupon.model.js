module.exports = (sequelize,DataTypes) =>{
    const Coupon = sequelize.define('coupon',{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            // allowNull: false,
            // autoIncrement: true,
            primaryKey: true
        },

        couponCode : {
            type:DataTypes.STRING,
            allowNull : false,
            validate : {
                notNull :{
                    msg : "coupon cannot be null",
                }
            }
        },
        startFrom : {
            type:DataTypes.DATE,
            allowNull : false,
            validate : {
                notNull :{
                    msg : "start date must be selected",
                }
            }
        },
        endAt : {
            type:DataTypes.DATE,
            allowNull : false,
            validate : {
                notNull :{
                    msg : "end date must be selected",
                }
            }
        },
        visibility : {
            type : DataTypes.BOOLEAN,
            defaultValue :true,
        },
        discountType : { 
            type :DataTypes.ENUM('fixed', 'percentage'),
            values: ['fixed', 'percentage'],
            defaultValue :'fixed',
        },
        discount : { 
            type : DataTypes.DOUBLE,
            defaultValue :0.0,
        },
        deletedAt : DataTypes.DATE,
    },{
        timestamps: true,
        createdAt: true, // don't add createdAt attribute
        updatedAt: false,
    });
    return Coupon;
}