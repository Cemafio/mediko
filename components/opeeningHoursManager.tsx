"use client";

import { useEffect, useState } from "react";

type OpeningHour = {
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
};

type DaySchedule = {
  dayOfWeek: number;
  day: string;
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
};

type OpeningHoursManagerProps = {
  initialHours?: OpeningHour[];
};

const DAYS = [
  { dayOfWeek: 1, day: "Lundi" },
  { dayOfWeek: 2, day: "Mardi" },
  { dayOfWeek: 3, day: "Mercredi" },
  { dayOfWeek: 4, day: "Jeudi" },
  { dayOfWeek: 5, day: "Vendredi" },
  { dayOfWeek: 6, day: "Samedi" },
  { dayOfWeek: 0, day: "Dimanche" },
];

const DEFAULT_HOURS: OpeningHour[] = [
  { dayOfWeek: 1, opensAt: "08:00", closesAt: "19:00" },
  { dayOfWeek: 6, opensAt: "08:00", closesAt: "13:00" },
];

export default function OpeningHoursManager({
  initialHours = DEFAULT_HOURS,
}: OpeningHoursManagerProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setSchedule(
      DAYS.map(({ dayOfWeek, day }) => {
        const hours = initialHours.find(
          (item) => item.dayOfWeek === dayOfWeek
        );

        return {
          dayOfWeek,
          day,
          isOpen: Boolean(hours),
          opensAt: hours?.opensAt ?? "08:00",
          closesAt: hours?.closesAt ?? "17:00",
        };
      })
    );
  }, [initialHours]);

  function updateDay(
    dayOfWeek: number,
    changes: Partial<DaySchedule>
  ) {
    setSchedule((current) =>
      current.map((item) =>
        item.dayOfWeek === dayOfWeek
          ? { ...item, ...changes }
          : item
      )
    );
    setMessage("");
    setError("");
  }

  async function handleSave() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const openingHours: OpeningHour[] = schedule
        .filter((item) => item.isOpen)
        .map(({ dayOfWeek, opensAt, closesAt }) => ({
          dayOfWeek,
          opensAt,
          closesAt,
        }));

      for (const hour of openingHours) {
        if (hour.opensAt >= hour.closesAt) {
          throw new Error(
            `Les horaires du ${
              DAYS.find((day) => day.dayOfWeek === hour.dayOfWeek)?.day
            } sont invalides : l'heure de fermeture doit être après l'ouverture.`
          );
        }
      }

      const response = await fetch("/api/pharmacy/opening-hours", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ openingHours }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ?? "Impossible d'enregistrer les horaires."
        );
      }

      setMessage("Les horaires ont été enregistrés avec succès.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section 
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        arial-modal="true"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">
          Horaires d'ouverture
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Définissez les jours et les heures d'ouverture de votre pharmacie.
        </p>
      </div>

      <div className="space-y-3">
        {schedule.map((item) => (
          <div
            key={item.dayOfWeek}
            className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 p-3 sm:grid-cols-[110px_1fr_1fr_auto] sm:items-center"
          >
            <span className="font-medium text-slate-700">
              {item.day}
            </span>

            {item.isOpen ? (
              <>
                <label className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="w-12">De</span>
                  <input
                    type="time"
                    value={item.opensAt}
                    onChange={(e) =>
                      updateDay(item.dayOfWeek, {
                        opensAt: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="w-12">À</span>
                  <input
                    type="time"
                    value={item.closesAt}
                    onChange={(e) =>
                      updateDay(item.dayOfWeek, {
                        closesAt: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </>
            ) : (
              <span className="text-sm text-red-500 sm:col-span-2">
                Fermé
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                updateDay(item.dayOfWeek, {
                  isOpen: !item.isOpen,
                })
              }
              aria-pressed={item.isOpen}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                item.isOpen
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.isOpen ? "Ouvert" : "Ouvrir"}
            </button>
          </div>
        ))}
      </div>

      {message && (
        <p role="status" className="mt-4 text-sm text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || schedule.length === 0}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer les horaires"}
        </button>
      </div>
    </section>
  );
}
