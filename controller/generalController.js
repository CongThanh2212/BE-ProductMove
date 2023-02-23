const generalModel = require('../model/generalModel')

class GeneralController {

    async login(req, res) {
        const username = req.query.username;
        const password = req.query.password;

        if (!username || !password) return res.status(400).send('Cú pháp không hợp lệ');

        const result = await generalModel.loginModel(username, password);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    // Thông tin chi tiết product
    async productDetails(req, res) {
        const id = req.query.id;
        const batchId = req.query.batch;
        const importId = req.query.import;
        const productId = req.query.pr;
        const oldId = req.query.old;

        if (!id || !batchId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await generalModel.checkAccess(id)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await generalModel.productDetailsModel(batchId, importId, productId, oldId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async changeEmail(req, res) {

    }

    async changePassword(req, res) {

    }

    async customerProfile(req, res) {
        const id = req.query.id;
        const customerId = req.query.customerId;

        if (!id || !customerId) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await generalModel.checkAccess(id)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await generalModel.customerProfileModel(customerId);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async accountProfile(req, res) {
        const id = req.query.id;

        if (!id) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await generalModel.checkAccess(id)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await generalModel.accountProfileModel(id);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }

    async otherAccountProfile(req, res) {
        const id = req.body.id;
        const name = req.body.name;

        if (!id) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await generalModel.checkAccess(id)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await generalModel.otherAccountProfileModel(name);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(result);
    }
}

module.exports = new GeneralController