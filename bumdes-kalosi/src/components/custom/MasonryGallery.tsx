"use client";

import { useState } from "react";
import { X, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
    id: string;
    title: string;
    type: "image" | "video";
    src: string;
    likes: number;
    views: string;
}

const MOCK_GALLERY: GalleryItem[] = [
    { id: "1", title: "Festival Budaya", type: "image", src: "https://placehold.co/600x800/f87171/ffffff?text=Vertical+1", likes: 234, views: "1.2k" },
    { id: "2", title: "Panen Raya", type: "image", src: "https://placehold.co/800x600/60a5fa/ffffff?text=Horizontal+1", likes: 120, views: "4.5k" },
    { id: "3", title: "Rapat Desa", type: "image", src: "https://placehold.co/600x600/34d399/ffffff?text=Square+1", likes: 89, views: "900" },
    { id: "4", title: "Wisata Alam", type: "image", src: "https://placehold.co/600x900/fbbf24/ffffff?text=Tall+Vertical", likes: 567, views: "10k" },
    { id: "5", title: "Produk UMKM", type: "image", src: "https://placehold.co/800x500/a78bfa/ffffff?text=Wide+Horizontal", likes: 342, views: "3.1k" },
    { id: "6", title: "Kesenian Tradisional", type: "image", src: "https://placehold.co/600x700/f472b6/ffffff?text=Portrait", likes: 211, views: "2k" },
    { id: "7", title: "Gotong Royong", type: "image", src: "https://placehold.co/700x700/indigo/ffffff?text=Square+2", likes: 156, views: "1.5k" },
    { id: "8", title: "Pemandangan Sore", type: "image", src: "https://placehold.co/600x400/rose/ffffff?text=Landscape", likes: 432, views: "5.6k" },
    { id: "9", title: "Anak-Anak Desa", type: "image", src: "https://placehold.co/500x800/teal/ffffff?text=Tall+2", likes: 98, views: "800" },
    { id: "10", title: "Kuliner Khas", type: "image", src: "https://placehold.co/800x600/cyan/ffffff?text=Landscape+2", likes: 675, views: "7k" },
    { id: "11", title: "Upacara Adat", type: "image", src: "https://placehold.co/600x800/orange/ffffff?text=Vertical+3", likes: 321, views: "2.8k" },
    { id: "12", title: "Kerajinan Tangan", type: "image", src: "https://placehold.co/600x600/lime/ffffff?text=Square+3", likes: 189, views: "1.9k" },
];

export function MasonryGallery() {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {MOCK_GALLERY.map((item) => (
                    <div
                        key={item.id}
                        className="break-inside-avoid relative group bg-white border border-slate-100 hover:border-black transition-all duration-300"
                    >
                        {/* Image Container */}
                        <div
                            className="cursor-zoom-in overflow-hidden"
                            onClick={() => setSelectedItem(item)}
                        >
                            <img
                                src={item.src}
                                alt={item.title}
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        {/* Card Footer */}
                        <div className="p-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 truncate max-w-[50%]">
                                {item.title}
                            </span>

                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                                    <Heart className="w-3.5 h-3.5" />
                                    <span>{item.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{item.views}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox / Popup */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedItem(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 h-10 w-10 hover:bg-slate-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(null);
                        }}
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    <div
                        className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedItem.src}
                            alt={selectedItem.title}
                            className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
