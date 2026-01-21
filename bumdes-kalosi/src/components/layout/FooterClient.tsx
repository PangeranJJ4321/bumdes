"use client";

import Link from "next/link";
import Image from "next/image";
import { IconBrandFacebook, IconBrandInstagram, IconBrandYoutube, IconBrandTiktok } from "@tabler/icons-react";

interface FooterClientProps {
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    address: string;
    operatingHours: string;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    tiktokUrl?: string | null;
    youtubeUrl?: string | null;
}

export function FooterClient({
    contactName,
    contactPhone,
    contactEmail,
    address,
    operatingHours,
    facebookUrl,
    instagramUrl,
    tiktokUrl,
    youtubeUrl
}: FooterClientProps) {
    return (
        <footer className="bg-white border-t pt-20 pb-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <h3 className="font-serif text-xl font-bold text-black">{contactName}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Menggerakkan ekonomi desa melalui inovasi digital.
                            Nikmati kuliner lezat dan wisata seru di satu tempat.
                        </p>
                        <div className="flex gap-4">
                            {facebookUrl && (
                                <Link href={facebookUrl} target="_blank" className="text-muted-foreground hover:text-black transition-colors">
                                    <IconBrandFacebook size={24} />
                                </Link>
                            )}
                            {instagramUrl && (
                                <Link href={instagramUrl} target="_blank" className="text-muted-foreground hover:text-black transition-colors">
                                    <IconBrandInstagram size={24} />
                                </Link>
                            )}
                            {tiktokUrl && (
                                <Link href={tiktokUrl} target="_blank" className="text-muted-foreground hover:text-black transition-colors">
                                    <IconBrandTiktok size={24} />
                                </Link>
                            )}
                            {youtubeUrl && (
                                <Link href={youtubeUrl} target="_blank" className="text-muted-foreground hover:text-black transition-colors">
                                    <IconBrandYoutube size={24} />
                                </Link>
                            )}
                        </div>

                        <div className="pt-6 border-t border-dashed border-slate-200">
                            <p className="text-xs font-serif italic text-muted-foreground mb-3">Didukung oleh:</p>
                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24 grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
                                    <Image
                                        src="/logo-desa.png"
                                        alt="Logo Desa Kalosi"
                                        fill
                                        className="object-contain"
                                        sizes="96px"
                                    />
                                </div>
                                <div className="relative w-24 h-24 grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
                                    <Image
                                        src="/logo-kkn.png"
                                        alt="Logo KKN Unhas"
                                        fill
                                        className="object-contain"
                                        sizes="96px"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-lg mb-4">Unit Usaha</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/layanan#kuliner" className="hover:text-black transition-colors">Food Court</Link></li>
                            <li><Link href="/layanan#wisata" className="hover:text-black transition-colors">Wisata Malam</Link></li>
                            <li><Link href="/layanan#mart" className="hover:text-black transition-colors">BUMDes Mart</Link></li>
                            <li><Link href="/layanan#perikanan" className="hover:text-black transition-colors">Perikanan</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-lg mb-4">Kontak</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>{address}</li>
                            <li>WhatsApp: {contactPhone}</li>
                            <li>Email: {contactEmail}</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-lg mb-4">Jam Operasional</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>{operatingHours}</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-6 text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} BUMDes Sumber Kalosi. All rights reserved.</p>
                    <p className="mt-1">Built with ❤️ for KKN T Gelombang 115 Desa Kalosi</p>
                </div>
            </div>
        </footer>
    );
}
