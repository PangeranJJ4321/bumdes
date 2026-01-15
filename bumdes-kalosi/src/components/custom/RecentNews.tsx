
import { SectionHeader } from "@/components/custom/SectionHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/server/db";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export async function RecentNews() {
    const newsList = await prisma.news.findMany({
        take: 3,
        orderBy: {
            publishedAt: 'desc',
        },
    });

    if (newsList.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Berita Terkini"
                    subtitle="Informasi terbaru seputar kegiatan dan perkembangan BUMDes Kalosi"
                    align="center"
                    className="mb-12"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {newsList.map((news) => (
                        <div key={news.id} className="group border-b border-black/10 hover:border-black transition-all duration-500 flex flex-col h-full bg-white pb-6">
                            <div className="relative h-48 w-full overflow-hidden">
                                {news.thumbnail ? (
                                    <Image
                                        src={news.thumbnail}
                                        alt={news.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{format(news.publishedAt, "d MMMM yyyy", { locale: id })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>{news.author}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {news.title}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                    {news.content.replace(/<[^>]*>?/gm, "")}
                                </p>
                                <Link href={`/berita/${news.slug}`} className="inline-flex items-center text-primary font-semibold text-sm hover:underline">
                                    Baca Selengkapnya
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/berita">
                        <Button variant="outline" className="rounded-none px-8 border-black text-black hover:bg-black hover:text-white transition-colors h-12">
                            Lihat Semua Berita <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
