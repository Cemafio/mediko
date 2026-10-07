import { notFound } from "next/navigation";
import { medicines } from "@/data/medicine";
import { pharmacies } from "@/data/pharmacies";
import Link from "next/link";
import PharmacyCard from "@/components/pharmacieCard";
import BackButton from "@/components/backbutton";
import { getMedicines, getOneMedicine } from "@/lib/service";
import { log } from "console";

type MedicinePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MedicinePage({
  params,
}: MedicinePageProps) {
  const { id } = await params;
  const medecineId = id;
  const medicine = await getOneMedicine(medecineId);
  const availablePharmacies = medicine.pharmacy;

  type MedicinePageProps = {
    params: Promise<{
      id: string;
    }>;
  };
  
  if (!medicine) {
    notFound();
  }


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
        <p className="mt-4 text-slate-600">
          {medicine.description}
        </p>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Pharmacies disponibles
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 mt-4 space-y-3">
            {availablePharmacies.map((pharmacy:any) => (
              <PharmacyCard
                key={pharmacy.pharmacyId}
                pharmacy={pharmacy.pharmacy}
              />
            ))}
          </div>
        </div>
      </div>
      
    </main>
  );
}