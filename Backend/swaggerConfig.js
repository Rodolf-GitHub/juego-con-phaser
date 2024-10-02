
const SwaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Productos Carnicos',
        version: '1.0.0',
        description: 'Documentación de la API de Productos carnicos',
      },
      servers: [
        {
          url: 'http://localhost:'+process.env.PORT+'/api',
          description: 'Servidor local',
        },
      ],
    },
    
    apis: ['./swaggerDocs/routesDocs/*'], // Rutas a los archivos que contienen las definiciones de las rutas de la API
  };
  
  module.exports = SwaggerOptions;
  