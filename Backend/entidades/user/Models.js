const { DataTypes } = require('sequelize');
const sequelize = require('../../databaseConnection/databaseConecction');
const Xterreno =require('../terreno/Models');
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'user'
  }
});

User.associations = {
  Xterreno: Xterreno.hasMany(User, { foreignKey: 'terreno_id', as: 'usuarios' }),
};

module.exports = User;