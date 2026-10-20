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