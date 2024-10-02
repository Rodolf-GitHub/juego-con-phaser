# Página Web para Almacenamiento de Productos y Recetas

Este proyecto, desarrollado utilizando Node.js, tiene como objetivo proporcionar una plataforma para almacenar productos y crear recetas a partir de los productos disponibles.

## Tecnologías Utilizadas

El proyecto hace uso de las siguientes tecnologías:

- **Node.js**: Utilizado para el desarrollo del backend de la aplicación, proporcionando la lógica de negocio y la gestión de datos.
- **Base de datos**: Se utiliza una base de datos (por ejemplo, MySQL) para almacenar la información relacionada con equipos, servicios y conexiones.

## Instalación

Para instalar y ejecutar el proyecto, sigue estos pasos:

1. Clona este repositorio en tu máquina local.
2. Instala las dependencias del backend utilizando `yarn install` en la carpeta correspondiente.
3. Configura las variables de entorno necesarias para la conexión a la base de datos en el archivo `.env`.
4. Ejecuta el servidor backend con `yarn start` en la carpeta correspondiente.

## Crear el primer usuario en la base de datos

Para crear el primer usuario en la base de datos, utiliza la ruta `userDefault` y envía una solicitud POST con el nombre de usuario y la contraseña en el cuerpo de la solicitud.

### Ejemplo de solicitud:

```json
{
  "username": "miusuario",
  "password": "micontraseña"
}
```
# Acceso a la documentacion

Para acceder a la documentación de la API, simplemente visita la ruta `/docs` en tu navegador después de ejecutar el servidor. Esta ruta te proporcionará una interfaz interactiva donde podrás explorar todas las rutas y funcionalidades disponibles en la API.

## Creadores

1. Marcos
