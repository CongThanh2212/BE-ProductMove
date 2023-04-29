const agentModel = require('../model/agentModel')

class AgentController {

    async sellProduct(req, res) {
        
        const agentId = req.body.agentId;
        const customerName = req.body.customerName;
        const customerPhone = req.body.customerPhone;
        const customerAddress = req.body.customerAddress;
        const arrProduct = JSON.parse(req.body.arrProduct);
        if (!agentId || arrProduct.length == 0 || !customerName || !customerPhone || !customerAddress) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.sellModel(agentId, customerName, customerPhone, customerAddress, arrProduct);

        res.json(result);
    }

    async returnOldBatch(req, res) {
        
        const agentId = req.body.agentId;
        const arrProduct = JSON.parse(req.body.arrProduct);

        if (!agentId || arrProduct.length == 0) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.returnOldModel(agentId, arrProduct);

        res.json(result);
    }

    async listReceiveAgent(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.newArrivalModel(agentId);

        res.json(result);
    }

    async listRecall(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.listRecallModel(agentId);

        res.json(result);
    }

    async soldToService(req, res) {
        
        const agentId = req.body.agentId;
        const serviceName = req.body.serviceName;
        const arrProduct = JSON.parse(req.body.arrProduct);

        if (!agentId || !serviceName || arrProduct.length == 0) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.soldToServiceModel(agentId, serviceName, arrProduct);

        res.json(result);
    }

    async recallToService(req, res) {
        
        const agentId = req.body.agentId;
        const serviceName = req.body.serviceName;
        const arrProduct = JSON.parse(req.body.arrProduct);

        if (!agentId || !serviceName || arrProduct.length == 0) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.recallToServiceModel(serviceName, arrProduct);

        res.json(result);
    }

    async listService(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.listServiceModel(agentId);

        res.json(result);
    }

    async listReceiveFixed(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.listReceiveFixedModel(agentId);

        res.json(result);
    }

    async returnCustomer(req, res) {
        
        const agentId = req.body.agentId;
        const productId = req.body.productId;
        const numberOfService = req.body.numberOfService;
        const customerId = req.body.customerId;

        if (!agentId || !productId || !numberOfService || !customerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.returnCustomerModel(productId, numberOfService, customerId);

        res.json(result);
    }

    async listOld(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.listOldModel(agentId);

        res.json(result);
    }

    async listSoldNoError(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.listSoldNoErrorModel(agentId);

        res.json(result);
    }

    async recall(req, res) {
        
        const agentId = req.body.agentId;
        const arrProduct = JSON.parse(req.body.arrProduct);

        if (!agentId || arrProduct.length == 0) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.recallModel(agentId, arrProduct);

        res.json(result);
    }

    async listFail(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.listFailModel(agentId);

        res.json(result);
    }

    async listSendFixed(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.listSendFixedModel(agentId);

        res.json(result);
    }

    async receiveFixed(req, res) {
        
        const agentId = req.body.agentId;
        const date = req.body.date;
        const productId = req.body.productId;
        const numberOfService = req.body.numberOfService;

        if (!agentId || !date || !productId || !numberOfService) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.receiveFixedModel(agentId, date, productId, numberOfService);

        res.json(result);
    }

    async listSendAgent(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.listSendAgentModel(agentId);

        res.json(result);
    }

    async receiveNewProduct(req, res) {
        
        const agentId = req.body.agentId;
        const date = req.body.date;
        const importBatchId = req.body.importBatchId;

        if (!agentId || !date || !importBatchId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.receiveNPModel(agentId, date, importBatchId);

        res.json(result);
    }

    async statisticalSoldByMonth(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.soldByMonthModel(agentId);

        res.json(result);
    }

    async statisticalSoldByYear(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.soldByYearModel(agentId);

        res.json(result);
    }

    async statisticalImportByMonth(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.importMonthModel(agentId);

        res.json(result);
    }

    async statisticalImportByYear(req, res) {
        
        const agentId = req.query.agentId;

        if (!agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.importYearModel(agentId);

        res.json(result);
    }

    async searchService(req, res) {
        
        const agentId = req.body.agentId;
        const keyWord = req.body.keyWord;

        if (!keyWord || !agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await agentModel.checkAgentAccess(agentId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await agentModel.searchServiceModel(keyWord);

        res.json(result);
    }
}

module.exports = new AgentController