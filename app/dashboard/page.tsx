"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* ───────────── Types ───────────── */

type Availability = "all" | "partial" | "none";

type RequestRow = {
    id: string;
    created_at: string;
    expires_at: string;
    image_path: string;
    medicines: string[];
    notes: string | null;
};

type ResponseRow = {
    request_id: string;
    availability: Availability;
    total_price: number | null;
    comment: string | null;
};

type Item = {
    recipientId: string;
    request: RequestRow;
    response: ResponseRow | null;
};

type Tab = "new" | "replied" | "expired";

/* ───────────── Données fictives ───────────── */

const MOCK_IMAGE =
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900";

const now = Date.now();

const MOCK_ITEMS: Item[] = [
    {
        recipientId: "recipient-001",
        request: {
            id: "request-001",
            created_at: new Date(now - 5 * 60000).toISOString(),
            expires_at: new Date(now + 55 * 60000).toISOString(),
            image_path: MOCK_IMAGE,
            medicines: ["Doliprane 1000mg", "Amoxicilline 500mg"],
            notes: "J'ai besoin de ces médicaments pour aujourd'hui.",
        },
        response: null,
    },

    {
        recipientId: "recipient-002",
        request: {
            id: "request-002",
            created_at: new Date(now - 18 * 60000).toISOString(),
            expires_at: new Date(now + 42 * 60000).toISOString(),
            image_path: MOCK_IMAGE,
            medicines: ["Spasfon", "Paracétamol 500mg"],
            notes: "Merci de vérifier si tous les médicaments sont disponibles.",
        },
        response: null,
    },

    {
        recipientId: "recipient-003",
        request: {
            id: "request-003",
            created_at: new Date(now - 45 * 60000).toISOString(),
            expires_at: new Date(now + 15 * 60000).toISOString(),
            image_path: MOCK_IMAGE,
            medicines: ["Ibuprofène 400mg", "Vitamine C"],
            notes: null,
        },
        response: null,
    },

    {
        recipientId: "recipient-004",
        request: {
            id: "request-004",
            created_at: new Date(now - 2 * 3600000).toISOString(),
            expires_at: new Date(now + 2 * 3600000).toISOString(),
            image_path: MOCK_IMAGE,
            medicines: ["Metformine 500mg", "Doliprane 1000mg"],
            notes: "Ordonnance pour traitement chronique.",
        },
        response: {
            request_id: "request-004",
            availability: "all",
            total_price: 18500,
            comment: "Tous les médicaments sont disponibles dans notre pharmacie.",
        },
    },

    {
        recipientId: "recipient-005",
        request: {
            id: "request-005",
            created_at: new Date(now - 3 * 3600000).toISOString(),
            expires_at: new Date(now + 1 * 3600000).toISOString(),
            image_path: MOCK_IMAGE,
            medicines: ["Augmentin 1g", "Doliprane 500mg"],
            notes: "Merci de me confirmer le médicament disponible.",
        },
        response: {
            request_id: "request-005",
            availability: "partial",
            total_price: 12000,
            comment: "Doliprane disponible, mais Augmentin 1g est actuellement en rupture.",
        },
    },

    {
        recipientId: "recipient-006",
        request: {
            id: "request-006",
            created_at: new Date(now - 26 * 3600000).toISOString(),
            expires_at: new Date(now - 2 * 3600000).toISOString(),
            image_path: MOCK_IMAGE,
            medicines: ["Amoxicilline 500mg", "Spasfon"],
            notes: null,
        },
        response: null,
    },
];

/* ───────────── Utilitaires ───────────── */

function beep(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 880;

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.6
    );

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
}

function timeLeft(expiresAt: string, now: number) {
    const diff = new Date(expiresAt).getTime() - now;

    if (diff <= 0) return "Expirée";

    const totalMin = Math.floor(diff / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;

    return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

function timeAgo(date: string, now: number) {
    const min = Math.max(
        0,
        Math.floor((now - new Date(date).getTime()) / 60000)
    );

    if (min < 1) return "À l'instant";
    if (min < 60) return `Il y a ${min} min`;

    const h = Math.floor(min / 60);

    if (h < 24) return `Il y a ${h} h`;

    return `Il y a ${Math.floor(h / 24)} j`;
}

function getTab(item: Item, now: number): Tab {
    if (item.response) return "replied";

    if (
        new Date(item.request.expires_at).getTime() <= now
    ) {
        return "expired";
    }

    return "new";
}

/* ───────────── Options ───────────── */

const availabilityOptions: {
    value: Availability;
    label: string;
    active: string;
}[] = [
    {
        value: "all",
        label: "Tout disponible",
        active:
            "border-green-600 bg-green-50 text-green-700",
    },
    {
        value: "partial",
        label: "Partiel",
        active:
            "border-amber-500 bg-amber-50 text-amber-700",
    },
    {
        value: "none",
        label: "Indisponible",
        active:
            "border-red-500 bg-red-50 text-red-700",
    },
];

const availabilityBadge: Record<Availability, string> = {
    all: "bg-green-100 text-green-700",
    partial: "bg-amber-100 text-amber-700",
    none: "bg-red-100 text-red-700",
};

const availabilityLabel: Record<Availability, string> = {
    all: "Tout disponible",
    partial: "Partiel",
    none: "Indisponible",
};

/* ───────────── Carte ───────────── */

function RequestCard({
    item,
    now,
    onSaved,
}: {
    item: Item;
    now: number;
    onSaved: (response: ResponseRow) => void;
}) {
    const { request, response } = item;

    const tab = getTab(item, now);

    const [availability, setAvailability] =
        useState<Availability | null>(
            response?.availability ?? null
        );

    const [price, setPrice] = useState(
        response?.total_price != null
            ? String(response.total_price)
            : ""
    );

    const [comment, setComment] = useState(
        response?.comment ?? ""
    );

    const [editing, setEditing] = useState(!response);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError("");

        if (!availability) {
            setError("Choisissez la disponibilité.");
            return;
        }

        if (
            availability !== "none" &&
            (!price || Number(price) <= 0)
        ) {
            setError("Indiquez le prix total.");
            return;
        }

        setSaving(true);

        setTimeout(() => {
            const newResponse: ResponseRow = {
                request_id: request.id,
                availability,
                total_price:
                    availability === "none"
                        ? null
                        : Number(price),
                comment: comment.trim() || null,
            };

            setSaving(false);
            setEditing(false);

            onSaved(newResponse);
        }, 700);
    }

    return (
        <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-slate-50 px-5 py-3 text-sm">
                <span className="text-slate-600">
                    {timeAgo(request.created_at, now)}
                </span>

                {tab === "new" && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        Expire dans{" "}
                        {timeLeft(request.expires_at, now)}
                    </span>
                )}

                {tab === "expired" && (
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                        Expirée
                    </span>
                )}

                {tab === "replied" && response && (
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                            availabilityBadge[
                                response.availability
                            ]
                        }`}
                    >
                        {
                            availabilityLabel[
                                response.availability
                            ]
                        }
                    </span>
                )}
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-2">
                {/* Ordonnance */}

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Ordonnance
                    </h3>

                    <a
                        href={request.image_path}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={request.image_path}
                            alt="Ordonnance"
                            className="mt-3 max-h-72 w-full rounded-xl border object-contain bg-slate-50"
                        />
                    </a>

                    {request.medicines.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-900">
                                Médicaments détectés
                            </p>

                            <ul className="mt-2 flex flex-wrap gap-2">
                                {request.medicines.map(
                                    (medicine) => (
                                        <li
                                            key={medicine}
                                            className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-100"
                                        >
                                            {medicine}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}

                    {request.notes && (
                        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                            {request.notes}
                        </p>
                    )}
                </div>

                {/* Réponse */}

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Votre réponse
                    </h3>

                    {tab === "expired" ? (
                        <p className="mt-3 text-sm text-slate-500">
                            Cette demande a expiré, vous ne pouvez
                            plus répondre.
                        </p>
                    ) : response && !editing ? (
                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                            {response.total_price != null && (
                                <p>
                                    Prix total :{" "}
                                    <span className="font-semibold text-slate-900">
                                        {response.total_price.toLocaleString(
                                            "fr-FR"
                                        )}{" "}
                                        Ar
                                    </span>
                                </p>
                            )}

                            {response.comment && (
                                <p>{response.comment}</p>
                            )}

                            {tab === "replied" &&
                                new Date(
                                    request.expires_at
                                ).getTime() > now && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditing(true)
                                        }
                                        className="mt-2 text-sm font-medium text-green-600 hover:underline"
                                    >
                                        Modifier ma réponse
                                    </button>
                                )}
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="mt-3 space-y-4"
                        >
                            <div className="grid grid-cols-3 gap-2">
                                {availabilityOptions.map(
                                    (option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                setAvailability(
                                                    option.value
                                                )
                                            }
                                            className={`rounded-lg border px-2 py-2.5 text-xs font-medium transition ${
                                                availability ===
                                                option.value
                                                    ? option.active
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    )
                                )}
                            </div>

                            {availability &&
                                availability !== "none" && (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-slate-700">
                                            Prix total (Ar)
                                        </label>

                                        <input
                                            type="number"
                                            min={0}
                                            value={price}
                                            onChange={(e) =>
                                                setPrice(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ex : 25000"
                                            className="rounded-lg border px-4 py-2.5 text-black outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        />
                                    </div>
                                )}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">
                                    Commentaire (facultatif)
                                </label>

                                <textarea
                                    rows={3}
                                    value={comment}
                                    onChange={(e) =>
                                        setComment(
                                            e.target.value
                                        )
                                    }
                                    placeholder={
                                        availability ===
                                        "partial"
                                            ? "Précisez ce qui manque..."
                                            : "Un message pour le patient"
                                    }
                                    className="resize-none rounded-lg border px-4 py-2.5 text-sm text-black outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            {error && (
                                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Envoi..."
                                        : "Envoyer la réponse"}
                                </button>

                                {response && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditing(false)
                                        }
                                        className="rounded-lg border px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                        Annuler
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </article>
    );
}

/* ───────────── Dashboard ───────────── */

export default function PharmacyDashboardPage() {
    const router = useRouter();

    const [items, setItems] =
        useState<Item[]>(MOCK_ITEMS);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [tab, setTab] =
        useState<Tab>("new");

    const [now, setNow] =
        useState(() => Date.now());

    const [soundOn, setSoundOn] =
        useState(false);

    const [flash, setFlash] =
        useState(false);

    const audioRef =
        useRef<AudioContext | null>(null);

    /* Horloge */

    useEffect(() => {
        const id = setInterval(
            () => setNow(Date.now()),
            30000
        );

        return () => clearInterval(id);
    }, []);

    /* Faux chargement */

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    /* Titre */

    const counts = useMemo(() => {
        const count: Record<Tab, number> = {
            new: 0,
            replied: 0,
            expired: 0,
        };

        items.forEach((item) => {
            count[getTab(item, now)]++;
        });

        return count;
    }, [items, now]);

    useEffect(() => {
        document.title =
            counts.new > 0
                ? `(${counts.new}) Dashboard | Mediko`
                : "Dashboard | Mediko";
    }, [counts.new]);

    const visible = items.filter(
        (item) =>
            getTab(item, now) === tab
    );

    /* Réponse fictive */

    function handleSaved(
        requestId: string,
        response: ResponseRow
    ) {
        setItems((current) =>
            current.map((item) =>
                item.request.id === requestId
                    ? {
                          ...item,
                          response,
                      }
                    : item
            )
        );
    }

    /* Son */

    function toggleSound() {
        if (!soundOn) {
            audioRef.current =
                new AudioContext();

            beep(audioRef.current);
        } else {
            audioRef.current?.close();
            audioRef.current = null;
        }

        setSoundOn(!soundOn);
    }

    /* Déconnexion fictive */

    function handleSignOut() {
        router.replace("/signin");
    }

    const tabs: {
        value: Tab;
        label: string;
    }[] = [
        {
            value: "new",
            label: "Nouvelles",
        },
        {
            value: "replied",
            label: "Répondues",
        },
        {
            value: "expired",
            label: "Expirées",
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-5xl">
                {/* En-tête */}

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-green-600">
                            Espace pharmacie
                        </p>

                        <h1 className="text-3xl font-bold text-slate-900">
                            Pharmacie Centrale
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleSound}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                soundOn
                                    ? "border-green-600 bg-green-50 text-green-700"
                                    : "text-slate-600 hover:bg-white"
                            }`}
                        >
                            {soundOn
                                ? "🔔 Son activé"
                                : "🔕 Activer le son"}
                        </button>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>

                {/* Alerte */}

                {flash && (
                    <div className="mt-6 animate-pulse rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-sm">
                        Nouvelle demande d&apos;ordonnance reçue !
                    </div>
                )}

                {/* Statistiques */}

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            En attente
                        </p>

                        <p className="mt-1 text-3xl font-bold text-amber-600">
                            {counts.new}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Répondues
                        </p>

                        <p className="mt-1 text-3xl font-bold text-green-600">
                            {counts.replied}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Expirées
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-400">
                            {counts.expired}
                        </p>
                    </div>
                </div>

                {/* Onglets */}

                <div className="mt-8 flex gap-2 border-b">
                    {tabs.map((t) => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() =>
                                setTab(t.value)
                            }
                            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                                tab === t.value
                                    ? "border-green-600 text-green-700"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {t.label}

                            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                {counts[t.value]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Contenu */}

                <div className="mt-6 space-y-5">
                    {loading && (
                        <p className="py-12 text-center text-sm text-slate-500">
                            Chargement...
                        </p>
                    )}

                    {error && (
                        <p className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading &&
                        !error &&
                        visible.length === 0 && (
                            <div className="rounded-2xl border border-dashed bg-white px-6 py-14 text-center text-sm text-slate-500">
                                {tab === "new" &&
                                    "Aucune demande en attente."}

                                {tab === "replied" &&
                                    "Vous n'avez encore répondu à aucune demande."}

                                {tab === "expired" &&
                                    "Aucune demande expirée."}
                            </div>
                        )}

                    {!loading &&
                        visible.map((item) => (
                            <RequestCard
                                key={item.recipientId}
                                item={item}
                                now={now}
                                onSaved={(response) =>
                                    handleSaved(
                                        item.request.id,
                                        response
                                    )
                                }
                            />
                        ))}
                </div>
            </div>
        </main>
    );
}