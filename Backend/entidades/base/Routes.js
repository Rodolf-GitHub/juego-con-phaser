const express = require('express');
const router = express.Router();
const ValidateAccess = require('../../middleWares/validateAccess.js'); 
const validateAccess=new ValidateAccess()
const XbaseController = require('./Controllers.js'); 
const xbaseController = new XbaseController();


router.get('/xbase', validateAccess.validateAccess(['cualquiera']), xbaseController.getAllXbase);
router.get('/xbase/:id', validateAccess.validateAccess(['cualquiera']), xbaseController.getXbaseById);
router.post('/xbase', validateAccess.validateAccess(['cualquiera']), xbaseController.createXbase);
router.put('/xbase/:id', validateAccess.validateAccess(['cualquiera']), xbaseController.updateXbase);
router.delete('/xbase/:id', validateAccess.validateAccess(['cualquiera']), xbaseController.deleteXbase);


module.exports = router;
