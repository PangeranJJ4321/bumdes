import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GallerySection } from "@/components/custom/GallerySection";
import { PageHero } from "@/components/custom/PageHero";
import { VisionMission } from "@/components/custom/VisionMission";
import { SectionHeader } from "@/components/custom/SectionHeader";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
                <PageHero
                    title="Tentang Kami"
                    subtitle="Mengenal lebih dekat visi, misi, dan perjalanan BUMDes Sumber Kalosi."
                    backgroundImage="about.webp"
                />

                <VisionMission />

                {/* Sejarah / History Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto space-y-8 text-center md:text-left">
                            <SectionHeader
                                title="Sejarah Perjalanan"
                                subtitle="Dedikasi yang tumbuh dari semangat membangun desa."
                                align="center"
                            />

                            <div className="prose prose-lg mx-auto text-muted-foreground leading-relaxed" data-aos="fade-up">
                                <p>
                                    BUMDes Sumber Kalosi didirikan pada tahun 2017 sebagai langkah awal membangun kemandirian ekonomi desa.
                                    Dimulai dari unit usaha simpan pinjam, kami hadir untuk memberikan solusi keuangan yang mudah dan terjangkau bagi masyarakat Desa Kalosi.
                                </p>
                                <p className="mt-4">
                                    Dalam kurun waktu 2020 hingga 2025, kami fokus mengembangkan unit usaha riil seperti Penyewaan Lapak Makan, Unit Usaha Ketapang, dan perintisan Wisata Desa.
                                    Langkah ini diambil untuk memberdayakan potensi kuliner lokal dan memaksimalkan sumber daya alam yang ada di desa.
                                </p>
                                <p className="mt-4">
                                    Kini di tahun 2026, BUMDes Sumber Kalosi melangkah lebih jauh. Dengan semangat transformasi digital, kami mengintegrasikan seluruh layanan dalam satu platform
                                    untuk memperluas jangkauan pasar dan memudahkan akses layanan bagi seluruh warga Sidenreng Rappang.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
                                {[
                                    { year: "2017", event: "Pendirian & Unit Simpan Pinjam" },
                                    { year: "2020", event: "Ekspansi Unit Usaha Riil" },
                                    { year: "2023", event: "Pengembangan Wisata Desa" },
                                    { year: "2026", event: "Transformasi Digital" }
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform cursor-default"
                                        data-aos="fade-up"
                                        data-aos-delay={idx * 100}
                                    >
                                        <div className="text-3xl font-bold text-primary mb-2">{item.year}</div>
                                        <div className="text-sm font-medium text-slate-600">{item.event}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <GallerySection />
            </main>
            <Footer />
        </div>
    );
}
