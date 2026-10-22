import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PharmacyCard from "@/components/pharmacieCard";
import BackButton from "@/components/backbutton";
import { getOneMedicine } from "@/lib/service";
import PharmacyPriceCard from "@/components/pharmaPrice";

type MedicinePageProps = {
    params: Promise<{
        id: string;
    }>;
};

type PharmacyLink = {
    pharmacyId: string | number;
    price: string,
    quantity: number
    pharmacy: any;
};

/** Mis en cache : generateMetadata et la page partagent un seul appel */
const fetchMedicine = cache(async (id: string) => {
    try {
        return await getOneMedicine(id);
    } catch {
        return null;
    }
});

export async function generateMetadata({
    params,
}: MedicinePageProps): Promise<Metadata> {
    const { id } = await params;
    const medicine = await fetchMedicine(id);

    if (!medicine) return { title: "Médicament introuvable | Mediko" };

    return {
        title: `${medicine.name} | Mediko`,
        description: `${medicine.name}${
            medicine.dosage ? ` ${medicine.dosage}` : ""
        } : description et pharmacies qui le proposent.`,
    };
}



export default async function MedicinePage({ params }: MedicinePageProps) {
    const { id } = await params;
    const medicine = await fetchMedicine(id);
    
    // Vérification AVANT d'utiliser medicine (sinon medicine.pharmacy plante)
    if (!medicine) {
        notFound();
    }

    const availablePharmacies: PharmacyLink[] = medicine.pharmacy ?? [];
    const sorted = [...availablePharmacies].sort((a: any, b: any) => {
        if ((a.quantity > 0) !== (b.quantity > 0)) return a.quantity > 0 ? -1 : 1;
        return a.price - b.price;
    });

    const cheapestId = sorted.find((item: any) => item.quantity > 0)?.pharmacyId;

    sorted.map((item) => {

        console.log(item.pharmacy);
    });

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-12">
            <div className="mx-auto max-w-3xl">
                <BackButton fallbackHref="/medicaments" />

                {/* Carte du médicament */}
                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="border-b bg-green-50/60 px-8 py-6">
                        <div className="flex items-start gap-4">
                            <div
                                aria-hidden="true"
                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-600 text-2xl text-white shadow-sm"
                            >
                                💊
                            </div>

                            <div className="min-w-0 flex-1">
                                {medicine.category && (
                                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                        {medicine.category}
                                    </span>
                                )}

                                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                                    {medicine.name}
                                </h1>

                                {medicine.dosage && (
                                    <p className="mt-1 text-sm text-slate-600">
                                        Dosage :{" "}
                                        <span className="font-medium text-slate-900">
                                            {medicine.dosage}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 p-8">
                        {/* Description */}
                        {medicine.description && (
                            <section>
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Description
                                </h2>
                                <p className="mt-3 leading-relaxed text-slate-600">
                                    {medicine.description}
                                </p>
                            </section>
                        )}

                        {/* Pharmacies */}
                        <section>
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Pharmacies disponibles
                                </h2>

                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                    {availablePharmacies.length}
                                </span>
                            </div>

                            {availablePharmacies.length === 0 ? (
                                <div className="mt-4 rounded-xl border border-dashed bg-slate-50 px-6 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-700">
                                        Aucune pharmacie ne propose ce médicament
                                        pour le moment.
                                    </p>
                                    <Link
                                        href="/pharmacies"
                                        className="mt-4 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                                    >
                                        Voir toutes les pharmacies
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {sorted.map((item) => (
                                        <PharmacyPriceCard
                                            key={item.pharmacyId}
                                            pharmacy={item.pharmacy}
                                            price={Number(item.price)}
                                            quantity={item.quantity}
                                            isCheapest={item.pharmacyId === cheapestId}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Avertissement */}
                        <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                            La disponibilité peut changer. Appelez la pharmacie
                            avant de vous déplacer. Ces informations ne
                            remplacent pas l&apos;avis d&apos;un médecin ou d&apos;un
                            pharmacien.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}