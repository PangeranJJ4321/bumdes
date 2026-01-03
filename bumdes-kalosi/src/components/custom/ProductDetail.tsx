"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "react-use-cart";
import { toast } from "sonner";

interface ProductDetailProps {
    product: {
        id: string;
        title: string;
        description: string;
        price: number;
        category: string;
        imageUrl: string;
        isPromo?: boolean;
        promoPrice?: number;
        images?: string[];
    };
}

export function ProductDetail({ product }: ProductDetailProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();

    // Safely handle images array, defaulting to main imageUrl if empty
    const galleryImages = product.images && product.images.length > 0
        ? product.images
        : [product.imageUrl];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    const handleQuantityChange = (type: "inc" | "dec") => {
        if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
        if (type === "inc") setQuantity(prev => prev + 1);
    };

    const currentPrice = product.isPromo && product.promoPrice ? product.promoPrice : product.price;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.title,
            title: product.title, // map title for react-use-cart
            price: currentPrice,
            img: product.imageUrl, // react-use-cart might use 'img' or custom field, I'll put both
            imageUrl: product.imageUrl,
            category: product.category,
            quantity: quantity,
        } as any);

        toast.success("Berhasil ditambahkan ke keranjang", {
            description: `${quantity}x ${product.title}`,
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Image Gallery */}
            <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                    <img
                        src={galleryImages[currentImageIndex]}
                        alt={product.title}
                        className="w-full h-full object-cover animate-in fade-in duration-300"
                    />

                    {/* Carousel Controls */}
                    {galleryImages.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="h-6 w-6 text-slate-900" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                onClick={nextImage}
                            >
                                <ChevronRight className="h-6 w-6 text-slate-900" />
                            </Button>
                        </>
                    )}

                    {product.isPromo && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold shadow-lg animate-pulse">
                            Promo!
                        </div>
                    )}
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {galleryImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${currentImageIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-slate-300"
                                }`}
                        >
                            <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="text-sm px-3 py-1">{product.category}</Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{product.title}</h1>
                    <div className="flex items-end gap-3 mb-6">
                        <div className="text-3xl font-bold text-primary">
                            Rp {currentPrice.toLocaleString("id-ID")}
                        </div>
                        {product.isPromo && (
                            <div className="text-xl text-muted-foreground line-through decoration-red-400 mb-1">
                                Rp {product.price.toLocaleString("id-ID")}
                            </div>
                        )}
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                <div className="border-t border-b border-slate-100 py-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">Jumlah</span>
                        <div className="flex items-center border border-slate-200 rounded-full">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-l-full hover:bg-slate-100"
                                onClick={() => handleQuantityChange("dec")}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-r-full hover:bg-slate-100"
                                onClick={() => handleQuantityChange("inc")}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        size="lg"
                        className="flex-1 h-12 text-lg rounded-full font-bold shadow-lg shadow-emerald-900/10"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" /> Tambah ke Keranjang
                    </Button>
                    <Button size="icon" variant="outline" className="h-12 w-12 rounded-full border-slate-200">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
