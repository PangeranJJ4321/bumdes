
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

import { sendTemplateMessage } from "@/lib/whatsapp";

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

            const orderIdShort = order.id.substring(0, 8).toUpperCase();

            // --- WHATSAPP CLOUD API START ---

            // 1. Send Message to SELLER (Staff)
            if (sellerPhone) {
                // Template: new_order_detail
                // Body Params: {{1}}=OrderId, {{2}}=Name, {{3}}=Phone, {{4}}=Method, {{5}}=Total, {{6}}=CleanPhone (for link)

                // Sanitize phone for URL (remove + or 0 in front, ensure 62)
                let cleanPhone = customerPhone.replace(/\D/g, '');
                if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1);

                const sellerComponents = [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: orderIdShort },                                      // {{1}}
                            { type: "text", text: customerName },                                      // {{2}}
                            { type: "text", text: customerPhone },                                     // {{3}}
                            { type: "text", text: deliveryMethod === 'COURIER' ? 'Kurir' : 'Pickup' }, // {{4}}
                            { type: "text", text: `Rp ${Number(totalPrice).toLocaleString('id-ID')}` }, // {{5}}
                            { type: "text", text: cleanPhone }                                         // {{6}}
                        ]
                    }
                ];

                await sendTemplateMessage(sellerPhone, "new_order_detail3", sellerComponents);
            }

            // 2. Send Message to BUYER (Customer)
            if (customerPhone) {
                // Construct Item List String
                // Example: "- Nasi Goreng (2x) @ Rp 15.000\n- Es Teh (1x) @ Rp 5.000"
                const itemsListString = items.map((item: any) =>
                    `- ${item.title} (${item.quantity}x) @ Rp ${Number(item.price).toLocaleString('id-ID')}`
                ).join("\n");

                // Template: order_confirmation
                // Params: {{1}}=Name, {{2}}=OrderId, {{3}}=ItemsString, {{4}}=Total
                const buyerComponents = [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: customerName },                                      // {{1}}
                            { type: "text", text: orderIdShort },                                      // {{2}}
                            { type: "text", text: itemsListString },                                   // {{3}}
                            { type: "text", text: `Rp ${Number(totalPrice).toLocaleString('id-ID')}` } // {{4}}
                        ]
                    }
                ];

                await sendTemplateMessage(customerPhone, "order_confirmation3", buyerComponents);
            }

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
