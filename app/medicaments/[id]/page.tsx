import { notFound } from "next/navigation";
import { medicines } from "@/data/medicine";
import { pharmacies } from "@/data/pharmacies";
import Link from "next/link";
import PharmacyCard from "@/components/pharmacieCard";
import BackButton from "@/components/backbutton";

type MedicinePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MedicinePage({
  params,
}: MedicinePageProps) {
  const { id } = await params;
  const medecineId = Number(id);
  const medicine = medicines.find((medoc) => medoc.id === medecineId);



  type MedicinePageProps = {
    params: Promise<{
      id: string;
    }>;
  };
  
  if (!medicine) {
    notFound();
  }

  const availablePharmacies = pharmacies.filter((pharmacy) =>
    medicine.pharmacyIds.includes(pharmacy.id)
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <BackButton fallbackHref="/pharmacies" /> 
      </div>
      
      <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-green-600">
          {medicine.category}
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {medicine.name}
        </h1>

        <p className="mt-4 text-slate-600">
          Dosage : {medicine.dosage}
        </p>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Pharmacies disponibles
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 mt-4 space-y-3">
            {availablePharmacies.map((pharmacy) => (
              <Link href={`/pharmacies/${pharmacy.id}`}>
                <PharmacyCard
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                />
                {/* <div
                  key={pharmacy.id}
                  className="rounded-lg border p-4 mb-4"
                >
                  <h3 className="font-semibold text-slate-900">
                    {pharmacy.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {pharmacy.address}, {pharmacy.city}
                  </p>
                </div> */}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
    </main>
  );
}