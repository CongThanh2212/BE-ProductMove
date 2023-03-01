const querySQL = require('./querySQL')
const db = require('../config/database')
const {hash} = require('./generalFunction')
const nodemailer = require('nodemailer')
const otplib = require('otplib')
const randomstring = require('randomstring')

class GeneralModel {

    async checkAccess(id) {
        const sql = querySQL.selectFromTableWhere(['accountId'] ,'account', ['accountId'], [id]);

        const [result, fields] = await db.query(sql);
        if (result.length == 0) return false;
        
        return true;
    }

    async loginModel(username, password) {
        const sql = querySQL.selectFromTableWhere(['accountId', 'password', 'type', 'cfEmail'], 'account', ['username'], [username]);

        const [result, fields] = await db.query(sql);
        if (result.length == 0) return {access:false};
        if (result[0].password == hash(password)) {
            return {
                access: true,
                accountId: result[0].accountId,
                type: result[0].type,
                cfEmail: result[0].cfEmail
            };
        }
        return {access:false};
    }

    async productDetailsModel(batchId, importId, productId, oldId) {
        // Search thông số của product
        const infoProduct = querySQL.selectAllFromTableWhere('new_product', ['batchId'], [batchId]);

        // Search history of product
        var historyPr = "SELECT status, date, locationId FROM history "
            + "WHERE id = '" + batchId + "'";
        if(importId) historyPr += " OR id = '" + importId + "'";
        if(productId) historyPr += " OR id = '" + productId + "'";
        if(oldId) historyPr += " OR id = '" + oldId + "'";
        historyPr += " ORDER BY date asc";
        
        const [info, fields] = await db.query(infoProduct);
        const [history, fields2] = await db.query(historyPr);
        
        var listHis = new Array;
        const prSql = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [history[0].locationId]);
        const agSql = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [history[1].locationId]);

        const [pr, fieldsPr] = await db.query(prSql);
        const [ag, fieldsAg] = await db.query(agSql);
        const producerName = pr[0].name;
        const agentName = ag[0].name;
        var customerName = '';

        for (var i = 0; i < history.length; i++) {
            switch(history[i].status) {
                case 'Mới sản xuất': {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: producerName});
                    break;
                }
                case 'Xuất cho đại lý': {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: agentName});
                    break;
                }
                case 'Đại lý nhận SP': {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: agentName});
                    break;
                }
                case 'Cũ - Trả lại CSSX': {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: producerName});
                    break;
                }
                case 'Nhận sản phẩm cũ': {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: producerName});
                    break;
                }
                case 'Bán cho KH': {
                    const cusSql = querySQL.selectFromTableWhere(['name'], 'customer', ['customerId'], [history[i].locationId]);
                    const [customer, fields3] = await db.query(cusSql);
                    customerName = customer[0].name;
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: customerName});
                    break;
                }
                case 'Triệu hồi': {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: agentName});
                    break;
                }
                case 'Đưa đi bảo hành': {
                    const sql = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [history[i].locationId]);
                    const [account, fields3] = await db.query(sql);
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: account[0].name});
                    break;
                }
                case 'Đang BH': {
                    const sql = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [history[i].locationId]);
                    const [account, fields3] = await db.query(sql);
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: account[0].name});
                    break;
                }
                case 'Lỗi, trả về CSSX': {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: producerName});
                    break;
                }
                case 'Nhận sản phẩm lỗi': {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: producerName});
                    break;
                }
                case 'BH xong, gửi về ĐL': {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: agentName});
                    break;
                }
                case 'Đại lý nhận SPBH': {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: agentName});
                    break;
                }
                // Trả lại KH
                default: {
                    listHis.push({status: history[i].status, date: history[i].date, locationId: history[i].locationId, name: customerName});
                }
            }
        }

        return ({info: info, history: listHis});
    }

    async customerProfileModel(customerId) {
        const sql = querySQL.selectAllFromTableWhere('customer', ['customerId'], [customerId]);
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: 0};
        }
    }

    async accountProfileModel(id) {
        const sql = querySQL.selectAllFromTableWhere('account', ['accountId'], [id]);
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: 0};
        }
    }

    async otherAccountProfileModel(name) {
        const sql = querySQL.selectFromTableWhere(['name', 'type', 'phone', 'address'], 'account', ['name'], [name]);
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: 0};
        }
    }

    async editAccountModel(id, name, address, phone) {
        const sql = querySQL.updateSet('account', ['name', 'address', 'phone'], [name, address, phone], ['accountId'], [id]);
        
        try {
            await db.query(sql);
        
            return {access: 1};
        } catch (error) {
            return {access: 0};
        }
    }

    async cfEmailModel(id, email) {
        try {
            const find = querySQL.selectFromTableWhere(['accountId'], 'account', ['email'], [email]);
            const [result, fields] = await db.query(find);

            if (result.length == 0) return {access: false, mess: 'Email đã đăng ký'};

            // send otp
            const mailServer = 'systemvct@gmail.com';
            const token = otplib.totp.generate(randomstring.generate());

            var transporter =  nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: mailServer,
                    pass: 'fgphnxvfildhrqsr'
                }
            });
            var content = 'Đây là mã OTP: ' + token;
            var options = {
                from: `Emma <${mailServer}>`,
                to: email,
                subject: 'Mã OTP',
                text: content
            }
            await transporter.sendMail(options);

            const del = querySQL.delete('otp', ['id', 'email'], [id, email]);
            const createOTP = querySQL.insertIntoFull('otp', [[id, email, token]]);
            await db.query(del);
            await db.query(createOTP);
        
            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async cfAndUpdateModel(id, otp) {
        try {
            const findOTP = querySQL.selectFromTableWhere(['email'], 'otp', ['id', 'otp'], [id, otp]);
            const [result, fields] = await db.query(findOTP);
            if (result.length == 0) return {access: false, mess: 'OTP không chính xác'};

            const delOTP = querySQL.delete('otp', ['id', 'otp'], [id, otp]);
            const updateEmaiil = querySQL.updateSet('account', ['email'], [result[0].email], ['accountId'], [id]);
            await db.query(delOTP);
            await db.query(updateEmaiil);
        
            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async forgotOrChangeModel(id, email) {
        try {
            var Email = email, Id = id;
            if (id) {
                const findEmail = querySQL.selectFromTableWhere(['email'], 'account', ['accountId'], [id]);
                const [result, fields] = await db.query(findEmail);
                if (result.length == 0) return {access: false, mess: 'Không tìm thấy id tài khoản'};
                Email = result[0].email;
            } else {
                const findEmail = querySQL.selectFromTableWhere(['accountId'], 'account', ['email'], [email]);
                const [result, fields] = await db.query(findEmail);
                if (result.length == 0) return {access: false, mess: 'Email chưa đăng ký'};
                Id = result[0].accountId;
            }

            // send otp
            const mailServer = 'systemvct@gmail.com';
            const token = otplib.totp.generate(randomstring.generate());

            var transporter =  nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: mailServer,
                    pass: 'fgphnxvfildhrqsr'
                }
            });
            var content = 'Đây là mã OTP: ' + token;
            var options = {
                from: `Emma <${mailServer}>`,
                to: Email,
                subject: 'Mã OTP',
                text: content
            }
            await transporter.sendMail(options);

            const del = querySQL.delete('otp', ['id', 'email'], [Id, Email]);
            const createOTP = querySQL.insertIntoFull('otp', [[Id, Email, token]]);
            await db.query(del);
            await db.query(createOTP);
        
            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async verificationForgotOrChangeModel(otp) {
        try {
            const findOTP = querySQL.selectFromTableWhere(['id'], 'otp', ['otp'], [otp]);
            const [result, fields] = await db.query(findOTP);
            if (result.length == 0) return {access: false, mess: 'OTP không chính xác'};

            const delOTP = querySQL.delete('otp', ['otp'], [otp]);
            await db.query(delOTP);
        
            return {access: true, id: result[0].id};
        } catch (error) {
            return {access: false};
        }
    }

    async changePassModel(id, password) {
        try {
            const update = querySQL.updateSet('account', ['password'], [hash(password)], ['accountId'], [id]);
            await db.query(update);
        
            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }
}

module.exports = new GeneralModel