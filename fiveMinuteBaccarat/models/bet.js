module.exports = (sequelize,DataTypes) => {
    sequelize.define('bet', {
        betId:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique:true,
        },
        betMoney:{
            type: DataTypes.INTEGER,
        },
        earnMoney:{
            type: DataTypes.INTEGER,
        },                        
    },{
        timestamps:true,
        paranoid:true,
    })
}