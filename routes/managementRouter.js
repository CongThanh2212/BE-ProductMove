var express = require('express');
var router = express.Router();

const management = require('../controller/managementController')

router.get('/list-account', management.listAccount) //
router.get('/profile-by-username', management.profileAccount) //
router.get('/list-product-line', management.listProductLine) //
router.get('/statistical-agent', management.statisticalOfAgent)
router.get('/statistical-producer', management.statisticalOfProducer)
router.get('/statistical-service', management.statisticalOfService)

router.post('/delete-account', management.deleteAccount) //
router.post('/create-account', management.createrAccount) //
router.post('/create-product-line', management.createProductLine) //

module.exports = router;