const querySQL = require('./querySQL')
const db = require('../config/database')

class ServiceModel {

    async checkServiceAccess(id) {
        const sql = querySQL.selectFromTableWhere(['type'] ,'account', ['accountId'], [id]);

        const [result, fields] = await db.query(sql);
        if (result.length == 0) return false;
        if (result[0].type == 'sv') return true;
        
        return false;
    }

    async listFailModel(serviceId) {
        const sql = "SELECT * "
            + "FROM product "
            + "WHERE lastServiceId = '" + serviceId + "' AND (status = 'send_fail' OR status = 'received_fail')";

        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async listFixedModel(serviceId) {
        const sql = "SELECT * "
        + "FROM services "
        + "WHERE serviceId = '" + serviceId + "' AND sendFixedDate IS NOT NULL";

        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async listFixingModel(serviceId) {
        const sql = querySQL.selectAllFromTableWhere('product', ['lastServiceId', 'status'], [serviceId, 'fixing']);

        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async listSendServiceModel(serviceId) {
        const sql = querySQL.selectAllFromTableWhere('product', ['lastServiceId', 'status'], [serviceId, 'send_service']);

        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async receiveSendServiceModel(serviceId, productId, date, numberOfService) {
        const updatePr = querySQL.updateSet('product', ['status'], ['fixing'], ['productId'], [productId]);
        const updateSv = querySQL.updateSet('services', ['fixingDate'], [date], ['productId', 'numberOfService'],
            [productId, numberOfService]);
        const history = querySQL.insertIntoFull('history', [[productId, 'Đang BH', date, serviceId]]);

        try {
            await db.query(updatePr);
            await db.query(updateSv);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async sendFixedModel(productId, date, numberOfService, agentId) {
        const updatePr = querySQL.updateSet('product', ['status'], ['send_fixed'], ['productId'], [productId]);
        const updateSv = querySQL.updateSet('services', ['sendFixedDate'], [date], ['productId', 'numberOfService'],
            [productId, numberOfService]);
        const history = querySQL.insertIntoFull('history', [[productId, 'BH xong, gửi về ĐL', date, agentId]]);

        try {
            await db.query(updatePr);
            await db.query(updateSv);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async sendFailModel(productId, date, producerId) {
        const updatePr = querySQL.updateSet('product', ['status', 'sendFailDate'], ['send_fail', date], ['productId'], [productId]);
        const history = querySQL.insertIntoFull('history', [[productId, 'Lỗi, trả về CSSX', date, producerId]]);

        try {
            await db.query(updatePr);
            await db.query(history);

            return {access: true};
        } catch (error) {
            return {access: false};
        }
    }

    async sendServiceMonthModel(serviceId) {
        const sql = "SELECT MONTH(sendServiceDate) as month, YEAR(sendServiceDate) as year, COUNT(*) as amount "
            + "FROM services "
            + "GROUP BY month, year "
            + "HAVING serviceId = '" + serviceId + "' AND month IS NOT NULL";
        
        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async sendServiceYearModel(serviceId) {
        const sql = "SELECT YEAR(sendServiceDate) as year, COUNT(*) as amount "
            + "FROM services "
            + "GROUP BY year "
            + "HAVING serviceId = '" + serviceId + "' AND year IS NOT NULL";
        
        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async fixedMonthModel(serviceId) {
        const sql = "SELECT MONTH(sendFixedDate) as month,YEAR(sendFixedDate) as year, COUNT(*) as amount "
            + "FROM services "
            + "GROUP BY month, year "
            + "HAVING serviceId = '" + serviceId + "' AND month IS NOT NULL";
        
        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async fixedYearModel(serviceId) {
        const sql = "SELECT YEAR(sendFixedDate) as year, COUNT(*) as amount "
            + "FROM services "
            + "GROUP BY year "
            + "HAVING serviceId = '" + serviceId + "' AND year IS NOT NULL";
        
        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async failMonthModel(serviceId) {
        const sql = "SELECT MONTH(sendFailDate) as month,YEAR(sendFailDate) as year, COUNT(*) as amount "
            + "FROM product "
            + "GROUP BY month, year "
            + "HAVING lastServiceId = '" + serviceId + "' AND month IS NOT NULL";
        
        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return {access: false};
        }
    }

    async failYearModel(serviceId) {
        const sql = "SELECT YEAR(sendFailDate) as year, COUNT(*) as amount "
            + "FROM product "
            + "GROUP BY year "
            + "HAVING lastServiceId = '" + serviceId + "' AND year IS NOT NULL";
        
        try {
            const [result, fields] = await db.query(sql);

            return result;
        } catch (error) {
            return {access: false};
        }
    }
}

module.exports = new ServiceModel