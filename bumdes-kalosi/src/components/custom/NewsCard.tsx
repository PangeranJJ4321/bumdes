import Link from "next/link"
import { Calendar, User, Eye } from "lucide-react"

interface NewsCardProps {
    title: string
    excerpt: string
    date: string
    author: string
    imageUrl: string
    slug: string
    category?: string
    views?: number
}

const CATEGORY_COLORS: Record<string, string> = {
    "Inovasi": "bg-blue-500",
    "Kegiatan": "bg-emerald-500",
    "Wisata": "bg-indigo-500",
    "Edukasi": "bg-orange-500",
}

export function NewsCard({ title, excerpt, date, author, imageUrl, slug, category = "Umum", views = 0 }: NewsCardProps) {
    return (
        <Link href={`/berita/${slug}`} className="block h-full">
            <div
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 h-full flex flex-col"
                data-aos="fade-up"
            >
                <div className="relative overflow-hidden h-56 shrink-0">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                        <span className={`${CATEGORY_COLORS[category] || 'bg-primary'} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                            {category}
                        </span>
                    </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 transition line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-grow">
                        {excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            <span>{author}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
