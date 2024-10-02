const express = require('express');
const router = express.Router();
const ValidateAccess = require('../../middleWares/validateAccess'); // Importar la función de middleware correctamente
const validateAccess=new ValidateAccess()
const UserController = require('./Controllers'); // Importar el controlador de usuario correctamente
const userController = new UserController();


router.get('/user',  userController.getAllUsers);
router.get('/user/:id',  userController.getUserById);
router.post('/user', userController.createUser);
router.put('/user/:id',  userController.updateUser);
router.delete('/user/:id', validateAccess.validateAccess(['master']), userController.deleteUser);
router.post('/login', userController.loginUser);
router.post('/userDefault', userController.createDefaultUser);
router.post('/user/seleccionarTerreno/:id',  userController.seleccionarTerreno);
router.get('/user/tieneTerreno', userController.usuarioTieneTerreno);
router.get('/user/relaciones/:id', userController.obtenerUsuarioConRelaciones);

module.exports = router;
