import Link from "next/link";
import type { Pharmacy } from "@/data/pharmacies";

type PharmacyCardProps = {
  pharmacy: Pharmacy;
};

export default function PharmacyCard({
  pharmacy,
}: PharmacyCardProps) {
  return (
    <Link
      href={`/pharmacies/${pharmacy.id}`}
      className="block rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        {pharmacy.name}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        {pharmacy.address}
      </p>

      <p className="text-sm text-slate-500">
        {pharmacy.city}
      </p>
    </Link>
  );
}