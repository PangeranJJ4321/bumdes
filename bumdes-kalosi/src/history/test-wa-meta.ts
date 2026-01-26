
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0";

const sendTestMessage = async () => {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    // Nomor HP tujuan
    const TO_PHONE_NUMBER = "6282393318287";

    console.log("-----------------------------------------");
    console.log("TESTING 7-PARAMETER TEMPLATE (DETAILS)");
    console.log("-----------------------------------------");
    console.log("Phone ID:", phoneId);
    console.log("To:", TO_PHONE_NUMBER);

    if (!token || !phoneId) return;

    try {
        const payload = {
            messaging_product: "whatsapp",
            to: TO_PHONE_NUMBER,
            type: "template",
            template: {
                name: "new_order_detail3",
                language: { code: "id" },
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: "TES-777" },      // {{1}} Order ID
                            { type: "text", text: "Sultan Andara" },// {{2}} Nama
                            { type: "text", text: "08111222333" },  // {{3}} HP
                            { type: "text", text: "Diantar Kurir" },// {{4}} Metode
                            { type: "text", text: "Rp 99.000" },    // {{5}} Total
                            { type: "text", text: "628111222333" }, // {{6}} HP Clean (link)
                            // PARAMETER BARU {{7}}:
                            { type: "text", text: "- Pizza Mewah (1x) @ Rp 50.000\n- Jus Emas (1x) @ Rp 49.000" }
                        ]
                    }
                ]
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
        console.log("\nRESPONSE:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("❌ EXCEPTION:", error);
    }
};

sendTestMessage();
