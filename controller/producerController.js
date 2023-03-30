const producerModel = require('../model/producerModel')

class ProducerController {

    // list batch xuất đi
    async listExport(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.listExportModel(producerId);

        res.json(result);
    }

    /*
        import batch vào storage
        "producerId": "543482566",
        "arrBatch": [
            {
                "batchNumber": "3",
                "amount": "50",
                "productLine": "iphone 6",
                "capacity": "64GB",
                "color": "Đen",
                "DOM": "2018-12-04",
                "WM": "5",
                "date": "2020-08-07"
            }
        ]
    */
    async importBatch(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.body.producerId;
        const arrBatch = JSON.parse(req.body.arrBatch);

        if (!producerId || arrBatch.length == 0) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.importModel(producerId, arrBatch);

        res.json(result);
    }

    // List các loại product
    async listProductType(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.productTypeModel();

        res.json(result);
    }

    // List các batch còn trong kho
    async listNewProduct(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.newProductModel(producerId);

        res.json(result);
    }

    /*
        Xuất batch cho agent
        arrBatch:
        [
            {
                batchId:
                batchNumber:
                amountInStorage:
                amountExport:
                productLine:
                capacity:
                color:
                WM:
                date:
            },
            ....
        ]
    */
    async exportForAgent(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.body.producerId;
        const agentName = req.body.agentName;
        const date = req.body.date;
        const arrBatch = JSON.parse(req.body.arrBatch);
        if (!producerId || !agentName || arrBatch.length == 0 || !date) return res.status(400).send('Cú pháp không hợp lệ');
        for (var i = 0; i < arrBatch.length; i++) {
            const batch = arrBatch[i];
            if((batch.amountInStorage - batch.amountExport) < 0) return res.status(400).send('Cú pháp không hợp lệ');
        }
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.exportModel(producerId, agentName, arrBatch, date);

        res.json(result);
    }

    async listOldAndFailNotReceiveYet(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.oldAndFailNotModel(producerId);

        res.json(result);
    }

    async receiveOld(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.body.producerId;
        const oldBatchId = req.body.oldBatchId;
        const date = req.body.date;

        if (!producerId || !oldBatchId || !date) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.receiveOldModel(oldBatchId, producerId, date);

        res.json(result);
    }

    async receiveFail(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.body.producerId;
        const productId = req.body.productId;
        const date = req.body.date;

        if (!producerId || !productId || !date) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.receiveFailModel(productId, producerId, date);

        res.json(result);
    }

    async listOldAndFailReceived(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.oldAndFailModel(producerId);

        res.json(result);
    }

    async statisticalFailByProductLine(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.failByProductLineModel(producerId);

        res.json(result);
    }

    async statisticalFailByAgent(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.failByAgentModel(producerId);

        res.json(result);
    }

    // Add
    async statisticalFailByService(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.failByServiceModel(producerId);

        res.json(result);
    }

    // // Change
    async statisticalOldByAgent(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.oldByAgentModel(producerId);

        res.json(result);
    }

    async statisticalProduceByMonth(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.produceByMonthModel(producerId);

        res.json(result);
    }

    async statisticalProduceByYear(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.produceByYearModel(producerId);

        res.json(result);
    }

    async statisticalExportByMonth(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.exportByMonthModel(producerId);

        res.json(result);
    }

    async statisticalExportByYear(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.query.producerId;

        if (!producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.exportByYearModel(producerId);

        res.json(result);
    }

    async searchAgent(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const producerId = req.body.producerId;
        const keyWord = req.body.keyWord;

        if (!keyWord || !producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await producerModel.checkProducerAccess(producerId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await producerModel.searchAgentModel(keyWord);

        res.json(result);
    }
}

module.exports = new ProducerController