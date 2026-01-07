
"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Utensils, Ticket, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"

const HERO_IMAGES = [
    "https://placehold.co/1920x1080/064e3b/ffffff?text=Background+Wisata+Malam",
    "https://placehold.co/1920x1080/1e293b/ffffff?text=Kuliner+Nusantara",
    "https://placehold.co/1920x1080/3f3f46/ffffff?text=Belanja+Oleh-Oleh",
]

export function HeroSection() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Image Carousel */}
            {HERO_IMAGES.map((image, index) => (
                <div
                    key={image}
                    className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-50" : "opacity-0"
                        } contrast-125`}
                    style={{
                        backgroundImage: `url('${image}')`
                    }}
                />
            ))}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-black/30" />

            {/* Content */}
            <div className="relative z-20 container px-4 text-center max-w-4xl mx-auto space-y-8">
                <div
                    className="space-y-4"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm text-sm font-medium">
                        Resmi Milik Desa Kalosi
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-sm">
                        Nikmati Suasana, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
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
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white min-w-[160px] h-12 rounded-full text-base font-semibold shadow-lg shadow-blue-900/20">
                        Pesan Makan
                    </Button>
                    <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 min-w-[160px] h-12 rounded-full text-base backdrop-blur-sm">
                        Lihat Wahana
                    </Button>
                </div>
            </div>
        </div>
    )
}
