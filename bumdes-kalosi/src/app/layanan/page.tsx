import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/custom/PageHero";
import { ProductGrid } from "@/components/custom/ProductGrid";

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
                <PageHero
                    title="Layanan & Produk"
                    subtitle="Temukan berbagai produk unggulan dan layanan terbaik dari BUMDes Sumber Kalosi."
                    backgroundImage="produk.webp"
                    backgroundPosition="bg-center"
                />

                <section className="py-12 container mx-auto px-4 min-h-[600px]">
                    <ProductGrid />
                </section>
            </main>
            <Footer />
        </div>
    );
}
