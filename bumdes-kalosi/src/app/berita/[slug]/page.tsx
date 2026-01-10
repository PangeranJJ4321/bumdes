import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { prisma } from "@/server/db"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar, User, ArrowLeft, Share2, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Metadata } from "next"

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const news = await prisma.news.findUnique({
        where: { slug: params.slug },
        select: { title: true, content: true }
    })

    if (!news) {
        return {
            title: "Berita Tidak Ditemukan",
        }
    }

    return {
        title: `${news.title} - BUMDes Kalosi`,
        description: news.content.substring(0, 160).replace(/<[^>]*>?/gm, ""),
    }
}

export default async function NewsDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params

    const news = await prisma.news.findUnique({
        where: { slug },
    })

    if (!news) {
        // If not found in DB, check if it's our mock data "bumdes-kalosi-raih-penghargaan-2025" for demo
        // This is just a fallback during transition
        if (slug === "bumdes-kalosi-raih-penghargaan-2025") {
            return <MockPage slug={slug} />
        }
        notFound()
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = news.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[500px] w-full flex items-end justify-start overflow-hidden bg-slate-900">
                    <Image
                        src={news.thumbnail || "https://placehold.co/1920x800/1e293b/ffffff?text=BUMDes+Kalosi"}
                        alt={news.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />

                    <div className="relative z-10 container mx-auto px-4 pb-16">
                        <div className="mb-6">
                            <Button asChild variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white transition-all rounded-full px-6">
                                <Link href="/berita">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Berita
                                </Link>
                            </Button>
                        </div>

                        <div className="max-w-4xl animate-in slide-in-from-bottom-5 duration-700">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
                                {news.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-medium">
                                <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <Calendar className="w-4 h-4 text-primary-foreground" />
                                    {format(new Date(news.publishedAt), "d MMMM yyyy", { locale: id })}
                                </span>
                                <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <User className="w-4 h-4 text-primary-foreground" />
                                    {news.author}
                                </span>
                                <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <Clock className="w-4 h-4 text-primary-foreground" />
                                    {readTime} menit baca
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Article */}
                        <div className="lg:col-span-8">
                            <article className="prose prose-lg dark:prose-invert max-w-none 
                                prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl
                                prose-p:leading-relaxed prose-img:rounded-2xl prose-img:shadow-xl
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg">
                                <div dangerouslySetInnerHTML={{ __html: news.content }} />
                            </article>

                            {/* Share & Footer of Article */}
                            <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-muted-foreground font-medium">
                                    Bagikan kabar baik ini:
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="icon" className="rounded-full hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z" />
                                        </svg>
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full hover:bg-black hover:text-white hover:border-black transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-card rounded-2xl p-8 border shadow-sm sticky top-24">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                                    Berita Lainnya
                                </h3>

                                {/* Static Recent Items (Can be made dynamic) */}
                                <div className="space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="aspect-video w-full rounded-lg bg-muted mb-3 overflow-hidden">
                                                <Image
                                                    src={`https://placehold.co/400x250/1e293b/ffffff?text=Berita+${i}`}
                                                    alt="Thumbnail"
                                                    width={400}
                                                    height={250}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                                Judul berita menarik lainnya yang bisa dibaca pengunjung.
                                            </h4>
                                            <span className="text-xs text-muted-foreground mt-2 block">2 Januari 2026</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t">
                                    <Button asChild variant="outline" className="w-full rounded-full">
                                        <Link href="/berita">Lihat Indeks Berita</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

// Fallback Mock Page for Transition
function MockPage({ slug }: { slug: string }) {
    const news = {
        title: "BUMDes Kalosi Raih Penghargaan Inovasi Desa Digital 2025",
        date: "2 Januari 2026",
        author: "Admin",
        imageUrl: "https://placehold.co/1920x800/1e293b/ffffff?text=Penghargaan+Desa",
        content: `
            <p><strong>Kalosi</strong> - BUMDes Sumber Kalosi kembali menorehkan prestasi membanggakan. Pada ajang Inovasi Desa Digital 2025 yang diselenggarakan oleh Pemerintah Kabupaten, BUMDes Kalosi dinobatkan sebagai pemenang kategori "Transformasi Layanan Publik".</p>
            <p>Penghargaan ini diberikan atas keberhasilan BUMDes dalam mengintegrasikan layanan pemesanan makanan, tiket wisata, dan belanja sembako ke dalam satu platform digital terpadu. Inovasi ini dinilai sangat efektif dalam meningkatkan perputaran ekonomi desa dan memudahkan akses warga.</p>
            <p>"Ini adalah hasil kerja keras seluruh tim dan dukungan masyarakat Desa Kalosi. Kami tidak akan berhenti sampai di sini, pengembangan fitur-fitur baru akan terus dilakukan," ujar Direktur BUMDes Kalosi saat menerima penghargaan.</p>
            <p>Kedepannya, BUMDes berencana menambahkan fitur pembayaran digital (QRIS) terintegrasi dan layanan antar barang (delivery) untuk semakin memanjakan pelanggan.</p>
            <blockquote>Pencapaian ini membuktikan bahwa desa digital bukan hanya mimpi, tapi realita yang bisa diwujudkan dengan kerja sama.</blockquote>
            <h2>Langkah Selanjutnya</h2>
            <p>Tim BUMDes telah menyusun roadmap 2026 yang mencakup ekspansi jangkauan pasar produk lokal hingga ke tingkat nasional melalui marketplace terintegrasi.</p>
        `
    } // Hardcoded for the specific slug demo

    const readTime = 3 // approx

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
                <div className="relative h-[60vh] min-h-[500px] w-full flex items-end justify-start overflow-hidden bg-slate-900">
                    <Image
                        src={news.imageUrl}
                        alt={news.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />

                    <div className="relative z-10 container mx-auto px-4 pb-16">
                        <div className="mb-6">
                            <Button asChild variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white transition-all rounded-full px-6">
                                <Link href="/berita">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Berita
                                </Link>
                            </Button>
                        </div>

                        <div className="max-w-4xl animate-in slide-in-from-bottom-5 duration-700">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
                                {news.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-medium">
                                <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <Calendar className="w-4 h-4 text-primary-foreground" />
                                    {news.date}
                                </span>
                                <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <User className="w-4 h-4 text-primary-foreground" />
                                    {news.author}
                                </span>
                                <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <Clock className="w-4 h-4 text-primary-foreground" />
                                    {readTime} menit baca
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8">
                            <article className="prose prose-lg dark:prose-invert max-w-none 
                                prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl
                                prose-p:leading-relaxed prose-img:rounded-2xl prose-img:shadow-xl
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg">
                                <div dangerouslySetInnerHTML={{ __html: news.content }} />
                            </article>
                        </div>
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-card rounded-2xl p-8 border shadow-sm sticky top-24">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                                    Berita Lainnya
                                </h3>
                                <p className="text-muted-foreground mb-4">Demo Content for fallback.</p>
                                <Button asChild variant="outline" className="w-full rounded-full">
                                    <Link href="/berita">Lihat Indeks Berita</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
