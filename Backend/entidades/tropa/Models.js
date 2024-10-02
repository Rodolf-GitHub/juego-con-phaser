const { DataTypes } = require('sequelize');
const sequelize = require('../../databaseConnection/databaseConecction');

const Xtropa = sequelize.define('Xtropa', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  puntos_vida: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  ataque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  coste_oro: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  coste_madera: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  coste_comida: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  coste_poblacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  nivel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  }
});
const XtipoTropa = require('../tipoTropa/Models');

Xtropa.belongsTo(XtipoTropa, { foreignKey: 'tipoTropaId', as: 'tipoTropa' });
module.exports = Xtropa;