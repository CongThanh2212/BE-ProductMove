const serviceModel = require('../model/serviceModel')

class ServiceController {

    async listFail(req, res) {
        const serviceId = req.query.serviceId;

        if (!serviceId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.listFailModel(serviceId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async listFixed(req, res) {
        const serviceId = req.query.serviceId;

        if (!serviceId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.listFixedModel(serviceId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async listFixing(req, res) {
        const serviceId = req.query.serviceId;

        if (!serviceId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.listFixingModel(serviceId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async listSendService(req, res) {
        const serviceId = req.query.serviceId;

        if (!serviceId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.listSendServiceModel(serviceId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async receiveSendService(req, res) {
        const serviceId = req.body.serviceId;
        const productId = req.body.productId;
        const date = req.body.date;
        const numberOfService = req.body.numberOfService;

        if (!serviceId || !productId || !date || !numberOfService) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.receiveSendServiceModel(serviceId, productId, date, numberOfService);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async sendFixed(req, res) {
        const serviceId = req.body.serviceId;
        const agentId = req.body.agentId;
        const productId = req.body.productId;
        const date = req.body.date;
        const numberOfService = req.body.numberOfService;

        if (!serviceId || !productId || !date || !numberOfService || !agentId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.sendFixedModel(productId, date, numberOfService, agentId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async sendFail(req, res) {
        const serviceId = req.body.serviceId;
        const producerId = req.body.producerId;
        const productId = req.body.productId;
        const date = req.body.date;

        if (!serviceId || !productId || !date || !producerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.sendFailModel(productId, date, producerId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async statisticalSendServiceByMonth(req, res) {
        const serviceId = req.query.serviceId;

        if (!serviceId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.sendServiceMonthModel(serviceId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async statisticalSendServiceByYear(req, res) {
        const serviceId = req.query.serviceId;

        if (!serviceId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.sendServiceYearModel(serviceId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async statisticalFixedByMonth(req, res) {
        const serviceId = req.query.serviceId;

        if (!serviceId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.fixedMonthModel(serviceId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async statisticalFixedByYear(req, res) {
        const serviceId = req.query.serviceId;

        if (!serviceId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.fixedYearModel(serviceId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async statisticalFailByMonth(req, res) {
        const serviceId = req.query.serviceId;

        if (!serviceId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.failMonthModel(serviceId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async statisticalFailByYear(req, res) {
        const serviceId = req.query.serviceId;

        if (!serviceId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await serviceModel.checkServiceAccess(serviceId)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await serviceModel.failYearModel(serviceId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }
}

module.exports = new ServiceController