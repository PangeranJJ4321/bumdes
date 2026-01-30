"use client";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";



const FOCUS_AREAS = [
    "Kuliner Nusantara",
    "Perikanan",
    "Agen LPG",
    "Wisata Malam"
];

export function AboutSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Content Side */}
                <div
                    className="space-y-8"
                    data-aos="fade-right"
                    data-aos-duration="1000"
                >
                    <div className="space-y-4">
                        <SectionHeader
                            title="Membangun Desa Lewat Digital"
                            subtitle="BUMDes Sumber Kalosi menghadirkan kemudahan transaksi dan promosi potensi desa."
                            align="left"
                            className="mb-4"
                        />
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Kami berkomitmen untuk mengangkat potensi lokal Desa Kalosi melalui integrasi teknologi.
                            Platform ini memudahkan warga untuk memesan kebutuhan harian dan menarik wisatawan
                            untuk menikmati keindahan malam di desa kami.
                        </p>
                    </div>

                    {/* Focus Areas */}
                    <div className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Fokus & Layanan Utama
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {FOCUS_AREAS.map((area, index) => (
                                <span
                                    key={area}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors cursor-default"
                                    data-aos="zoom-in"
                                    data-aos-delay={index * 100}
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Lokasi Strategis</h4>
                                <p className="text-sm text-muted-foreground">Pusat Desa Kalosi</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Buka Setiap Hari</h4>
                                <p className="text-sm text-muted-foreground">08:00 - 22:00 WITA</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button variant="ghost" className="group text-primary font-semibold hover:bg-primary/10" asChild>
                            <Link href="/tentang-kami">
                                Pelajari Lebih Lanjut <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Map Side */}
                <div
                    className="relative w-full min-h-[300px] lg:min-h-[500px] rounded-2xl overflow-hidden shadow-2xl group border border-slate-100 bg-slate-100"
                    data-aos="fade-left"
                    data-aos-duration="1000"
                >
                    <iframe
                        src="https://maps.google.com/maps?q=BUMDes+Sumber+Kalosi,+Dua+Pitue,+Sidenreng+Rappang&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        className="absolute inset-0 w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Link Google Maps BUMDes Sumber Kalosi"
                    />
                </div>
            </div>
        </section>
    );
}