'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserHookTail = sequelize.define('UserHookTail', {
        nick: DataTypes.STRING,
        score: DataTypes.INTEGER,
    }, {});
    UserHookTail.associate = function(models) {
        // associations can be defined here
    };
    return UserHookTail;
};