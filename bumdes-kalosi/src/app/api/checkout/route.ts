
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

import { sendWhatsapp } from "@/lib/fonnte";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("[Checkout API] Request received:", {
            customerName: body.customerName,
            itemCount: body.items?.length,
            totalPrice: body.totalPrice,
            sellerPhone: body.sellerPhone
        });

        const {
            customerName,
            customerPhone,
            customerAddress,
            deliveryMethod,
            items,
            totalPrice,
            notes,
            sellerPhone // Receive sellerPhone explicitly
        } = body;

        // Basic validation
        if (!customerName || !customerPhone || !items || !totalPrice) {
            console.warn("[Checkout API] Missing required fields");
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create Order in Database
        try {
            const order = await prisma.order.create({
                data: {
                    customerName,
                    customerPhone,
                    customerAddress: customerAddress || "-",
                    deliveryMethod: deliveryMethod || "PICKUP",
                    items: items,
                    totalPrice: Number(totalPrice),
                    status: "PENDING",
                    notes: notes,
                    itemsDetail: {
                        create: items.map((item: any) => ({
                            productId: item.id,
                            quantity: Number(item.quantity),
                            price: Number(item.price)
                        }))
                    }
                }
            });

            console.log("[Checkout API] Order created successfully:", order.id);

            // --- FONNTE NOTIFICATION START ---

            // 1. Send Message to SELLER (Staff)
            if (sellerPhone) {
                const orderIdShort = order.id.substring(0, 8).toUpperCase();
                let sellerMsg = `*PESANAN BARU - BUMDES KALOSI*\n`;
                sellerMsg += `#ORDER ID: ${orderIdShort}\n`;
                sellerMsg += `------------------------------------------\n\n`;
                sellerMsg += `👤 *Data Pemesan:*\n`;
                sellerMsg += `Nama: ${customerName}\n`;
                sellerMsg += `No HP: ${customerPhone}\n`;
                sellerMsg += `Alamat: ${customerAddress || "-"}\n`;
                sellerMsg += `Metode: ${deliveryMethod === 'COURIER' ? '🚚 Diantar Kurir' : '🏪 Ambil Sendiri'}\n\n`;

                sellerMsg += `🛒 *Detail Pesanan:*\n`;
                items.forEach((item: any, index: number) => {
                    sellerMsg += `${index + 1}. ${item.title} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
                });

                sellerMsg += `\n💰 *Total Tagihan: Rp ${Number(totalPrice).toLocaleString('id-ID')}*\n\n`;
                sellerMsg += `------------------------------------------\n`;
                sellerMsg += `Mohon segera diproses ya!`;

                await sendWhatsapp(sellerPhone, sellerMsg);
            }

            // 2. Send Message to BUYER (Customer)
            if (customerPhone) {
                let buyerMsg = `Halo Kak ${customerName}, terima kasih sudah berbelanja di BUMDes Kalosi! 🎉\n\n`;
                buyerMsg += `Berikut detail pesanan kakak:\n`;

                items.forEach((item: any, index: number) => {
                    buyerMsg += `${index + 1}. ${item.title} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
                });

                buyerMsg += `\n💰 *Total Tagihan: Rp ${Number(totalPrice).toLocaleString('id-ID')}*\n\n`;

                buyerMsg += `Pesanan kakak sedang kami proses.\n`;
                buyerMsg += `Admin kami akan segera menghubungi kakak untuk konfirmasi pembayaran dan ${deliveryMethod === 'COURIER' ? 'pengiriman' : 'pengambilan barang'}.\n\n`;
                buyerMsg += `Mohon ditunggu ya! 😊`;

                await sendWhatsapp(customerPhone, buyerMsg);
            }

            // --- FONNTE NOTIFICATION END ---

            return NextResponse.json({
                success: true,
                orderId: order.id,
                message: "Order created and notifications sent"
            });

        } catch (dbError: any) {
            console.error("[Checkout API] Database interaction failed:", dbError);

            if (dbError.code === 'P2003') {
                return NextResponse.json(
                    { success: false, message: "Produk dalam keranjang tidak valid atau sudah dihapus dari database." },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { success: false, message: "Gagal menyimpan pesanan ke database." },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("[Checkout API] Unhandled error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
