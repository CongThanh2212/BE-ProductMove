var express = require('express');
var router = express.Router();

const producer = require('../controller/producerController')

router.get('/list-export', producer.listExport) //
router.get('/list-new-product', producer.listNewProduct) //
router.get('/message-old-and-fail', producer.listOldAndFailNotReceiveYet) //
router.get('/list-old-and-fail', producer.listOldAndFailReceived) //
router.get('/statistical-fail-by-product-line', producer.statisticalFailByProductLine)//
router.get('/statistical-fail-by-agent', producer.statisticalFailByAgent)//
router.get('/statistical-fail-by-service', producer.statisticalFailByService)//
router.get('/statistical-old-by-agent', producer.statisticalOldByAgent)
router.get('/statistical-produce-by-month', producer.statisticalProduceByMonth)//
router.get('/statistical-produce-by-year', producer.statisticalProduceByYear)//
router.get('/statistical-export-by-month', producer.statisticalExportByMonth)
router.get('/statistical-export-by-year', producer.statisticalExportByYear)
router.get('/list-product-type', producer.listProductType) //

router.post('/import-batch', producer.importBatch) //
router.post('/export-for-agent', producer.exportForAgent) //
router.post('/receive-old', producer.receiveOld) //
router.post('/receive-fail', producer.receiveFail) //
router.post('/search-agent', producer.searchAgent) //

module.exports = router;