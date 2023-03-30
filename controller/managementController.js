const managementModel = require('../model/managementModel')

class ManagementController {

    async listAccount(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.listAccountModel();

        res.json(result);
    }

    // Lấy profile thông qua username
    async profileAccount(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const mgId = req.query.id;
        const userName = req.query.userName;

        if (!mgId || !userName) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.profileModel(userName);

        res.json(result);
    }

    // Thu hồi tài khoản thông qua username
    async deleteAccount(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const mgId = req.body.id;
        const userName = req.body.userName;

        if (!mgId || !userName) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.delAccountModel(userName);

        res.json(result);
    }

    async createrAccount(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
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
        res.header("Access-Control-Allow-Origin", "*");
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.listProductLineModel();

        res.json(result);
    }

    // Add
    async createProductLine(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const mgId = req.body.id;
        const name = req.body.name;
        const WM = req.body.WM;
        const arrCapacity = req.body.arrCapacity;

        if (!mgId || !name || !WM || !arrCapacity) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.createProductLineModel(name.toLowerCase(), WM, arrCapacity);

        res.json(result);
    }

    // Add: Thống kê số lượng sản xuất và số lượng lỗi của Producer
    async statisticalOfProducer(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.producerModel();

        res.json(result);
    }

    // Add: Thống kê số lượng bán ra và số lượng cũ của Agent
    async statisticalOfAgent(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.agentModel();

        res.json(result);
    }

    // Add: Thống kê số lượng sửa chữa thành công và số lượng thất bại của Service
    async statisticalOfService(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const mgId = req.query.id;

        if (!mgId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await managementModel.checkManagementAccess(mgId)) return res.status(403).send('Không có quyền truy cập');

        const result = await managementModel.serviceModel();

        res.json(result);
    }
}

module.exports = new ManagementController