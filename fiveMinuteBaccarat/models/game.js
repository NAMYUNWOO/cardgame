'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    gameResult: DataTypes.STRING,
    gameId: DataTypes.INTEGER,
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
  };
  return Game;
};