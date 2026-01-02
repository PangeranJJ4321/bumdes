import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-muted/50 border-t pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-primary">BUMDes Sumber Kalosi</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Menggerakkan ekonomi desa melalui inovasi digital.
                            Nikmati kuliner lezat dan wisata seru di satu tempat.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Unit Usaha</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#kuliner" className="hover:text-primary transition-colors">Food Court</Link></li>
                            <li><Link href="#wisata" className="hover:text-primary transition-colors">Wisata Malam</Link></li>
                            <li><Link href="#mart" className="hover:text-primary transition-colors">BUMDes Mart</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Perikanan</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Kontak</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Desa Kalosi, Enrekang</li>
                            <li>WhatsApp: +62 812-3456-7890</li>
                            <li>Email: bumdes@kalosi.desa.id</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Jam Operasional</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex justify-between"><span>Senin - Jumat</span> <span>08:00 - 22:00</span></li>
                            <li className="flex justify-between"><span>Sabtu - Minggu</span> <span>08:00 - 23:00</span></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-6 text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} BUMDes Sumber Kalosi. All rights reserved.</p>
                    <p className="mt-1">Built with ❤️ for KKN Desa Kalosi</p>
                </div>
            </div>
        </footer>
    )
}
