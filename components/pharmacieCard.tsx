
import Link from "next/link";
import type { Pharmacy } from "@/data/pharmacies";

type PharmacyCardProps = {
  pharmacy: Pharmacy;
};

export default function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  return (
    <Link
      href={`/pharmacies/${pharmacy.id}`}
      aria-label={`Voir les informations de ${pharmacy.name}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 sm:p-6"
    >
      {/* Décoration */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-50 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative">
        {/* En-tête */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3Z" />
            </svg>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Pharmacie
          </span>
        </div>

        {/* Informations */}
        <div className="mt-5">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-emerald-700 sm:text-xl">
            {pharmacy.name}
          </h2>

          <div className="mt-3 flex items-start gap-2.5 text-sm leading-6 text-slate-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
              aria-hidden="true"
            >
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>

            <span>
              {pharmacy.address}
              <span className="block font-medium text-slate-700">
                {pharmacy.city}
              </span>
            </span>
          </div>

          {pharmacy.phone && (
            <div className="mt-3 flex items-center gap-2.5 text-sm text-slate-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 text-emerald-600"
                aria-hidden="true"
              >
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1Z" />
              </svg>
              <span>{pharmacy.phone}</span>
            </div>
          )}
        </div>

        {/* Séparateur */}
        <div className="my-5 border-t border-slate-100" />

        {/* Action */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-emerald-700">
            Voir la pharmacie
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-300 group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
