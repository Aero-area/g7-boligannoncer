require('dotenv').config();

const calculatePricePerSqm = require('./utils/price_calculator');
const express = require('express');
const path = require('path');
const { poolPromise } = require('./database/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statiske filer
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// GET /
// Henter de 25 seneste boligannoncer til forsiden
app.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT TOP 25
                id,
                adresse,
                stoerrelse_m2,
                visninger,
                pris
            FROM Boligannonce
            ORDER BY id DESC
        `);

        res.render('index', { boligannoncer: result.recordset });
    } catch (error) {
        console.error('Fejl ved hentning af boligannoncer:', error);
        res.status(500).send('Fejl ved hentning af boligannoncer');
    }
});

// GET /listing/:id
// Opdaterer visninger i databasen og henter derefter den valgte annonce
app.get('/listing/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send('Ugyldigt id');
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', id)
            .query(`
                UPDATE Boligannonce
                SET visninger = visninger + 1
                WHERE id = @id
            `);

        const result = await pool.request()
            .input('id', id)
            .query(`
                SELECT *
                FROM Boligannonce
                WHERE id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).send('Boligannonce ikke fundet');
        }

        const bolig = result.recordset[0];
        const prisPrM2 = calculatePricePerSqm(bolig.pris, bolig.stoerrelse_m2);

        res.render('listing', {
            bolig: {
                ...bolig,
                pris_pr_m2: prisPrM2
            }
        });
    } catch (error) {
        console.error('Fejl ved hentning af boligannonce:', error);
        res.status(500).send('Fejl ved hentning af boligannonce');
    }
});

// POST /add-listing
// Opretter en ny boligannonce i databasen
app.post('/add-listing', async (req, res) => {
    try {
        const {
            adresse,
            boligtype,
            pris,
            stoerrelse_m2,
            antal_vaerelser,
            opfoerelsesaar
        } = req.body;

        const parsedPris = Number(pris);
        const parsedStoerrelse = Number(stoerrelse_m2);
        const parsedVaerelser = Number(antal_vaerelser);
        const parsedOpfoerelsesaar = Number(opfoerelsesaar);

        if (!adresse || adresse.trim() === '') {
            return res.status(400).json({
                message: 'Adresse skal udfyldes'
            });
        }

        if (!boligtype || boligtype.trim() === '') {
            return res.status(400).json({
                message: 'Boligtype skal udfyldes'
            });
        }

        if (!Number.isFinite(parsedPris) || parsedPris < 1) {
            return res.status(400).json({
                message: 'Pris skal være mindst 1'
            });
        }

        if (!Number.isInteger(parsedStoerrelse) || parsedStoerrelse <= 0) {
            return res.status(400).json({
                message: 'Størrelse skal være større end 0'
            });
        }

        if (!Number.isInteger(parsedVaerelser) || parsedVaerelser < 1) {
            return res.status(400).json({
                message: 'Antal værelser skal være mindst 1'
            });
        }

        if (
            !Number.isInteger(parsedOpfoerelsesaar) ||
            parsedOpfoerelsesaar < 1800 ||
            parsedOpfoerelsesaar > 2100
        ) {
            return res.status(400).json({
                message: 'Opførelsesår skal være mellem 1800 og 2100'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('adresse', adresse.trim())
            .input('boligtype', boligtype.trim())
            .input('pris', parsedPris)
            .input('stoerrelse_m2', parsedStoerrelse)
            .input('antal_vaerelser', parsedVaerelser)
            .input('opfoerelsesaar', parsedOpfoerelsesaar)
            .query(`
                INSERT INTO Boligannonce (
                    adresse,
                    boligtype,
                    pris,
                    stoerrelse_m2,
                    antal_vaerelser,
                    opfoerelsesaar
                )
                VALUES (
                    @adresse,
                    @boligtype,
                    @pris,
                    @stoerrelse_m2,
                    @antal_vaerelser,
                    @opfoerelsesaar
                )
            `);

        res.status(201).json({
            message: 'Boligannonce oprettet'
        });
    } catch (error) {
        console.error('Fejl ved oprettelse af boligannonce:', error);
        res.status(500).json({
            message: 'Serverfejl ved oprettelse af boligannonce'
        });
    }
});

// Simpel health-check route
app.get('/health', (req, res) => {
    res.status(200).send('Serveren kører');
});

// Starter først serveren, når databaseforbindelsen virker
async function startServer() {
    try {
        await poolPromise;
        console.log('Databaseforbindelse testet OK');

        app.listen(PORT, () => {
            console.log(`Serveren kører på http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Kunne ikke starte serveren pga. databasefejl:', error);
    }
}

startServer();