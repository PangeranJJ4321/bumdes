
const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0";

/**
 * Sends a WhatsApp Template Message via Cloud API
 * @param to Recipient phone number (e.g., "628123456789")
 * @param templateName Name of the template (e.g., "hello_world")
 * @param languageCode Language code (default: "id")
 * @param components Template parameters (header, body, etc.)
 */
export const sendTemplateMessage = async (
    to: string,
    templateName: string,
    components: any[] = [],
    languageCode: string = "id"
) => {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
        console.error("[WhatsApp] Missing configuration. Check .env");
        return { success: false, error: "Missing configuration" };
    }

    try {
        const payload = {
            messaging_product: "whatsapp",
            to: to,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: languageCode
                },
                components: components
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

        if (!response.ok) {
            console.error("[WhatsApp] Error response:", JSON.stringify(data, null, 2));
            return { success: false, error: data.error?.message || "Unknown error" };
        }

        console.log("[WhatsApp] Message sent successfully:", data);
        return { success: true, data };
    } catch (error) {
        console.error("[WhatsApp] Exception sending message:", error);
        return { success: false, error: error };
    }
};
