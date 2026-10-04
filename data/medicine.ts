export type Medicine = {
  id: number;
  name: string;
  category: string;
  dosage: string;
  pharmacyIds: number[];
};

export const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracétamol",
    category: "Antalgique",
    dosage: "500 mg",
    pharmacyIds: [1, 2, 3],
  },
  {
    id: 2,
    name: "Amoxicilline",
    category: "Antibiotique",
    dosage: "500 mg",
    pharmacyIds: [1, 3],
  },
  {
    id: 3,
    name: "Ibuprofène",
    category: "Anti-inflammatoire",
    dosage: "400 mg",
    pharmacyIds: [2],
  },
  {
    id: 4,
    name: "Doliprane",
    category: "Antalgique",
    dosage: "1000 mg",
    pharmacyIds: [1, 2],
  },
  {
    id: 5,
    name: "Aspirine",
    category: "Antalgique",
    dosage: "500 mg",
    pharmacyIds: [3],
  },
];