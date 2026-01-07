"use client";

import { Target, Lightbulb, TrendingUp, Users } from "lucide-react";

export function VisionMission() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Vision */}
                    <div
                        className="bg-blue-50 rounded-3xl p-8 border border-blue-100 relative overflow-hidden group"
                        data-aos="fade-right"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Lightbulb className="w-32 h-32 text-blue-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                                <Target className="w-4 h-4" /> Visi Kami
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
                                "Menjadi Pilar Ekonomi Desa yang Mandiri, Inovatif, dan Berkelanjutan Berbasis Digital"
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
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
                                    icon: <Lightbulb className="w-5 h-5 text-amber-500" />
                                },
                                {
                                    title: "Pemberdayaan Masyarakat",
                                    desc: "Meningkatkan kapasitas SDM desa melalui pelatihan dan pendampingan usaha.",
                                    icon: <Users className="w-5 h-5 text-blue-500" />
                                },
                                {
                                    title: "Optimasi Potensi Lokal",
                                    desc: "Mengelola dan memasarkan produk unggulan serta pariwisata desa ke pasar yang lebih luas.",
                                    icon: <Target className="w-5 h-5 text-blue-500" />
                                }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-4 p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:shadow-md transition-all group"
                                    data-aos="fade-up"
                                    data-aos-delay={idx * 100}
                                >
                                    <div className="shrink-0 w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                                        <p className="text-slate-600 text-sm">{item.desc}</p>
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
