module.exports = (sequelize,DataTypes) => {
    sequelize.define('game', {
        gameId:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        gameResult:{
            type: DataTypes.STRING,
        },
        gameContent:{
            type: DataTypes.STRING,
        },        
    },{
        timestamps:true,
        paranoid:true,
    })
}