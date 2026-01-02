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
                    backgroundImage="https://placehold.co/1920x800/0f172a/ffffff?text=Tentang+Kami"
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
                                    BUMDes Sumber Kalosi didirikan pada tahun 2018 sebagai respon atas kebutuhan masyarakat Desa Kalosi akan sebuah lembaga ekonomi yang mampu mengelola potensi lokal secara profesional.
                                    Berawal dari unit usaha simpan pinjam sederhana, kami terus berkembang mengikuti dinamika kebutuhan warga.
                                </p>
                                <p className="mt-4">
                                    Pada tahun 2024, di bawah kepemimpinan baru dan semangat digitalisasi, BUMDes Kalosi bertransformasi.
                                    Kami meluncurkan inisiatif "Desa Digital" yang mengintegrasikan layanan perdagangan, pembayaran, dan informasi desa dalam satu platform terpadu.
                                    Langkah ini diambil untuk memastikan Desa Kalosi tidak hanya menjadi penonton, tetapi pemain utama dalam era ekonomi digital.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
                                {[
                                    { year: "2018", event: "Pendirian BUMDes" },
                                    { year: "2020", event: "Unit Usaha Dagang" },
                                    { year: "2023", event: "Unit Wisata Rintisan" },
                                    { year: "2024", event: "Transformasi Digital" }
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
