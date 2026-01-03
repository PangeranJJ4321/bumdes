"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/custom/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea exists based on file list
import { useCart } from "react-use-cart";
import { useState, useEffect } from "react";
import { Phone, MapPin, User, ShoppingBag, Send } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, cartTotal, isEmpty } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Form Stats
    const [formData, setFormData] = useState({
        nama: "",
        noHp: "",
        dusun: "",
        alamatLengkap: "",
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) return null;

    if (isEmpty) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center p-4">
                    <div className="text-center space-y-4">
                        <div className="bg-slate-100 p-6 rounded-full inline-block">
                            <ShoppingBag className="h-12 w-12 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Keranjang Kosong</h2>
                        <p className="text-muted-foreground">Anda belum memilih produk apapun.</p>
                        <Button onClick={() => router.push("/layanan")}>
                            Kembali Belanja
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, dusun: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.nama || !formData.noHp || !formData.dusun || !formData.alamatLengkap) {
            toast.error("Mohon lengkapi semua data diri Anda.");
            return;
        }

        // WhatsApp Logic
        const adminPhone = "6285255887755"; // Replace with actual admin number if known, otherwise placeholder

        let message = `Halo Admin BUMDes Kalosi, saya ingin memesan:\n\n`;
        message += `*Data Pemesan:*\n`;
        message += `Nama: ${formData.nama}\n`;
        message += `No HP: ${formData.noHp}\n`;
        message += `Alamat: ${formData.dusun} - ${formData.alamatLengkap}\n\n`;

        message += `*Detail Pesanan:*\n`;
        items.forEach((item, index) => {
            message += `${index + 1}. ${item.title} (${item.quantity}x) - Rp ${(item.price * item.quantity!).toLocaleString('id-ID')}\n`;
        });

        message += `\n*Total Tagihan: Rp ${cartTotal.toLocaleString('id-ID')}*`;
        message += `\n\nMohon diproses, terima kasih.`;

        const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar forceOpaque />
            <main className="flex-grow pt-20 pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8 text-slate-900">Checkout Pesanan</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Form */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800">
                                        <User className="h-5 w-5 text-emerald-600" />
                                        Data Diri & Alamat
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nama">Nama Lengkap</Label>
                                            <Input
                                                id="nama"
                                                name="nama"
                                                placeholder="Contoh: Andi Wijaya"
                                                value={formData.nama}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="noHp">Nomor WhatsApp / HP</Label>
                                            <Input
                                                id="noHp"
                                                name="noHp"
                                                type="tel"
                                                placeholder="Contoh: 081234567890"
                                                value={formData.noHp}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dusun">Dusun / Wilayah</Label>
                                            <Select onValueChange={handleSelectChange} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Dusun" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Kalosi">Kalosi</SelectItem>
                                                    <SelectItem value="Killa">Killa</SelectItem>
                                                    <SelectItem value="Tondok Kalua">Tondok Kalua</SelectItem>
                                                    {/* Add more dusun as needed */}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="alamatLengkap">Alamat Lengkap</Label>
                                            <Textarea
                                                id="alamatLengkap"
                                                name="alamatLengkap"
                                                placeholder="Contoh: Jl. Poros Kalosi, dekat Mesjid Raya..."
                                                className="resize-none h-24"
                                                value={formData.alamatLengkap}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Right Column: Order Summary */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800">
                                        <ShoppingBag className="h-5 w-5 text-emerald-600" />
                                        Ringkasan Pesanan
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-start text-sm">
                                                <div className="space-y-1">
                                                    <span className="font-medium text-slate-700 block">{item.title}</span>
                                                    <span className="text-slate-500 text-xs">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                                                </div>
                                                <span className="font-semibold text-slate-900">
                                                    Rp {(item.price * item.quantity!).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-100 pt-4 space-y-3">
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Subtotal</span>
                                            <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-lg font-bold text-slate-900 border-t border-dashed border-slate-200 pt-3">
                                            <span>Total Pembayaran</span>
                                            <span className="text-emerald-600">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full mt-6 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12 text-base shadow-lg shadow-emerald-500/20"
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Pesan Sekarang via WhatsApp
                                    </Button>

                                    <p className="text-xs text-center text-slate-400 mt-4">
                                        Anda akan diarahkan ke WhatsApp Admin untuk konfirmasi pesanan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
