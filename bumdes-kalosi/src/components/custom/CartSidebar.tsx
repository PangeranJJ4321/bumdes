"use client";

import { useCart } from "react-use-cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingCart, Package, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CartSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
    const { isEmpty, items, updateItemQuantity, removeItem, cartTotal, emptyCart } = useCart();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:w-[480px] flex flex-col p-0 bg-white border-l shadow-2xl">
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="bg-gradient-to-br from-blue-500 to-sky-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                                    <ShoppingCart className="h-5 w-5 text-white" />
                                </div>
                                {!isEmpty && (
                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                                        {items.length}
                                    </div>
                                )}
                            </div>
                            <div>
                                <SheetTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                    Keranjang Belanja
                                </SheetTitle>
                                {!isEmpty && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {items.length} item dalam keranjang
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/50">
                    {isEmpty ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-sky-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-3xl border-2 border-slate-200/50">
                                    <Package className="h-20 w-20 text-slate-300" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg text-slate-900">Keranjang Masih Kosong</h3>
                                <p className="text-sm text-muted-foreground max-w-[250px]">
                                    Yuk mulai belanja dan temukan produk favoritmu!
                                </p>
                            </div>
                            <Button
                                className="bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-lg shadow-blue-500/20 group"
                                onClick={() => onOpenChange(false)}
                            >
                                <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                                Mulai Belanja
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group relative flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200/60 transition-all duration-300"
                                    style={{
                                        animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`
                                    }}
                                >
                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-200/60 group-hover:border-blue-200/60 transition-colors">
                                        <img
                                            src={item.imageUrl as string}
                                            alt={item.title as string}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-tight">
                                                {item.title}
                                            </h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-all duration-200 hover:scale-110"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between mt-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground">
                                                    Rp {item.price.toLocaleString('id-ID')} × {item.quantity}
                                                </span>
                                                <span className="font-bold text-base bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                                                    Rp {(item.price * item.quantity!).toLocaleString('id-ID')}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
                                                <button
                                                    onClick={() => updateItemQuantity(item.id, (item.quantity ?? 1) - 1)}
                                                    className="hover:text-blue-600 transition-colors disabled:opacity-30 disabled:hover:text-current hover:scale-110 active:scale-95"
                                                    disabled={item.quantity === 1}
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="text-sm font-bold w-6 text-center text-slate-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateItemQuantity(item.id, (item.quantity ?? 1) + 1)}
                                                    className="hover:text-blue-600 transition-colors hover:scale-110 active:scale-95"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!isEmpty && (
                    <div className="px-6 pb-6 pt-4 space-y-4 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="space-y-3 p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200/50">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 font-medium">Subtotal</span>
                                <span className="font-semibold text-slate-900">
                                    Rp {cartTotal.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-slate-900">Total Pembayaran</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                                    Rp {cartTotal.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="w-full border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 font-semibold transition-all duration-200"
                                onClick={() => emptyCart()}
                            >
                                Kosongkan
                            </Button>
                            <Button
                                className="w-full bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                                asChild
                            >
                                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                                    Checkout Sekarang
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}

                <style jsx global>{`
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateX(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                `}</style>
            </SheetContent>
        </Sheet>
    );
}