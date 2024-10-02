const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const cors = require("cors");
const glob = require("glob");
const path = require("path");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Rutas de la aplicación
const routesDir = "./entidades";

// Configuración de Swagger
const swaggerJSDoc = require("swagger-jsdoc");
const SwaggerUi = require("swagger-ui-express");
const SwaggerOptions = require("./swaggerConfig"); // Importa la configuración de Swagger
const configSwagger = swaggerJSDoc(SwaggerOptions);
app.use("/api/docs", SwaggerUi.serve, SwaggerUi.setup(configSwagger));
const multer = require('./multerConfig');

// Carga dinámica de las rutas de la aplicación
glob
  .sync(`${routesDir}/**/Routes.js`, { ignore: `${routesDir}/base/**/*.js` })
  .forEach((filePath) => {
    const route = require(path.resolve(filePath));
    app.use("/api", route);
  });
  app.use("/api",multer)

// Inicio del servidor
async function main() {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Fatal error when launching app", error);
  }
}

main();
