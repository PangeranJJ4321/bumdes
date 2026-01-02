"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { PageHero } from "@/components/custom/PageHero"
import { NewsCard } from "@/components/custom/NewsCard"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Mock Data
const NEWS_ITEMS = [
    {
        id: "1",
        title: "BUMDes Kalosi Raih Penghargaan Inovasi Desa Digital 2025",
        slug: "bumdes-kalosi-raih-penghargaan-2025",
        excerpt: "Berkat transformasi digital layanan masyarakat dan wisata, BUMDes Kalosi dinobatkan sebagai desa inovatif terbaik tingkat kabupaten.",
        date: "2 Januari 2026",
        author: "Admin",
        imageUrl: "https://placehold.co/600x400/1e293b/ffffff?text=Penghargaan+Desa",
        category: "Inovasi"
    },
    {
        id: "2",
        title: "Festival Kuliner Malam Minggu Ramai Pengunjung",
        slug: "festival-kuliner-malam-minggu",
        excerpt: "Ratusan warga memadati area Food Court BUMDes untuk menikmati aneka jajanan lokal dan live music.",
        date: "28 Desember 2025",
        author: "Humas",
        imageUrl: "https://placehold.co/600x400/f97316/ffffff?text=Festival+Kuliner",
        category: "Kegiatan"
    },
    {
        id: "3",
        title: "Penambahan Wahana Baru di Area Wisata",
        slug: "wahana-baru-wisata-kalosi",
        excerpt: "Kini tersedia wahana kereta mini dan trampolin raksasa untuk anak-anak di area wisata BUMDes Kalosi.",
        date: "15 Desember 2025",
        author: "Admin",
        imageUrl: "https://placehold.co/600x400/4f46e5/ffffff?text=Wahana+Baru",
        category: "Wisata"
    },
    {
        id: "4",
        title: "Pelatihan Digital Marketing untuk UMKM Desa",
        slug: "pelatihan-digital-marketing-umkm",
        excerpt: "BUMDes bekerjasama dengan mahasiswa KKN mengadakan pelatihan pemasaran online bagi pelaku UMKM lokal.",
        date: "10 Desember 2025",
        author: "Humas",
        imageUrl: "https://placehold.co/600x400/10b981/ffffff?text=Pelatihan+UMKM",
        category: "Edukasi"
    },
]

export default function BeritaPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredNews = NEWS_ITEMS.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
                    {filteredNews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredNews.map((item) => (
                                <NewsCard key={item.id} {...item} />
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
