import { notFound } from "next/navigation";
import { pharmacies } from "@/data/pharmacies";
import { medicines } from "@/data/medicine";
import MedicineCard from "@/components/MedicineCard";

type PharmacyPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function PharmacyPage({
    params,
}: PharmacyPageProps) {
    const { id } = await params;

    const pharmacyId = Number(id);

    const pharmacy = pharmacies.find(
        (pharmacy) => pharmacy.id === pharmacyId
    );

    if (!pharmacy) {
        notFound();
    }

    const availableMedicines = medicines.filter((medicine) =>
        medicine.pharmacyIds.includes(pharmacy.id)
    );

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-12">
            <div className="mx-auto max-w-3xl">
                <div className="rounded-xl border bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-bold text-slate-900">
                        {pharmacy.name}
                    </h1>

                    <p className="mt-2 text-slate-600">
                        {pharmacy.address}, {pharmacy.city}
                    </p>
                    <p className="mt-3 text-sm text-slate-600">
                        Téléphone : {pharmacy.phone}
                    </p>
                    <div className="mt-4">
                        <h2 className="font-semibold text-slate-900">
                            Horaires
                        </h2>

                        <div className="mt-2 space-y-1">
                            {pharmacy.openingHours.map((hours) => (
                            <div
                                key={hours.day}
                                className="flex justify-between text-sm text-slate-600"
                            >
                                <span>{hours.day}</span>

                                <span>
                                {hours.open === "Fermé"
                                    ? "Fermé"
                                    : `${hours.open} - ${hours.close}`}
                                </span>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>

                <section className="mt-8">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Médicaments disponibles
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {availableMedicines.length} médicament(s) disponible(s)
                    </p>

                    <div className="mt-4 space-y-3">
                        {availableMedicines.map((medicine) => (
                            <MedicineCard
                                key={medicine.id}
                                medicine={medicine}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}