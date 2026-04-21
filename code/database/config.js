// Centraliseret konfiguration der adskiller opsætningen fra vores backend-logik

// 1. Indlæs logindetaljer fra vores .env-fil, så vi ikke uploader passwords til GitHub
require('dotenv').config();

// 2. Byg et konfigurationsobjekt ud fra de lokalt gemte miljøvariabler
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT) || 1433,
    
    // 3. Nødvendige sikkerhedsindstillinger for at kommunikere krypteret med Azure SQL
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// 4. Eksportér opsætningen så selve backend-forbindelsen kan benytte sig af det
module.exports = sqlConfig;