const { DataTypes } = require('sequelize');
const sequelize = require('../../databaseConnection/databaseConecction');

const Xbase = sequelize.define('Xbase', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Xbase;