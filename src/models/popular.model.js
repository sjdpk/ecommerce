// @desc : Popular Model 
// @fields : [name*,image*]
module.exports = (sequelize, DataTypes) => {
    const Popular = sequelize.define('popular', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "name cannot be empty"
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "description cannot be empty"
                }
            }
        },
        button1Text: DataTypes.STRING,
        button2Text: DataTypes.STRING,
        tagList: DataTypes.ARRAY(DataTypes.STRING),
        visibility: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        image: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
    });
    return Popular;
}

