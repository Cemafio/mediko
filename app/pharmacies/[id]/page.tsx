import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pharmacies } from "@/data/pharmacies";
import { medicines } from "@/data/medicine";
import MedicineCard from "@/components/MedicineCard";
import BackButton from "@/components/backbutton";

// Le statut Ouvert/Fermé dépend de l'heure : on évite le cache statique
export const dynamic = "force-dynamic";

const TIMEZONE = "Indian/Antananarivo";

const EN_TO_FR: Record<string, string> = {
    Sunday: "Dimanche",
    Monday: "Lundi",
    Tuesday: "Mardi",
    Wednesday: "Mercredi",
    Thursday: "Jeudi",
    Friday: "Vendredi",
    Saturday: "Samedi",
};

type OpeningHours = { day: string; open: string; close: string };

type PharmacyPageProps = {
    params: Promise<{
        id: string;
    }>;
};

/** Jour et heure actuels à Madagascar, quel que soit le fuseau du serveur */
function getNow() {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TIMEZONE,
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(new Date());

    const get = (type: string) =>
        parts.find((p) => p.type === type)?.value ?? "0";

    return {
        day: EN_TO_FR[get("weekday")],
        minutes: Number(get("hour")) * 60 + Number(get("minute")),
    };
}

function toMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

// function getOpenStatus(openingHours: OpeningHours[]) {
//     const { day, minutes } = getNow();
//     const todayHours = openingHours.find((h) => h.day === day);

//     if (!todayHours || todayHours.open === "Fermé") {
//         return { today: day, isOpen: false, closesAt: null as string | null };
//     }

//     const start = toMinutes(todayHours.open);
//     const end = toMinutes(todayHours.close);

//     // Gère aussi les horaires qui passent minuit (ex. 20:00 - 02:00)
//     const isOpen =
//         end > start
//             ? minutes >= start && minutes < end
//             : minutes >= start || minutes < end;

//     return {
//         today: day,
//         isOpen,
//         closesAt: isOpen ? todayHours.close : null,
//     };
// }

export async function generateMetadata({
    params,
}: PharmacyPageProps): Promise<Metadata> {
    const { id } = await params;
    const pharmacy = pharmacies.find((p:any) => p.id === id);

    if (!pharmacy) return { title: "Pharmacie introuvable | Mediko" };

    return {
        title: `${pharmacy.name} | Mediko`,
        description: `${pharmacy.name} - ${pharmacy.address}, ${pharmacy.city}. Horaires et médicaments disponibles.`,
    };
}

export default async function PharmacyPage({ params }: PharmacyPageProps) {
    const { id } = await params;

    const pharmacy = pharmacies.find((p:any) => p.id === id);

    if (!pharmacy) {
        notFound();
    }


    // const { today, isOpen, closesAt } = getOpenStatus(pharmacy.openingHours);

    const phoneHref = `tel:${pharmacy.phone.replace(/\s/g, "")}`;
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${pharmacy.name} ${pharmacy.address} ${pharmacy.city}`
    )}`;

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-12">
            <div className="mx-auto max-w-3xl">
                <BackButton fallbackHref="/pharmacies" />

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    {/* En-tête */}
                    <div className="border-b bg-green-50/60 px-8 py-6">
                        <div className="flex items-start gap-4">
                            <div
                                aria-hidden="true"
                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-600 text-2xl text-white shadow-sm"
                            >
                                ✚
                            </div>

                            <div className="min-w-0 flex-1">
                                <h1 className="text-3xl font-bold text-slate-900">
                                    {pharmacy.name}
                                </h1>

                                {/* <span
                                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                        isOpen
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${
                                            isOpen ? "bg-green-600" : "bg-red-600"
                                        }`}
                                    />
                                    {isOpen
                                        ? `Ouvert · ferme à ${closesAt}`
                                        : "Fermé actuellement"}
                                </span> */}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 p-8 md:grid-cols-2">
                        {/* Coordonnées */}
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Coordonnées
                            </h2>

                            <div className="mt-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <span aria-hidden="true" className="mt-0.5 text-lg">
                                        📍
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            Adresse
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {pharmacy.address}, {pharmacy.city}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span aria-hidden="true" className="mt-0.5 text-lg">
                                        📞
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            Téléphone
                                        </p>
                                        <a
                                            href={phoneHref}
                                            className="text-sm text-green-600 hover:underline"
                                        >
                                            {pharmacy.phone}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <a
                                    href={phoneHref}
                                    className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                                >
                                    Appeler
                                </a>

                                <a
                                    href={mapsHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-lg border border-green-600 px-5 py-2.5 text-sm font-medium text-green-600 transition hover:bg-green-50"
                                >
                                    Itinéraire
                                </a>
                            </div>
                        </div>

                        {/* Horaires */}
                        <div>
                            {/* <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Horaires d&apos;ouverture
                            </h2> */}

                            {/* <div className="mt-4 divide-y overflow-hidden rounded-xl border"> */}
                                {/* {pharmacy.openingHours.map((hours) => {
                                    const isToday = hours.day === today;
                                    const closed = hours.open === "Fermé";

                                    return (
                                        <div
                                            key={hours.day}
                                            className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                                                isToday
                                                    ? "bg-green-50 font-medium text-green-800"
                                                    : "text-slate-600"
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {hours.day}
                                                {isToday && (
                                                    <span className="rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                                                        Aujourd&apos;hui
                                                    </span>
                                                )}
                                            </span>

                                            <span className={closed ? "text-red-500" : ""}>
                                                {closed
                                                    ? "Fermé"
                                                    : `${hours.open} - ${hours.close}`}
                                            </span>
                                        </div>
                                    );
                                })} */}
                            {/* </div> */}
                        </div>
                    </div>
                </div>

                {/* Médicaments */}
                {/* <section className="mt-10">
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Médicaments disponibles
                        </h2>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            {availableMedicines.length}
                        </span>
                    </div>

                    {availableMedicines.length === 0 ? (
                        <div className="mt-4 rounded-xl border border-dashed bg-white px-6 py-10 text-center text-sm text-slate-500">
                            Aucun médicament n&apos;est répertorié pour cette
                            pharmacie pour le moment.
                        </div>
                    ) : (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {availableMedicines.map((medicine) => (
                                <MedicineCard key={medicine.id} medicine={medicine} />
                            ))}
                        </div>
                    )}
                </section> */}
            </div>
        </main>
    );
}