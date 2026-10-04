import { notFound } from "next/navigation";
import { medicines } from "@/data/medicine";

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

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
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
      </div>
    </main>
  );
}