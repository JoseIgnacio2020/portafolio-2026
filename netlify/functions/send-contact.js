export async function handler(event) {
    try {
        const { token, name, email, phone, message } = JSON.parse(event.body);

        // 🔐 Validar reCAPTCHA con Google
        const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        });

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "reCAPTCHA inválido" })
            };
        }

        // 📧 Enviar con EmailJS (REST API)
        const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                service_id: process.env.VITE_EMAILJS_SERVICE_ID,
                template_id: process.env.VITE_EMAILJS_TEMPLATE_ID,
                user_id: process.env.VITE_EMAILJS_PUBLIC_KEY,
                template_params: {
                    name,
                    email,
                    phone,
                    message
                }
            })
        });

        if (!emailRes.ok) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Error enviando email" })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}
