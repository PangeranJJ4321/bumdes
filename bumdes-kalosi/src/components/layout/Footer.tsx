import Link from "next/link"
import { prisma } from "@/server/db"
import { IconBrandFacebook, IconBrandInstagram, IconBrandYoutube } from "@tabler/icons-react";

export async function Footer() {
    const settings = await prisma.siteSettings.findUnique({
        where: { key: "general" },
    });

    const contactPhone = settings?.contactPhone || "+62 812-3456-7890";
    const contactEmail = settings?.contactEmail || "bumdes@kalosi.desa.id";
    const address = settings?.address || "Desa Kalosi, Enrekang";
    const hours = settings?.operatingHours || "Senin - Minggu: 08:00 - 22:00";

    return (
        <footer className="bg-muted/50 border-t pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-primary">{settings?.contactName || "BUMDes Sumber Kalosi"}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Menggerakkan ekonomi desa melalui inovasi digital.
                            Nikmati kuliner lezat dan wisata seru di satu tempat.
                        </p>
                        <div className="flex gap-4">
                            {settings?.facebookUrl && (
                                <Link href={settings.facebookUrl} target="_blank" className="text-muted-foreground hover:text-primary">
                                    <IconBrandFacebook size={20} />
                                </Link>
                            )}
                            {settings?.instagramUrl && (
                                <Link href={settings.instagramUrl} target="_blank" className="text-muted-foreground hover:text-primary">
                                    <IconBrandInstagram size={20} />
                                </Link>
                            )}
                            {settings?.youtubeUrl && (
                                <Link href={settings.youtubeUrl} target="_blank" className="text-muted-foreground hover:text-primary">
                                    <IconBrandYoutube size={20} />
                                </Link>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Unit Usaha</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/layanan#kuliner" className="hover:text-primary transition-colors">Food Court</Link></li>
                            <li><Link href="/layanan#wisata" className="hover:text-primary transition-colors">Wisata Malam</Link></li>
                            <li><Link href="/layanan#mart" className="hover:text-primary transition-colors">BUMDes Mart</Link></li>
                            <li><Link href="/layanan#perikanan" className="hover:text-primary transition-colors">Perikanan</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Kontak</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>{address}</li>
                            <li>WhatsApp: {contactPhone}</li>
                            <li>Email: {contactEmail}</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Jam Operasional</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>{hours}</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-6 text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} BUMDes Sumber Kalosi. All rights reserved.</p>
                    <p className="mt-1">Built with ❤️ for KKN Desa Kalosi</p>
                </div>
            </div>
        </footer>
    )
}
