
import Link from "next/link";
import { ArrowUpRight, Pill, Tag } from "lucide-react";

type Medicine = {
    id: string;
    name: string;
    category: string;
    dosage: string;
};

type MedicineCardProps = {
    medicine: Medicine;
};

export default function MedicineCard({ medicine }: MedicineCardProps) {
    return (
        <Link
            href={`/medicaments/${medicine.id}`}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
            {/* En-tête */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
                    <Pill size={24} strokeWidth={1.8} />
                </div>

                <span className="inline-flex max-w-[65%] items-center gap-1.5 truncate rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                    <Tag size={12} />
                    <span className="truncate">{medicine.category}</span>
                </span>
            </div>

            {/* Informations */}
            <div className="mt-5 flex-1">
                <h3 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-700">
                    {medicine.name}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                    Dosage
                </p>

                <p className="mt-0.5 text-sm font-semibold text-emerald-700">
                    {medicine.dosage}
                </p>
            </div>

            {/* Pied de carte */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-emerald-700">
                    Voir les détails
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-all group-hover:bg-emerald-600 group-hover:text-white">
                    <ArrowUpRight size={18} />
                </span>
            </div>
        </Link>
    );
}
