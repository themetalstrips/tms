// Contact Support script for The Metal Strips
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formView = document.getElementById('contactFormView');
    const successView = document.getElementById('contactSuccessView');
    const successName = document.getElementById('successContactName');
    const successEmail = document.getElementById('successContactEmail');

    if (contactForm && formView && successView) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract inputs
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

            // Update success details
            if (successName) successName.textContent = name;
            if (successEmail) successEmail.textContent = email;

            // Toggle views
            formView.style.display = 'none';
            successView.style.display = 'block';

            // Reset form
            contactForm.reset();
        });
    }

    const resetContactBtn = document.getElementById('resetContactBtn');
    if (resetContactBtn && formView && successView) {
        resetContactBtn.addEventListener('click', () => {
            successView.style.display = 'none';
            formView.style.display = 'block';
        });
    }
});
