module.exports = (sequelize,DataTypes) =>{
    const Cart = sequelize.define("cart",{
       userId : {
        type : DataTypes.UUID,
        allowNull : false,
       },
       products : DataTypes.ARRAY(DataTypes.INTEGER),
    },{ 
        timestamps: true,
        createdAt: true, // don't add createdAt attribute
        updatedAt: true,
      });
    return Cart;
}