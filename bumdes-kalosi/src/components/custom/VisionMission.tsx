"use client";

import { Target, Lightbulb, TrendingUp, Users } from "lucide-react";

export function VisionMission() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Vision */}
                    <div
                        className="bg-white rounded-none p-8 border border-black relative overflow-hidden group"
                        data-aos="fade-right"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Lightbulb className="w-32 h-32 text-black" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-none text-xs uppercase tracking-widest font-bold mb-6">
                                <Target className="w-4 h-4" /> Visi Kami
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-black mb-6 leading-tight italic">
                                "Menjadi Pilar Ekonomi Desa yang Mandiri, Inovatif, dan Berkelanjutan Berbasis Digital"
                            </h3>
                            <p className="text-black/80 leading-relaxed font-light">
                                Kami bercita-cita mewujudkan Desa Kalosi sebagai pusat pertumbuhan ekonomi baru yang memanfaatkan teknologi untuk kesejahteraan seluruh warga.
                            </p>
                        </div>
                    </div>

                    {/* Mission */}
                    <div
                        className="space-y-6"
                        data-aos="fade-left"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-primary" /> Misi Utama
                        </h3>
                        <div className="grid gap-4">
                            {[
                                {
                                    title: "Digitalisasi Ekonomi",
                                    desc: "Membangun ekosistem perdagangan digital yang inklusif bagi seluruh pelaku UMKM desa.",
                                    icon: <Lightbulb className="w-5 h-5 text-black" />
                                },
                                {
                                    title: "Pemberdayaan Masyarakat",
                                    desc: "Meningkatkan kapasitas SDM desa melalui pelatihan dan pendampingan usaha.",
                                    icon: <Users className="w-5 h-5 text-black" />
                                },
                                {
                                    title: "Optimasi Potensi Lokal",
                                    desc: "Mengelola dan memasarkan produk unggulan serta pariwisata desa ke pasar yang lebih luas.",
                                    icon: <Target className="w-5 h-5 text-black" />
                                }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-4 p-4 rounded-none bg-white border border-slate-200 hover:border-black transition-all group"
                                    data-aos="fade-up"
                                    data-aos-delay={idx * 100}
                                >
                                    <div className="shrink-0 w-12 h-12 rounded-none bg-white border border-slate-200 flex items-center justify-center shadow-none group-hover:border-black transition-colors">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-bold text-black mb-1 text-lg">{item.title}</h4>
                                        <p className="text-slate-600 text-sm font-light">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
