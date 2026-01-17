"use server"


import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/server/db"
import bcrypt from "bcryptjs"


export async function loginAction(formData: FormData) {
    try {
        await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirectTo: "/admin/dashboard",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials."
                default:
                    return "Something went wrong."
            }
        }
        throw error
    }
}

export async function generateResetToken(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Return success even if user not found to prevent enumeration
            // But for our app, maybe we want to know? 
            // Let's return null to indicate handled.
            return { token: null, name: null };
        }

        // Generate simple token (uuid)
        const token = crypto.randomUUID();
        const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

        // Save token
        // We will use VerificationToken model or similar. 
        // Schema has VerificationToken(identifier, token, expires)
        // identifier will be email

        // delete existing tokens for this email
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        });

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires
            }
        });

        return { token, name: user.name || user.username };

    } catch (error) {
        console.error("Generate token error:", error);
        throw new Error("Gagal memproses permintaan reset password.");
    }
}

export async function resetPassword(token: string, password: string) {
    try {
        const existingToken = await prisma.verificationToken.findUnique({
            where: {
                identifier_token: {
                    token: token,
                    identifier: "", // This is problematic, we need to find by token mostly.
                    // The schema constraint is @@unique([identifier, token])
                    // So we cannot look up by token alone efficiently unless we scan or change schema.
                    // However, we can use findFirst
                }
            }
        });

        // Workaround: Find token manually since we don't have identifier here easily unless passed.
        // Actually, we should look up by token. 
        // Since schema is unique on [identifier, token], finding by token alone relies on simple findFirst

        const validToken = await prisma.verificationToken.findFirst({
            where: { token }
        });

        if (!validToken) {
            return { error: "Token tidak valid atau tidak ditemukan." };
        }

        const hasExpired = new Date() > validToken.expires;
        if (hasExpired) {
            return { error: "Token telah kadaluarsa." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { email: validToken.identifier },
            data: { password: hashedPassword }
        });

        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: validToken.identifier,
                    token: validToken.token
                }
            }
        });

        return { success: true };

    } catch (error) {
        console.error("Reset password error:", error);
        return { error: "Gagal mereset password." };
    }
}
