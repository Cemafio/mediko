import { getPharmacies } from "@/lib/service";

type OpeningHours = {
    day: string;
    open: string;
    close: string;
};

export type Pharmacy = {
    id: number;
    name: string;
    address: string;
    city: string;
    phone: string;
    openingHours: OpeningHours[];
};

export const pharmacies:any = await getPharmacies();
// [
//     {
//         id: 1,
//         name: "Pharmacie Centrale",
//         address: "Analakely",
//         city: "Antananarivo",
//         phone: "+261 34 00 000 01",
//         openingHours: [
//             {
//                 day: "Lundi",
//                 open: "08:00",
//                 close: "18:00",
//             },
//             {
//                 day: "Mardi",
//                 open: "08:00",
//                 close: "18:00",
//             },
//             {
//                 day: "Mercredi",
//                 open: "08:00",
//                 close: "18:00",
//             },
//             {
//                 day: "Jeudi",
//                 open: "08:00",
//                 close: "18:00",
//             },
//             {
//                 day: "Vendredi",
//                 open: "08:00",
//                 close: "18:00",
//             },
//             {
//                 day: "Samedi",
//                 open: "08:00",
//                 close: "13:00",
//             },
//             {
//                 day: "Dimanche",
//                 open: "Fermé",
//                 close: "",
//             },
//         ],
//     },
//     {
//         id: 2,
//         name: "Pharmacie de l'Indépendance",
//         address: "Avenue de l'Indépendance",
//         city: "Antananarivo",
//         phone: "+261 34 00 000 02",
//         openingHours: [
//             {
//                 day: "Lundi",
//                 open: "08:00",
//                 close: "19:00",
//             },
//             {
//                 day: "Mardi",
//                 open: "08:00",
//                 close: "19:00",
//             },
//             {
//                 day: "Mercredi",
//                 open: "08:00",
//                 close: "19:00",
//             },
//             {
//                 day: "Jeudi",
//                 open: "08:00",
//                 close: "19:00",
//             },
//             {
//                 day: "Vendredi",
//                 open: "08:00",
//                 close: "19:00",
//             },
//             {
//                 day: "Samedi",
//                 open: "08:00",
//                 close: "13:00",
//             },
//             {
//                 day: "Dimanche",
//                 open: "Fermé",
//                 close: "",
//             },
//         ],
//     },
//     {
//         id: 3,
//         name: "Pharmacie Soa",
//         address: "Andraharo",
//         city: "Antananarivo",
//         phone: "+261 34 00 000 03",
//         openingHours: [
//             {
//                 day: "Lundi",
//                 open: "08:00",
//                 close: "19:00",
//             },
//             {
//                 day: "Mardi",
//                 open: "08:00",
//                 close: "19:00",
//             },
//             {
//                 day: "Mercredi",
//                 open: "08:00",
//                 close: "19:00",
//             },
//             {
//                 day: "Jeudi",
//                 open: "08:00",
//                 close: "19:00",
//             },
//             {
//                 day: "Vendredi",
//                 open: "08:00",
//                 close: "19:00",
//             },
//             {
//                 day: "Samedi",
//                 open: "08:00",
//                 close: "13:00",
//             },
//             {
//                 day: "Dimanche",
//                 open: "Fermé",
//                 close: "",
//             },
//         ],
//     },
// ];