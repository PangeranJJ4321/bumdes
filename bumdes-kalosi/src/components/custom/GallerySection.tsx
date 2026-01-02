import { SectionHeader } from "@/components/custom/SectionHeader";

const GALLERY_IMAGES = [
    { src: "https://placehold.co/400x300/f87171/ffffff?text=Kegiatan+1", alt: "Kegiatan Desa 1", className: "col-span-1 row-span-1" },
    { src: "https://placehold.co/400x600/60a5fa/ffffff?text=Kegiatan+2", alt: "Kegiatan Desa 2", className: "col-span-1 row-span-2" },
    { src: "https://placehold.co/400x300/34d399/ffffff?text=Kegiatan+3", alt: "Kegiatan Desa 3", className: "col-span-1 row-span-1" },
    { src: "https://placehold.co/400x300/fbbf24/ffffff?text=Kegiatan+4", alt: "Kegiatan Desa 4", className: "col-span-1 row-span-1" },
    { src: "https://placehold.co/400x300/a78bfa/ffffff?text=Kegiatan+5", alt: "Kegiatan Desa 5", className: "col-span-1 row-span-1" },
    { src: "https://placehold.co/400x300/f472b6/ffffff?text=Kegiatan+6", alt: "Kegiatan Desa 6", className: "col-span-1 row-span-1" },
];

export function GallerySection() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 space-y-12">
                <SectionHeader
                    title="Galeri Desa"
                    subtitle="Dokumentasi kegiatan dan keindahan Desa Kalosi."
                    align="center"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {GALLERY_IMAGES.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group ${img.className}`}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url('${img.src}')` }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
