import PharmacyCard from "@/components/pharmacieCard";
import { pharmacies } from "@/data/pharmacies";

export default function PharmaciesPage() {
  
  pharmacies.map((pharmacy:any) => {
    console.log(`Pharmacies:`, pharmacy);
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Pharmacies
        </h1>

        <p className="mt-2 text-slate-600">
          Retrouvez les pharmacies disponibles.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {pharmacies.map((pharmacy:any) => (
            <PharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
            />
          ))}
        </div>
      </div>
    </main>
  );
}