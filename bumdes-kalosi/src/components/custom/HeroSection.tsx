
"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Utensils, Ticket, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"

const HERO_IMAGE = "home.webp"

export function HeroSection() {
    return (
        <div className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-top bg-no-repeat opacity-50 contrast-125 transition-opacity duration-1000 ease-in-out"
                style={{
                    backgroundImage: `url('${HERO_IMAGE}')`
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-black/30" />

            {/* Content */}
            <div className="relative z-20 container px-4 text-center max-w-4xl mx-auto space-y-8">
                <div
                    className="space-y-4"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <span className="inline-block px-4 py-1.5 rounded-none border border-white/20 bg-white/10 text-white backdrop-blur-sm text-xs uppercase tracking-widest font-medium">
                        Resmi Milik Desa Kalosi
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
                        Nikmati Suasana, <br />
                        <span className="italic">
                            Dukung Ekonomi Desa
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
                        Pusat kuliner, wisata malam keluarga, dan belanja kebutuhan harian dalam satu platform digital yang mudah.
                    </p>
                </div>

                <div
                    className="flex flex-wrap items-center justify-center gap-4"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                >
                    <Button asChild size="lg" className="bg-white hover:bg-white/90 text-black min-w-[160px] h-12 rounded-none text-base font-semibold shadow-none cursor-pointer">
                        <Link href="/layanan">
                            Pesan Makan
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 min-w-[160px] h-12 rounded-none text-base backdrop-blur-sm cursor-pointer">
                        <Link href="/layanan#wisata">
                            Lihat Wahana
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
