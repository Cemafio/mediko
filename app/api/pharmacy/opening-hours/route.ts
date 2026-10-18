import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("mediko_access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        { message: "La variable API_URL n'est pas configurée." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${apiUrl}/pharmacies/update`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    return NextResponse.json(
      data ?? {
        message: response.ok
          ? "Horaires enregistrés."
          : "Erreur du serveur.",
      },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour des horaires." },
      { status: 500 }
    );
  }
}
