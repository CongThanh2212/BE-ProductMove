const generalModel = require('../model/generalModel')

class GeneralController {

    async login(req, res) {
        
        const username = req.query.username;
        const password = req.query.password;

        if (!username || !password) return res.status(400).send('Cú pháp không hợp lệ');

        const result = await generalModel.loginModel(username, password);

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

        res.json(result);
    }

    async accountProfile(req, res) {
        
        const id = req.query.id;

        if (!id) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await generalModel.checkAccess(id)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await generalModel.accountProfileModel(id);

        res.json(result);
    }

    async confirmEmail(req, res) {
        

        const id = req.body.id;
        const email = req.body.email;

        if (!id || !email) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await generalModel.checkAccess(id)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await generalModel.cfEmailModel(id, email);

        res.json(result);
    }

    async cfAndUpdateEmail(req, res) {
        

        const id = req.body.id;
        const otp = req.body.otp;

        if (!id || !otp) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await generalModel.checkAccess(id)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await generalModel.cfAndUpdateModel(id, otp);

        res.json(result);
    }

    async forgotOrChange(req, res) {
        

        const email = req.body.email;
        const id = req.body.id;

        if (!id && !email) return res.status(400).send('Cú pháp không hợp lệ');
        
        const result = await generalModel.forgotOrChangeModel(id, email);

        res.json(result);
    }

    async verificationForgotOrChange(req, res) {
        

        const otp = req.body.otp;

        if (!otp) return res.status(400).send('Cú pháp không hợp lệ');
        
        const result = await generalModel.verificationForgotOrChangeModel(otp);

        res.json(result);
    }

    async changePass(req, res) {
        

        const id = req.body.id;
        const password = req.body.password;

        if (!id || !password) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await generalModel.checkAccess(id)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await generalModel.changePassModel(id, password);

        res.json(result);
    }

    async otherAccountProfile(req, res) {
        
        const id = req.body.id;
        const name = req.body.name;

        if (!id || !name) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await generalModel.checkAccess(id)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await generalModel.otherAccountProfileModel(name);

        res.json(result);
    }

    async editAccount(req, res) {
        

        const id = req.body.id;
        const name = req.body.name;
        const address = req.body.address;
        const phone = req.body.phone;

        if (!id || !name || !address || !phone) return res.status(400).send('Cú pháp không hợp lệ');
        if (!await generalModel.checkAccess(id)) return res.status(403).send('Không có quyền truy cập');
        
        const result = await generalModel.editAccountModel(id, name, address, phone);

        res.json(result);
    }
}

module.exports = new GeneralController