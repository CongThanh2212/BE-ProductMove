const querySQL = require('./querySQL')
const db = require('../config/database')
const { hash} = require('./generalFunction')
var randomstring = require("randomstring");

class ManagementModel {

    async checkManagementAccess(id) {
        const sql = querySQL.selectFromTableWhere(['type'] ,'account', ['accountId'], [id]);

        const [result, fields] = await db.query(sql);
        if (result.length == 0) return false;
        if (result[0].type == 'mg') return true;
        
        return false;
    }

    async listAccountModel() {
        const sql = querySQL.selectFromTableWhere(['userName', 'name', 'type', 'cfEmail'], 'account', ['type!'], ['mg']);

        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: 0};
        }
    }

    async profileModel(userName) {
        const sql = querySQL.selectFromTableWhere(['name', 'userName', 'type', 'cfEmail', 'address', 'phone'], 'account',
            ['userName'], [userName]);

        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: 0};
        } 
    }

    async delAccountModel(userName) {
        const sql = querySQL.delete('account', ['userName'], [userName]);

        try {
            await db.query(sql);
        
            return {access: 1};
        } catch (error) {
            return {mess: 'Tài khoản không tồn tại'};
        }
    }

    async createAccountModel(userName, password, type) {
        const id = randomstring.generate(7);
        const pass = hash(password);

        const check = querySQL.selectFromTableWhere(['accountId'], 'account', ['username'], [userName]);
        const [result, fields] = await db.query(check);
        if (result.length > 0) return {access: 0, mess: 'Tài khoản đã tồn tại'};

        const sql = querySQL.insertInto('account', ['accountId', 'userName', 'password', 'type'],
            [[id, userName, pass, type]]);

        try {
            await db.query(sql);
        
            return {access: 1};
        } catch (error) {
            return {access: 0};
        }
    }

    async listProductLineModel() {
        const sql = querySQL.selectFromTable(['*'], 'productLine');

        try {
            const [result, fields] = await db.query(sql);
        
            return result; 
        } catch (error) {
            return {access: 0};
        }
    }

    async createProductLineModel(name, WM, arrCapacity) {
        const sql = querySQL.insertIntoFull('productLine', [[name, arrCapacity, WM]]);

        try {
            await db.query(sql);
            return {access: 1};
        } catch (error) {
            return {access: 0, mess: 'Dòng sản phẩm đã tồn tại'};
        }
    }

    async producerModel() {
        try {
            const produceSql = "SELECT producerId, SUM(amountStart) as amount "
                + "FROM new_product "
                + "GROUP BY producerId";
            const failSql = "SELECT producerId, COUNT(*) as amount "
                + "FROM product "
                + "GROUP BY producerId "
                + "HAVING status = 'send_fail' OR status = 'received_fail'";

            const [result0, fields0] = await db.query(produceSql);
            const [result1, fields1] = await db.query(failSql);
            var produce = new Array;
            var fail = new Array;
            for (var i = 0; i < result0.length; i++) {
                const producer = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result0[i].producerId]);

                const [name, fields] = await db.query(producer);
                produce.push({name: name[0].name, amount: result0[i].amount});
            }
            for (var i = 0; i < result1.length; i++) {
                const producer = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result1[i].producerId]);

                const [name, fields] = await db.query(producer);
                fail.push({name: name[0].name, amount: result1[i].amount});
            }
            
            return ({produce: produce, fail: fail});
        } catch (error) {
            return {access: 0};
        } 
    }

    async agentModel() {
        try {
            const soldSql = "SELECT agentId, COUNT(*) as amount "
                + "FROM product "
                + "GROUP BY agentId";
            const oldSql = "SELECT agentId, SUM(amount) as amount "
                + "FROM send_receive_old "
                + "GROUP BY agentId";

            const [result0, fields0] = await db.query(soldSql);
            const [result1, fields1] = await db.query(oldSql);
            var sold = new Array;
            var old = new Array;
            for (var i = 0; i < result0.length; i++) {
                const agent = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result0[i].agentId]);

                const [name, fields] = await db.query(agent);
                sold.push({name: name[0].name, amount: result0[i].amount});
            }
            for (var i = 0; i < result1.length; i++) {
                const agent = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result1[i].agentId]);

                const [name, fields] = await db.query(agent);
                old.push({name: name[0].name, amount: result1[i].amount});
            }
            
            return ({sold: sold, old: old}); 
        } catch (error) {
            return {access: 0};
        }
    }

    async serviceModel() {
        try {
            const fixedSql = "SELECT serviceId, COUNT(*) as amount "
                + "FROM services "
                + "GROUP BY serviceId "
                + "HAVING sendFixedDate IS NOT NULL";
            const failSql = "SELECT serviceId, COUNT(*) as amount "
                + "FROM product "
                + "GROUP BY serviceId "
                + "HAVING status = 'send_fail' OR status = 'received_fail'";

            const [result0, fields0] = await db.query(fixedSql);
            const [result1, fields1] = await db.query(failSql);
            var fixed = new Array;
            var fail = new Array;
            for (var i = 0; i < result0.length; i++) {
                const service = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result0[i].serviceId]);

                const [name, fields] = await db.query(service);
                fixed.push({name: name[0].name, amount: result0[i].amount});
            }
            for (var i = 0; i < result1.length; i++) {
                const service = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result1[i].serviceId]);

                const [name, fields] = await db.query(service);
                fail.push({name: name[0].name, amount: result1[i].amount});
            }
            
            return ({fixed: fixed, fail: fail}); 
        } catch (error) {
            return {access: 0};
        }
    }
}

module.exports = new ManagementModel