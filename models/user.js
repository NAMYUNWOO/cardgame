module.exports = (sequelize,DataTypes) => {
    sequelize.define('user', {
        code: {
            type:DataTypes.STRING(40),
            allowNull:false,
            unique:true,
        },
        password : {
            type: DataTypes.STRING(100),
            allowNull:false
        },
        money:{
            type: DataTypes.INTEGER,
            allowNull:false,
        }
    },{
        timestamps:true,
        paranoid:true,
    })
}