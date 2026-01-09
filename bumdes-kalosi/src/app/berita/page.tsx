"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { PageHero } from "@/components/custom/PageHero"
import { NewsCard } from "@/components/custom/NewsCard"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { trpc as api } from "@/lib/trpc/client"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export default function BeritaPage() {
    const [searchQuery, setSearchQuery] = useState("")

    // Fetch all news for now, filtering properly should be done on backend usually but for small datasets client is fine
    // Or we can add search to getList input
    const { data: newsItems, isLoading } = api.news.getAll.useQuery({
        limit: 50, // Fetch first 50
    })

    const filteredNews = newsItems?.items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
                <PageHero
                    title="Berita & Informasi"
                    subtitle="Update terbaru seputar kegiatan desa dan BUMDes Kalosi."
                    backgroundImage="https://placehold.co/1920x800/1e293b/ffffff?text=Berita+Desa"
                >
                    <div className="max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari berita..."
                            className="bg-white/90 backdrop-blur-sm border-white/20 text-black pl-10 h-12 rounded-full shadow-lg placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-white/40"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </PageHero>

                <div className="container mx-auto px-4 py-16">
                    {isLoading ? (
                        <div className="text-center py-20">Loading...</div>
                    ) : filteredNews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredNews.map((item) => (
                                <NewsCard
                                    key={item.id}
                                    title={item.title}
                                    excerpt={item.content.replace(/<[^>]*>?/gm, "").substring(0, 100) + "..."}
                                    date={format(new Date(item.publishedAt), "d MMMM yyyy", { locale: id })}
                                    author={item.author}
                                    imageUrl={item.thumbnail || `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(item.title.substring(0, 10))}`}
                                    slug={item.slug}
                                    category="Berita"
                                    views={0}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-semibold text-muted-foreground">Tidak ada berita yang ditemukan.</h3>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
