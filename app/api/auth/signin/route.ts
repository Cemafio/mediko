
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:3005";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "L'e-mail et le mot de passe sont obligatoires." },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_URL}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {
                    message:
                        data.message ?? "Email ou mot de passe incorrect.",
                },
                { status: response.status }
            );
        }

        const accessToken = data.access_token;

        if (!accessToken) {
            return NextResponse.json(
                { message: "Access token absent de la réponse NestJS." },
                { status: 502 }
            );
        }

        const result = NextResponse.json({
            user: data.user ?? null,
        });

        result.cookies.set("mediko_access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 60,
        });

        return result;
    } catch (error) {
        console.error("Erreur login :", error);

        return NextResponse.json(
            { message: "Erreur lors de la connexion au serveur." },
            { status: 500 }
        );
    }
}
