import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";

const galleryUpdateSchema = z.object({
    title: z.string().min(1).optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const data = galleryUpdateSchema.parse(body);

        const updated = await prisma.gallery.update({
            where: { id },
            data
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.gallery.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
    }
}
