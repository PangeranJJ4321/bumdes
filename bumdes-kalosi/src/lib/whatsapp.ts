
/**
 * WhatsApp Helper for Fonnte API
 * Documentation: https://docs.fonnte.com/
 */

export const formatToFonnteNumber = (phone: string): string => {
    // Fonnte accepts 08xx or 628xx. Let's ensure strict digits.
    // If it starts with +, remove it.
    let clean = phone.replace(/\D/g, '');

    // Fonnte works best with 08xx or 628xx.
    // If it's already 62, keep it. If it's 08, keep it.
    // Let's normalize to 62 for consistency if we want, or just leave it.
    // Actually, Fonnte documentation often shows '08123...' or '628123...'. 
    // Let's ensure 62 prefix for international standard consistency.
    if (clean.startsWith('0')) {
        clean = '62' + clean.substring(1);
    }
    return clean;
};

export const sendFonnteMessage = async (
    target: string,
    message: string
) => {
    const token = process.env.FONNTE_TOKEN;
    if (!token) {
        console.error("[Fonnte] Missing FONNTE_TOKEN in .env");
        return { success: false, error: "Missing configuration" };
    }

    const formattedTarget = formatToFonnteNumber(target);

    try {
        const formData = new FormData();
        formData.append('target', formattedTarget);
        formData.append('message', message);

        // Optional: url, filename, schedule, etc. can be added here if needed.

        const response = await fetch("https://api.fonnte.com/send", {
            method: "POST",
            headers: {
                "Authorization": token
            },
            body: formData
        });

        const data = await response.json();

        // Fonnte response example: { "status": true, "target": [ "6282..." ], "message": "..." }
        // or { "status": false, "reason": "..." }

        if (!data.status) {
            console.error("[Fonnte] Error response:", data);
            return { success: false, error: data.reason || "Unknown Fonnte error" };
        }

        console.log(`[Fonnte] Message sent to ${formattedTarget}:`, data);
        return { success: true, data };
    } catch (error) {
        console.error("[Fonnte] Exception:", error);
        return { success: false, error: error };
    }
};
