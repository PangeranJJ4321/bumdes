"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "react-use-cart";
import { useState, useEffect } from "react";
import { Phone, MapPin, User, ShoppingBag, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, cartTotal, isEmpty } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        nama: "",
        noHp: "",
        alamatLengkap: "",
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (isEmpty) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                <Navbar forceOpaque />
                <main className="flex-grow flex flex-col items-center justify-center p-6">
                    <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/60">
                        <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="h-10 w-10 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900">Keranjang Masih Kosong</h2>
                            <p className="text-slate-500">Sepertinya Anda belum memilih produk atau layanan dari BUMDes Kalosi.</p>
                        </div>
                        <Button
                            onClick={() => router.push("/layanan")}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl transition-all"
                        >
                            Mulai Belanja
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nama || !formData.noHp || !formData.alamatLengkap) {
            toast.error("Mohon lengkapi semua data pengiriman.");
            return;
        }

        const adminPhone = "6282393318287";
        let message = `*PESANAN BARU - BUMDES KALOSI*\n`;
        message += `------------------------------------------\n\n`;
        message += `👤 *Data Pemesan:*\n`;
        message += `Nama: ${formData.nama}\n`;
        message += `No HP: ${formData.noHp}\n`;
        message += `Alamat: ${formData.alamatLengkap}\n\n`;

        message += `🛒 *Detail Pesanan:*\n`;
        items.forEach((item, index) => {
            message += `${index + 1}. ${item.title} (${item.quantity}x) - Rp ${(item.price * item.quantity!).toLocaleString('id-ID')}\n`;
        });

        message += `\n💰 *Total Tagihan: Rp ${cartTotal.toLocaleString('id-ID')}*\n\n`;
        message += `------------------------------------------\n`;
        message += `_Mohon segera dikonfirmasi ya Admin, Terima kasih!_`;

        const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            <Navbar forceOpaque />

            <main className="flex-grow pt-28 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Header & Breadcrumb */}
                        <div className="mb-10 text-center lg:text-left">
                            <Link href="/layanan" className="inline-flex items-center text-sm text-emerald-600 font-medium mb-4 hover:gap-2 transition-all gap-1">
                                <ArrowLeft className="w-4 h-4" /> Kembali ke Layanan
                            </Link>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
                            <p className="text-slate-500 mt-2">Selesaikan pesanan Anda dengan mengisi data di bawah ini.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            {/* Form Pengiriman */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="bg-emerald-100 p-2 rounded-lg">
                                            <MapPin className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-800">Informasi Pengiriman</h2>
                                    </div>

                                    <form className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="nama" className="text-slate-700 font-medium">Nama Lengkap</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="nama"
                                                        name="nama"
                                                        placeholder="Andi Wijaya"
                                                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all h-11 rounded-xl"
                                                        value={formData.nama}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="noHp" className="text-slate-700 font-medium">Nomor WhatsApp</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="noHp"
                                                        name="noHp"
                                                        type="tel"
                                                        placeholder="081234..."
                                                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all h-11 rounded-xl"
                                                        value={formData.noHp}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="alamatLengkap" className="text-slate-700 font-medium">Detail Alamat / Patokan (Bisa Shareloct di WA)</Label>
                                            <Textarea
                                                id="alamatLengkap"
                                                name="alamatLengkap"
                                                placeholder="Contoh: Rumah warna hijau depan masjid, Jl. Poros Kalosi..."
                                                className="resize-none h-28 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl p-4"
                                                value={formData.alamatLengkap}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </form>
                                </div>

                                {/* Payment Note */}
                                <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex gap-4">
                                    <CheckCircle2 className="h-6 w-6 text-blue-600 shrink-0" />
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        <strong>Metode Pembayaran:</strong> Untuk saat ini kami melayani pembayaran
                                        <strong> Cash on Delivery (COD)</strong> atau Transfer saat barang sampai.
                                        Admin akan mengonfirmasi total biaya melalui WhatsApp.
                                    </p>
                                </div>
                            </div>

                            {/* Ringkasan Pesanan */}
                            <div className="lg:col-span-5">
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 sticky top-28">
                                    <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                                        <ShoppingBag className="h-5 w-5 text-emerald-600" />
                                        Ringkasan Pesanan
                                    </h2>

                                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center group">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">{item.title}</span>
                                                    <span className="text-slate-400 text-xs font-medium">{item.quantity} Unit x Rp {item.price.toLocaleString('id-ID')}</span>
                                                </div>
                                                <span className="font-bold text-slate-900">
                                                    Rp {(item.price * item.quantity!).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-slate-100">
                                        <div className="flex justify-between items-center text-slate-500">
                                            <span className="text-sm">Subtotal</span>
                                            <span className="font-medium">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500">
                                            <span className="text-sm">Biaya Layanan</span>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">Gratis</span>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200">
                                            <span className="text-lg font-bold text-slate-900">Total</span>
                                            <span className="text-2xl font-black text-emerald-600">
                                                Rp {cartTotal.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full mt-8 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-extrabold h-14 rounded-2xl text-lg shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Send className="w-5 h-5 mr-3" />
                                        Pesan via WhatsApp
                                    </Button>

                                    <p className="text-[10px] text-center text-slate-400 mt-5 leading-relaxed uppercase tracking-wider font-semibold">
                                        Terjamin Aman • Layanan Desa Kalosi
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