"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
    id: string;
    title: string;
    description: string;
    price?: number;
    category: string;
    imageUrl: string;
    isPromo?: boolean;
    promoPrice?: number;
}

export function ProductCard({
    title,
    description,
    price,
    category,
    imageUrl,
    isPromo,
    promoPrice
}: ProductCardProps) {
    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col h-full">
            <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-slate-100 animate-pulse" /> {/* Placeholder loading */}
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-semibold shadow-sm">
                        {category}
                    </Badge>
                    {isPromo && (
                        <Badge className="bg-red-500 text-white border-red-600 animate-pulse shadow-sm">
                            Promo!
                        </Badge>
                    )}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                    {description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        {price ? (
                            <div className="flex flex-col">
                                {isPromo && promoPrice ? (
                                    <>
                                        <span className="text-xs text-muted-foreground line-through decoration-red-400">
                                            Rp {price.toLocaleString('id-ID')}
                                        </span>
                                        <span className="text-lg font-bold text-primary">
                                            Rp {promoPrice.toLocaleString('id-ID')}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-lg font-bold text-slate-900">
                                        Rp {price.toLocaleString('id-ID')}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-sm font-medium text-emerald-600">
                                Hubungi Kami
                            </span>
                        )}
                    </div>

                    <Button size="icon" className="h-9 w-9 rounded-full shadow-sm hover:scale-105 transition-transform">
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
