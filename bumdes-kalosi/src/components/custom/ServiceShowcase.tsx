"use client"

import { useState, useEffect } from "react"
import { ServiceCard } from "./ServiceCard"
import { Utensils, Ticket, ShoppingBag, CreditCard, Fish } from "lucide-react"

const SERVICES = [
    {
        id: "kuliner",
        title: "Food Court",
        description: "Nikmati aneka hidangan lezat lokal dari nasi goreng hingga sarebba hangat. Tempat bersantai terbaik bersama keluarga.",
        icon: Utensils,
        href: "/layanan?category=KULINER",
        imageUrls: [
            "/images/kuliner/1.png",
            "/images/kuliner/2.png",
            "/images/kuliner/3.png",
            "/images/kuliner/4.png",
            "/images/kuliner/5.png",
            "/images/kuliner/6.png",
            "/images/kuliner/7.png",

        ],
        colorClass: "bg-neutral-900",
    },
    {
        id: "wisata",
        title: "Wisata Malam",
        description: "Wahana seru untuk keluarga: Istana Balon, Mobil Listrik, dan suasana malam yang indah di jantung Desa Kalosi.",
        icon: Ticket,
        href: "/layanan?category=WISATA",
        imageUrls: [
            "https://cdn.digitaldesa.com/uploads/profil/73.14.09.2003/berita/3fd87d30c3bc8ca4ecdc9b94cd8c9264.jpg",
        ],
        colorClass: "bg-neutral-800",
    },
    {
        id: "agen",
        title: "Agen",
        description: "Layanan keuangan praktis: Gas LPG.",
        icon: CreditCard,
        href: "/layanan?category=AGEN",
        imageUrls: [
            "/images/agen/1.png",
        ],
        colorClass: "bg-neutral-800",
    },
    {
        id: "perikanan",
        title: "Perikanan (Ketapang)",
        description: "Unit usaha budidaya ikan air tawar, kebun cabai di Dusun 2.",
        icon: Fish,
        href: "/layanan?category=KETAPANG",
        imageUrls: [
            "/images/ketapang/1.jpeg",
            "/images/ketapang/2.jpeg",
            "/images/ketapang/3.jpeg",
            "/images/ketapang/4.jpeg",
        ],
        colorClass: "bg-black",
    },
]

export function ServiceShowcase() {
    const [activeId, setActiveId] = useState<string>("kuliner")

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveId((currentId) => {
                const currentIndex = SERVICES.findIndex(s => s.id === currentId)
                const nextIndex = (currentIndex + 1) % SERVICES.length
                return SERVICES[nextIndex].id
            })
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[500px] w-full max-w-7xl mx-auto">
            {SERVICES.map((service) => (
                <ServiceCard
                    key={service.id}
                    {...service}
                    isActive={activeId === service.id}
                    onClick={() => setActiveId(service.id)}
                />
            ))}
        </div>
    )
}
