"use client"

import { useState, useEffect } from "react"
import { ServiceCard } from "./ServiceCard"
import { Utensils, Ticket, ShoppingBag } from "lucide-react"

const SERVICES = [
    {
        id: "kuliner",
        title: "Food Court",
        description: "Nikmati aneka hidangan lezat lokal dari nasi goreng hingga sarebba hangat. Tempat bersantai terbaik bersama keluarga.",
        icon: Utensils,
        href: "#kuliner",
        imageUrls: [
            "https://placehold.co/600x800/f97316/ffffff?text=Food+Court+1",
            "https://placehold.co/600x800/c2410c/ffffff?text=Suasana+Makan",
            "https://placehold.co/600x800/ea580c/ffffff?text=Menu+Lokal",
        ],
        colorClass: "bg-orange-600",
    },
    {
        id: "wisata",
        title: "Wisata Malam",
        description: "Wahana seru untuk keluarga: Istana Balon, Mobil Listrik, dan suasana malam yang indah di jantung Desa Kalosi.",
        icon: Ticket,
        href: "#wisata",
        imageUrls: [
            "https://placehold.co/600x800/4f46e5/ffffff?text=Wisata+Malam",
            "https://placehold.co/600x800/3730a3/ffffff?text=Wahana+Main",
            "https://placehold.co/600x800/312e81/ffffff?text=Lampu+Hias",
        ],
        colorClass: "bg-indigo-600",
    },
    {
        id: "mart",
        title: "BUMDes Mart",
        description: "Belanja kebutuhan harian, sembako, galon, dan gas dengan mudah dan harga terjangkau.",
        icon: ShoppingBag,
        href: "#mart",
        imageUrls: [
            "https://placehold.co/600x800/10b981/ffffff?text=BUMDes+Mart",
            "https://placehold.co/600x800/059669/ffffff?text=Rak+Sembako",
            "https://placehold.co/600x800/047857/ffffff?text=Pelayanan",
        ],
        colorClass: "bg-emerald-600",
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
