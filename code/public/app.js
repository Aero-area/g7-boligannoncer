document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-listing-form');
    const message = document.getElementById('form-message');

    if (!form) {
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            adresse: form.adresse.value,
            boligtype: form.boligtype.value,
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

            message.textContent = result.message;

            if (!response.ok) {
                return;
            }

            form.reset();
            window.location.reload();
        } catch (error) {
            console.error(error);
            message.textContent = 'Serverfejl ved oprettelse af boligannonce';
        }
    });
});