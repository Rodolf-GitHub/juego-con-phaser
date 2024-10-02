const { DataTypes } = require('sequelize');
const sequelize = require('../../databaseConnection/databaseConecction');

const XtipoTropa = sequelize.define('XtipoTropa', {
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

XtipoTropa.prototype.getValoresNivel = function(nivel) {
  const factor = Math.pow(1.1, nivel - 1);
  return {
    puntos_vida: Math.round(this.puntos_vida * factor),
    ataque: Math.round(this.ataque * factor),
    coste_oro: Math.round(this.coste_oro * factor),
    coste_madera: Math.round(this.coste_madera * factor),
    coste_comida: Math.round(this.coste_comida * factor),
    coste_poblacion: Math.round(this.coste_poblacion * factor)
  };
};

module.exports = XtipoTropa;