// Hjælpefunktion til at udregne kvadratmeterprisen for en bolig
function calculatePricePerSqm(pris, stoerrelseM2) {
    // 1. Typetjek og validering: Forhindrer fejl som division med nul, returnerer blot null ved fejl
    if (!Number.isFinite(pris) || !Number.isFinite(stoerrelseM2) || stoerrelseM2 <= 0) {
        return null;
    }

    // 2. Foretag selve udregningen og afrund pænt til nærmeste hele tal
    return Math.round(pris / stoerrelseM2);
}

// 3. Gør modulet / funktionen tilgængelig, så den kan trækkes ind i vores router/controller
module.exports = calculatePricePerSqm;