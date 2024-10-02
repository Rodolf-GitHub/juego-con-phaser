const { DataTypes } = require('sequelize');
const sequelize = require('../../databaseConnection/databaseConecction');

const Xbatalla = sequelize.define('Xbatalla', {
  fechaInicio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fechaFin: DataTypes.DATE,
  resultado: DataTypes.STRING,
  detalles: DataTypes.TEXT,
  atacanteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  defensorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

module.exports = Xbatalla;