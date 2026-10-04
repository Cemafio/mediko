export type Pharmacy = {
  id: number;
  name: string;
  address: string;
  city: string;
};

export const pharmacies: Pharmacy[] = [
  {
    id: 1,
    name: "Pharmacie Centrale",
    address: "Analakely",
    city: "Antananarivo",
  },
  {
    id: 2,
    name: "Pharmacie de l'Indépendance",
    address: "Avenue de l'Indépendance",
    city: "Antananarivo",
  },
  {
    id: 3,
    name: "Pharmacie Soa",
    address: "Andraharo",
    city: "Antananarivo",
  },
];