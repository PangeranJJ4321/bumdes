import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";

const gallerySchema = z.object({
    title: z.string().min(1),
    category: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = gallerySchema.parse(body);

        const item = await prisma.gallery.create({
            data: {
                title: data.title,
                category: data.category,
                description: data.description,
                imageUrl: data.imageUrl,
            }
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
    }
}
