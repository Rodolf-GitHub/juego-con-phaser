const express = require('express');
const router = express.Router();
const ValidateAccess = require('../../middleWares/validateAccess.js'); 
const validateAccess=new ValidateAccess()
const XtipoTropaController = require('./Controllers.js'); 
const xtipoTropaController = new XtipoTropaController();


router.get('/xtipoTropa', validateAccess.validateAccess(['cualquiera']), xtipoTropaController.getAllXtipoTropa);
router.get('/xtipoTropa/:id', validateAccess.validateAccess(['cualquiera']), xtipoTropaController.getXtipoTropaById);
router.post('/xtipoTropa', validateAccess.validateAccess(['cualquiera']), xtipoTropaController.createXtipoTropa);
router.put('/xtipoTropa/:id', validateAccess.validateAccess(['cualquiera']), xtipoTropaController.updateXtipoTropa);
router.delete('/xtipoTropa/:id', validateAccess.validateAccess(['cualquiera']), xtipoTropaController.deleteXtipoTropa);


module.exports = router;
