document.addEventListener('DOMContentLoaded', () => {
    
    // Configurar el año dinámico en el footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Efecto simple en la navbar al hacer scroll (agregar clase scrolled)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Pequeño efecto de animación en el botón de WhatsApp al cargar la página
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        setTimeout(() => {
            whatsappBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                whatsappBtn.style.transform = 'scale(1)';
            }, 300);
        }, 2000);
    }

    // Configuración EmailJS y Formulario de Contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Inicializar EmailJS con la variable de entorno de Vite
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            
            const msgSuccess = document.getElementById('form-message-success');
            const msgError = document.getElementById('form-message-error');
            const msgSending = document.getElementById('form-message-sending');
            const btnSubmit = document.getElementById('btn-submit');

            // 1. Validación Bootstrap 5
            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }

            // 2. Validación de reCAPTCHA
            const recaptchaResponse = grecaptcha.getResponse();
            if (recaptchaResponse.length === 0) {
                msgSuccess.classList.add('d-none');
                msgError.classList.remove('d-none');
                msgError.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> Por favor verifica que no eres un robot marcando el reCAPTCHA.';
                return;
            }

            // Iniciar proceso de envío
            const originalBtnHtml = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';
            btnSubmit.disabled = true;

            msgSuccess.classList.add('d-none');
            msgError.classList.add('d-none');
            msgSending.classList.remove('d-none');

            const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

            // 3. Envío con EmailJS
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    msgSending.classList.add('d-none');
                    msgSuccess.classList.remove('d-none');
                    
                    // Limpiar formulario y reCAPTCHA
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                    grecaptcha.reset();
                }, (error) => {
                    msgSending.classList.add('d-none');
                    msgError.classList.remove('d-none');
                    msgError.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> Ocurrió un error de conexión. Por favor intenta de nuevo más tarde.';
                    console.error('Error EmailJS:', error);
                }).finally(() => {
                    // Restaurar botón
                    btnSubmit.innerHTML = originalBtnHtml;
                    btnSubmit.disabled = false;
                });
        });
    }
});
