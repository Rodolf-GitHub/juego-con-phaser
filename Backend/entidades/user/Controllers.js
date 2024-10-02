const jwt = require("jsonwebtoken");
// user.controller.js
const User = require("./Models");
const bcrypt = require("bcryptjs");
const Xterreno = require('../terreno/Models');
const logger = require("../../loggers/loggers");

class UserController {
  async getAllUsers(req, res) {
    try {
      console.log("get controller");
      console.log(User);
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      res.status(500).json({ message: "Error al obtener usuario por ID" });
    }
  }
  async createUser(req, res) {
    const userData = await req.body;
    userData.password = await bcrypt.hash(userData.password, 10);
    try {
      const newUser = await User.create(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(500).json({ message: "Error al crear usuario" });
    }
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const userData = req.body;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Si se proporciona una nueva contraseña, la encriptamos
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      // Actualiza los datos del usuario
      await user.update(userData);

      // Devuelve el usuario actualizado (sin la contraseña)
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const deletedUser = await User.destroy({
        where: { id: id }
      });
      if (!deletedUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ message: "Error al eliminar usuario" });
    }
  }
  async seleccionarTerreno(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET);
      const userId = decoded.user.id;
      const { id: terrenoId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (user.terreno_id !== null) {
        return res.status(400).json({ message: "El usuario ya tiene un terreno asignado", success: false });
      }

      if (terrenoId === '0') {
        return res.status(400).json({ message: "ID de terreno no válido", success: false });
      }

      const terreno = await Xterreno.findByPk(terrenoId);
      if (!terreno) {
        return res.status(404).json({ message: "Terreno no encontrado" });
      }

      await user.update({ terreno_id: terrenoId });

      res.status(200).json({ message: "Terreno seleccionado con éxito", success: true });
    } catch (error) {
      console.error("Error al seleccionar terreno:", error);
      res.status(500).json({ message: "Error al seleccionar terreno", success: false });
    }
  }
  async createDefaultUser(req, res) {
    try {
      // Obtener el nombre de usuario y contraseña del cuerpo de la solicitud
      const { username, password } = req.body;

      // Verificar si ya existe al menos un usuario en la base de datos
      const existingUsersCount = await User.count();
      if (existingUsersCount >= 1) {
        return res
          .status(500)
          .json({
            message:
              "Esto solo se puede hacer si no hay ningún usuario en la base de datos",
          });
      }

      // Cifrar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario
      const newUser = await User.create({
        username,
        password: hashedPassword,
        role: "master",
      });

      // Enviar la respuesta
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(500).json({ message: "Error al crear usuario por defecto" });
    }
  }

  async loginUser(req, res) {
    try {
      const { username, password } = await req.body;
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }

      var validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }

      const accesToken = await generateAccessToken(username);
      res.status(200).json({ 
        message: "Inicio de sesión exitoso para el usuario: " + username, 
        token: accesToken, 
        userId: user.id 
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  }

  async getUsuarioInfo(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET);
      const userId = decoded.user.id;

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          { model: Xterreno, as: 'terreno' }
        ]
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
      res.status(500).json({ message: "Error al obtener información del usuario" });
    }
  }

  async usuarioTieneTerreno(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [{ model: Xterreno, as: 'terreno' }]
      });
      if (!user) {
        console.log("Usuario no encontrado");
        return false;
      }

      const tieneTerrenoRespuesta = user.terreno !== null;
      console.log(`El usuario con ID ${userId} ${tieneTerrenoRespuesta ? 'tiene' : 'no tiene'} terreno`);
      return tieneTerrenoRespuesta;
    } catch (error) {
      console.error("Error al verificar si el usuario tiene terreno:", error);
      return false;
    }
  }

  async obtenerUsuarioConRelaciones(req, res) {
    try {
      const { id } = req.params;
      console.log("------>", id);
      const usuario = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: { all: true, nested: true }
      });

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error("Error al obtener usuario con relaciones:", error);
      res.status(500).json({ message: "Error al obtener usuario con relaciones" });
    }
  }
}

async function generateAccessToken(username) {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const accessToken = jwt.sign({ user }, process.env.SECRET, {
      expiresIn: "10h",
    });

    return accessToken;
  } catch (error) {
    console.error("Error al generar token de acceso:", error);
    throw error;
  }
}

module.exports = UserController;
