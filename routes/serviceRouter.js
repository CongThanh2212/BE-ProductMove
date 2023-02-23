var express = require('express');
var router = express.Router();

const service = require('../controller/serviceController')

router.get('/list-fail', service.listFail) //
router.get('/list-fixed', service.listFixed) //
router.get('/list-fixing', service.listFixing) //
router.get('/message-service', service.listSendService) //
router.get('/statistical-need-fix-by-month', service.statisticalSendServiceByMonth)
router.get('/statistical-need-fix-by-year', service.statisticalSendServiceByYear)
router.get('/statistical-fixed-by-month', service.statisticalFixedByMonth)
router.get('/statistical-fixed-by-year', service.statisticalFixedByYear)
router.get('/statistical-fail-by-month', service.statisticalFailByMonth)
router.get('/statistical-fail-by-year', service.statisticalFailByYear)

router.post('/receive-service', service.receiveSendService) //
router.post('/send-fixed', service.sendFixed) //
router.post('/send-fail', service.sendFail) //

module.exports = router;