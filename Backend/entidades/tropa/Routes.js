const express = require('express');
const router = express.Router();
const ValidateAccess = require('../../middleWares/validateAccess.js'); 
const validateAccess=new ValidateAccess()
const XtropaController = require('./Controllers.js'); 
const xtropaController = new XtropaController();


router.get('/xtropa', validateAccess.validateAccess(['cualquiera']), xtropaController.getAllXtropa);
router.get('/xtropa/:id', validateAccess.validateAccess(['cualquiera']), xtropaController.getXtropaById);
router.post('/xtropa', validateAccess.validateAccess(['cualquiera']), xtropaController.createXtropa);
router.put('/xtropa/:id', validateAccess.validateAccess(['cualquiera']), xtropaController.updateXtropa);
router.delete('/xtropa/:id', validateAccess.validateAccess(['cualquiera']), xtropaController.deleteXtropa);


module.exports = router;
