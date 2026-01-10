import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ filename: string }> }
) {
    const { filename } = await context.params;

    // Validate filename to prevent traversal
    if (!filename || filename.includes("..")) {
        return new NextResponse("Invalid filename", { status: 400 });
    }

    // Construct path to storage/uploads
    const filePath = join(process.cwd(), "storage", "uploads", filename);

    if (!existsSync(filePath)) {
        return new NextResponse("File not found", { status: 404 });
    }

    // Read and serve file
    try {
        const fileBuffer = await readFile(filePath);

        // Simple content type detection
        const ext = filename.split('.').pop()?.toLowerCase();
        let contentType = "application/octet-stream";

        const mimeTypes: Record<string, string> = {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "webp": "image/webp",
            "gif": "image/gif",
            "svg": "image/svg+xml",
            "pdf": "application/pdf"
        };

        if (ext && mimeTypes[ext]) {
            contentType = mimeTypes[ext];
        }

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        return new NextResponse("Error reading file", { status: 500 });
    }
}
