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
            return ({access: false})
        }
    }

    async importModel(producerId, arrBatch) {
        try {
            let date = (new Date()).toISOString();
            for (var i = 0; i < arrBatch.length; i++) {
                const batchId = 'BATCH' + randomstring.generate(7);
                const batch = arrBatch[i];
                const addBatch = querySQL.insertIntoFull('new_product',
                    [[batchId, batch.batchNumber, batch.amount, batch.amount, batch.productLine, batch.capacity, batch.color,
                    batch.DOM, batch.WM, date, producerId]]);
                const history = querySQL.insertIntoFull('history', [[batchId, 'Mới sản xuất', date, producerId]]);
                
                await db.query(addBatch);
                await db.query(history);
            }
    
            return {access: true};
        } catch (error) {
            return ({access: false})
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
            return ({access: false})
        }
    }

    async newProductModel(producerId) {
        const sql = "SELECT * FROM new_product "
            + "WHERE producerId = '" + producerId + "' AND amountNow > 0";

        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return ({access: false})
        }
    }

    async exportModel(producerId, agentName, arrBatch) {
        try {
            let date = (new Date()).toISOString();
            // agentId
            const agent = querySQL.selectFromTableWhere(['accountId'], 'account', ['name'], [agentName]);
            const [result, fields] = await db.query(agent);
            if (result.length == 0) return ({access: false, mess: 'Không tìm thấy đại lý'});
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

            return {access: true};
        } catch (error) {
            return ({access: false});
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
            return ({access: false})
        }
    }

    async receiveOldModel(oldBatchId, producerId) {
        let date = (new Date()).toISOString();
        const receive = querySQL.updateSet('send_receive_old', ['status', 'receiveDate'], ['received_old', date],
            ['oldBatchId'], [oldBatchId]);
        const history = querySQL.insertIntoFull('history', [[oldBatchId, 'Nhận sản phẩm cũ', date, producerId]]);
        
        try {
            await db.query(receive);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return ({access: false})
        }
    }

    async receiveFailModel(productId, producerId) {
        let date = (new Date()).toISOString();
        const receive = querySQL.updateSet('product', ['status', 'receiveFailDate'], ['received_fail', date],
            ['productId'], [productId]);
        const history = querySQL.insertIntoFull('history', [[productId, 'Nhận sản phẩm lỗi', date, producerId]]);

        try {
            await db.query(receive);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return ({access: false})
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
            return ({access: false})
        }
    }

    async failByProductLineModel(producerId) {
        const sql = "SELECT productLine, COUNT(*) as amount "
            + "FROM product "
            + "WHERE producerId = '" + producerId + "' AND (status = 'send_fail' OR status = 'received_fail') "
            + "GROUP BY productLine";

        try {
            const [result, fields] = await db.query(sql);
            var arrName = new Array;
            var arrAmount = new Array;

            for (var i = 0; i < result.length; i++) {
                arrName.push(result[0].productLine);
                arrAmount.push(result[i].amount);
            }
            
            return {
                access: true,
                productLine: arrName,
                amount: arrAmount
            };
        } catch (error) {
            return ({access: false})
        }
    }

    async failByAgentModel(producerId) {
        const sql = "SELECT agentId, COUNT(*) as amount "
            + "FROM product "
            + "WHERE producerId = '" + producerId + "' AND (status = 'send_fail' OR status = 'received_fail') "
            + "GROUP BY agentId ";
        
        try {
            const [result, fields] = await db.query(sql);
            var arrName = new Array;
            var arrAmount = new Array;

            for (var i = 0; i < result.length; i++) {
                const agentSql = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result[i].agentId]);
                
                const [agent, fields] = await db.query(agentSql);
                arrName.push(agent[0].name);
                arrAmount.push(result[i].amount);
            }
            
            return {
                access: true,
                name: arrName,
                amount: arrAmount
            };
        } catch (error) {
            return ({access: false})
        }
    }

    async failByServiceModel(producerId) {
        const sql = "SELECT lastServiceId, COUNT(*) as amount "
            + "FROM product "
            + "WHERE producerId = '" + producerId + "' AND (status = 'send_fail' OR status = 'received_fail') "
            + "GROUP BY lastServiceId";
        
        try {
            const [result, fields] = await db.query(sql);
            var arrName = new Array;
            var arrAmount = new Array;

            for (var i = 0; i < result.length; i++) {
                const serviceSql = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result[i].lastServiceId]);
                
                const [service, fields] = await db.query(serviceSql);
                arrName.push(service[0].name);
                arrAmount.push(result[i].amount);
            }
            
            return {
                access: true,
                name: arrName,
                amount: arrAmount
            };
        } catch (error) {
            return ({access: false})
        }
    }

    async oldByAgentModel(producerId) {
        const sql = "SELECT agentId, SUM(amount) as amount "
            + "FROM send_receive_old "
            + "WHERE producerId = '" + producerId + "' "
            + "GROUP BY agentId ";
        
        try {
            const [result, fields] = await db.query(sql);
            var arrName = new Array;
            var arrAmount = new Array;

            for (var i = 0; i < result.length; i++) {
                const agentSql = querySQL.selectFromTableWhere(['name'], 'account', ['accountId'], [result[i].agentId]);
                
                const [agent, fields] = await db.query(agentSql);
                arrName.push(agent[0].name);
                arrAmount.push(result[i].amount);
            }
            
            return {
                access: true,
                name: arrName,
                amount: arrAmount
            };
        } catch (error) {
            return ({access: false})
        }
    }

    async produceByMonthModel(producerId) {
        const sql = "SELECT MONTH(date) as month, YEAR(date) as year, SUM(amountStart) as amount "
            + "FROM new_product "
            + "WHERE producerId = '" + producerId + "' "
            + "GROUP BY month, year "
            + "ORDER BY date";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return {
                access: true,
                list: result
            };
        } catch (error) {
            return ({access: false})
        }
    }

    async produceByYearModel(producerId) {
        const sql = "SELECT YEAR(date) as year, SUM(amountStart) as amount "
            + "FROM new_product "
            + "WHERE producerId = '" + producerId + "' "
            + "GROUP BY year "
            + "ORDER BY date";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return {
                access: true,
                list: result
            };
        } catch (error) {
            return ({access: false})
        }
    }

    async exportByMonthModel(producerId) {
        const sql = "SELECT MONTH(sendDate) as month, YEAR(sendDate) as year, SUM(amountStart) as amount "
            + "FROM send_receive_agent "
            + "WHERE producerId = '" + producerId + "' "
            + "GROUP BY month, year "
            + "ORDER BY sendDate";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return {
                access: true,
                list: result
            };
        } catch (error) {
            return ({access: false})
        }
    }

    async exportByYearModel(producerId) {
        const sql = "SELECT YEAR(sendDate) as year, SUM(amountStart) as amount "
            + "FROM send_receive_agent "
            + "WHERE producerId = '" + producerId + "' "
            + "GROUP BY year "
            + "ORDER BY sendDate";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return {
                access: true,
                list: result
            };
        } catch (error) {
            return ({access: false})
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
            return ({access: false})
        }
    }
}

module.exports = new ProducerModel