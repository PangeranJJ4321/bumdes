import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetail } from "@/components/custom/ProductDetail";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { prisma } from "@/server/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Fetch product & reviews from DB
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            createdBy: true,
            businessUnit: true,
            reviews: {
                where: { status: "APPROVED" }, // Only show approved reviews or filtered
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!product) {
        notFound();
    }

    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    // Adapt DB product to Component props if needed
    // MOCK_PRODUCTS might have extra fields like 'images' that DB doesn't have yet in seed
    // For now, we use single imageUrl for gallery if images missing
    const productData = {
        ...product,
        title: product.name,
        description: product.description || "", // Handle nullable description
        // If we want multiple images, we need to add them to DB or use array. 
        // fallback to single image array
        images: product.imageUrl ? [product.imageUrl] : [],
        imageUrl: product.imageUrl || "",  // Ensure string
        promoPrice: product.promoPrice || undefined, // Handle null -> undefined
        category: product.businessUnit.name,
        rating: averageRating,
        reviewCount: product.reviews.length,
        sellerPhone: product.createdBy?.phone || "6282393318287",
        isOnlineOrder: product.isOnlineOrder,
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar forceOpaque />
            <main className="flex-grow pt-24 pb-32 lg:pb-20">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb / Back */}
                    <Link
                        href="/layanan"
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Layanan
                    </Link>

                    <ProductDetail product={productData} />

                    {/* Reviews Section */}
                    <div className="mt-20 border-t border-slate-100 pt-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                            Ulasan Pembeli
                            <span className="bg-slate-100 text-slate-600 text-sm py-1 px-3 rounded-full">
                                {product.reviews.length}
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                            <div className="md:col-span-5">
                                <ReviewForm productId={product.id} />
                            </div>
                            <div className="md:col-span-7">
                                <ReviewList reviews={product.reviews} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
