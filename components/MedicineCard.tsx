type Medicine = {
  id: number;
  name: string;
  category: string;
  dosage: string;
};

type MedicineCardProps = {
  medicine: Medicine;
};

export default function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <div className="mb-3 rounded-xl border bg-white p-5 text-left shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        {medicine.name}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {medicine.category}
      </p>

      <p className="mt-2 text-sm font-medium text-green-600">
        {medicine.dosage}
      </p>
    </div>
  );
}