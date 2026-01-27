"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import Image from "next/image";

interface GalleryItem {
    id: string;
    title: string;
    imageUrl: string;
    category?: string;
    description?: string;
}

export function MasonryGallery() {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const { data: galleryItems, isLoading } = trpc.gallery.getAll.useQuery({});

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const items = galleryItems?.items || [];

    return (
        <div className="container mx-auto px-4 py-8">
            {items.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-muted-foreground font-medium">Belum ada foto di galeri saat ini.</p>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {items.map((item: any) => (
                        <div
                            key={item.id}
                            className="break-inside-avoid relative group bg-white border border-slate-100 hover:border-black transition-all duration-300 rounded-lg overflow-hidden"
                        >
                            {/* Image Container */}
                            <div
                                className="cursor-zoom-in overflow-hidden"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="relative w-full h-auto">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="p-3 flex flex-col gap-1">
                                <span className="text-sm font-medium text-slate-700 truncate block w-full">
                                    {item.title}
                                </span>
                                {item.category && (
                                    <span className="text-xs text-muted-foreground bg-slate-100 w-fit px-2 py-0.5 rounded-full">
                                        {item.category}
                                    </span>
                                )}
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
                        className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center flex-col gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedItem.imageUrl}
                            alt={selectedItem.title}
                            className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                        />
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">{selectedItem.title}</h3>
                            {selectedItem.description && <p className="text-muted-foreground text-sm max-w-2xl">{selectedItem.description}</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
