import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mediko_access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Non authentifié." },
      { status: 401 }
    );
  }

  const response = await fetch(
    `${process.env.API_URL}/pharmacies/connected`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json().catch(() => null);

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("mediko_access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Non authentifié." },
      { status: 401 }
    );
  }

  const body = await request.json();

  const response = await fetch(
    `${process.env.API_URL}/pharmacies/update`,
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

  return NextResponse.json(data, {
    status: response.status,
  });
}
