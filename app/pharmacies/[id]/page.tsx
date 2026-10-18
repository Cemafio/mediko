
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pharmacies } from "@/data/pharmacies";
import BackButton from "@/components/backbutton";
import { log } from "console";

export const dynamic = "force-dynamic";

const TIMEZONE = "Indian/Antananarivo";

const DAYS = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
];

const EN_TO_DAY: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

type OpeningHour = {
    id: string;
    pharmacyId: string;
    dayOfWeek: number;
    opensAt: string;
    closesAt: string;
};

type Pharmacy = {
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    email?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    openingHours: OpeningHour[];
};

type PageProps = {
    params: Promise<{ id: string }>;
};

function getMadagascarTime() {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TIMEZONE,
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(new Date());

    const value = (type: string) =>
        parts.find((part) => part.type === type)?.value ?? "0";

    return {
        day: EN_TO_DAY[value("weekday")] ?? 0,
        minutes: Number(value("hour")) * 60 + Number(value("minute")),
    };
}

function toMinutes(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function formatHours(hours: OpeningHour[]) {
    if (hours.length === 0) return "Fermé";

    return hours
        .map((hour) => `${hour.opensAt} – ${hour.closesAt}`)
        .join(" / ");
}

function getOpeningStatus(pharmacy: Pharmacy) {
    const now = getMadagascarTime();
    const todayHours = pharmacy.openingHours.filter(
        (hour) => hour.dayOfWeek === now.day
    );

    const yesterday = (now.day + 6) % 7;
    const yesterdayHours = pharmacy.openingHours.filter(
        (hour) => hour.dayOfWeek === yesterday
    );

    // Vérifie les créneaux d'aujourd'hui.
    for (const hour of todayHours) {
        const start = toMinutes(hour.opensAt);
        const end = toMinutes(hour.closesAt);

        const isOpen =
            end > start
                ? now.minutes >= start && now.minutes < end
                : end < start &&
                  (now.minutes >= start || now.minutes < end);

        if (isOpen) {
            return {
                isOpen: true,
                message: `Ouvert · ferme à ${hour.closesAt}`,
            };
        }
    }

    // Vérifie si un créneau de la veille passe après minuit.
    for (const hour of yesterdayHours) {
        const start = toMinutes(hour.opensAt);
        const end = toMinutes(hour.closesAt);

        if (end < start && now.minutes < end) {
            return {
                isOpen: true,
                message: `Ouvert · ferme à ${hour.closesAt}`,
            };
        }
    }

    const nextHour = pharmacy.openingHours
        .filter((hour) => {
            const start = toMinutes(hour.opensAt);
            return (
                hour.dayOfWeek === now.day &&
                start > now.minutes
            );
        })
        .sort(
            (a, b) => toMinutes(a.opensAt) - toMinutes(b.opensAt)
        )[0];

    return {
        isOpen: false,
        message: nextHour
            ? `Fermé · ouvre à ${nextHour.opensAt}`
            : "Fermé actuellement",
    };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id } = await params;
    const pharmacy = (pharmacies as Pharmacy[]).find(
        (item) => item.id === id
    );

    if (!pharmacy) {
        return { title: "Pharmacie introuvable | Mediko" };
    }

    return {
        title: `${pharmacy.name} | Mediko`,
        description: `Coordonnées et horaires de ${pharmacy.name}, située à ${pharmacy.address}, ${pharmacy.city}.`,
    };
}

export default async function PharmacyPage({ params }: PageProps) {
    const { id } = await params;

    const pharmacy = (pharmacies as Pharmacy[]).find(
        (item) => item.id === id
    );

    if (!pharmacy) notFound();

    const status = getOpeningStatus(pharmacy);
    const phoneHref = `tel:${pharmacy.phone.replace(/[^\d+]/g, "")}`;

    const hasCoordinates =
        pharmacy.latitude != null && pharmacy.longitude != null;

    const mapQuery = hasCoordinates
        ? `${pharmacy.latitude},${pharmacy.longitude}`
        : `${pharmacy.name}, ${pharmacy.address}, ${pharmacy.city}`;

    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

    const today = getMadagascarTime().day;

    return (
        <main className="min-h-screen bg-[#f5f8f6] text-slate-800">
            <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-10">
                <div className="mb-7">
                    <BackButton fallbackHref="/pharmacies" />
                </div>

                {/* En-tête */}
                <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 p-6 text-white shadow-lg shadow-emerald-900/10 sm:p-10">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full border-[35px] border-white/5"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-32 right-32 -z-10 h-64 w-64 rounded-full bg-white/5 blur-3xl"
                    />

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-5xl shadow-inner backdrop-blur-sm">
                            ✚
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-50">
                                    PHARMACIE
                                </span>

                                <span
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                        status.isOpen
                                            ? "bg-emerald-300/20 text-emerald-50"
                                            : "bg-white/15 text-white/90"
                                    }`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${
                                            status.isOpen
                                                ? "animate-pulse bg-emerald-300"
                                                : "bg-slate-300"
                                        }`}
                                    />
                                    {status.message}
                                </span>
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                {pharmacy.name}
                            </h1>

                            <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-emerald-50/90 sm:text-base">
                                <span aria-hidden="true">⌖</span>
                                <span>
                                    {pharmacy.address}, {pharmacy.city}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a
                            href={phoneHref}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-emerald-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <span aria-hidden="true">☎</span>
                            Appeler la pharmacie
                        </a>

                        <a
                            href={mapsHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <span aria-hidden="true">↗</span>
                            Voir l&apos;itinéraire
                        </a>
                    </div>
                </section>

                {/* Informations */}
                <div className="mt-8 grid gap-6 lg:grid-cols-5">
                    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-7 lg:col-span-2">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                                ◷
                            </span>
                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Horaires d&apos;ouverture
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Heure locale de Madagascar
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 divide-y divide-slate-100">
                            {DAYS.map((day, index) => {
                                const hours = pharmacy.openingHours
                                    .filter((item) => item.dayOfWeek === index)
                                    .sort(
                                        (a, b) =>
                                            toMinutes(a.opensAt) -
                                            toMinutes(b.opensAt)
                                    );

                                console.log("Opening Hours:", pharmacy.openingHours);
                                console.log("Filtered Hours:", hours);

                                const isToday = index === today;

                                return (
                                    <div
                                        key={day}
                                        className={`flex items-start justify-between gap-3 py-3 text-sm ${
                                            isToday
                                                ? "font-semibold text-emerald-800"
                                                : "text-slate-600"
                                        }`}
                                    >
                                        <span className="flex flex-wrap items-center gap-2">
                                            {day}
                                            {isToday && (
                                                <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                                                    Aujourd&apos;hui
                                                </span>
                                            )}
                                        </span>

                                        <span
                                            className={`max-w-[58%] text-right ${
                                                hours.length === 0
                                                    ? "font-medium text-rose-500"
                                                    : ""
                                            }`}
                                        >
                                            {formatHours(hours)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                            Les horaires affichés proviennent des
                            informations enregistrées pour cette pharmacie.
                            En cas de doute, contactez-la directement.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-7 lg:col-span-3">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-xl">
                                ♧
                            </span>
                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Informations pratiques
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Contact et localisation
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div className="flex gap-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg">
                                    ☎
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Téléphone
                                    </p>
                                    <a
                                        href={phoneHref}
                                        className="mt-1 inline-block font-semibold text-slate-800 transition-colors hover:text-emerald-700"
                                    >
                                        {pharmacy.phone}
                                    </a>
                                </div>
                            </div>

                            {pharmacy.email && (
                                <div className="flex gap-4">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg">
                                        ✉
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            E-mail
                                        </p>
                                        <a
                                            href={`mailto:${pharmacy.email}`}
                                            className="mt-1 inline-block break-all font-medium text-slate-800 hover:text-emerald-700"
                                        >
                                            {pharmacy.email}
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg">
                                    ⌖
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Adresse
                                    </p>
                                    <p className="mt-1 font-medium leading-6 text-slate-800">
                                        {pharmacy.address}, {pharmacy.city}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a
                            href={mapsHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-7 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm font-semibold text-emerald-800 transition duration-200 hover:border-emerald-300 hover:bg-emerald-100"
                        >
                            Ouvrir dans Google Maps
                            <span aria-hidden="true">↗</span>
                        </a>

                        {hasCoordinates && (
                            <p className="mt-3 text-xs text-slate-400">
                                Coordonnées GPS : {pharmacy.latitude},{" "}
                                {pharmacy.longitude}
                            </p>
                        )}
                    </section>
                </div>

                {/* Médicaments : à relier aux données PharmacyMedicine */}
                <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                            ♧
                        </span>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Médicaments disponibles
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Cette section pourra afficher les médicaments
                                associés à cette pharmacie, leur prix et leur
                                stock dès que les données de la relation
                                PharmacyMedicine seront connectées à la page.
                            </p>
                        </div>
                    </div>
                </section>

                <footer className="py-8 text-center text-xs text-slate-400">
                    Mediko · Les informations peuvent évoluer. Contactez la
                    pharmacie pour confirmer les horaires et la disponibilité.
                </footer>
            </div>
        </main>
    );
}
