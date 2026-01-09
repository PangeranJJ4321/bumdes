"use client";
import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { trpc as api } from "@/lib/trpc/client";
import { ProductCategory } from "@prisma/client";
import { useSearchParams, useRouter } from "next/navigation";

const CATEGORIES = [
    { label: "Semua", value: "ALL" },
    { label: "Kuliner", value: ProductCategory.KULINER },
    { label: "Wisata", value: ProductCategory.WISATA },
    { label: "Mart", value: ProductCategory.MART },
    { label: "Agen", value: ProductCategory.AGEN },
    { label: "Perikanan", value: ProductCategory.KETAPANG },
];

export function ProductGrid() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialCategory = searchParams.get("category") || "ALL";

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState("");

    // Update URL when category changes
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        const params = new URLSearchParams(searchParams);
        if (category === "ALL") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const { data: products, isLoading } = api.product.getAll.useQuery();

    const filteredProducts = products?.filter((product) => {
        const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    }) || [];

    return (
        <div className="space-y-8">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b border-border/40">
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat.value}
                            variant={selectedCategory === cat.value ? "default" : "outline"}
                            onClick={() => handleCategoryChange(cat.value)}
                            className="rounded-full whitespace-nowrap"
                        >
                            {cat.label}
                        </Button>
                    ))}
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari layanan..."
                        className="pl-9 rounded-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="text-center py-20">Loading...</div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                    {filteredProducts.map((product) => {
                        const totalRating = product.reviews?.reduce((acc: number, r: any) => acc + r.rating, 0) || 0;
                        const avgRating = product.reviews?.length ? totalRating / product.reviews.length : 0;

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
            ) : (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/25">
                    <p className="text-muted-foreground text-lg">Tidak ada layanan yang ditemukan.</p>
                </div>
            )}
        </div>
    );
}
