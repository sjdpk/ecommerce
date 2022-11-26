
module.exports =(sequelize,DataTypes)=>{
    const Banner = sequelize.define('banner',{
        banner:{
            type: DataTypes.STRING,
            allowNull : false,
            vaidate : {notNull:{msg:"banner image cannot be null"}}
        },
        // categoryId  : DataTypes.INTEGER,
        // userId : DataTypes.UUID,
        // productId : DataTypes.INTEGER,
        remark : DataTypes.STRING,
        visibility : {
            type : DataTypes.BOOLEAN,
            defaultValue : true,
        }
    });
    return Banner;
}