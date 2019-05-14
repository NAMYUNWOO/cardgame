'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bet = sequelize.define('Bet', {
    betMoney: DataTypes.INTEGER,
    betoutcome:DataTypes.STRING,
    payout: DataTypes.INTEGER,
    bettor_code : DataTypes.STRING,
    bet_gameId: DataTypes.INTEGER,
  }, {});
  Bet.associate = function(models) {
    // associations can be defined here
  };
  return Bet;
};