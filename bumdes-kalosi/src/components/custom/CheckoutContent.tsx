"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "react-use-cart";
import { useState, useEffect } from "react";
import { Phone, MapPin, User, ShoppingBag, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldLabel,
    FieldContent,
    FieldError,
} from "@/components/ui/field";

import { checkoutSchema, CheckoutFormValues } from "@/lib/schemas";

export function CheckoutContent() {
    const { items, cartTotal, isEmpty, emptyCart } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            nama: "",
            noHp: "",
            alamatLengkap: "",
            metodePengiriman: "PICKUP",
        },
    });

    const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
    const metodePengiriman = watch("metodePengiriman");

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (isEmpty) {
        return (
            <main className="flex-grow flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/60">
                    <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">Keranjang Masih Kosong</h2>
                        <p className="text-slate-500">Sepertinya Anda belum memilih produk atau layanan dari BUMDes Kalosi.</p>
                    </div>
                    <Button
                        onClick={() => router.push("/layanan")}
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl transition-all"
                    >
                        Mulai Belanja
                    </Button>
                </div>
            </main>
        );
    }

    const onSubmit = async (data: CheckoutFormValues) => {
        setIsSubmitting(true);

        try {
            // 1. Save to Database
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: data.nama,
                    customerPhone: data.noHp,
                    customerAddress: data.alamatLengkap,
                    deliveryMethod: data.metodePengiriman,
                    items: items,
                    totalPrice: cartTotal,
                    notes: `Metode: ${data.metodePengiriman === 'COURIER' ? 'Diantar Kurir' : 'Ambil Sendiri'}`
                })
            });

            const resData = await response.json();

            if (!resData.success) {
                toast.error("Gagal memproses pesanan: " + resData.message);
                setIsSubmitting(false);
                return;
            }

            // 2. Redirect to WhatsApp
            const adminPhone = "6282393318287";
            const orderIdShort = resData.orderId.substring(0, 8).toUpperCase();

            let message = `*PESANAN BARU - BUMDES KALOSI*\n`;
            message += `#ORDER ID: ${orderIdShort}\n`;
            message += `------------------------------------------\n\n`;
            message += `👤 *Data Pemesan:*\n`;
            message += `Nama: ${data.nama}\n`;
            message += `No HP: ${data.noHp}\n`;
            message += `Alamat: ${data.alamatLengkap || "-"}\n`;
            message += `Metode: ${data.metodePengiriman === 'COURIER' ? '🚚 Diantar Kurir' : '🏪 Ambil Sendiri'}\n\n`;

            message += `🛒 *Detail Pesanan:*\n`;
            items.forEach((item, index) => {
                message += `${index + 1}. ${item.title} (${item.quantity}x) - Rp ${(item.price * item.quantity!).toLocaleString('id-ID')}\n`;
            });

            message += `\n💰 *Total Tagihan: Rp ${cartTotal.toLocaleString('id-ID')}*\n\n`;
            message += `------------------------------------------\n`;
            message += `_Mohon segera dikonfirmasi ya Admin, Terima kasih!_`;

            const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

            // Clear cart and redirect
            emptyCart();
            window.open(waUrl, '_blank');
            router.push("/"); // Back to home or success page
            toast.success("Pesanan berhasil dibuat!");

        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-grow pt-28 pb-16">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header & Breadcrumb */}
                    <div className="mb-10 lg:text-left">
                        <Link href="/layanan" className="inline-flex items-center text-sm text-primary font-medium mb-4 hover:gap-2 transition-all gap-1">
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
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800">Informasi Pengiriman</h2>
                                </div>

                                <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Field>
                                            <FieldLabel htmlFor="nama" className="text-slate-700 font-medium">Nama Lengkap</FieldLabel>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                                                <FieldContent>
                                                    <Input
                                                        id="nama"
                                                        placeholder="Masukan nama anda"
                                                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all h-11 rounded-xl"
                                                        {...register("nama")}
                                                    />
                                                </FieldContent>
                                            </div>
                                            <FieldError errors={[{ message: errors.nama?.message }]} />
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="noHp" className="text-slate-700 font-medium">Nomor WhatsApp</FieldLabel>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                                                <FieldContent>
                                                    <Input
                                                        id="noHp"
                                                        type="tel"
                                                        placeholder="081234..."
                                                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all h-11 rounded-xl"
                                                        {...register("noHp")}
                                                    />
                                                </FieldContent>
                                            </div>
                                            <FieldError errors={[{ message: errors.noHp?.message }]} />
                                        </Field>
                                    </div>

                                    <Field>
                                        <FieldLabel className="text-slate-700 font-medium">Metode Pengiriman</FieldLabel>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div
                                                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${metodePengiriman === 'PICKUP' ? 'border-primary bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                                                onClick={() => setValue('metodePengiriman', 'PICKUP')}
                                            >
                                                <ShoppingBag className={`h-6 w-6 ${metodePengiriman === 'PICKUP' ? 'text-primary' : 'text-slate-400'}`} />
                                                <span className={`font-semibold ${metodePengiriman === 'PICKUP' ? 'text-primary' : 'text-slate-600'}`}>Ambil Sendiri</span>
                                            </div>
                                            <div
                                                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${metodePengiriman === 'COURIER' ? 'border-primary bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                                                onClick={() => setValue('metodePengiriman', 'COURIER')}
                                            >
                                                <div className="relative">
                                                    <MapPin className={`h-6 w-6 ${metodePengiriman === 'COURIER' ? 'text-primary' : 'text-slate-400'}`} />
                                                    {metodePengiriman === 'COURIER' && <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-500" />}
                                                </div>
                                                <span className={`font-semibold ${metodePengiriman === 'COURIER' ? 'text-primary' : 'text-slate-600'}`}>Diantar Kurir</span>
                                            </div>
                                        </div>
                                    </Field>

                                    {metodePengiriman === 'COURIER' && (
                                        <Field>
                                            <FieldLabel htmlFor="alamatLengkap" className="text-slate-700 font-medium">Detail Alamat / Patokan</FieldLabel>
                                            <FieldContent>
                                                <Textarea
                                                    id="alamatLengkap"
                                                    placeholder="Contoh: Rumah warna hijau depan masjid, Jl. Poros Kalosi..."
                                                    className="resize-none h-24 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl p-4"
                                                    {...register("alamatLengkap")}
                                                />
                                            </FieldContent>
                                            <FieldError errors={[{ message: errors.alamatLengkap?.message }]} />
                                        </Field>
                                    )}
                                </form>
                            </div>

                            {/* Payment Note */}
                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex gap-4">
                                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                                <p className="text-sm text-blue-900 leading-relaxed">
                                    <strong>Metode Pembayaran:</strong> Pembayaran dilakukan via
                                    <strong> Cash on Delivery (COD)</strong> atau Transfer saat barang diterima.
                                    Admin akan mengonfirmasi total biaya (+ ongkir jika kurir) via WhatsApp.
                                </p>
                            </div>
                        </div>

                        {/* Ringkasan Pesanan */}
                        <div className="lg:col-span-5">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 sticky top-28">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <ShoppingBag className="h-5 w-5 text-primary" />
                                        Ringkasan
                                    </h2>
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{items.length} Item</span>
                                </div>

                                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center group">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors">{item.title}</span>
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
                                        <span className="text-sm">Biaya Pengiriman</span>
                                        {metodePengiriman === 'COURIER' ? (
                                            <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 rounded-full">Info via WA</span>
                                        ) : (
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">Gratis</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200">
                                        <span className="text-lg font-bold text-slate-900">Total</span>
                                        <span className="text-2xl font-black text-primary">
                                            Rp {cartTotal.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isSubmitting}
                                    className="w-full mt-8 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-extrabold h-14 rounded-2xl text-lg shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        "Memproses..."
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-3" />
                                            Pesan via WhatsApp
                                        </>
                                    )}
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
    );
}
