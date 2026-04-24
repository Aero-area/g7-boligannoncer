# G7 Boligannoncer

## Krav (Prerequisites)
For at kunne afvikle dette projekt lokalt, kræves følgende:
Node.js og npm (Node Package Manager) skal være installeret.
En gyldig .env fil placeret i rodmappen (samme sted som package.json). Denne fil skal indeholde forbindelsesoplysninger til vores Azure SQL-database.
Udfyld følgende værdier i .env filen:
DB_USER=
DB_PASSWORD=
DB_SERVER=
DB_DATABASE=
DB_PORT=
PORT=

## Projektstruktur
Systemet er opdelt i følgende overordnede lag for at adskille ansvarsområder og skabe kontekst:

code/: Hovedmappen for applikationen som indeholder vores backend.

code/index.js: Applikationens startpunkt (Express server).

code/routes/: Håndtering af applikationens API-endpoints og routing.

code/database/: Funktioner og opsætning til databaseintegration mod MSSQL.

code/views/: Dynamiske frontend-skabeloner (EJS).
code/public/: Statiske ressourcer (fx CSS, JS i browseren og billeder).

sql/: Indeholder database-skema og oprettelsesscripts.
test/http/: Indeholder .http-filer til test af vores API.

## Sådan eksekveres applikationen
For at starte systemet lokalt, skal censor åbne en terminal, navigere til projektets rodmappe og køre følgende kommandoer.

1. Installer først alle nødvendige afhængigheder via npm:

npm install

2. Pben code mappen:

cd code

3. Start applikationen:

npm start

Alternativ under udvikling: npm run dev starter serveren i watch-mode

## Sådan afprøves systemet (Afprøvning)
Når applikationen er startet og kører i terminalen, kan webapplikationen og API'et afprøves.

1. Via Browser (Frontend):
Åbn din browser og tilgå webapplikationen via:
http://localhost:3000/

2. Via API Test (REST Client):
Vores API-endpoints kan testes isoleret for at verificere forretningslogik. Vi anbefaler at bruge udvidelsen "REST Client" i VS Code.
Naviger til mappen test/http/ i projektet, åbn filerne her, og klik på genvejen Send Request over de enkelte HTTP-kald.

## Kort Fejlsøgning (Troubleshooting)
Start-op fejl:
Den absolut mest almindelige opstartsfejl er, at terminalen ikke står i den korrekte mappe, før kommandoer køres. Sørg for at terminalen står i roden af projektet (g7-boligannoncer), hvor package.json og code-mappen er synlige. Brug eventuelt cd-kommandoen til at navigere korrekt.

Fejl ved databasekald:
Opstår der fejl i loggen eller i frontend, der indikerer manglende databaseforbindelse, så verificér at din .env-fil er korrekt placeret, indeholder de rigtige felter, samt at din maskines IP-adresse er whitelistet på Azure portalen.
