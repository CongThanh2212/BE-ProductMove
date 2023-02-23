const querySQL = require('./querySQL')
const db = require('../config/database')
var randomstring = require("randomstring");

class ProducerModel {

    async checkProducerAccess(id) {
        const sql = querySQL.selectFromTableWhere(['type'] ,'account', ['accountId'], [id]);

        const [result, fields] = await db.query(sql);
        if (result.length == 0) return false;
        if (result[0].type == 'pr') return true;
        
        return false;
    }

    async listExportModel(producerId) {
        const sql = querySQL.selectFromTableWhere(['importBatchId', 'batchId', 'batchNumber', 'amountStart', 'status',
            'productLine', 'capacity'], 'send_receive_agent', ['producerId'], [producerId]);
        //const sql = querySQL.selectAllFromTableWhere('send_receive_agent', ['producerId'], [producerId]);
        
        try {
            const [result, fields] = await db.query(sql);
            return result;
        } catch (error) {
            return ({access: 0})
        }
    }

    async importModel(producerId, arrBatch) {
        try {
            for (var i = 0; i < arrBatch.length; i++) {
                const batchId = 'BATCH' + randomstring.generate(7);
                const batch = arrBatch[i];
                const addBatch = querySQL.insertIntoFull('new_product',
                    [[batchId, batch.batchNumber, batch.amount, batch.amount, batch.productLine, batch.capacity, batch.color,
                    batch.DOM, batch.WM, batch.date, producerId]]);
                const history = querySQL.insertIntoFull('history', [[batchId, 'Mới sản xuất', batch.date, producerId]]);
                
                await db.query(addBatch);
                await db.query(history);
            }
    
            return {access: 1};
        } catch (error) {
            return ({access: 0})
        }
    }

    async productTypeModel() {
        const sql = querySQL.selectFromTable(['*'], 'productLine');

        try {
            const [result, fields] = await db.query(sql);
            var list = new Array;
            for (var i = 0; i < result.length; i++) {
                list.push({name: result[i].name, capacity: result[i].capacities.split(','), WM: result[i].WM});
            }
            
            return list;
        } catch (error) {
            return ({access: 0})
        }
    }

    async newProductModel(producerId) {
        const sql = "SELECT * FROM new_product "
            + "WHERE producerId = '" + producerId + "' AND amountNow > 0";

        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return ({access: 0})
        }
    }

    async exportModel(producerId, agentName, arrBatch, date) {
        try {
            // agentId
            const agent = querySQL.selectFromTableWhere(['accountId'], 'account', ['name'], [agentName]);
            const [result, fields] = await db.query(agent);
            const agentId = result[0].accountId;

            for (var i = 0; i < arrBatch.length; i++) {
                const importBatchId = 'IMPORT' + randomstring.generate(7);
                const batch = arrBatch[i];

                const sendAgent = querySQL.insertIntoFull('send_receive_agent',
                    [[importBatchId, batch.batchId, batch.batchNumber, batch.amountExport, batch.amountExport, 'send_agent', batch.productLine,
                    batch.capacity, batch.color, batch.WM, date, "null", producerId, agentId]]);
                const updateAmount = querySQL.updateSet('new_product', ['amountNow'], [batch.amountInStorage - batch.amountExport],
                    ['batchId'], [batch.batchId]);
                const history = querySQL.insertIntoFull('history', [[importBatchId, 'Xuất cho đại lý', date, agentId]]);

                await db.query(sendAgent);
                await db.query(updateAmount);
                await db.query(history);
            }

            return {access: 1};
        } catch (error) {
            return ({access: 0})
        }
    }

    async oldAndFailNotModel(producerId) {
        const failSql = querySQL.selectAllFromTableWhere('product', ['producerId', 'status'], [producerId, 'send_fail']);
        const oldSql = querySQL.selectAllFromTableWhere('send_receive_old', ['producerId', 'status'], [producerId, 'send_old']);
        
        try {
            const [result0, fields0] = await db.query(failSql);
            const [result1, fields1] = await db.query(oldSql);

            return result0.concat(result1);
        } catch (error) {
            return ({access: 0})
        }
    }

    async receiveOldModel(oldBatchId, producerId, date) {
        const receive = querySQL.updateSet('send_receive_old', ['status', 'receiveDate'], ['received_old', date],
            ['oldBatchId'], [oldBatchId]);
        const history = querySQL.insertIntoFull('history', [[oldBatchId, 'Nhận sản phẩm cũ', date, producerId]]);
        
        try {
            await db.query(receive);
            await db.query(history);

            return {access: 1};
        } catch (error) {
            return ({access: 0})
        }
    }

    async receiveFailModel(productId, producerId, date) {
        const receive = querySQL.updateSet('product', ['status', 'receiveFailDate'], ['received_fail', date],
            ['productId'], [productId]);
        const history = querySQL.insertIntoFull('history', [[productId, 'Nhận sản phẩm lỗi', date, producerId]]);

        try {
            await db.query(receive);
            await db.query(history);

            return {access: 1};
        } catch (error) {
            return ({access: 0})
        }
    }

    async oldAndFailModel(producerId) {
        const oldSql = querySQL.selectAllFromTableWhere('send_receive_old', ['status', 'producerId'], ['received_old', producerId]);
        const failSql = querySQL.selectAllFromTableWhere('product', ['status', 'producerId'], ['received_fail', producerId]);

        try {
            const [old, fields0] = await db.query(oldSql);
            const [fail, fields1] = await db.query(failSql);

            return (old.concat(fail));
        } catch (error) {
            return ({access: 0})
        }
    }

    async failByProductLineModel(producerId) {
        const sql = "SELECT productLine, COUNT(*) as amount "
            + "FROM product "
            + "GROUP BY productLine "
            + "HAVING producerId = '" + producerId + "' AND (status = 'send_fail' OR status = 'received_fail')";

        try {
            const [result, fields] = await db.query(sql);
            return result;
        } catch (error) {
            return ({access: 0})
        }
    }

    async failByAgentModel(producerId) {
        const sql = "SELECT agentId, COUNT(*) as amount "
            + "FROM product "
            + "GROUP BY agentId "
            + "HAVING producerId = '" + producerId + "' AND (status = 'send_fail' OR status = 'received_fail')";
        
        try {
            const [result, fields] = await db.query(sql);

            var list = new Array;
            for (var i = 0; i < result.length; i++) {
                const agentSql = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result[i].agentId]);
                
                const agent = await db.query(agentSql);
                list.push({name: agent[0].name, amout: result[i].amount});
            }
            
            return list;
        } catch (error) {
            return ({access: 0})
        }
    }

    async failByServiceModel(producerId) {
        const sql = "SELECT lastServiceId, COUNT(*) as amount "
            + "FROM product "
            + "GROUP BY lastServiceId "
            + "HAVING producerId = '" + producerId + "' AND (status = 'send_fail' OR status = 'received_fail')";
        
        try {
            const [result, fields] = await db.query(sql);

            var list = new Array;
            for (var i = 0; i < result.length; i++) {
                const serviceSql = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result[i].lastServiceId]);
                
                const service = await db.query(serviceSql);
                list.push({name: service[0].name, amout: result[i].amount});
            }
            
            return list;
        } catch (error) {
            return ({access: 0})
        }
    }

    async oldByAgentModel(producerId) {
        const sql = "SELECT agentId, SUM(amount) as amount "
            + "FROM send_receive_old "
            + "GROUP BY agentId "
            + "HAVING producerId = '" + producerId + "'";
        
        try {
            const [result, fields] = await db.query(sql);

            var list = new Array;
            for (var i = 0; i < result.length; i++) {
                const agentSql = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result[i].agentId]);
                
                const agent = await db.query(agentSql);
                list.push({name: agent[0].name, amout: result[i].amount});
            }
            
            return list;
        } catch (error) {
            return ({access: 0})
        }
    }

    async produceByMonthModel(producerId) {
        const sql = "SELECT MONTH(date) as month, YEAR(date) as year, SUM(amountStart) as amount "
            + "FROM new_product "
            + "GROUP BY month, year "
            + "HAVING producerId = '" + producerId + "'";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return ({access: 0})
        }
    }

    async produceByYearModel(producerId) {
        const sql = "SELECT YEAR(date) as year, SUM(amountStart) as amount "
            + "FROM new_product "
            + "GROUP BY year "
            + "HAVING producerId = '" + producerId + "'";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return ({access: 0})
        }
    }

    async exportByMonthModel(producerId) {
        const sql = "SELECT MONTH(sendDate) as month, YEAR(sendDate) as year, SUM(amountStart) as amount "
            + "FROM send_receive_agent "
            + "GROUP BY month, year "
            + "HAVING producerId = '" + producerId + "'";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return ({access: 0})
        }
    }

    async exportByYearModel(producerId) {
        const sql = "SELECT YEAR(sendDate) as year, SUM(amountStart) as amount "
            + "FROM send_receive_agent "
            + "GROUP BY year "
            + "HAVING producerId = '" + producerId + "'";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return ({access: 0})
        }
    }

    async searchAgentModel(keyWord) {
        const sql = "SELECT name "
            + "FROM account "
            + "WHERE type = 'ag' AND name LIKE '%" + keyWord + "%'";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return ({access: 0})
        }
    }
}

module.exports = new ProducerModel