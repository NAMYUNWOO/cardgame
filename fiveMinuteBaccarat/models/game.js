'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    gameResult: DataTypes.STRING
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
  };
  return Game;
};