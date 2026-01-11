import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckoutContent } from "@/components/custom/CheckoutContent";

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar forceOpaque />
            <CheckoutContent />
            <Footer />
        </div>
    );
}
