const managementModel = require('../model/managementModel')

class ManagementController {

    async listAccount(req, res) {
        
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.listAccountModel();

        res.json(result);
    }

    // Lấy profile thông qua username
    async profileAccount(req, res) {
        
        const mgId = req.query.id;
        const userName = req.query.userName;

        if (!mgId || !userName) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.profileModel(userName);

        res.json(result);
    }

    // Thu hồi tài khoản thông qua username
    async deleteAccount(req, res) {
        
        const mgId = req.body.id;
        const userName = req.body.userName;

        if (!mgId || !userName) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.delAccountModel(userName);

        res.json(result);
    }

    async createrAccount(req, res) {
        
        const mgId = req.body.id;
        const userName = req.body.userName;
        const password = req.body.password;
        const type = req.body.type;

        if (!mgId || !userName || !password || !type) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.createAccountModel(userName, password, type);

        res.json(result);
    }

    async listProductLine(req, res) {
        
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.listProductLineModel();

        res.json(result);
    }

    // Add
    async createProductLine(req, res) {
        
        const mgId = req.body.id;
        const name = req.body.name;
        const WM = req.body.WM;
        const arrCapacity = req.body.arrCapacity;

        if (!mgId || !name || !WM || !arrCapacity) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.createProductLineModel(name.toLowerCase(), WM, arrCapacity);

        res.json(result);
    }

    // Add: Thống kê số lượng sản xuất của Producer
    async statisticalOfProducerProduce(req, res) {
        
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.producerProduceModel();

        res.json(result);
    }

    // Add: Thống kê số lượng lỗi của Producer
    async statisticalOfProducerFail(req, res) {
        
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.producerFailModel();

        res.json(result);
    }

    // Add: Thống kê số lượng bán ra của Agent
    async statisticalOfAgentSold(req, res) {
        
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.agentSoldModel();

        res.json(result);
    }

    // Add: Thống kê số lượng cũ của Agent
    async statisticalOfAgentOld(req, res) {
        
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.agentOldModel();

        res.json(result);
    }

    // Add: Thống kê số lượng sửa chữa thành công của Service
    async statisticalOfServiceFixed(req, res) {
        
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.serviceFixedModel();

        res.json(result);
    }

    // Add: Thống kê số lượng thất bại của Service
    async statisticalOfServiceFail(req, res) {
        
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.serviceFailModel();

        res.json(result);
    }
}

module.exports = new ManagementController