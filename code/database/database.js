const sql = require('mssql');
const sqlConfig = require('./config');

const poolPromise = new sql.ConnectionPool(sqlConfig)
    .connect()
    .then((pool) => {
        console.log('Forbundet til MSSQL');
        return pool;
    })
    .catch((error) => {
        console.error('Databaseforbindelse fejlede:', error);
        throw error;
    });

module.exports = {
    sql,
    poolPromise
};