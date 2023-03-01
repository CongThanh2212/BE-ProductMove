var express = require('express');
var router = express.Router();

const general = require('../controller/generalController')

router.get('/login', general.login) //
router.get('/product-details', general.productDetails) //
router.get('/customer-profile', general.customerProfile) //
router.get('/account-profile', general.accountProfile) //

router.post('/confirm-email', general.confirmEmail) //
router.post('/verification-and-update-email', general.cfAndUpdateEmail) //
router.post('/forgot-pass-or-change-email', general.forgotOrChange) //
router.post('/forgot-pass-or-change-email-verification', general.verificationForgotOrChange) //
router.post('/change-pass', general.changePass) //
router.post('/other-account-profile', general.otherAccountProfile) //
router.post('/edit-account-profile', general.editAccount) //

module.exports = router;