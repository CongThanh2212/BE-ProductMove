const querySQL = require('./querySQL')
const db = require('../config/database')
var randomstring = require("randomstring");

class AgentModel {

    async checkAgentAccess(id) {
        const sql = querySQL.selectFromTableWhere(['type'] ,'account', ['accountId'], [id]);

        const [result, fields] = await db.query(sql);
        if (result.length == 0) return false;
        if (result[0].type == 'ag') return true;
        
        return false;
    }

    async sellModel(agentId, customerName, customerPhone, customerAddress, arrProduct, sellDate) {
        try {
            const customerId = 'CS' + randomstring.generate(7);;
            const customer = querySQL.insertIntoFull('customer', [[customerId, customerName, customerPhone, customerAddress]]);
            await db.query(customer);

            var prValues = [];
            var prHis = [];
            var index = 0;
            for (var i = 0; i < arrProduct.length; i++) {
                const pr = arrProduct[i];
                for (var j = 0; j < pr.amountSell; j++) {
                    const productId = 'PR' + randomstring.generate(7);

                    prValues[index] = [productId, pr.importBatchId, pr.batchId, pr.batchNumber, 'sold', pr.productLine, pr.capacity,
                        pr.WM, sellDate, 'null', 'null', pr.producerId, agentId, 'null', '0', customerId];
                    prHis[index] = [productId, 'Bán cho KH', sellDate, customerId];
                    index++;
                }

                const updateAmount = querySQL.updateSet('send_receive_agent', ['amountNow'], [pr.amountNow - pr.amountSell],
                    ['importBatchId'], [pr.importBatchId]);
                await db.query(updateAmount);
            }
            const products = querySQL.insertIntoFull('product', prValues);
            const history = querySQL.insertIntoFull('history', prHis);

            await db.query(products);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async returnOldModel(agentId, arrProduct, date) {
        try {
            var oldValues = [];
            var hisValues = [];
            for (var i = 0; i < arrProduct.length; i++) {
                const oldId = 'OLD' + randomstring.generate(7);
                const pr = arrProduct[i];
                oldValues[i] = [oldId, pr.importBatchId, pr.batchId, pr.batchNumber, pr.amount, 'send_old', pr.productLine, pr.capacity,
                    date, 'null', pr.producerId, agentId];
                hisValues[i] = [oldId, 'Cũ - Trả lại CSSX', date, pr.producerId];

                const updateAmount = querySQL.updateSet('send_receive_agent', ['amountNow'], ['0'],
                    ['importBatchId'], [pr.importBatchId]);
                await db.query(updateAmount);
            }
            const old = querySQL.insertIntoFull('send_receive_old', oldValues);
            const his = querySQL.insertIntoFull('history', hisValues);
            console.log(old);console.log(his);
            await db.query(old);
            await db.query(his);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async newArrivalModel(agentId) {
        const sql = "SELECT * "
            + "FROM send_receive_agent "
            + "WHERE amountNow > '0' AND status = 'received_agent' AND agentId = '" + agentId + "'";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async listRecallModel(agentId) {
        const sql = querySQL.selectAllFromTableWhere('product', ['status', 'agentId'], ['recall', agentId]);
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async soldToServiceModel(agentId, serviceName, date, arrProduct) {
        try {
            const sv = querySQL.selectFromTableWhere(['accountId'], 'account', ['name'], [serviceName]);
            const [result, fields] = await db.query(sv);
            if (result.length == 0) return {access: false, mess: 'Không tồn tại TTBH'};
            const serviceId = result[0].accountId;

            var servicesValue = [];
            var hisValue = [];
            for (var i = 0; i < arrProduct.length; i++) {
                const pr = arrProduct[i];
                const updatePr = querySQL.updateSet('product', ['status', 'lastServiceId', 'numberOfService'],
                    ['send_service', serviceId, pr.numberOfService + 1], ['productId'], [pr.productId]);
                
                servicesValue[i] = [pr.productId, pr.numberOfService + 1, pr.importBatchId, pr.batchId, serviceId, agentId, date,
                    pr.batchNumber, pr.productLine, pr.capacity];
                hisValue[i] = [pr.productId, 'Đưa đi bảo hành', date, serviceId];
                await db.query(updatePr);
            }
            const services = querySQL.insertInto('services', ['productId', 'numberOfService', 'importBatchId', 'batchId', 'serviceId',
                'agentId', 'sendServiceDate', 'batchNumber', 'productLine', 'capacity'], servicesValue);
            const history = querySQL.insertIntoFull('history', hisValue);

            await db.query(services);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async recallToServiceModel(serviceName, date, arrProduct) {
        try {
            const sv = querySQL.selectFromTableWhere(['accountId'], 'account', ['name'], [serviceName]);
            const [result, fields] = await db.query(sv);
            if (result.length == 0) return {access: false, mess: 'Không tồn tại TTBH'};
            const serviceId = result[0].accountId;

            var hisValue = [];
            for (var i = 0; i < arrProduct.length; i++) {
                const pr = arrProduct[i];
                const updatePr = querySQL.updateSet('product', ['status', 'lastServiceId'], ['send_service', serviceId], ['productId'],
                    [pr.productId]);
                const services = querySQL.updateSet('services', ['serviceId', 'sendServiceDate'], [serviceId, date],
                    ['productId', 'numberOfService'], [pr.productId, pr.numberOfService]);
                
                hisValue[i] = [pr.productId, 'Đưa đi bảo hành', date, serviceId];
                await db.query(updatePr);
                await db.query(services);
            }
            const history = querySQL.insertIntoFull('history', hisValue);

            await db.query(history);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async listServiceModel(agentId) {
        const sql = "SELECT * "
            + "FROM product "
            + "WHERE status = 'send_service' OR status = 'fixing' OR status = 'send_fixed'";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async listReceiveFixedModel(agentId) {
        const sql = "SELECT * "
            + "FROM product "
            + "WHERE status = 'received_fixed'";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async returnCustomerModel(productId, numberOfService, date, customerId) {
        const updateSv = querySQL.updateSet('services', ['returnCustomerDate'], [date], ['productId', 'numberOfService'],
            [productId, numberOfService]);
        const updatePr = querySQL.updateSet('product', ['status'], ['return_customer'], ['productId'], [productId]);
        const history = querySQL.insertIntoFull('history', [[productId, 'Trả lại KH', date, customerId]]);
        
        try {
            await db.query(updateSv);
            await db.query(updatePr);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async listOldModel(agentId) {
        const sql = "SELECT * "
            + "FROM send_receive_old "
            + "WHERE agentId = '" + agentId + "'";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async listSoldNoErrorModel(agentId) {
        const sql = "SELECT * "
            + "FROM product "
            + "WHERE agentId = '" + agentId + "' AND (status = 'sold' OR status = 'return_customer')";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async recallModel(agentId, arrProduct, date) {
        try {
            var servicesValue = [], hisValue = [];
            for (var i = 0; i < arrProduct.length; i++) {
                const pr = arrProduct[i];
                const updatePr = querySQL.updateSet('product', ['status', 'numberOfService'], ['recall', pr.numberOfService + 1],
                    ['productId'], [pr.productId]);
                servicesValue[i] = [pr.productId, pr.numberOfService + 1, pr.importBatchId, pr.batchId ,agentId, date, pr.batchNumber,
                    pr.productLine, pr.capacity]
                hisValue[i] = [pr.productId, 'Triệu hồi', date, agentId];

                await db.query(updatePr);
            }
            const services = querySQL.insertInto('services', ['productId', 'numberOfService', 'importBatchId', 'batchId', 'agentId',
                'recallDate', 'batchNumber', 'productLine', 'capacity'], servicesValue);
            const history = querySQL.insertIntoFull('history', hisValue);

            await db.query(services);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async listFailModel(agentId) {
        const sql = "SELECT * "
            + "FROM product "
            + "WHERE agentId = '" + agentId + "' AND (status = 'send_fail' OR status = 'received_fail')";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async listSendFixedModel(agentId) {
        const sql = querySQL.selectAllFromTableWhere('product', ['agentId', 'status'], [agentId, 'send_fixed']);
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async receiveFixedModel(agentId, date, productId, numberOfService) {
        const updatePr = querySQL.updateSet('product', ['status'], ['received_fixed'], ['productId'], [productId]);
        const updateSv = querySQL.updateSet('services', ['receiveFixedDate'], [date], ['productId', 'numberOfService'],
            [productId, numberOfService]);
        const history = querySQL.insertIntoFull('history', [[productId, 'Đại lý nhận SPBH', date, agentId]]);
        
        try {
            await db.query(updatePr);
            await db.query(updateSv);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async listSendAgentModel(agentId) {
        const sql = querySQL.selectAllFromTableWhere('send_receive_agent', ['agentId', 'status'], [agentId, 'send_agent']);
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return ({access: false})
        }
    }

    async receiveNPModel(agentId, date, importBatchId) {
        const update = querySQL.updateSet('send_receive_agent', ['status', 'receiveDate'], ['received_agent', date], ['importBatchId'], [importBatchId]);
        const history = querySQL.insertIntoFull('history', [[importBatchId, 'Đại lý nhận SP', date, agentId]]);
        console.log(history);
        
        try {
            await db.query(update);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async soldByMonthModel(agentId) {
        const sql = "SELECT MONTH(sellDate) as month, YEAR(sellDate) as year, COUNT(*) as amount "
            + "FROM product "
            + "WHERE agentId = '" + agentId + "' "
            + "GROUP BY month, year "
            + "ORDER BY sellDate";
        
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

    async soldByYearModel(agentId) {
        const sql = "SELECT YEAR(sellDate) as year, COUNT(*) as amount "
            + "FROM product "
            + "WHERE agentId = '" + agentId + "' "
            + "GROUP BY year "
            + "ORDER BY sellDate";
        
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

    async importMonthModel(agentId) {
        const sql = "SELECT MONTH(receiveDate) as month, YEAR(receiveDate) as year, SUM(amountStart) as amount "
            + "FROM send_receive_agent "
            + "WHERE agentId = '" + agentId + "' AND status = 'received_agent' "
            + "GROUP BY year, month "
            + "ORDER BY receiveDate";
        
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

    async importYearModel(agentId) {
        const sql = "SELECT YEAR(receiveDate) as year, SUM(amountStart) as amount "
            + "FROM send_receive_agent "
            + "WHERE agentId = '" + agentId + "' AND status = 'received_agent' "
            + "GROUP BY year "
            + "ORDER BY receiveDate";
        
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

    async searchServiceModel(keyWord) {
        const sql = "SELECT name "
            + "FROM account "
            + "WHERE type = 'sv' AND name LIKE '%" + keyWord + "%'";
        
        try {
            const [result, fields] = await db.query(sql);
        
            return result;
        } catch (error) {
            return ({access: false})
        }
    }
}

module.exports = new AgentModel