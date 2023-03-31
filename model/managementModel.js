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
            return {access: false};
        }
    }

    async profileModel(userName) {
        const sql = querySQL.selectFromTableWhere(['name', 'userName', 'type', 'cfEmail', 'address', 'phone'], 'account',
            ['userName'], [userName]);

        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: false};
        } 
    }

    async delAccountModel(userName) {
        const sql = querySQL.delete('account', ['userName'], [userName]);

        try {
            await db.query(sql);
        
            return {access: true};
        } catch (error) {
            return {access: false, mess: 'Tài khoản không tồn tại'};
        }
    }

    async createAccountModel(userName, password, type) {
        const id = randomstring.generate(7);
        const pass = hash(password);

        const check = querySQL.selectFromTableWhere(['accountId'], 'account', ['username'], [userName]);
        const [result, fields] = await db.query(check);
        if (result.length > 0) return {access: false, mess: 'Tài khoản đã tồn tại'};

        const sql = querySQL.insertInto('account', ['accountId', 'userName', 'password', 'type'],
            [[id, userName, pass, type]]);

        try {
            await db.query(sql);
        
            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async listProductLineModel() {
        const sql = querySQL.selectFromTable(['*'], 'productLine');

        try {
            const [result, fields] = await db.query(sql);
        
            return result; 
        } catch (error) {
            return {access: false};
        }
    }

    async createProductLineModel(name, WM, arrCapacity) {
        const sql = querySQL.insertIntoFull('productLine', [[name, arrCapacity, WM]]);

        try {
            await db.query(sql);
            return {access: true};
        } catch (error) {
            return {access: false, mess: 'Dòng sản phẩm đã tồn tại'};
        }
    }

    async producerProduceModel() {
        try {
            const produceSql = "SELECT producerId, SUM(amountStart) as amount "
                + "FROM new_product "
                + "GROUP BY producerId";

            const [result0, fields0] = await db.query(produceSql);
            var arrName = new Array;
            var arrAmount = new Array;
            
            for (var i = 0; i < result0.length; i++) {
                const producer = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result0[i].producerId]);

                const [name, fields] = await db.query(producer);
                arrName.push(name[0].name);
                arrAmount.push(result0[i].amount);
            }
            
            return {
                access: true,
                name: arrName,
                amount: arrAmount
            };
        } catch (error) {
            return {access: false};
        } 
    }

    async producerFailModel() {
        try {
            const failSql = "SELECT producerId, COUNT(*) as amount "
                + "FROM product "
                + "WHERE status = 'send_fail' OR status = 'received_fail' "
                + "GROUP BY producerId ";

            const [result1, fields1] = await db.query(failSql);
            var arrName = new Array;
            var arrAmount = new Array;
            
            for (var i = 0; i < result1.length; i++) {
                const producer = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result1[i].producerId]);

                const [name, fields] = await db.query(producer);
                arrName.push(name[0].name);
                arrAmount.push(result1[i].amount);
            }
            
            return {
                access: true,
                name: arrName,
                amount: arrAmount
            };
        } catch (error) {
            return {access: false};
        } 
    }

    async agentSoldModel() {
        try {
            const soldSql = "SELECT agentId, COUNT(*) as amount "
                + "FROM product "
                + "GROUP BY agentId";

            const [result0, fields0] = await db.query(soldSql);
            var arrName = new Array;
            var arrAmount = new Array;

            for (var i = 0; i < result0.length; i++) {
                const agent = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result0[i].agentId]);

                const [name, fields] = await db.query(agent);
                arrName.push(name[0].name);
                arrAmount.push(result0[i].amount);
            }
            
            return {
                access: true,
                name: arrName,
                amount: arrAmount
            };
        } catch (error) {
            return {access: false};
        }
    }

    async agentOldModel() {
        try {
            const oldSql = "SELECT agentId, SUM(amount) as amount "
                + "FROM send_receive_old "
                + "GROUP BY agentId";

            const [result1, fields1] = await db.query(oldSql);
            var arrName = new Array;
            var arrAmount = new Array;

            for (var i = 0; i < result1.length; i++) {
                const agent = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result1[i].agentId]);

                const [name, fields] = await db.query(agent);
                arrName.push(name[0].name);
                arrAmount.push(result1[i].amount);
            }
            
            return {
                access: true,
                name: arrName,
                amount: arrAmount
            };
        } catch (error) {
            return {access: false};
        }
    }

    async serviceFixedModel() {
        try {
            const fixedSql = "SELECT serviceId, COUNT(*) as amount "
                + "FROM services "
                + "WHERE sendFixedDate IS NOT NULL "
                + "GROUP BY serviceId ";

            const [result0, fields0] = await db.query(fixedSql);
            var arrName = new Array;
            var arrAmount = new Array;

            for (var i = 0; i < result0.length; i++) {
                const service = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result0[i].serviceId]);

                const [name, fields] = await db.query(service);
                arrName.push(name[0].name);
                arrAmount.push(result0[i].amount);
            }
            
            return {
                access: true,
                name: arrName,
                amount: arrAmount
            };
        } catch (error) {
            return {access: false};
        }
    }

    async serviceFailModel() {
        try {
            const failSql = "SELECT lastServiceId, COUNT(*) as amount "
                + "FROM product "
                + "WHERE status = 'send_fail' OR status = 'received_fail' "
                + "GROUP BY lastServiceId ";

            const [result1, fields1] = await db.query(failSql);
            var arrName = new Array;
            var arrAmount = new Array;
            
            for (var i = 0; i < result1.length; i++) {
                const service = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result1[i].lastServiceId]);

                const [name, fields] = await db.query(service);
                arrName.push(name[0].name);
                arrAmount.push(result1[i].amount);
            }
            
            return {
                access: true,
                name: arrName,
                amount: arrAmount
            };
        } catch (error) {
            return {access: false};
        }
    }
}

module.exports = new ManagementModel