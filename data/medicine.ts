export type Medicine = {
  id: number;
  name: string;
  category: string;
  dosage: string;
};

export const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracétamol",
    category: "Antalgique",
    dosage: "500 mg",
  },
  {
    id: 2,
    name: "Amoxicilline",
    category: "Antibiotique",
    dosage: "500 mg",
  },
  {
    id: 3,
    name: "Ibuprofène",
    category: "Anti-inflammatoire",
    dosage: "400 mg",
  },
  {
    id: 4,
    name: "Doliprane",
    category: "Antalgique",
    dosage: "1000 mg",
  },
  {
    id: 5,
    name: "Aspirine",
    category: "Antalgique",
    dosage: "500 mg",
  },
];