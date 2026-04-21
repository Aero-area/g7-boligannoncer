// 1. Sikr at HTML'en er fuldt indlæst, før vi manipulerer DOM'en
document.addEventListener('DOMContentLoaded', () => {
    // 2. Hent formen og besked-elementet til senere brug
    const form = document.getElementById('add-listing-form');
    const message = document.getElementById('form-message');

    if (!form || !message) {
        return;
    }

    // 3. Lokal hjælpefunktion til at give brugeren succes- eller fejlmeddelelser
    const showMessage = (text, type) => {
        message.textContent = text;
        message.classList.remove('form-message--success', 'form-message--error');

        if (type === 'success') {
            message.classList.add('form-message--success');
        }

        if (type === 'error') {
            message.classList.add('form-message--error');
        }
    };

    // 4. Fang form-submit og stop standard sideopdatering
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        showMessage('', '');

        // 5. Udpak og formatér input-dataen til et JSON-venligt objekt
        const formData = {
            adresse: form.adresse.value.trim(),
            boligtype: form.boligtype.value.trim(),
            pris: Number(form.pris.value),
            stoerrelse_m2: Number(form.stoerrelse_m2.value),
            antal_vaerelser: Number(form.antal_vaerelser.value),
            opfoerelsesaar: Number(form.opfoerelsesaar.value)
        };

        try {
            // 6. Send en asynkron POST-request med vores data til backenden
            const response = await fetch('/add-listing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            // 7. Håndter API-fejl (fx hvis backenden afviser data ved validering)
            if (!response.ok) {
                showMessage(result.message || 'Fejl ved oprettelse af boligannonce', 'error');
                return;
            }

            // 8. Positiv feedback til brugeren: Ryd formen og genindlæs oversigten
            showMessage(result.message || 'Boligannonce oprettet', 'success');
            form.reset();

            setTimeout(() => {
                window.location.reload();
            }, 700);
        } catch (error) {
            // 9. Fang kritiske netværksfejl eller situationer hvor backend er offline
            console.error('Fejl i client-side POST request:', error);
            showMessage('Serverfejl ved oprettelse af boligannonce', 'error');
        }
    });
});