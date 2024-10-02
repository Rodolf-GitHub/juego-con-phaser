const dotenv = require("dotenv");
dotenv.config();

const { Sequelize } = require('sequelize');
const logger = require("../loggers/loggers");
const port = process.env.PORT;
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT
});

// Prueba la conexión
// Prueba la conexión y maneja errores de conexión
async function testConnection() {
  let isConnected = false;
  let connectionAttempts = 0;
  const maxConnectionAttempts = 5; // Número máximo de intentos de conexión
  
  while (!isConnected && connectionAttempts < maxConnectionAttempts) {
    try {
      await sequelize.sync({ alter: true });//desactivar para que no sincronice
      await sequelize.authenticate();
      logger.info('Synchronization with data base success');
      logger.info('Server listening on port: '+port);
      isConnected = true; // Indicar que la conexión ha tenido éxito
      
    } catch (error) {
      connectionAttempts++;
      logger.error('error with database connection:', error);
      logger.error('Error occurred while connecting to the database:');
      
    }
  }
  
  if (!isConnected) {
    logger.error('Failed to connect to the database after multiple attempts. Exiting...');
    process.exit(1); // Salir del proceso con un código de error
  }
}


testConnection();
module.exports=sequelize;

