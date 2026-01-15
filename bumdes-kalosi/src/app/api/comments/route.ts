import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";

const createCommentSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    content: z.string().min(1, "Komentar tidak boleh kosong"),
    newsId: z.string().min(1, "News ID missing")
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const newsId = searchParams.get("newsId");

    if (!newsId) {
        return NextResponse.json({ error: "News ID Required" }, { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { newsId },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, content, newsId } = createCommentSchema.parse(body);

        const comment = await prisma.comment.create({
            data: {
                name,
                email,
                content,
                newsId
            }
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
