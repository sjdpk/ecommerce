module.exports = (sequelize, DataTypes) => {
    const Favourite = sequelize.define("favourite", {
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "userId cannot be empty"
                }
            }
        },
        favouriteList: DataTypes.ARRAY(DataTypes.INTEGER),
    });
    return Favourite;
}