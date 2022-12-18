module.exports = (sequelize,DataTypes) =>{
    const Cart = sequelize.define("cart",{
       userId : {
        type : DataTypes.UUID,
        allowNull : false,
       },
        //  products : DataTypes.ARRAY(DataTypes.INTEGER),
      productId : { 
        type : DataTypes.INTEGER,
        allowNull : false,
        validate : {notNull : { msg : 'productId cannot be empty'}},  
      },
      quantity : { 
        type : DataTypes.INTEGER,
        defaultValue :0,
      },
      additionalInfo :  DataTypes.STRING,
      remark : DataTypes.STRING,
      deleted : { 
        type : DataTypes.BOOLEAN,
        defaultValue : false,
      }, 
    },{ 
        timestamps: true,
        createdAt: true, // don't add createdAt attribute
        updatedAt: true,
      });
    return Cart;
}