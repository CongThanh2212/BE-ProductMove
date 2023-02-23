class QuerySQL {

    // Search trong bảng với điều kiện
    selectAllFromTableWhere(table, arrAttributesWhere, arrValuesWhere) {
        var sql = "SELECT * FROM " + table
            + " where ";
        for (var i = 0; i < arrAttributesWhere.length; i++) {
            sql += arrAttributesWhere[i] + " = '" + arrValuesWhere[i] + "'";
            if (i < arrAttributesWhere.length - 1) sql += " and ";
        }
        return sql;
    }

    // Search trong bảng với điều kiện
    selectFromTableWhere(arrAttributesSelect, table, arrAttributesWhere, arrValuesWhere) {
        var sql = "SELECT ";
        for (var i = 0; i < arrAttributesSelect.length; i++) {
            sql += arrAttributesSelect[i];
            if (i < arrAttributesSelect.length - 1) sql += ", ";
        }
        sql += " FROM " + table
            + " where ";
        for (var i = 0; i < arrAttributesWhere.length; i++) {
            sql += arrAttributesWhere[i] + "= '" + arrValuesWhere[i] + "'";
            if (i < arrAttributesWhere.length - 1) sql += "and ";
        }
        return sql;
    }

    // Search trong bảng
    selectFromTable(arrAttributesSelect, table) {
        var sql = "SELECT ";
        for (var i = 0; i < arrAttributesSelect.length; i++) {
            sql += arrAttributesSelect[i];
            if (i < arrAttributesSelect.length - 1) sql += ", ";
        }
        sql += " FROM " + table;
        return sql;
    }

    /* insert giá trị của 1 số thuộc tính vào 1 bảng
    */
    insertInto(table, arrAttributes, arrValue) {
        var sql = "insert into " + table + " (";
        for (var i = 0; i < arrAttributes.length; i++) {
            sql += arrAttributes[i];
            if (i < arrAttributes.length - 1) sql += ", ";
        }
        sql += ") values";
        for (var i = 0; i < arrValue.length; i++) {
            sql += " ("
            for (var j = 0; j < arrValue[i].length; j++) {
                sql += "'" + arrValue[i][j] + "'";
                if (j < arrValue[i].length - 1) sql += ", ";
            }
            sql += ")";
            if (i < arrValue.length - 1) sql += ",";
        }
        return sql;
    }

    // insert đầy đủ giá trị các thuộc tính vào 1 bảng
    insertIntoFull(table, arrValue) {
        var sql = "insert into " + table + " values ";
        for (var i = 0; i < arrValue.length; i++) {
            sql += " ("
            for (var j = 0; j < arrValue[i].length; j++) {
                if (arrValue[i][j] == "null") sql += "null"
                else sql += "'" + arrValue[i][j] + "'";
                if (j < arrValue[i].length - 1) sql += ", ";
            }
            sql += ")";
            if (i < arrValue.length - 1) sql += ",";
        }
        return sql;
    }

    // Update
    updateSet(table, arrAttributesSet, arrValuesSet, arrAttributesWhere, arrValuesWhere) {
        var sql = "update " + table
            + " set ";
        for (var i = 0; i < arrAttributesSet.length; i++) {
            sql += arrAttributesSet[i] + " = '" + arrValuesSet[i] + "'";
            if (i < arrAttributesSet.length - 1) sql += ", ";
        }
        sql += " where ";
        for (var i = 0; i < arrAttributesWhere.length; i++) {
            sql += arrAttributesWhere[i] + " = '" + arrValuesWhere[i] + "'";
            if (i < arrAttributesWhere.length - 1) sql += " and ";
        }
        return sql;
    }

    count(table, arrAttributesWhere, arrValuesWhere) {
        var sql = "select count(*) from " + table
            + " where ";
        for (var i = 0; i < arrAttributesWhere.length; i++) {
            sql += arrAttributesWhere[i] + " = '" + arrValuesWhere[i] + "'";
            if (i < arrAttributesWhere.length - 1) sql += " and ";
        }
        return sql;
    }

    delete(table, arrAttributesWhere, arrValuesWhere) {
        var sql = "DELETE FROM " + table
            + " WHERE ";
        for (var i = 0; i < arrAttributesWhere.length; i++) {
            sql += arrAttributesWhere[i] + " = '" + arrValuesWhere[i] + "'";
            if (i < arrAttributesWhere.length - 1) sql += " and ";
        }
        return sql;
    }
}

module.exports = new QuerySQL