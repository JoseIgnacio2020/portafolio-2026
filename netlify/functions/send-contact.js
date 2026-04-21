export async function handler(event) {
    try {
        console.log("BODY:", event.body);

        const body = event.body ? JSON.parse(event.body) : {};
        const { token, name, email, phone, message } = body;

        console.log("TOKEN:", token);

        // 🔐 reCAPTCHA
        const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        });

        const verifyData = await verifyRes.json();
        console.log("RECAPTCHA:", verifyData);

        if (!verifyData.success) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "reCAPTCHA inválido",
                    googleResponse: verifyData
                })
            };
        }

        // 📧 EmailJS
        const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                template_params: {
                    name,
                    email,
                    phone,
                    message
                }
            })
        });

        const emailText = await emailRes.text();
        console.log("EMAILJS RESPONSE:", emailText);

        if (!emailRes.ok) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "EmailJS error", emailText })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        console.error("ERROR:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}
