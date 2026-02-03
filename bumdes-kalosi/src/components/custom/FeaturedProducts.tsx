
import { ProductCard } from "@/components/custom/ProductCard";
import { prisma } from "@/server/db";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function FeaturedProducts() {
    // Fetch top 4 featured products (e.g. promo items or latest)
    const products = await prisma.product.findMany({
        take: 4,
        where: {
            imageUrl: {
                not: null
            },
            isOnlineOrder: true,
        },
        orderBy: [
            { isPromo: 'desc' }, // Prioritize promo items
            { createdAt: 'desc' }, // Newest items first as tie-breaker
        ],
        include: {
            reviews: {
                select: {
                    rating: true
                }
            }
        }
    });

    console.log(products);

    if (products.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Produk Unggulan Desa"
                    subtitle="Pilihan terbaik langsung dari masyarakat Desa Kalosi"
                    align="center"
                    className="mb-12"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {products.map((product) => {
                        const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
                        const avgRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

                        return (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.name}
                                description={product.description || ""}
                                price={product.price}
                                imageUrl={product.imageUrl || `https://placehold.co/600x400/png?text=${encodeURIComponent(product.name)}`}
                                category={product.category}
                                rating={avgRating}
                                reviewCount={product.reviews?.length || 0}
                                isPromo={product.isPromo}
                                promoPrice={product.promoPrice || undefined}
                            />
                        )
                    })}
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
