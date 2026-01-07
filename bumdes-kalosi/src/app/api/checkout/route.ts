
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
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
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create Order in Database
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
                itemsDetail: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            message: "Order created successfully"
        });

    } catch (error) {
        console.error("Checkout Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
