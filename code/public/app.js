document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-listing-form');
    const message = document.getElementById('form-message');

    if (!form || !message) {
        return;
    }

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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        showMessage('', '');

        const formData = {
            adresse: form.adresse.value.trim(),
            boligtype: form.boligtype.value.trim(),
            pris: Number(form.pris.value),
            stoerrelse_m2: Number(form.stoerrelse_m2.value),
            antal_vaerelser: Number(form.antal_vaerelser.value),
            opfoerelsesaar: Number(form.opfoerelsesaar.value)
        };

        try {
            const response = await fetch('/add-listing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                showMessage(result.message || 'Fejl ved oprettelse af boligannonce', 'error');
                return;
            }

            showMessage(result.message || 'Boligannonce oprettet', 'success');
            form.reset();

            setTimeout(() => {
                window.location.reload();
            }, 700);
        } catch (error) {
            console.error('Fejl i client-side POST request:', error);
            showMessage('Serverfejl ved oprettelse af boligannonce', 'error');
        }
    });
});