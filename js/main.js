document.addEventListener('DOMContentLoaded', () => {

    // 1. Configurar el año dinámico en el footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Efecto en la navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Animación inicial del botón de WhatsApp
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        setTimeout(() => {
            whatsappBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                whatsappBtn.style.transform = 'scale(1)';
            }, 300);
        }, 2000);
    }

    // 4. Configuración EmailJS y Formulario
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const msgSuccess = document.getElementById('form-message-success');
            const msgError = document.getElementById('form-message-error');
            const msgSending = document.getElementById('form-message-sending');
            const btnSubmit = document.getElementById('btn-submit');

            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }

            const recaptchaResponse = grecaptcha.getResponse();
            if (recaptchaResponse.length === 0) {
                msgSuccess.classList.add('d-none');
                msgError.classList.remove('d-none');
                msgError.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> Por favor verifica que no eres un robot.';
                return;
            }

            const originalBtnHtml = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';
            btnSubmit.disabled = true;

            msgSuccess.classList.add('d-none');
            msgError.classList.add('d-none');
            msgSending.classList.remove('d-none');

            emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                this
            ).then(() => {
                msgSending.classList.add('d-none');
                msgSuccess.classList.remove('d-none');
                contactForm.reset();
                contactForm.classList.remove('was-validated');
                grecaptcha.reset();
            }, (error) => {
                msgSending.classList.add('d-none');
                msgError.classList.remove('d-none');
                msgError.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> Error de conexión. Reintenta más tarde.';
                console.error('Error EmailJS:', error);
            }).finally(() => {
                btnSubmit.innerHTML = originalBtnHtml;
                btnSubmit.disabled = false;
            });
        });
    }

    // 5. NAVEGACIÓN MÓVIL: Auto-cierre del menú hamburguesa
    // Seleccionamos todos los enlaces del menú y el contenedor colapsable
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const menuToggle = document.getElementById('navbarNav');

    // Verificamos que existan antes de añadir el listener
    if (menuToggle && navLinks.length > 0) {
        // Inicializamos el componente Collapse de Bootstrap
        const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                // Solo ejecutamos el cierre si el menú está desplegado (tiene la clase 'show')
                if (menuToggle.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }
});