const express = require('express');
const router = express.Router();
const ValidateAccess = require('../../middleWares/validateAccess.js'); 
const validateAccess=new ValidateAccess()
const XtipoConstruccionController = require('./Controllers.js'); 
const xtipoConstruccionController = new XtipoConstruccionController();


router.get('/xtipoConstruccion', validateAccess.validateAccess(['cualquiera']), xtipoConstruccionController.getAllXtipoConstruccion);
router.get('/xtipoConstruccion/:id', validateAccess.validateAccess(['cualquiera']), xtipoConstruccionController.getXtipoConstruccionById);
router.post('/xtipoConstruccion', validateAccess.validateAccess(['cualquiera']), xtipoConstruccionController.createXtipoConstruccion);
router.put('/xtipoConstruccion/:id', validateAccess.validateAccess(['cualquiera']), xtipoConstruccionController.updateXtipoConstruccion);
router.delete('/xtipoConstruccion/:id', validateAccess.validateAccess(['cualquiera']), xtipoConstruccionController.deleteXtipoConstruccion);


module.exports = router;
