"use client"
import { LucideIcon, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface ServiceCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    imageUrls: string[];
    colorClass: string;
    isActive: boolean;
    onClick: () => void;
}

export function ServiceCard({ title, description, icon: Icon, href, imageUrls, colorClass, isActive, onClick }: ServiceCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Internal Carousel Logic
    useEffect(() => {
        // Only auto-rotate if there are multiple images
        if (imageUrls.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval);
    }, [imageUrls.length]);

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative h-[400px] md:h-[500px] transition-all duration-500 ease-in-out cursor-pointer overflow-hidden rounded-3xl group",
                isActive ? "flex-[3]" : "flex-[1] hover:flex-[1.2]"
            )}
        >
            <Card className="h-full w-full border-0 shadow-none bg-transparent">
                <div className="absolute inset-0 z-0">
                    {/* Carousel Images */}
                    {imageUrls.map((img, index) => (
                        <div
                            key={img}
                            className={cn(
                                "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
                                index === currentImageIndex ? "opacity-100" : "opacity-0"
                            )}
                            style={{ backgroundImage: `url('${img}')` }}
                        />
                    ))}

                    {/* Overlays */}
                    <div className={cn("absolute inset-0 mix-blend-multiply transition-opacity duration-500", colorClass, isActive ? "opacity-40" : "opacity-70")} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>

                <CardContent className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                    <div className={cn(
                        "transition-all duration-500 flex items-start",
                        isActive ? "mb-6" : "mb-0 justify-center md:justify-start"
                    )}>
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                            <Icon className="w-6 h-6" />
                        </div>
                    </div>

                    <div className={cn(
                        "space-y-4 transition-all duration-500 overflow-hidden",
                        isActive ? "opacity-100 max-h-[300px]" : "opacity-0 md:opacity-100 max-h-0 md:max-h-[100px]"
                    )}>
                        <h3 className={cn("font-bold transition-all duration-300", isActive ? "text-3xl" : "text-xl md:text-2xl")}>
                            {title}
                        </h3>

                        <p className={cn(
                            "text-white/80 transition-all duration-500",
                            isActive ? "opacity-100 line-clamp-none" : "opacity-0 h-0 md:h-auto md:line-clamp-2 md:opacity-70"
                        )}>
                            {description}
                        </p>

                        <div className={cn(
                            "flex items-center text-sm font-bold pt-2",
                            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}>
                            <span>Jelajahi Sekarang</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
