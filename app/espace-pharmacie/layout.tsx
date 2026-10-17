import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.API_URL ?? "http://localhost:3005";

export default async function EspacePharmacieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("mediko_access_token")?.value;

  if (!token) {
    redirect("/signin");
  }

  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  }).catch(() => null);

  if (!response || !response.ok) {
    redirect("/signin");
  }

  const user = await response.json();

  // Remplace PHARMACY par la valeur exacte de ton enum Prisma.
  console.log(user);
  
  if (user.role !== "PHARMACIST") {
    redirect("/unauthorized");
  }

  return children;
}