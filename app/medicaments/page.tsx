
import type { Metadata } from "next";
import Link from "next/link";
import MedicineCard from "@/components/MedicineCard";
import { getMedicines } from "@/lib/service";

type MedicinesPageProps = {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
};

export const metadata: Metadata = {
    title: "Médicaments | Mediko",
    description:
        "Recherchez un médicament et découvrez les pharmacies qui le proposent.",
};

// function normalize(value: string) {
//     return value
//         .normalize("NFD")
//         .replace(/\p{Diacritic}/gu, "")
//         .toLowerCase()
//         .trim();
// }

function buildHref(search: string | undefined, page: number) {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (page > 1) params.set("page", String(page));

    const query = params.toString();

    return query ? `/medicaments?${query}` : "/medicaments";
}

export default async function MedicinesPage({
    searchParams,
}: MedicinesPageProps) {
    const { search: rawSearch, page: rawPage } = await searchParams;
    const search = rawSearch?.trim() || undefined;

    const parsedPage = Number(rawPage);
    const requestedPage =
        Number.isSafeInteger(parsedPage) && parsedPage > 0
            ? parsedPage
            : 1;

    const PAGE_SIZE = 6;

    let result: Awaited<ReturnType<typeof getMedicines>> | null = null;
    let loadError = false;

    try {
        result = await getMedicines(
            requestedPage,
            PAGE_SIZE,
            search ?? '',
        );
    } catch {
        loadError = true;
    }

    const medicines = result?.data ?? [];
    const meta = result?.meta;

    // La recherche est effectuée côté serveur dans une prochaine étape.
    // Pour l'instant, l'API renvoie seulement la page demandée.
    // const query = search ? normalize(search) : "";
    const filtered = medicines;

    const currentPage = meta?.page ?? requestedPage;
    const totalPages = meta?.totalPages ?? 0;
    const total = meta?.total ?? 0;

    return (
        <main className="min-h-screen bg-slate-50">
            <section className="border-b bg-gradient-to-b from-green-50 to-white">
                <div className="mx-auto max-w-5xl px-6 pb-10 pt-12">
                    <p className="text-sm font-medium text-green-600">
                        Catalogue
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
                        Médicaments
                    </h1>

                    <p className="mt-2 max-w-2xl text-slate-600">
                        Consultez notre liste de médicaments et trouvez les
                        pharmacies qui les proposent.
                    </p>

                    <form
                        action="/medicaments"
                        method="get"
                        className="mt-6 flex max-w-2xl overflow-hidden rounded-xl border bg-white shadow-sm focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100"
                    >
                        <input
                            type="search"
                            name="search"
                            defaultValue={search}
                            placeholder="Rechercher un médicament..."
                            aria-label="Rechercher un médicament"
                            className="min-w-0 flex-1 px-5 py-3.5 text-black outline-none"
                        />

                        <button
                            type="submit"
                            className="bg-green-600 px-6 font-medium text-white transition hover:bg-green-700"
                        >
                            Rechercher
                        </button>
                    </form>
                </div>
            </section>

            <div className="mx-auto max-w-5xl px-6 py-10">
                {loadError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                        <p className="font-medium text-red-700">
                            Impossible de charger les médicaments.
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            Vérifiez votre connexion puis réessayez.
                        </p>

                        <Link
                            href={buildHref(search, requestedPage)}
                            className="mt-5 inline-flex rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                            Réessayer
                        </Link>
                    </div>
                )}

                {!loadError && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-slate-600">
                                {search ? (
                                    <>
                                        <strong className="text-slate-900">
                                            {filtered.length}
                                        </strong>{" "}
                                        résultat{filtered.length > 1 ? "s" : ""} sur cette
                                        page pour{" "}
                                        <strong className="text-slate-900">
                                            « {search} »
                                        </strong>
                                    </>
                                ) : (
                                    <>
                                        <strong className="text-slate-900">
                                            {total}
                                        </strong>{" "}
                                        médicament{total > 1 ? "s" : ""} au total
                                    </>
                                )}
                            </p>

                            {search && (
                                <Link
                                    href="/medicaments"
                                    className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-green-200 hover:text-green-700"
                                >
                                    Effacer la recherche
                                    <span aria-hidden="true">✕</span>
                                </Link>
                            )}
                        </div>

                        {filtered.length === 0 ? (
                            <div className="mt-8 rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
                                <div
                                    aria-hidden="true"
                                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl"
                                >
                                    🔍
                                </div>

                                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                    Aucun médicament trouvé sur cette page
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Vérifiez l&apos;orthographe ou essayez un autre nom.
                                </p>

                                {search && (
                                    <Link
                                        href="/medicaments"
                                        className="mt-6 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                                    >
                                        Voir tous les médicaments
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                {filtered.map((medicine: any) => (
                                    <MedicineCard
                                        key={medicine.id}
                                        medicine={medicine}
                                    />
                                ))}
                            </div>
                        )}

                        {meta && totalPages > 1 && (
                            <nav
                                aria-label="Pagination"
                                className="mt-10 flex items-center justify-between gap-4"
                            >
                                {meta.hasPreviousPage ? (
                                    <Link
                                        href={buildHref(search, currentPage - 1)}
                                        className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-green-200 hover:text-green-700"
                                    >
                                        ← Précédent
                                    </Link>
                                ) : (
                                    <span className="cursor-not-allowed rounded-lg border bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
                                        ← Précédent
                                    </span>
                                )}

                                <span className="text-sm text-slate-500">
                                    Page{" "}
                                    <strong className="text-slate-900">
                                        {currentPage}
                                    </strong>{" "}
                                    sur {totalPages}
                                </span>

                                {meta.hasNextPage ? (
                                    <Link
                                        href={buildHref(search, currentPage + 1)}
                                        className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-green-200 hover:text-green-700"
                                    >
                                        Suivant →
                                    </Link>
                                ) : (
                                    <span className="cursor-not-allowed rounded-lg border bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
                                        Suivant →
                                    </span>
                                )}
                            </nav>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
