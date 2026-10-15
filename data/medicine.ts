import { getMedicines } from "@/lib/service";

export type Medicine = {
  id: string;
  name: string;
  category: string;
  dosage: string;
  pharmacyIds: number[];
};

export const medicines: Medicine[] = await getMedicines();