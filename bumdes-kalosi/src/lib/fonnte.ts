export const sendWhatsapp = async (target: string, message: string) => {
    const token = process.env.FONNTE_TOKEN;

    if (!token) {
        console.error("FONNTE_TOKEN is not set in environment variables.");
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('target', target);
        formData.append('message', message);

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                Authorization: token,
            },
            body: formData,
        });

        const result = await response.json();
        console.log("[Fonnte] Send result:", result);
        return result.status;
    } catch (error) {
        console.error("[Fonnte] Error sending message:", error);
        return false;
    }
};
