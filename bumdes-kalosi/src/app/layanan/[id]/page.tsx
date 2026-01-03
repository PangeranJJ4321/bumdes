import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetail } from "@/components/custom/ProductDetail";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Find product by ID
    const product = MOCK_PRODUCTS.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-24 pb-20">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb / Back */}
                    <Link
                        href="/layanan"
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Layanan
                    </Link>

                    <ProductDetail product={product} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
