function calculatePricePerSqm(pris, stoerrelseM2) {
    if (!Number.isFinite(pris) || !Number.isFinite(stoerrelseM2) || stoerrelseM2 <= 0) {
        return null;
    }

    return Math.round(pris / stoerrelseM2);
}

module.exports = calculatePricePerSqm;