const winston = require("winston");

// Crea un logger personalizado
const logger = winston.createLogger({
  level: "info", // Nivel de registro (info, error, warn, etc.)
  format: winston.format.combine(
    winston.format.colorize({ all: true }), // Agrega colores a los mensajes
    winston.format.simple() // Formato simple para los mensajes
  ),
  transports: [
    new winston.transports.Console(), // Salida a la consola
  ],
});

module.exports = logger;
