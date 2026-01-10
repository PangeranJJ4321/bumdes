import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { NewsFeed } from "@/components/custom/NewsFeed"

export default function BeritaPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <NewsFeed />
            <Footer />
        </div>
    )
}
