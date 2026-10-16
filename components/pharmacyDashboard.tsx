import { medicines } from "@/data/medicine";
import { createMedicinesStock, getStockPharmacy, updateMedicinesStock } from "@/lib/service";
import { useEffect, useMemo, useState } from "react";

type Medicine = {
    id: string;
    name: string;
    description: string;
    dosage: string;
    price: number;
    quantity: number;
};

const accToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXY4Y2UwNnQwMDA0b2dzYnJreW1tejc2IiwiZW1haWwiOiJhbXBhbmRyYW5hQGV4YW1wbGUuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3OTIwNzMzMTUsImV4cCI6MTc5MjE1OTcxNX0.N1Y5ZLycs7Df2TMmWthaWVealrgPI14AcoJd8mpRKHU";


const initialPharmacy = {
    name: "Pharmacie Ambohipo",
    address: "3 Chemis Ambohipo",
    city: "Antananarivo",
    phone: "+261 39 00 000 00",
    email: "contact@ambohipo.mg",
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price);

function getStatus(quantity: number) {
    if (quantity === 0) {
        return { label: "Rupture de stock", color: "bg-red-50 text-red-700" };
    }
    if (quantity <= 8) {
        return { label: "Stock faible", color: "bg-amber-50 text-amber-700" };
    }
    return { label: "En stock", color: "bg-emerald-50 text-emerald-700" };
}

export default function PharmacyDashboardPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [pharmacy, setPharmacy] = useState(initialPharmacy);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Tous les statuts");
    const [editing, setEditing] = useState<Medicine | null>(null);
    const [adding, setAdding] = useState(false);
    const [editingPharmacy, setEditingPharmacy] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [notice, setNotice] = useState("");

    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [loadingStock, setLoadingStock] = useState(true);
    const [stockError, setStockError] = useState("");
    const [today, setToday] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadStock() {
            try {
                setLoadingStock(true);
                setStockError("");

                const data = await getStockPharmacy(accToken);

                if (!cancelled) {
                    // Cette version suppose que l'API renvoie directement un tableau.
                    if (!Array.isArray(data)) {
                        throw new Error(
                            "Le format des données du stock est incorrect."
                        );
                    }

                    setMedicines(data);
                }
            } catch (error) {
                if (!cancelled) {
                    setStockError(
                        error instanceof Error
                            ? error.message
                            : "Impossible de récupérer le stock."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingStock(false);
                }
            }
        }

        // La date est calculée après le premier rendu.
        setToday(
            new Intl.DateTimeFormat("fr-FR", {
                dateStyle: "full",
            }).format(new Date())
        );

        void loadStock();

        return () => {
            cancelled = true;
        };
    }, []);

    const stats = useMemo(() => ({
        total: medicines.length,
        low: medicines.filter(
            (m) => m.quantity > 0 && m.quantity <= 8
        ).length,
        out: medicines.filter(
            (m) => m.quantity === 0
        ).length,
        units: medicines.reduce(
            (sum, m) => sum + m.quantity,
            0
        ),
    }), [medicines]);

    // Garde ici le reste de tes fonctions et de ton composant.

    const visibleMedicines = medicines.filter((m:any) => {
        const matchesSearch = `${m.name} ${m.dosage} ${m.description}`
            .toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "Tous les statuts" ||
            (filter === "En stock" && m.quantity > 8) ||
            (filter === "Stock faible" && m.quantity > 0 && m.quantity <= 8) ||
            (filter === "Rupture de stock" && m.quantity === 0);

        return matchesSearch && matchesFilter;
    });


    async function saveMedicine(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const values = {
            name: String(data.get("name")).trim(),
            description: String(data.get("description") ?? "").trim(),
            dosage: String(data.get("dosage")).trim(),
            price: Number(data.get("price")),
            quantity: Number(data.get("quantity")),
        };

        if (!values.name || !values.dosage) {
            setFormError("Le nom et le dosage sont obligatoires.");
            return;
        }

        if (
            !Number.isFinite(values.price) ||
            values.price < 0 ||
            !Number.isInteger(values.quantity) ||
            values.quantity < 0
        ) {
            setFormError("Prix et quantité doivent être des nombres positifs (quantité entière).");
            return;
        }

        setFormError("");
        setSaving(true);

        try {
            if (editing) {
                const saved: Medicine = await updateMedicinesStock(editing.id, accToken, ...[values]);

                // On remplace par la réponse du serveur (l'id peut avoir changé après un renommage)
                setMedicines((prev: Medicine[]) =>
                    prev.map((m) => (m.id === editing.id ? saved : m))
                );
                setNotice("Médicament modifié.");
            } else {
                const saved: Medicine = await createMedicinesStock(accToken, values);

                setMedicines((prev: Medicine[]) => [...prev, saved]);
                setNotice("Médicament ajouté au stock.");
            }

            setEditing(null);
            setAdding(false);
        } catch (error) {
            setFormError(
                error instanceof Error ? error.message : "Une erreur est survenue."
            );
        } finally {
            setSaving(false);
        }
    }
    
    function savePharmacy(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        setPharmacy({
            name: String(data.get("name")).trim(),
            address: String(data.get("address")).trim(),
            city: String(data.get("city")).trim(),
            phone: String(data.get("phone")).trim(),
            email: String(data.get("email")).trim(),
        });

        setEditingPharmacy(false);
        setNotice("Informations modifiées.");
    }

    function deleteMedicine() {
        setMedicines((prev:any) => prev.filter((m:any) => m.id !== deleting));
        setDeleting(null);
        setNotice("Médicament supprimé.");
    }

    const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

    return (
        <div className="min-h-screen bg-[#f5f7f8] text-slate-800 lg:flex">

            {/* CONTENU */}
            <div className="flex-1 mx-auto max-w-6xl">
                <main className="mx-auto max-w-[1600px] space-y-5 p-5 sm:p-8">
                    <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-medium text-green-600">
                                Espace pharmacie
                            </p>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Tableau de bord</h1>
                            <p className="mt-1 text-sm text-slate-500">Gérez votre stock et vos informations en toute simplicité.</p>
                        </div>
                        <p className="text-sm text-slate-500">
                            {today || "Chargement de la date..."}
                        </p>                    
                    </section>

                    {notice && (
                        <div role="status" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {notice}
                            <button onClick={() => setNotice("")} aria-label="Fermer">✕</button>
                        </div>
                    )}

                    {/* STATISTIQUES */}
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            { label: "Médicaments en stock", value: stats.units, sub: `${stats.total} références`, icon: "💊", color: "emerald" },
                            { label: "Stock faible", value: stats.low, sub: "Nécessite votre attention", icon: "ⓘ", color: "amber" },
                            { label: "Rupture de stock", value: stats.out, sub: "Quantité égale à zéro", icon: "◇", color: "blue" },
                            { label: "Références", value: stats.total, sub: "Médicaments répertoriés", icon: "♙", color: "violet" },
                        ].map(stat => (
                            <div key={stat.label} className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                                    <span className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${stat.color === "emerald" ? "bg-emerald-50" :
                                            stat.color === "amber" ? "bg-amber-50" :
                                                stat.color === "blue" ? "bg-blue-50" : "bg-violet-50"
                                        }`}>{stat.icon}</span>
                                </div>
                                <p className="mt-3 text-3xl font-extrabold text-slate-950">{stat.value}</p>
                                <p className="mt-1 text-xs text-slate-500">{stat.sub}</p>
                            </div>
                        ))}
                    </section>

                    {/* PHARMACIE + ACTIONS */}
                    <section className="grid gap-5 xl:grid-cols-[2fr_1fr]">
                        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                <h2 className="text-lg font-bold text-slate-950">Informations de la pharmacie</h2>
                                <button onClick={() => setEditingPharmacy(true)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50">✎ Modifier</button>
                            </div>
                            <div className="grid md:grid-cols-2">
                                <div className="space-y-5 p-5">
                                    <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">▣</span>
                                        <div>
                                            <h3 className="font-bold text-slate-950">{pharmacy.name}</h3>
                                            <p className="text-sm text-slate-500">{pharmacy.city}</p>
                                            <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Profil actif (démo)</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">⌖ &nbsp; Adresse</p>
                                        <p className="ml-6 mt-1 text-sm text-slate-500">{pharmacy.address}, {pharmacy.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">♧ &nbsp; Téléphone</p>
                                        <a href={`tel:${pharmacy.phone.replace(/[^\d+]/g, "")}`} className="ml-6 mt-1 block text-sm text-emerald-700 hover:underline">{pharmacy.phone}</a>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">✉ &nbsp; E-mail</p>
                                        <a href={`mailto:${pharmacy.email}`} className="ml-6 mt-1 block break-all text-sm text-slate-500 hover:text-emerald-700">{pharmacy.email}</a>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 p-5 md:border-l md:border-t-0">
                                    <h3 className="mb-4 font-bold text-slate-900">◷ &nbsp; Horaires d&apos;ouverture</h3>
                                    {[
                                        ["Lundi", "08:00 - 11:00"],
                                        ["Mardi", "Fermé"],
                                        ["Mercredi", "Fermé"],
                                        ["Jeudi", "Fermé"],
                                        ["Vendredi", "Fermé"],
                                        ["Samedi", "08:00 - 13:00"],
                                        ["Dimanche", "Fermé"],
                                    ].map(([day, hours]) => (
                                        <div key={day} className="flex justify-between gap-3 border-b border-slate-100 py-2 text-xs">
                                            <span className="text-slate-600">{day}</span>
                                            <span className={hours === "Fermé" ? "text-red-500" : "font-medium text-slate-700"}>{hours}</span>
                                        </div>
                                    ))}
                                    <button onClick={() => setNotice("La modification des horaires sera connectée au backend.")} className="mt-4 text-sm font-semibold text-emerald-700 hover:underline">Gérer les horaires →</button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-950">⚡ Actions rapides</h2>
                            <div className="mt-5 space-y-3">
                                {[
                                    ["＋", "Ajouter un médicament", "Enregistrer un nouveau produit"],
                                    ["◇", "Gérer mon stock", "Modifier quantités et prix"],
                                    ["✎", "Modifier mes informations", "Mettre à jour mes coordonnées"],
                                ].map(([icon, label, description], i) => (
                                    <button
                                        key={label}
                                        onClick={() => i === 0 ? setAdding(true) : i === 1 ? document.getElementById("stock")?.scrollIntoView({ behavior: "smooth" }) : setEditingPharmacy(true)}
                                        className="flex w-full items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-800">{icon}</span>
                                        <span>
                                            <span className="block text-sm font-semibold text-slate-900">{label}</span>
                                            <span className="mt-1 block text-xs text-slate-500">{description}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {loadingStock && (
                        <p role="status" className="text-sm text-slate-500">
                            Chargement du stock...
                        </p>
                    )}

                    {stockError && (
                        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                            {stockError}
                        </p>
                    )}

                    {/* TABLEAU DU STOCK */}
                    <section id="stock" className="scroll-mt-24 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-950">💊 Mon stock de médicaments</h2>
                                <p className="mt-1 text-sm text-slate-500">Gérez vos médicaments, quantités et prix.</p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filtrer les médicaments" className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500">
                                    <option>Tous les statuts</option>
                                    <option>En stock</option>
                                    <option>Stock faible</option>
                                    <option>Rupture de stock</option>
                                </select>
                                <button onClick={() => setAdding(true)} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">＋ Ajouter un médicament</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs text-slate-600">
                                    <tr>
                                        {["Médicament", "Dosage", "Prix (Ar)", "Quantité", "Statut", "Actions"].map(header => (
                                            <th key={header} className="px-5 py-3.5 font-semibold">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {visibleMedicines.map((medicine:Medicine) => {
                                        const status = getStatus(medicine.quantity);
                                        return (
                                            <tr key={medicine.id} className="transition hover:bg-slate-50">
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg">💊</span>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{medicine.name}</p>
                                                            <p className="mt-0.5 text-xs text-slate-500">{medicine.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap">{medicine.dosage}</td>
                                                <td className="px-5 py-3 whitespace-nowrap">{formatPrice(medicine.price)}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${medicine.quantity === 0 ? "bg-red-50 text-red-700" :
                                                            medicine.quantity <= 8 ? "bg-amber-50 text-amber-700" :
                                                                "bg-emerald-50 text-emerald-700"
                                                        }`}>{medicine.quantity}</span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${status.color}`}>{status.label}</span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setEditing(medicine)} aria-label={`Modifier ${medicine.name}`} className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-emerald-50">✎</button>
                                                        <button onClick={() => setDeleting(medicine.id)} aria-label={`Supprimer ${medicine.name}`} className="rounded-lg border border-red-100 px-3 py-2 text-red-600 hover:bg-red-50">⌫</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {visibleMedicines.length === 0 && (
                                        <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">Aucun médicament ne correspond à la recherche.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">{visibleMedicines.length} médicament(s) affiché(s) sur {medicines.length}</div>
                    </section>
                </main>
            </div>

            {/* FORMULAIRE MEDICAMENT */}
            {(adding || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => { setAdding(false); setEditing(null); }}>
                    <div role="dialog" aria-modal="true" aria-labelledby="medicine-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h2 id="medicine-title" className="text-xl font-bold">{editing ? "Modifier le médicament" : "Ajouter un médicament"}</h2>
                        <form key={editing?.id ?? "new"} onSubmit={saveMedicine} className="mt-5 space-y-4">
                            {[
                                ["name", "Nom du médicament", editing?.name ?? ""],
                                ["description", "Description", editing?.description ?? ""],
                                ["dosage", "Dosage", editing?.dosage ?? ""],
                                ["price", "Prix en Ariary", String(editing?.price ?? "")],
                                ["quantity", "Quantité en stock", String(editing?.quantity ?? "")],
                            ].map(([name, label, value]) => (
                                <label key={name} className="block text-sm font-medium text-slate-700">
                                    {label}
                                    <input name={name} required={name === "name" || name === "price" || name === "quantity"} defaultValue={value} type={name === "price" || name === "quantity" ? "number" : "text"} min={name === "price" || name === "quantity" ? "0" : undefined} className={inputClass} />
                                </label>
                            ))}

                            {formError && (
                                <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                                    {formError}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => { setAdding(false); setEditing(null); setFormError(""); }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                                    Annuler
                                </button>
                                <button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Ajouter"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODIFIER PHARMACIE */}
            {editingPharmacy && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setEditingPharmacy(false)}>
                    <div role="dialog" aria-modal="true" aria-labelledby="pharmacy-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h2 id="pharmacy-title" className="text-xl font-bold">Modifier ma pharmacie</h2>
                        <form onSubmit={savePharmacy} className="mt-5 space-y-4">
                            {[
                                ["name", "Nom", pharmacy.name],
                                ["address", "Adresse", pharmacy.address],
                                ["city", "Ville", pharmacy.city],
                                ["phone", "Téléphone", pharmacy.phone],
                                ["email", "E-mail", pharmacy.email],
                            ].map(([name, label, value]) => (
                                <label key={name} className="block text-sm font-medium text-slate-700">
                                    {label}
                                    <input name={name} required={name !== "email"} type={name === "email" ? "email" : "text"} defaultValue={value} className={inputClass} />
                                </label>
                            ))}
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setEditingPharmacy(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">Annuler</button>
                                <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CONFIRMATION SUPPRESSION */}
            {deleting !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setDeleting(null)}>
                    <div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h2 id="delete-title" className="text-lg font-bold">Supprimer ce médicament ?</h2>
                        <p className="mt-2 text-sm text-slate-500">Cette action supprimera la référence de la liste affichée.</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setDeleting(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">Annuler</button>
                            <button onClick={deleteMedicine} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
