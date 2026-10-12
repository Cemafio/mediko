"use client";

import { useState } from "react";
import { DAY_NAMES } from "@/lib/openingHours";

type Slot = { dayOfWeek: number; opensAt: string; closesAt: string };

type Props = {
    onSubmit: (slot: Slot) => Promise<void> | void;
};

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function OpeningHourForm({ onSubmit }: Props) {
    const [dayOfWeek, setDayOfWeek] = useState(1);
    const [opensAt, setOpensAt] = useState("08:00");
    const [closesAt, setClosesAt] = useState("19:00");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (!opensAt || !closesAt) {
            setError("Renseignez l'heure d'ouverture et de fermeture.");
            return;
        }

        if (opensAt === closesAt) {
            setError("L'ouverture et la fermeture doivent être différentes.");
            return;
        }

        setSaving(true);
        await onSubmit({ dayOfWeek, opensAt, closesAt });
        setSaving(false);
    }

    const fieldClass =
        "rounded-lg border px-3 py-2 text-sm text-black outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Jour</label>
                    <select
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(Number(e.target.value))}
                        className={fieldClass}
                    >
                        {WEEK_ORDER.map((d) => (
                            <option key={d} value={d}>
                                {DAY_NAMES[d]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Ouverture</label>
                    <input
                        type="time"
                        value={opensAt}
                        onChange={(e) => setOpensAt(e.target.value)}
                        className={fieldClass}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Fermeture</label>
                    <input
                        type="time"
                        value={closesAt}
                        onChange={(e) => setClosesAt(e.target.value)}
                        className={fieldClass}
                    />
                </div>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {saving ? "Ajout..." : "Ajouter cette plage"}
            </button>
        </form>
    );
}