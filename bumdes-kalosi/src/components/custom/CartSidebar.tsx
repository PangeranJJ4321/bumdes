"use client";

import { useCart } from "react-use-cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingCart, X, ArrowRight } from "lucide-react";
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
            <SheetContent className="w-full sm:w-[500px] flex flex-col p-0 bg-white border-l border-black rounded-none">
                <SheetHeader className="px-6 py-6 border-b border-black bg-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-black p-2 rounded-none">
                                <ShoppingCart className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <SheetTitle className="text-xl font-serif font-bold text-black uppercase tracking-wider">
                                    Keranjang
                                </SheetTitle>
                                {!isEmpty && (
                                    <p className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-widest">
                                        {items.length} Item
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-none hover:bg-black hover:text-white transition-colors"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
                    {isEmpty ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-8 border-2 border-dashed border-slate-200">
                            <div className="p-6 border-2 border-black rounded-none bg-slate-50">
                                <ShoppingCart className="h-12 w-12 text-black" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-serif font-bold text-2xl text-black">Keranjang Kosong</h3>
                                <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">
                                    Belum ada produk yang dipilih
                                </p>
                            </div>
                            <Button
                                className="bg-black text-white rounded-none hover:bg-slate-800 px-8"
                                asChild
                            >
                                <Link href="/layanan" onClick={() => onOpenChange(false)}>
                                    Mulai Belanja
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group relative flex gap-4 p-4 border border-slate-200 hover:border-black transition-colors bg-white rounded-none"
                                >
                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-slate-100 border border-slate-200 rounded-none">
                                        <img
                                            src={item.imageUrl as string}
                                            alt={item.title as string}
                                            className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-serif font-bold text-base text-black line-clamp-2 leading-tight">
                                                {item.title}
                                            </h3>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-6 w-6 rounded-none"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        <div className="flex items-end justify-between mt-3">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs font-mono text-slate-500">
                                                    {item.price.toLocaleString('id-ID')}
                                                </span>
                                                <span className="font-bold text-base text-black">
                                                    Rp {(item.price * item.quantity!).toLocaleString('id-ID')}
                                                </span>
                                            </div>

                                            <div className="flex items-center border border-black rounded-none">
                                                <button
                                                    onClick={() => updateItemQuantity(item.id, (item.quantity ?? 1) - 1)}
                                                    className="p-1 px-2 hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
                                                    disabled={item.quantity === 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-sm font-bold w-8 text-center border-x border-black h-full flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateItemQuantity(item.id, (item.quantity ?? 1) + 1)}
                                                    className="p-1 px-2 hover:bg-black hover:text-white transition-colors"
                                                >
                                                    <Plus className="h-3 w-3" />
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
                    <div className="px-6 pb-6 pt-6 border-t font-serif border-black bg-slate-50">
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between text-sm uppercase tracking-wider text-slate-600">
                                <span>Subtotal</span>
                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="h-px bg-slate-200"></div>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-lg text-black uppercase tracking-wider">Total</span>
                                <span className="font-bold text-xl text-black">
                                    Rp {cartTotal.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                className="w-full bg-black text-white hover:bg-slate-800 rounded-none h-12 uppercase tracking-widest font-bold flex items-center justify-center gap-2 px-6 group"
                                asChild
                            >
                                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                                    <span>Checkout</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full rounded-none h-10 text-xs uppercase tracking-widest"
                                onClick={() => emptyCart()}
                            >
                                Kosongkan Keranjang
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}