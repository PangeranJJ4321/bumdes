
import { SectionHeader } from "@/components/custom/SectionHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/custom/ProductGrid";

export function FeaturedProducts() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Produk Unggulan Desa"
                    subtitle="Pilihan terbaik langsung dari masyarakat Desa Kalosi"
                    align="center"
                    className="mb-12"
                />

                <div className="mb-12">
                    <ProductGrid limit={4} showFilters={false} showPagination={false} />
                </div>

                <div className="text-center">
                    <Link href="/layanan">
                        <Button size="lg" variant="outline" className="rounded-none px-8 font-bold border-2 border-black text-black hover:bg-black hover:text-white transition-colors">
                            Lihat Semua Produk <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
