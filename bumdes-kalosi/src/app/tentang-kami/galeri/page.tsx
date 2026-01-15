import { MasonryGallery } from "@/components/custom/MasonryGallery";
import { PageHero } from "@/components/custom/PageHero";
import { Navbar } from "@/components/layout/Navbar";

export default function GalleryPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />
            <PageHero
                title="Galeri Desa Kalosi"
                subtitle="Kumpulan momen dan keindahan desa dalam satu album."
                backgroundImage="https://placehold.co/1920x600/1e293b/ffffff?text=Galeri+Desa"
            />
            <MasonryGallery />
        </main>
    );
}
