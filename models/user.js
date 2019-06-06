'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        code: DataTypes.STRING,
        password: DataTypes.STRING,
        money: DataTypes.INTEGER,
        validCode: DataTypes.BOOLEAN,
        nick: DataTypes.STRING,
    }, {});
    User.associate = function(models) {
        // associations can be defined here
    };
    return User;
};