"use client"

import { useState, useMemo } from "react"
import { PageHero } from "@/components/custom/PageHero"
import { NewsCard } from "@/components/custom/NewsCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, SortDesc, SortAsc, LayoutGrid, List as ListIcon } from "lucide-react"
import { trpc as api } from "@/lib/trpc/client"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"

export function NewsFeed() {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    // Fetch data
    const { data: newsItems, isLoading } = api.news.getAll.useQuery({
        limit: 50,
    })

    // Filter & Sort Logic
    const processedNews = useMemo(() => {
        if (!newsItems?.items) return []

        let filtered = newsItems.items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase())
        )

        // Sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.publishedAt).getTime();
            const dateB = new Date(b.publishedAt).getTime();
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [newsItems, searchQuery, sortOrder]);

    const featuredNews = processedNews.length > 0 ? processedNews[0] : null;
    const regularNews = processedNews.length > 0 ? processedNews.slice(1) : [];

    return (
        <main className="flex-grow bg-slate-50/50 min-h-screen">
            {/* Header / Hero with Search integrated properly */}
            <PageHero
                title="Kabar BUMDes"
                berita={true}
                subtitle="Informasi terkini, pengumuman, dan aktivitas terbaru dari BUMDes Sumber Kalosi."
                backgroundImage="berita.webp"
            >
                <div className="max-w-4xl mx-auto mt-12">
                    {/* Filter Bar */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20 flex flex-col md:flex-row gap-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Cari berita atau artikel..."
                                className="border-0 shadow-none focus-visible:ring-0 bg-transparent pl-10 h-12 text-base text-slate-800 placeholder:text-slate-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-px bg-slate-200 hidden md:block my-2"></div>
                            <Select value={sortOrder} onValueChange={(val: any) => setSortOrder(val)}>
                                <SelectTrigger className="w-full md:w-[160px] border-0 shadow-none focus:ring-0 h-12 bg-transparent hover:bg-slate-50 rounded-xl transition-colors text-slate-700">
                                    <div className="flex items-center gap-2">
                                        {sortOrder === "newest" ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                                        <SelectValue placeholder="Urutkan" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Terbaru</SelectItem>
                                    <SelectItem value="oldest">Terlama</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="bg-slate-100/50 rounded-xl p-1 flex items-center h-12">
                                <Button
                                    variant={viewMode === "grid" ? "white" : "ghost"}
                                    size="icon"
                                    className={`h-10 w-10 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-slate-700"}`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "white" : "ghost"}
                                    size="icon"
                                    className={`h-10 w-10 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-slate-700"}`}
                                    onClick={() => setViewMode("list")}
                                >
                                    <ListIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </PageHero>

            <div className="container mx-auto px-4 pb-16 pt-0 -mt-5 relative z-30">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : processedNews.length > 0 ? (
                    <div className="space-y-12">
                        {/* Featured Post (Only show if on first page/no heavy filtering) */}
                        {!searchQuery && sortOrder === "newest" && featuredNews && (
                            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <Link href={`/berita/${featuredNews.slug}`} className="group block">
                                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 grid md:grid-cols-12 gap-0 hover:shadow-2xl transition-all duration-300">
                                        <div className="md:col-span-7 relative h-64 md:h-auto min-h-[300px]">
                                            <Image
                                                src={featuredNews.thumbnail || `https://placehold.co/800x600/2563eb/ffffff?text=${encodeURIComponent(featuredNews.title)}`}
                                                alt={featuredNews.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                Berita Utama
                                            </div>
                                        </div>
                                        <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                                <span>{format(new Date(featuredNews.publishedAt), "d MMMM yyyy", { locale: id })}</span>
                                                <span>•</span>
                                                <span>{featuredNews.author}</span>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                                                {featuredNews.title}
                                            </h2>
                                            <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                                                {featuredNews.content.replace(/<[^>]*>?/gm, "")}
                                            </p>
                                            <span className="text-primary font-semibold flex items-center gap-2">
                                                Baca Selengkapnya <span className="text-lg">→</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Search Results / Regular List */}
                        {searchQuery && (
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-slate-900">
                                    Hasil pencarian untuk "{searchQuery}" ({processedNews.length})
                                </h3>
                            </div>
                        )}

                        {/* Regular Grid */}
                        <div className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                : "grid grid-cols-1 gap-6 max-w-4xl mx-auto"
                        }>
                            {(searchQuery || sortOrder !== "newest" ? processedNews : regularNews).map((item, idx) => (
                                viewMode === "grid" ? (
                                    <NewsCard
                                        key={item.id}
                                        {...item}
                                        excerpt={item.content.replace(/<[^>]*>?/gm, "").substring(0, 120) + "..."}
                                        date={format(new Date(item.publishedAt), "d MMMM yyyy", { locale: id })}
                                        imageUrl={item.thumbnail || `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(item.title.substring(0, 10))}`}
                                        category="Berita"
                                        views={0}
                                    />
                                ) : (
                                    <Link key={item.id} href={`/berita/${item.slug}`} className="group">
                                        <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-all flex gap-6 items-center">
                                            <div className="relative h-24 w-36 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                                <Image
                                                    src={item.thumbnail || `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(item.title.substring(0, 10))}`}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                    <span>{format(new Date(item.publishedAt), "d MMMM yyyy", { locale: id })}</span>
                                                </div>
                                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {item.content.replace(/<[^>]*>?/gm, "")}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-dashed">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Tidak ditemukan</h3>
                        <p className="text-muted-foreground">
                            Maaf, kami tidak dapat menemukan berita yang Anda cari.
                        </p>
                        <Button
                            variant="link"
                            className="text-primary mt-2"
                            onClick={() => { setSearchQuery(""); setSortOrder("newest") }}
                        >
                            Reset Filter
                        </Button>
                    </div>
                )}
            </div>
        </main>
    )
}
