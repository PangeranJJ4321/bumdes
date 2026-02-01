import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file uploaded" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        let buffer = Buffer.from(bytes);

        // Define upload directory
        const uploadDir = join(process.cwd(), "storage", "uploads");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory exists
        }

        // Generate unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        let filename = file.name.replace(/[^a-zA-Z0-9.]/g, "-");

        // Check if file is an image
        const isImage = file.type.startsWith("image/");

        if (isImage) {
            try {
                // Optimize with Sharp
                // Rename extension to .webp
                const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
                filename = `${uniqueSuffix}-${nameWithoutExt}.webp`;

                buffer = (await sharp(buffer)
                    .resize(1920, 1080, { // Max dimensions
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .webp({ quality: 80 })
                    .toBuffer()) as any;

            } catch (sharpError) {
                console.error("Optimization failed, saving original:", sharpError);
                // Fallback to original filename/buffer if sharp fails
                filename = `${uniqueSuffix}-${filename}`;
            }
        } else {
            // Non-image files (e.g. PDF)
            filename = `${uniqueSuffix}-${filename}`;
        }

        const filePath = join(uploadDir, filename);

        // Write file
        await writeFile(filePath, buffer);

        // Return the URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({ success: true, url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, message: "Upload failed" },
            { status: 500 }
        );
    }
}
