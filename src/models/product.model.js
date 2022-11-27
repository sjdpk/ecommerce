// @desc : Category Model 
// @fields : [name*,image*]
module.exports = ( sequelize, DataTypes ) =>{
    const Product = sequelize.define('product',{
        name : { 
            type : DataTypes.STRING,
            allowNull : false,
            // unique :  {
            //     args: true,
            //     msg : "category is already defined"
            // },
            validate:{
                notNull:{
                    msg:"name cannot be empty"
                }
            }

        },
        slug:DataTypes.STRING,
        description : { 
            type : DataTypes.TEXT,
            allowNull : false,
            validate : {
                notNull : {
                    msg : 'description cannot be empty',
                }
            }  
        },
        // category  : DataTypes.INTEGER,
        // subcategory : DataTypes.INTEGER,
        // subsubcategory : DataTypes.INTEGER,
        price : { 
            type : DataTypes.DOUBLE,
            allowNull : false,
            validate : {
                notNull : {
                    msg : 'price cannot be empty',
                }
            }  
        },
        productStock :{
            type:DataTypes.INTEGER,
            defaultValue :1,
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
        visibility : {
            type : DataTypes.BOOLEAN,
            defaultValue :true,
        },
        disable : {
            type : DataTypes.BOOLEAN,
            defaultValue :false,
        },
        image :{ 
            type : DataTypes.STRING,
            allowNull : false,
            validate:{notNull:{msg:"name cannot be empty"}}
        },
        additionalInfo :{
            type :DataTypes.JSON,
        },
        vendorId:{
            type : DataTypes.UUID,
            allowNull : false,
            validate:{
                notNull:{
                    msg:"vendor id cannot be empty"
                }
            }
        },
        deletedAt:DataTypes.DATE,
        // deletedBy :DataTypes.INTEGER,

    });

    Product.addHook('beforeValidate', (prod, options) => {
        const uniqueSuffix = Date.now();
        const slug = `${prod.name.replace(" ","-")}-${uniqueSuffix}`;
        prod.slug = slug.toLowerCase().trim();
      });
    return Product;
}

