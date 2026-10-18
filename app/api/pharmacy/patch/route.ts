import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH() {
    const cookieStore = await cookies();
    const token = cookieStore.get("mediko_access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Non authentifié." },
        { status: 401 }
      );
    }

    const response = await fetch(
        `${process.env.API_URL}/pharmacies/update`,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    const data = await response.json();

    return NextResponse.json(data, {
        status: response.status,
    });
}