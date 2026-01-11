
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("[Checkout API] Request received:", {
            customerName: body.customerName,
            itemCount: body.items?.length,
            totalPrice: body.totalPrice
        });

        const {
            customerName,
            customerPhone,
            customerAddress,
            deliveryMethod,
            items,
            totalPrice,
            notes
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
        // Note: valid items must exist in Product table for the foreign key to work
        try {
            const order = await prisma.order.create({
                data: {
                    customerName,
                    customerPhone,
                    customerAddress: customerAddress || "-",
                    deliveryMethod: deliveryMethod || "PICKUP",
                    items: items, // Save JSON dump of items
                    totalPrice: Number(totalPrice),
                    status: "PENDING",
                    notes: notes,
                    // Create OrderItems for structured data
                    // We map carefully to ensure types match schema
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

            return NextResponse.json({
                success: true,
                orderId: order.id,
                message: "Order created successfully"
            });

        } catch (dbError: any) {
            console.error("[Checkout API] Database interaction failed:", dbError);

            // Check for specific Prisma errors (like Foreign Key constraint)
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
