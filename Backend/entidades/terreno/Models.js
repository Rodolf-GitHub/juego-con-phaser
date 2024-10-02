const { DataTypes } = require('sequelize');
const sequelize = require('../../databaseConnection/databaseConecction');
const Xconstruccion = require('../construccion/Models');

const Xterreno = sequelize.define('Xterreno', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ancho: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
    allowNull: true // Ancho del terreno en casillas
  },
  alto: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
    allowNull: true // Alto del terreno en casillas
  },
  poblacion: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  // Actividades para comida
  agricultura: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  ganaderia: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  caza: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  pesca: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  // Actividades para obtener madera
  tala: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  botanica: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  // Actividades para obtener oro
  mineria: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  comercio: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  artesania: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  // Atributos de poder
  poderAtaque: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  poderDefensa: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  saludTropas: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  }
});
Xterreno.associations = {
  Xconstruccion: Xterreno.hasMany(Xconstruccion, { foreignKey: 'terreno_id', as: 'construcciones' })
};
module.exports = Xterreno;