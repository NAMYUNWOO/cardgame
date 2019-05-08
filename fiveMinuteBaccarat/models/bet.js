'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bet = sequelize.define('Bet', {
    betMoney: DataTypes.INTEGER,
    earn: DataTypes.INTEGER
  }, {});
  Bet.associate = function(models) {
    // associations can be defined here
  };
  return Bet;
};