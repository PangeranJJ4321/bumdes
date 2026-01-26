"use client";

import Link from "next/link";
import Image from "next/image";
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandYoutube,
    IconBrandTiktok
} from "@tabler/icons-react";

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
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-xl font-bold text-black">
                            {contactName}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Menggerakkan ekonomi desa melalui inovasi digital.
                            Nikmati kuliner lezat dan wisata seru di satu tempat.
                        </p>

                        {/* Social Media Links */}
                        <div className="flex gap-4">
                            {facebookUrl && (
                                <Link
                                    href={facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-black transition-colors"
                                    aria-label="Facebook"
                                >
                                    <IconBrandFacebook size={24} />
                                </Link>
                            )}
                            {instagramUrl && (
                                <Link
                                    href={instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-black transition-colors"
                                    aria-label="Instagram"
                                >
                                    <IconBrandInstagram size={24} />
                                </Link>
                            )}
                            {tiktokUrl && (
                                <Link
                                    href={tiktokUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-black transition-colors"
                                    aria-label="TikTok"
                                >
                                    <IconBrandTiktok size={24} />
                                </Link>
                            )}
                            {youtubeUrl && (
                                <Link
                                    href={youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-black transition-colors"
                                    aria-label="YouTube"
                                >
                                    <IconBrandYoutube size={24} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Unit Usaha */}
                    <div>
                        <h4 className="font-serif font-bold text-lg mb-4">
                            Unit Usaha
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/layanan#kuliner"
                                    className="hover:text-black transition-colors"
                                >
                                    Food Court
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/layanan#wisata"
                                    className="hover:text-black transition-colors"
                                >
                                    Wisata Malam
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/layanan#mart"
                                    className="hover:text-black transition-colors"
                                >
                                    BUMDes Mart
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/layanan#perikanan"
                                    className="hover:text-black transition-colors"
                                >
                                    Perikanan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kontak */}
                    <div>
                        <h4 className="font-serif font-bold text-lg mb-4">
                            Kontak
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>{address}</li>
                            <li>WhatsApp: {contactPhone}</li>
                            <li>Email: {contactEmail}</li>
                        </ul>
                    </div>

                    {/* Jam Operasional */}
                    <div>
                        <h4 className="font-serif font-bold text-lg mb-4">
                            Jam Operasional
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>{operatingHours}</li>
                        </ul>
                    </div>
                </div>

                {/* Logo Partners */}
                <div className="pt-10 pb-6 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                        {/* Pemerintah Desa */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative w-28 h-28 flex-shrink-0">
                                <Image
                                    src="/logo-sidrap.png"
                                    alt="Logo Desa Kalosi"
                                    fill
                                    className="object-contain"
                                    sizes="112px"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="font-semibold text-sm text-black mb-1">
                                    Pemerintah Desa Kalosi
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Kecamatan Dua Pitue<br />
                                    Kabupaten Sidenreng Rappang
                                </p>
                            </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className="hidden md:block w-px bg-slate-200 self-stretch"></div>

                        {/* KKN Unhas */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative w-28 h-28 flex-shrink-0">
                                <Image
                                    src="/logo-kkn.png"
                                    alt="Logo KKN Unhas"
                                    fill
                                    className="object-contain"
                                    sizes="112px"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="font-semibold text-sm text-black mb-1">
                                    KKN Tematik: Inovasi Daerah
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Gelombang 115<br />
                                    Universitas Hassanuddin
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t pt-6 text-center text-xs text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} BUMDes Sumber Kalosi.
                        All rights reserved.
                    </p>
                    <div className="mt-2 space-x-4">
                        <Link
                            href="/privacy-terms"
                            className="hover:text-black transition-colors underline decoration-dotted"
                        >
                            Privacy Policy & Terms of Service
                        </Link>
                    </div>
                    <p className="mt-2">
                        Built with ❤️ for KKN T Gelombang 115 Desa Kalosi
                    </p>
                </div>
            </div>
        </footer>
    );
}