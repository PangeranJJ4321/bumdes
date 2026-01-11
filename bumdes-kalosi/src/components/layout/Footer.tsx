import { prisma } from "@/server/db"
import { FooterClient } from "./FooterClient"

export async function Footer() {
    const settings = await prisma.siteSettings.findUnique({
        where: { key: "general" },
    });

    const contactPhone = settings?.contactPhone || "+62 812-3456-7890";
    const contactEmail = settings?.contactEmail || "bumdes@kalosi.desa.id";
    const address = settings?.address || "Desa Kalosi, Enrekang";
    const hours = settings?.operatingHours || "Senin - Minggu: 08:00 - 22:00";
    const contactName = settings?.contactName || "BUMDes Sumber Kalosi";

    return (
        <FooterClient
            contactName={contactName}
            contactPhone={contactPhone}
            contactEmail={contactEmail}
            address={address}
            operatingHours={hours}
            facebookUrl={settings?.facebookUrl}
            instagramUrl={settings?.instagramUrl}
            youtubeUrl={settings?.youtubeUrl}
        />
    )
}
