const express = require('express');
const router = express.Router();
const ValidateAccess = require('../../middleWares/validateAccess.js'); 
const validateAccess = new ValidateAccess()
const XconstruccionController = require('./Controllers.js'); 
const xconstruccionController = new XconstruccionController();

// Rutas existentes
router.get('/xconstruccion', validateAccess.validateAccess(['cualquiera']), xconstruccionController.getAllXconstruccion);
router.get('/xconstruccion/:id', validateAccess.validateAccess(['cualquiera']), xconstruccionController.getXconstruccionById);
router.post('/xconstruccion', validateAccess.validateAccess(['cualquiera']), xconstruccionController.createXconstruccion);
router.put('/xconstruccion/:id', validateAccess.validateAccess(['cualquiera']), xconstruccionController.updateXconstruccion);
router.delete('/xconstruccion/:id', validateAccess.validateAccess(['cualquiera']), xconstruccionController.deleteXconstruccion);

// Nuevas rutas
router.post('/xconstruccion/crear', validateAccess.validateAccess(['cualquiera']), xconstruccionController.crearConstruccion);
router.get('/xconstruccion/terreno/:terreno_id', validateAccess.validateAccess(['cualquiera']), xconstruccionController.obtenerConstruccionesPorTerreno);

module.exports = router;
