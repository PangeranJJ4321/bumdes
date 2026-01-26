
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0";

const sendSimpleTest = async () => {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const to = "6282393318287"; // Nomor Admin

    console.log("-----------------------------------------");
    console.log("TESTING SIMPLE HELLO_WORLD");
    console.log("-----------------------------------------");

    try {
        const payload = {
            messaging_product: "whatsapp",
            to: to,
            type: "template",
            template: {
                name: "hello_world",
                language: { code: "en_US" }
            }
        };

        const response = await fetch(`${WHATSAPP_API_URL}/${phoneId}/messages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("RESPONSE:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("EXCEPTION:", error);
    }
};

sendSimpleTest();
