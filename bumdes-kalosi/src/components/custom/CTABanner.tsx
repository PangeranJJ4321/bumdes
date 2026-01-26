"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function CTABanner() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background with Gradient and Pattern */}
            <div className="absolute inset-0 bg-slate-900 z-0">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>
            </div>

            {/* Floating Decorative Elements */}
            {/* Floating Decorative Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-none blur-2xl animate-pulse delay-700" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-none blur-3xl animate-pulse" />

            <div className="container mx-auto px-4 relative z-10 text-center text-white space-y-8">
                <div
                    className="space-y-4 max-w-3xl mx-auto"
                    data-aos="fade-up"
                    data-aos-duration="800"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-sm">
                        Siap Menjelajahi Kalosi?
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-50 max-w-2xl mx-auto font-light">
                        Nikmati kuliner lezat, belanja hemat, dan suasana malam yang tak terlupakan.
                    </p>
                </div>

                <div
                    className="flex flex-wrap justify-center gap-6 pt-4"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="800"
                >
                    <Button asChild size="lg" className="h-14 px-8 rounded-none text-lg font-bold bg-white text-black hover:bg-slate-100 shadow-none transition-all hover:translate-y-[-2px] cursor-pointer">
                        <Link href="/layanan">
                            Mulai Pesan Sekarang
                            <ArrowUpRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                </div>

                <p
                    className="text-sm text-blue-100 opacity-80 pt-8"
                    data-aos="fade-in"
                    data-aos-delay="400"
                >
                    *Didukung penuh oleh BUMDes Sumber Kalosi
                </p>
            </div>
        </section>
    );
}
