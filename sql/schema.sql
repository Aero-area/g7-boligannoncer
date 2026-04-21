-- 1. Nulstil databasen ved at fjerne eksisterende tabel, så vi får en "clean slate"
DROP TABLE IF EXISTS Boligannonce;
GO

-- 2. Opret selve tabellen med automatisk tildelt ID og standardværdier
CREATE TABLE Boligannonce (
    id INT IDENTITY(1,1) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    boligtype VARCHAR(50) NOT NULL,
    pris DECIMAL(18,2) NOT NULL,
    stoerrelse_m2 INT NOT NULL,
    antal_vaerelser INT NOT NULL,
    opfoerelsesaar INT NOT NULL,
    oprettelsesdato DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    visninger INT NOT NULL DEFAULT 0,
    er_aktiv BIT NOT NULL DEFAULT 1,

    -- 3. Definer constraints: Sikr primærnøglen og bloker meningsløse data (negative tal)
    CONSTRAINT PK_Boligannonce PRIMARY KEY (id),
    CONSTRAINT CK_Boligannonce_Pris CHECK (pris >= 0),
    CONSTRAINT CK_Boligannonce_Stoerrelse CHECK (stoerrelse_m2 > 0),
    CONSTRAINT CK_Boligannonce_AntalVaerelser CHECK (antal_vaerelser > 0),
    CONSTRAINT CK_Boligannonce_Opfoerelsesaar CHECK (opfoerelsesaar BETWEEN 1800 AND 2100)
);
GO

-- 4. Indsæt et udvalg af testdata (seeding), så vi har boliger at vise i frontenden
INSERT INTO Boligannonce (
    adresse,
    boligtype,
    pris,
    stoerrelse_m2,
    antal_vaerelser,
    opfoerelsesaar
)
VALUES
('Noerrebrogade 45, 2. th, 2200 Koebenhavn N', 'Lejlighed', 3495000.00, 82, 3, 1934),
('Vesterbrogade 120, 4. tv, 1620 Koebenhavn V', 'Lejlighed', 4295000.00, 95, 4, 1898),
('Kystvejen 18, 8000 Aarhus C', 'Villa', 5895000.00, 156, 5, 1978),
('Algade 7, 1. sal, 4000 Roskilde', 'Ejerlejlighed', 2395000.00, 67, 2, 2004),
('Parkvej 33, 9000 Aalborg', 'Raekkehus', 3195000.00, 118, 4, 1999),
('Stationsvej 12, 4700 Naestved', 'Villa', 2795000.00, 132, 4, 1965),
('Havnevej 9, 3. mf, 6700 Esbjerg', 'Lejlighed', 1895000.00, 58, 2, 1987),
('Skovbrynet 21, 2800 Kongens Lyngby', 'Raekkehus', 4595000.00, 126, 5, 2012);
GO

-- 5. Opdater en enkelt annonce til status "solgt" (inaktiv) for at simulere virkelig brug
UPDATE Boligannonce
SET er_aktiv = 0
WHERE id = 5;
GO