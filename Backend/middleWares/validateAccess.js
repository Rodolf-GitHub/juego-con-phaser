const jwt = require('jsonwebtoken');
const User = require('../entidades/user/Models');

class ValidateAccess {
  validateAccess(roles) {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        
        const user = await User.findByPk(decoded.id);
        if (!user) {
          return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        req.user = user; // Asegúrate de que esta línea esté presente

        if (roles.includes(user.role) || roles.includes('cualquiera','user')) {
          next();
        } else {
          res.status(403).json({ message: 'Acceso denegado' });
        }
      } catch (error) {
        console.error('Error en la autenticación:', error);
        res.status(401).json({ message: 'Token inválido o expirado' });
      }
    };
  }
}

module.exports = ValidateAccess;