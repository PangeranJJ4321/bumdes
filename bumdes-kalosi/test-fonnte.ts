
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sendTestFonnte = async () => {
    const token = process.env.FONNTE_TOKEN;
    const to = "6282393318287"; // Nomor Admin

    if (!token) {
        console.error("Missing FONNTE_TOKEN in .env");
        return;
    }

    console.log("-----------------------------------------");
    console.log("TESTING FONNTE API");
    console.log("-----------------------------------------");
    console.log("To:", to);

    try {
        const formData = new FormData();
        formData.append('target', to);
        formData.append('message', "*Halo, ini tes Fonnte dari API BUMDes!* \n🚀 Sistem notifikasi aktif.");

        // NOTE: Fonnte API requires Authorization header with the token.
        // It accepts multipart/form-data.

        const response = await fetch("https://api.fonnte.com/send", {
            method: "POST",
            headers: {
                "Authorization": token
            },
            body: formData
        });

        const data = await response.json();
        console.log("RESPONSE:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("EXCEPTION:", error);
    }
};

sendTestFonnte();
