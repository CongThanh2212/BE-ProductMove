var express = require('express');
var router = express.Router();

const agent = require('../controller/agentController')

router.get('/message-new-arrival', agent.listSendAgent) //
router.get('/list-new-arrival', agent.listReceiveAgent) //
router.get('/list-recall', agent.listRecall) //
router.get('/list-service', agent.listService) //
router.get('/message-fixed', agent.listSendFixed) //
router.get('/list-fixed', agent.listReceiveFixed) //
router.get('/list-old', agent.listOld) //
router.get('/list-sold-no-error', agent.listSoldNoError) //
router.get('/list-fail', agent.listFail) //
router.get('/statistical-sold-by-month', agent.statisticalSoldByMonth)//
router.get('/statistical-sold-by-year', agent.statisticalSoldByYear)//
router.get('/statistical-import-by-month', agent.statisticalImportByMonth)//
router.get('/statistical-import-by-year', agent.statisticalImportByYear)//

router.post('/sell-product', agent.sellProduct) //
router.post('/return-old', agent.returnOldBatch) //
router.post('/sold-to-service', agent.soldToService) //
router.post('/recall-to-service', agent.recallToService) //
router.post('/return-customer', agent.returnCustomer) //
router.post('/recall', agent.recall) //
router.post('/receive-fixed', agent.receiveFixed) //
router.post('/receive-new-product', agent.receiveNewProduct) //
router.post('/search-service', agent.searchService) //

module.exports = router;