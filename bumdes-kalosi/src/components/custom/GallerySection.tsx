import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function GallerySection() {
    return (
        <section className="py-20 bg-white border-t border-slate-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left Column: Feature Image */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative aspect-[4/3] w-full overflow-hidden shadow-xl">
                            <Image
                                src="https://placehold.co/1200x900/1e293b/ffffff?text=Galeri+Desa+Kalosi"
                                alt="Galeri Feature"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -z-10 top-6 -left-6 w-full h-full border-2 border-slate-200" />
                    </div>

                    {/* Right Column: Typography & Content */}
                    <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                        <div className="space-y-4">
                            <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                                Kabupaten Enrekang
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                                Galeri Desa Kalosi
                            </h2>
                            <p className="text-xl md:text-2xl font-serif italic text-slate-600 leading-relaxed">
                                "Merekam jejak langkah, mengabadikan keindahan alam dan budaya dalam setiap lapisan cerita."
                            </p>
                            <p className="text-muted-foreground leading-loose">
                                Jelajahi kumpulan momen terbaik dari kegiatan masyarakat, pemandangan alam memukau, hingga potret kehidupan sehari-hari yang menghangatkan hati.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                            <Link href="/tentang-kami/galeri">
                                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-none px-8 h-12 text-base">
                                    Lihat Galeri
                                </Button>
                            </Link>
                            <Link href="/kontak">
                                <Button size="lg" variant="outline" className="border-slate-900 text-slate-900 hover:bg-slate-50 rounded-none px-8 h-12 text-base">
                                    Hubungi Kami
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
