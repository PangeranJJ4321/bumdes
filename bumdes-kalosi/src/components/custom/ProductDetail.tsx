"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Share2, ChevronLeft, ChevronRight, Star } from "lucide-react";
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
        stock?: number | null;
    };
}

export function ProductDetail({ product }: ProductDetailProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();

    const stock = product.stock ?? 0;
    const isOutOfStock = stock <= 0;

    // Rating logic
    const rating = product.rating ?? 0;
    const reviewCount = product.reviewCount ?? 0;

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
        if (type === "inc" && quantity < stock) setQuantity(prev => prev + 1);
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

    const handleChatSeller = () => {
        const adminPhone = "6282393318287";
        const message = `Halo Admin, saya mau tanya tentang produk *${product.title}*...`;
        window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Image Gallery */}
            <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                    <img
                        src={galleryImages[currentImageIndex]}
                        alt={product.title}
                        className={`w-full h-full object-cover animate-in fade-in duration-300 ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
                    />

                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-lg">STOK HABIS</span>
                        </div>
                    )}

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

                    {product.isPromo && !isOutOfStock && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold shadow-lg animate-pulse">
                            Promo!
                        </div>
                    )}
                </div>
                {galleryImages.length > 1 && (
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
                )}
            </div>

            {/* Right Column: Details */}
            <div className="space-y-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="text-sm px-3 py-1">{product.category}</Badge>
                        {stock > 0 && stock <= 5 && (
                            <Badge variant="destructive" className="text-sm px-3 py-1 animate-pulse">Sisa {stock} Unit</Badge>
                        )}
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
                                disabled={quantity <= 1 || isOutOfStock}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-r-full hover:bg-slate-100"
                                onClick={() => handleQuantityChange("inc")}
                                disabled={quantity >= stock || isOutOfStock}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="text-sm text-slate-500 text-right">
                        Stok Tersedia: <span className="font-bold text-slate-900">{stock}</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        size="lg"
                        className="flex-1 h-12 text-lg rounded-xl font-bold shadow-lg shadow-blue-900/10"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-12 border-primary text-primary hover:bg-blue-50 rounded-xl px-6 font-bold"
                        onClick={handleChatSeller}
                    >
                        <Share2 className="mr-2 h-5 w-5" /> Tanya Penjual
                    </Button>
                </div>
            </div>
        </div>
    );
}
