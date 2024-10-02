const express = require('express');
const router = express.Router();
const ValidateAccess = require('../../middleWares/validateAccess.js'); 
const validateAccess=new ValidateAccess()
const XterrenoController = require('./Controllers.js'); 
const xterrenoController = new XterrenoController();


router.get('/xterreno',  xterrenoController.getAllXterreno);
router.get('/xterreno/:id', validateAccess.validateAccess(['cualquiera']), xterrenoController.getXterrenoById);
router.post('/xterreno', validateAccess.validateAccess(['cualquiera']), xterrenoController.createXterreno);
router.put('/xterreno/:id', validateAccess.validateAccess(['cualquiera']), xterrenoController.updateXterreno);
router.delete('/xterreno/:id', validateAccess.validateAccess(['cualquiera']), xterrenoController.deleteXterreno);


module.exports = router;
