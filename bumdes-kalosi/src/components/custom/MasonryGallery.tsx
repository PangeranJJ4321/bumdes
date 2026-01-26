"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
    id: string;
    title: string;
    type: "image" | "video";
    src: string;
    likes: number;
    views: string;
}

const MOCK_GALLERY: GalleryItem[] = [];

export function MasonryGallery() {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    return (
        <div className="container mx-auto px-4 py-8">
            {MOCK_GALLERY.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-muted-foreground font-medium">Belum ada foto di galeri saat ini.</p>
                </div>
            ) : (
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


                            </div>
                        </div>
                    ))}
                </div>
            )}

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
