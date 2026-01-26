"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "react-use-cart";
import { useState, useEffect } from "react";
import { Phone, MapPin, User, ShoppingBag, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldLabel,
    FieldContent,
    FieldError,
} from "@/components/ui/field";

import { checkoutSchema, CheckoutFormValues } from "@/lib/schemas";

export function CheckoutContent() {
    const { items, cartTotal, isEmpty, emptyCart, removeItem } = useCart();
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
            waOptIn: false,
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
            <main className="flex-grow flex flex-col items-center justify-center p-6 bg-slate-50">
                <div className="max-w-md w-full text-center space-y-6 bg-white p-10 border border-black shadow-none">
                    <div className="bg-black text-white w-24 h-24 flex items-center justify-center mx-auto mb-4 rounded-none">
                        <ShoppingBag className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-black uppercase tracking-wider">Keranjang Kosong</h2>
                        <p className="text-slate-500 font-mono text-sm tracking-wide">Belum ada item yang dipilih.</p>
                    </div>
                    <Button
                        onClick={() => router.push("/layanan")}
                        className="w-full bg-black hover:bg-slate-800 text-white h-12 rounded-none transition-all uppercase tracking-widest font-bold"
                    >
                        Mulai Belanja
                    </Button>
                </div>
            </main>
        );
    }

    // Group items by sellerPhone
    const groupedItems: Record<string, typeof items> = {};
    items.forEach(item => {
        const sellerPhone = (item as any).sellerPhone || "6282393318287"; // Fallback to default admin
        if (!groupedItems[sellerPhone]) {
            groupedItems[sellerPhone] = [];
        }
        groupedItems[sellerPhone].push(item);
    });

    const onSubmit = async (data: CheckoutFormValues, targetSellerPhone?: string) => {
        setIsSubmitting(true);

        // Filter items for this specific seller if targetSellerPhone is provided
        // If not provided (should not happen with new logic), it takes all items.
        // Actually, let's make targetSellerPhone required for the button interaction.
        if (!targetSellerPhone) return;

        const sellerItems = groupedItems[targetSellerPhone];
        const sellerTotal = sellerItems.reduce((acc, item) => acc + (item.price * (item.quantity ?? 1)), 0);


        try {
            // 1. Save to Database (We still save ONE order entry technically, or should we split?
            // For now, let's save a single order record but with ONLY these items to allow tracking per seller order?
            // OR save one big order and just message the seller with partial items.
            // Let's go with: Save the specific items being ordered as a "Order" record.
            // This means we might have multiple Order IDs if the user clicks both buttons.
            // This is actually better for tracking. Each click = One DB Order.
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: data.nama,
                    customerPhone: data.noHp,
                    customerAddress: data.alamatLengkap,
                    deliveryMethod: data.metodePengiriman,
                    items: sellerItems, // ONLY send items for this seller
                    totalPrice: sellerTotal,
                    notes: `Metode: ${data.metodePengiriman === 'COURIER' ? 'Diantar Kurir' : 'Ambil Sendiri'}`,
                    sellerPhone: targetSellerPhone,
                    waOptIn: data.waOptIn
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal membuat pesanan");
            }

            // Remove items from cart
            sellerItems.forEach(item => removeItem(item.id));

            // Success notification - NO REDIRECT
            toast.success("Pesanan berhasil dibuat! Notifikasi WhatsApp telah dikirim.");

            // Optional: Redirect to home or order history
            router.push('/');

        } catch (error: any) {
            console.error("Checkout Error:", error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false); // Using boolean or specific seller state
        }
    };


    // Wrapper to handle specific seller submission
    const handleSellerSubmit = (sellerPhone: string) => {
        handleSubmit((data) => {
            onSubmit(data, sellerPhone).then(() => {
                // After success, remove items for this seller
                if (groupedItems[sellerPhone]) {
                    groupedItems[sellerPhone].forEach(item => removeItem(item.id));
                }
                // If cart becomes empty, component will re-render and show empty state
            });
        })();
    };

    return (
        <main className="flex-grow pt-28 pb-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header & Breadcrumb */}
                    <div className="mb-10 lg:text-left">
                        <Link href="/layanan" className="inline-flex items-center text-sm text-slate-500 font-mono font-medium mb-4 hover:gap-2 hover:text-black transition-all gap-1 uppercase tracking-widest">
                            <ArrowLeft className="w-4 h-4" /> Kembali ke Layanan
                        </Link>
                        <h1 className="text-4xl font-serif font-bold text-black uppercase tracking-wider">Checkout</h1>
                        <p className="text-slate-500 mt-2 font-mono tracking-wide">Selesaikan pesanan Anda dengan mengisi data di bawah ini.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* Form Pengiriman */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-white p-8 border border-black rounded-none shadow-none">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-black text-white p-2 rounded-none">
                                        <MapPin className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-serif font-bold text-black uppercase tracking-wide">Informasi Pengiriman</h2>
                                </div>

                                <form id="checkout-form" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Field>
                                            <FieldLabel htmlFor="nama" className="text-black font-bold uppercase tracking-widest text-xs font-mono">Nama Lengkap</FieldLabel>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                                                <FieldContent>
                                                    <Input
                                                        id="nama"
                                                        placeholder="Masukan nama anda"
                                                        className="pl-10 bg-white border-black text-black transition-all h-12 rounded-none placeholder:text-slate-400 font-mono"
                                                        aria-invalid={!!errors.nama}
                                                        {...register("nama")}
                                                    />
                                                </FieldContent>
                                            </div>
                                            <FieldError errors={[{ message: errors.nama?.message }]} />
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="noHp" className="text-black font-bold uppercase tracking-widest text-xs font-mono">Nomor WhatsApp</FieldLabel>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                                                <FieldContent>
                                                    <Input
                                                        id="noHp"
                                                        type="tel"
                                                        placeholder="081234..."
                                                        className="pl-10 bg-white border-black text-black transition-all h-12 rounded-none placeholder:text-slate-400 font-mono"
                                                        aria-invalid={!!errors.noHp}
                                                        {...register("noHp")}
                                                    />
                                                </FieldContent>
                                            </div>
                                            <FieldError errors={[{ message: errors.noHp?.message }]} />
                                        </Field>
                                    </div>
                                    <div className="flex items-start space-x-3 pt-4 pb-2">
                                        <Checkbox
                                            id="waOptIn"
                                            checked={watch("waOptIn")}
                                            onCheckedChange={(checked) => setValue("waOptIn", checked as boolean)}
                                            className="mt-1"
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="waOptIn"
                                                className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-black"
                                            >
                                                Kirim notifikasi status pesanan via WhatsApp <span className="text-red-500">*</span>
                                                <span className="ml-2 inline-block bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                    Wajib
                                                </span>
                                            </label>
                                            <p className="text-xs text-slate-500 leading-normal">
                                                Centang agar kami bisa mengirim <strong className="text-black">Detail Pesanan</strong> & <strong className="text-black">Update Pengiriman</strong> Anda secara otomatis tanpa perlu chat manual.
                                            </p>
                                        </div>
                                    </div>
                                    {errors.waOptIn && <p className="text-xs font-medium text-destructive mt-1">{errors.waOptIn.message}</p>}

                                    <Field>
                                        <FieldLabel className="text-black font-bold uppercase tracking-widest text-xs font-mono">Metode Pengiriman</FieldLabel>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div
                                                className={`cursor-pointer border-2 rounded-none p-4 flex flex-col items-center justify-center gap-2 transition-all ${metodePengiriman === 'PICKUP' ? 'border-black bg-black text-white' : 'border-slate-200 text-slate-500 hover:border-black hover:text-black'}`}
                                                onClick={() => setValue('metodePengiriman', 'PICKUP')}
                                            >
                                                <ShoppingBag className={`h-6 w-6 ${metodePengiriman === 'PICKUP' ? 'text-white' : 'text-current'}`} />
                                                <span className={`font-bold uppercase tracking-wider text-xs ${metodePengiriman === 'PICKUP' ? 'text-white' : 'text-current'}`}>Ambil Sendiri</span>
                                            </div>
                                            <div
                                                className={`cursor-pointer border-2 rounded-none p-4 flex flex-col items-center justify-center gap-2 transition-all ${metodePengiriman === 'COURIER' ? 'border-black bg-black text-white' : 'border-slate-200 text-slate-500 hover:border-black hover:text-black'}`}
                                                onClick={() => setValue('metodePengiriman', 'COURIER')}
                                            >
                                                <div className="relative">
                                                    <MapPin className={`h-6 w-6 ${metodePengiriman === 'COURIER' ? 'text-white' : 'text-current'}`} />
                                                </div>
                                                <span className={`font-bold uppercase tracking-wider text-xs ${metodePengiriman === 'COURIER' ? 'text-white' : 'text-current'}`}>Diantar Kurir</span>
                                            </div>
                                        </div>
                                    </Field>

                                    {metodePengiriman === 'COURIER' && (
                                        <Field>
                                            <FieldLabel htmlFor="alamatLengkap" className="text-black font-bold uppercase tracking-widest text-xs font-mono">Detail Alamat / Patokan</FieldLabel>
                                            <FieldContent>
                                                <Textarea
                                                    id="alamatLengkap"
                                                    placeholder="Contoh: Rumah warna hijau depan masjid, Jl. Poros Kalosi..."
                                                    className="resize-none h-24 bg-white border-black text-black  transition-all rounded-none p-4 placeholder:text-slate-400 font-mono"
                                                    aria-invalid={!!errors.alamatLengkap}
                                                    {...register("alamatLengkap")}
                                                />
                                            </FieldContent>
                                            <FieldError errors={[{ message: errors.alamatLengkap?.message }]} />
                                        </Field>
                                    )}
                                </form>
                            </div>

                            {/* Payment Note */}
                            <div className="bg-slate-50 border border-slate-200 p-5 rounded-none flex gap-4">
                                <CheckCircle2 className="h-6 w-6 text-black shrink-0" />
                                <p className="text-sm text-slate-600 leading-relaxed font-mono">
                                    <strong className="text-black">Metode Pembayaran:</strong> Pembayaran dilakukan via
                                    <strong className="text-black"> Cash on Delivery (COD)</strong> atau Transfer saat barang diterima.
                                    Admin akan mengonfirmasi total biaya (+ ongkir jika kurir) via WhatsApp.
                                </p>
                            </div>
                        </div>

                        {/* Ringkasan Pesanan (Iterate per Seller) */}
                        <div className="lg:col-span-5 space-y-8">
                            {Object.entries(groupedItems).map(([sellerPhone, sellerItems], idx) => {
                                const sellerTotal = sellerItems.reduce((acc, item) => acc + (item.price * (item.quantity ?? 1)), 0);
                                const isMultiSeller = Object.keys(groupedItems).length > 1;

                                return (
                                    <div key={sellerPhone} className="bg-white p-8 border border-black rounded-none shadow-none">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-serif font-bold text-black uppercase tracking-wide flex items-center gap-2">
                                                <ShoppingBag className="h-5 w-5 text-black" />
                                                {isMultiSeller ? `Pesanan #${idx + 1}` : 'Ringkasan'}
                                            </h2>
                                            <span className="bg-black text-white px-3 py-1 rounded-none text-xs font-mono font-bold">{sellerItems.length} Item</span>
                                        </div>

                                        {/* Items List */}
                                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
                                            {sellerItems.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center group py-2 border-b border-dashed border-slate-200 last:border-0">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-black font-serif uppercase tracking-tight">{item.title}</span>
                                                        <span className="text-slate-500 text-xs font-mono">{item.quantity} Unit x Rp {item.price.toLocaleString('id-ID')}</span>
                                                    </div>
                                                    <span className="font-bold text-black font-mono">
                                                        Rp {(item.price * item.quantity!).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-black">
                                            <div className="flex justify-between items-center text-slate-600 font-mono text-sm">
                                                <span className="uppercase tracking-wide">Subtotal</span>
                                                <span className="font-bold text-black">Rp {sellerTotal.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-slate-600 font-mono text-sm">
                                                <span className="uppercase tracking-wide">Biaya Pengiriman</span>
                                                {metodePengiriman === 'COURIER' ? (
                                                    <span className="text-xs font-bold text-black bg-slate-100 px-2 py-1 rounded-none uppercase">Info via WA</span>
                                                ) : (
                                                    <span className="text-xs font-bold text-white bg-black px-2 py-1 rounded-none uppercase">Gratis</span>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-dashed border-black">
                                                <span className="text-lg font-serif font-bold text-black uppercase tracking-wider">Total</span>
                                                <span className="text-2xl font-black text-black">
                                                    Rp {sellerTotal.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={() => handleSellerSubmit(sellerPhone)}
                                            disabled={isSubmitting}
                                            className="w-full mt-8 bg-black hover:bg-slate-800 text-white font-bold h-14 rounded-none text-lg shadow-none transition-all uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed border border-black hover:border-slate-800"
                                        >
                                            {isSubmitting ? (
                                                "Memproses..."
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 mr-3" />
                                                    Pesan ke Penjual {isMultiSeller ? `#${idx + 1}` : ''}
                                                </>
                                            )}
                                        </Button>

                                        <p className="text-[10px] text-center text-slate-400 mt-5 leading-relaxed uppercase tracking-wider font-bold font-mono">
                                            Terjamin Aman • Layanan Desa Kalosi
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
