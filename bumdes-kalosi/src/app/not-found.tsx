import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileQuestion } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar forceOpaque={true} />

            <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">

                    <div className="relative mx-auto w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center">
                        <FileQuestion className="w-16 h-16 text-slate-500" />
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            404
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-serif font-bold text-slate-900">
                            Halaman Tidak Ditemukan
                        </h1>
                        <p className="text-slate-600">
                            Maaf, halaman yang Anda tuju mungkin telah dihapus, dipindahkan, atau tidak tersedia saat ini.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button asChild size="lg" className="rounded-none font-bold">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Beranda
                            </Link>
                        </Button>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}
