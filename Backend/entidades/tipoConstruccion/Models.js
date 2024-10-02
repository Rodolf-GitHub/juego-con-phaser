const { DataTypes } = require('sequelize');
const sequelize = require('../../databaseConnection/databaseConecction');

const XtipoConstruccion = sequelize.define('XtipoConstruccion', {
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

XtipoConstruccion.prototype.getValoresNivel = function(nivel) {
  const factor = Math.pow(1.1, nivel - 1);
  return {
    produccionOro: this.produccionOro * factor,
    produccionMadera: this.produccionMadera * factor,
    produccionComida: this.produccionComida * factor,
    puntos_vida: Math.round(this.puntos_vida * factor),
    ataque: Math.round(this.ataque * factor)
  };
};

module.exports = XtipoConstruccion;