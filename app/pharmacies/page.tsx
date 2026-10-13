import type { Metadata } from "next";
import Link from "next/link";
import PharmacyCard from "@/components/pharmacieCard";
import { pharmacies } from "@/data/pharmacies";
import { getOpenStatus } from "@/lib/openingHours";
import { log } from "node:console";

// Le statut Ouvert/Fermé dépend de l'heure : on évite le cache statique
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Pharmacies | Mediko",
    description:
        "Retrouvez les pharmacies proches de vous, leurs horaires et les médicaments disponibles.",
};

type PharmaciesPageProps = {
    searchParams: Promise<{
        search?: string;
        city?: string;
        open?: string;
    }>;
};

/** Met en minuscules et retire les accents */
function normalize(value: string) {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();
}

export default async function PharmaciesPage({
    searchParams,
}: PharmaciesPageProps) {
    const { search: rawSearch, city: rawCity, open } = await searchParams;

    const search = rawSearch?.trim() || undefined;
    const city = rawCity?.trim() || undefined;
    const onlyOpen = open === "1";

    // Pharmacies enrichies avec leur statut du moment
    const all = (pharmacies as any[]).map((pharmacy) => ({
        pharmacy,
        status: getOpenStatus(pharmacy.openingHours),
    }));

    const cities = Array.from(
        new Set(all.map(({ pharmacy }) => String(pharmacy.address)))
    ).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

    const query = search ? normalize(search) : "";

    const filtered = all
        .filter(({ pharmacy, status }) => {
            if (city && pharmacy.address !== city) return false;
            if (onlyOpen && !status.isOpen) return false;
            if (!query) return true;

            return normalize(
                `${pharmacy.name} ${pharmacy.address} ${pharmacy.city}`
            ).includes(query);
        })
        .sort((a, b) =>
            String(a.pharmacy.name).localeCompare(String(b.pharmacy.name), "fr", {
                sensitivity: "base",
            })
        );

    const openCount = all.filter(({ status }) => status.isOpen).length;
    const hasFilters = Boolean(search || city || onlyOpen);

    return (
        <main className="min-h-screen bg-slate-50">
            {/* En-tête */}
            <section className="border-b bg-gradient-to-b from-green-50 to-white">
                <div className="mx-auto max-w-5xl px-6 pb-10 pt-12">
                    <p className="text-sm font-medium text-green-600">Annuaire</p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
                        Pharmacies
                    </h1>
                    <p className="mt-2 max-w-2xl text-slate-600">
                        Retrouvez les pharmacies disponibles, leurs horaires et
                        les médicaments qu&apos;elles proposent.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1 text-sm text-green-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        {openCount} pharmacie{openCount > 1 ? "s" : ""} ouverte
                        {openCount > 1 ? "s" : ""} actuellement
                    </div>

                    {/* Recherche et filtres (fonctionne sans JavaScript) */}
                    <form
                        action="/pharmacies"
                        method="get"
                        className="mt-6 space-y-3"
                    >
                        <div className="flex max-w-2xl overflow-hidden rounded-xl border bg-white shadow-sm focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">
                            <input
                                type="search"
                                name="search"
                                defaultValue={search}
                                placeholder="Nom, adresse ou quartier..."
                                aria-label="Rechercher une pharmacie"
                                className="flex-1 px-5 py-3.5 text-black outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-green-600 px-6 font-medium text-white transition hover:bg-green-700"
                            >
                                Rechercher
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                name="city"
                                defaultValue={city ?? ""}
                                aria-label="Filtrer par ville"
                                className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            >
                                <option value="">Toutes les villes</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>

                            {/* <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 hover:border-green-200">
                                <input
                                    type="checkbox"
                                    name="open"
                                    value="1"
                                    defaultChecked={onlyOpen}
                                    className="h-4 w-4 accent-green-600"
                                />
                                Ouvertes maintenant
                            </label> */}

                            <button
                                type="submit"
                                className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                            >
                                Appliquer
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <div className="mx-auto max-w-5xl px-6 py-10">
                {/* Résumé */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-600">
                        <strong className="text-slate-900">
                            {filtered.length}
                        </strong>{" "}
                        pharmacie{filtered.length > 1 ? "s" : ""}
                        {search && (
                            <>
                                {" "}
                                pour{" "}
                                <strong className="text-slate-900">
                                    « {search} »
                                </strong>
                            </>
                        )}
                    </p>

                    {hasFilters && (
                        <Link
                            href="/pharmacies"
                            className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-green-200 hover:text-green-700"
                        >
                            Réinitialiser les filtres
                            <span aria-hidden="true">✕</span>
                        </Link>
                    )}
                </div>

                {/* Liste ou état vide */}
                {filtered.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
                        <div
                            aria-hidden="true"
                            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl"
                        >
                            🏥
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                            Aucune pharmacie trouvée
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Essayez un autre nom ou retirez certains filtres.
                        </p>
                        {hasFilters && (
                            <Link
                                href="/pharmacies"
                                className="mt-6 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                            >
                                Voir toutes les pharmacies
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {filtered.map(({ pharmacy, status }) => (
                            <div key={pharmacy.id} className="relative">
                                <PharmacyCard pharmacy={pharmacy} />

                                {/* <span
                                    className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                        status.isOpen
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            status.isOpen
                                                ? "bg-green-600"
                                                : "bg-red-600"
                                        }`}
                                    />
                                    {status.isOpen ? "Ouvert" : "Fermé"}
                                </span> */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}