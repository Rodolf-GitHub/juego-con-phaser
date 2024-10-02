const express = require('express');
const router = express.Router();
const ValidateAccess = require('../../middleWares/validateAccess.js'); 
const validateAccess=new ValidateAccess()
const XbatallaController = require('./Controllers.js'); 
const xbatallaController = new XbatallaController();


router.get('/xbatalla', validateAccess.validateAccess(['cualquiera']), xbatallaController.getAllXbatalla);
router.get('/xbatalla/:id', validateAccess.validateAccess(['cualquiera']), xbatallaController.getXbatallaById);
router.post('/xbatalla', validateAccess.validateAccess(['cualquiera']), xbatallaController.createXbatalla);
router.put('/xbatalla/:id', validateAccess.validateAccess(['cualquiera']), xbatallaController.updateXbatalla);
router.delete('/xbatalla/:id', validateAccess.validateAccess(['cualquiera']), xbatallaController.deleteXbatalla);


module.exports = router;
