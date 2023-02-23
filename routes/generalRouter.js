var express = require('express');
var router = express.Router();

const general = require('../controller/generalController')

router.get('/login', general.login) //
router.get('/product-details', general.productDetails) //
router.get('/customer-profile', general.customerProfile) //
router.get('/account-profile', general.accountProfile) //
router.post('/other-account-profile', general.otherAccountProfile) //

module.exports = router;