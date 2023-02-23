const querySQL = require('./querySQL')
const db = require('../config/database')
const {hash} = require('./generalFunction')

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
        const historyPr = "SELECT status, date, locationId FROM history "
            + "WHERE id = '" + batchId + "' OR id = '" + importId + "' OR id = '" + productId + "' OR id = '" + oldId + "' "
            + "ORDER BY date asc";
        
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
}

module.exports = new GeneralModel