import { medicines } from "@/data/medicine";
import MedicineCard from "@/components/MedicineCard";

export default function Medicaments() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Médicaments
        </h1>

        <p className="mt-2 text-slate-600">
          Consultez notre liste de médicaments.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
            />
          ))}
        </div>
      </div>
    </main>
  );
}