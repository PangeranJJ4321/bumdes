"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useCart } from "react-use-cart"
import { CartSidebar } from "@/components/custom/CartSidebar"


interface NavbarProps {
    forceOpaque?: boolean;
}

export function Navbar({ forceOpaque = false }: NavbarProps) {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [isCartOpen, setIsCartOpen] = React.useState(false)
    const { totalItems } = useCart()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const showOpaque = isScrolled || forceOpaque

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-300",
                    showOpaque
                        ? "bg-background/80 backdrop-blur-md border-b shadow-sm h-20"
                        : "bg-transparent h-24"
                )}
            >
                <div className="container mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 shrink-0">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/logo-sidrap.png"
                                    alt="Logo Desa Kalosi"
                                    fill
                                    sizes="100px"
                                    className="object-contain"
                                />
                            </div>
                            <span className={cn(
                                "font-serif text-2xl font-bold tracking-tight hidden lg:block",
                                showOpaque ? "text-black" : "text-white"
                            )}>
                                BUMDes Sumber Kalosi
                            </span>
                            <span className={cn(
                                "font-serif text-2xl font-bold tracking-tight lg:hidden",
                                showOpaque ? "text-black" : "text-white"
                            )}>
                                BUMDes Kalosi
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
                            {[
                                { name: "Beranda", href: "/" },
                                { name: "Tentang Kami", href: "/tentang-kami" },
                                { name: "Layanan & Produk", href: "/layanan" },
                                { name: "Berita", href: "/berita" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "text-xs font-bold uppercase tracking-widest transition-colors hover:text-black whitespace-nowrap",
                                        showOpaque ? "text-black/70" : "text-white/90 hover:text-white"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-4 justify-end">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "relative rounded-none h-10 w-10",
                                    showOpaque ? "text-black" : "text-white hover:bg-white/10 hover:text-white"
                                )}
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingCart className="h-6 w-6" />
                                {mounted && (totalItems ?? 0) > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-none bg-black text-[10px] font-bold text-white animate-in zoom-in">
                                        {totalItems}
                                    </span>
                                )}
                            </Button>

                            {/* Mobile Menu */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className={cn(
                                        "md:hidden h-10 w-10",
                                        showOpaque ? "text-black" : "text-white hover:bg-white/20 hover:text-white"
                                    )}>
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                    <SheetHeader className="text-left mb-8">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="relative w-10 h-10">
                                                <Image
                                                    src="/logo-sidrap.png"
                                                    alt="Logo Desa Kalosi"
                                                    fill
                                                    sizes="100px"
                                                    className="object-contain"
                                                />
                                            </div>
                                            <SheetTitle className="font-serif text-2xl font-bold">BUMDes Sumber Kalosi</SheetTitle>
                                        </div>
                                        <SheetDescription>
                                            Jelajahi layanan dan informasi kami
                                        </SheetDescription>
                                    </SheetHeader>
                                    <nav className="flex flex-col gap-2">
                                        {[
                                            { name: "Beranda", href: "/" },
                                            { name: "Tentang Kami", href: "/tentang-kami" },
                                            { name: "Berita", href: "/berita" },
                                            { name: "Layanan", href: "/layanan" },
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="px-4 py-3 rounded-none font-serif text-lg hover:bg-slate-100 transition-colors border-b border-slate-100 last:border-0"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            <CartSidebar open={isCartOpen} onOpenChange={setIsCartOpen} />
        </>
    )
}