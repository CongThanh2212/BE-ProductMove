var express = require('express');
var router = express.Router();

const management = require('../controller/managementController')

router.get('/list-account', management.listAccount) //
router.get('/profile-by-username', management.profileAccount) //
router.get('/list-product-line', management.listProductLine) //
router.get('/statistical-agent-sold', management.statisticalOfAgentSold)
router.get('/statistical-agent-old', management.statisticalOfAgentOld)
router.get('/statistical-producer-produce', management.statisticalOfProducerProduce)
router.get('/statistical-producer-fail', management.statisticalOfProducerFail)
router.get('/statistical-service-fixed', management.statisticalOfServiceFixed)
router.get('/statistical-service-fail', management.statisticalOfServiceFail)

router.post('/delete-account', management.deleteAccount) //
router.post('/create-account', management.createrAccount) //
router.post('/create-product-line', management.createProductLine) //

module.exports = router;