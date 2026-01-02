import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { PageHero } from "@/components/custom/PageHero"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock Data (In a real app, manipulate this data fetch)
const NEWS_DETAILS: Record<string, { title: string; date: string; author: string; content: string; imageUrl: string }> = {
    "bumdes-kalosi-raih-penghargaan-2025": {
        title: "BUMDes Kalosi Raih Penghargaan Inovasi Desa Digital 2025",
        date: "2 Januari 2026",
        author: "Admin",
        imageUrl: "https://placehold.co/1920x800/1e293b/ffffff?text=Penghargaan+Desa",
        content: `
            <p class="mb-4"><strong>Kalosi</strong> - BUMDes Sumber Kalosi kembali menorehkan prestasi membanggakan. Pada ajang Inovasi Desa Digital 2025 yang diselenggarakan oleh Pemerintah Kabupaten, BUMDes Kalosi dinobatkan sebagai pemenang kategori "Transformasi Layanan Publik".</p>
            <p class="mb-4">Penghargaan ini diberikan atas keberhasilan BUMDes dalam mengintegrasikan layanan pemesanan makanan, tiket wisata, dan belanja sembako ke dalam satu platform digital terpadu. Inovasi ini dinilai sangat efektif dalam meningkatkan perputaran ekonomi desa dan memudahkan akses warga.</p>
            <p class="mb-4">"Ini adalah hasil kerja keras seluruh tim dan dukungan masyarakat Desa Kalosi. Kami tidak akan berhenti sampai di sini, pengembangan fitur-fitur baru akan terus dilakukan," ujar Direktur BUMDes Kalosi saat menerima penghargaan.</p>
            <p class="mb-4">Kedepannya, BUMDes berencana menambahkan fitur pembayaran digital (QRIS) terintegrasi dan layanan antar barang (delivery) untuk semakin memanjakan pelanggan.</p>
        `
    },
    // Add default fallback for other slugs for demo purposes
    "default": {
        title: "Detail Berita BUMDes Kalosi",
        date: "2026",
        author: "Admin",
        imageUrl: "https://placehold.co/1920x800/3f3f46/ffffff?text=Detail+Berita",
        content: `
            <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p class="mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        `
    }
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
    // In Next.js App Router, params is available. ideally fetching data here.
    // For demo, checking if key exists, else show default
    const slug = params.slug
    const news = NEWS_DETAILS[slug] || NEWS_DETAILS["default"]

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
                <div className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 contrast-125"
                        style={{ backgroundImage: `url('${news.imageUrl}')` }}
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-black/40 to-black/60" />
                    <div className="relative z-20 container px-4 text-center max-w-4xl mx-auto pt-20">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-white border border-primary/30 text-sm mb-6 backdrop-blur-sm">
                            <Calendar className="w-3 h-3" /> {news.date}
                            <span className="w-1 h-1 rounded-full bg-white/50 mx-1" />
                            <User className="w-3 h-3" /> {news.author}
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg leading-tight">
                            {news.title}
                        </h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16 max-w-3xl">
                    <Button asChild variant="ghost" className="mb-8 hover:bg-muted/50 -ml-4">
                        <Link href="/berita">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Berita
                        </Link>
                    </Button>

                    <div
                        className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                </div>
            </main>
            <Footer />
        </div>
    )
}
