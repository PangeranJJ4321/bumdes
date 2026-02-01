
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";



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
            sellerPhone, // Receive sellerPhone explicitly
            waOptIn // Receive opt-in status
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
                    waOptIn: waOptIn || false,
                    waOptInAt: waOptIn ? new Date() : null,
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

            const orderIdShort = order.id.substring(0, 8).toUpperCase();

            // --- FONNTE LOGIC REMOVED (Manual Checkout) ---
            // The system now only saves the order. The actual message sending is handled client-side via WhatsApp redirect.

            return NextResponse.json({
                success: true,
                orderId: order.id,
                message: "Order saved"
            });

            // --- WHATSAPP CLOUD API END ---

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
