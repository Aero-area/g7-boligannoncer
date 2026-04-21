// Filens formål: Håndtere opkoblingen til databasen og skabe én genanvendelig "pool" af connections

// 1. Hent selve MSSQL-driveren og vores logindetaljer fra config-filen
const sql = require('mssql');
const sqlConfig = require('./config');

// 2. Opret en asynkron Connection Pool, som sikrer at vi ikke åbner en ny connection ved hvert Request
const poolPromise = new sql.ConnectionPool(sqlConfig)
    .connect()
    // 3. Hvis forbindelsen godkendes, logger vi det og sender den aktive pool videre
    .then((pool) => {
        console.log('Forbundet til MSSQL');
        return pool;
    })
    // 4. Fang kritiske fejl (som forkerte passwords eller nedetid) og kast fejlen, så serveren ikke hænger
    .catch((error) => {
        console.error('Databaseforbindelse fejlede:', error);
        throw error;
    });

// 5. Eksportér selve poolen for at kunne lave kald, og sql-objektet for at bygge typer (f.eks. sql.Int) i andre filer
module.exports = {
    sql,
    poolPromise
};