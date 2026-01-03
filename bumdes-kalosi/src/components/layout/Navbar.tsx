"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full md:grid md:grid-cols-3">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                            K
                        </div>
                        <span className={cn(
                            "font-bold text-lg tracking-tight",
                            isScrolled ? "text-foreground" : "text-white"
                        )}>
                            BUMDes Kalosi
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center justify-center gap-8">
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
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    isScrolled ? "text-foreground/80" : "text-white/90 hover:text-white"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4 justify-end">
                        <Button variant="ghost" size="icon" className={cn(
                            "relative",
                            isScrolled ? "text-foreground" : "text-white hover:bg-white/20 hover:text-white"
                        )}>
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                                0
                            </span>
                        </Button>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className={cn(
                                    "md:hidden",
                                    isScrolled ? "text-foreground" : "text-white hover:bg-white/20 hover:text-white"
                                )}>
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader className="text-left mb-8">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                                            K
                                        </div>
                                        <SheetTitle className="text-xl">BUMDes Kalosi</SheetTitle>
                                    </div>
                                    <SheetDescription>
                                        Jelajahi layanan dan informasi kami
                                    </SheetDescription>
                                </SheetHeader>
                                <nav className="flex flex-col gap-1">
                                    {[
                                        { name: "Beranda", href: "/" },
                                        { name: "Tentang Kami", href: "/tentang-kami" },
                                        { name: "Berita", href: "/berita" },
                                        { name: "Layanan", href: "/layanan" },
                                    ].map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="px-4 py-3 rounded-lg font-medium text-base hover:bg-accent transition-colors"
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
    )
}