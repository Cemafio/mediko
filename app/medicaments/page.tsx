import { medicines } from "@/data/medicine";
import MedicineCard from "@/components/MedicineCard";

type MedicinesPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function MedicinesPage({
  searchParams,
}: MedicinesPageProps) {
  const { search } = await searchParams;

  const filteredMedicines = search
    ? medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(search.toLowerCase())
      )
    : medicines;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Médicaments
        </h1>

        <p className="mt-2 text-slate-600">
          Consultez notre liste de médicaments.
        </p>

        {search && (
          <p className="mt-4 text-sm text-slate-500">
            Résultats pour : <strong>{search}</strong>
          </p>
        )}

        {filteredMedicines.length === 0 ? (
          <p className="mt-8 text-center text-slate-500">
            Aucun médicament trouvé.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {filteredMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}