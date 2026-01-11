
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId, rating, comment, authorName } = body;

        if (!productId || !rating || !comment) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const review = await prisma.review.create({
            data: {
                productId,
                rating: Number(rating),
                comment,
                authorName: authorName || "Pengunjung",
                // status: "PENDING" // Default in schema, but maybe auto-approve for now?
                status: "APPROVED" // Let's auto-approve for immediate feedback in this demo
            }
        });

        return NextResponse.json({ success: true, review });

    } catch (error) {
        console.error("Review Submission Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
