const { DataTypes } = require('sequelize');
const sequelize = require('../../databaseConnection/databaseConecction');

const Xconstruccion = sequelize.define('Xconstruccion', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nivel: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  x: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  y: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  produccionOro: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  produccionMadera: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  produccionComida: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  ultimaProduccion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
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
  actividadRelacionada: {
    type: DataTypes.STRING,
    allowNull: true
  }
});
const XtipoConstruccion = require('../tipoConstruccion/Models');

Xconstruccion.belongsTo(XtipoConstruccion, { foreignKey: 'tipoConstruccionId', as: 'tipoConstruccion' });

module.exports = Xconstruccion;