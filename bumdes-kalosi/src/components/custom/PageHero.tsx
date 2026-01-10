"use client"

import { useEffect, useState } from "react"

interface PageHeroProps {
    title: string
    subtitle?: string
    backgroundImage?: string
    children?: React.ReactNode
    berita?: boolean
}

export function PageHero({
    title,
    subtitle,
    backgroundImage = "https://placehold.co/1920x600/1e293b/ffffff?text=Page+Header",
    children,
    berita
}: PageHeroProps) {
    return (
        <div className={`relative w-full flex items-center justify-center overflow-hidden bg-slate-900 ${berita ? "h-auto min-h-[600px] py-12" : "h-[50vh] min-h-[400px]"}`}>
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 contrast-125"
                style={{
                    backgroundImage: `url('${backgroundImage}')`
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-black/40 to-black/60" />

            {/* Content */}
            <div className={berita ? "relative z-20 container px-4 text-center max-w-4xl mx-auto space-y-6 pt-32 md:pt-5" : "relative z-20 container px-4 text-center max-w-4xl mx-auto space-y-6 pt-16"}>
                <div
                    className="space-y-2"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children && (
                    <div
                        className="pt-2"
                        data-aos="fade-up"
                        data-aos-delay="200"
                        data-aos-duration="1000"
                    >
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}
