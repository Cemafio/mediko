import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

type Context = {
  params: Promise<{ id: string }>;
};

async function stockRequest(
  request: Request,
  context: Context,
  method: "PATCH" | "DELETE",
) {
  const token = (await cookies()).get("mediko_access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Non authentifié." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  const response = await fetch(
    `${API_URL}/pharmacy/stock/${encodeURIComponent(id)}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(method === "PATCH"
          ? { "Content-Type": "application/json" }
          : {}),
      },
      ...(method === "PATCH"
        ? { body: await request.text() }
        : {}),
      cache: "no-store",
    },
  );

  const text = await response.text();

  return new NextResponse(text || null, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function PATCH(request: Request, context: Context) {
  return stockRequest(request, context, "PATCH");
}

export async function DELETE(request: Request, context: Context) {
  return stockRequest(request, context, "DELETE");
}