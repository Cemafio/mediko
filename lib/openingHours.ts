const TIMEZONE = "Indian/Antananarivo";

const DAY_INDEX: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

export const DAY_NAMES = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
];

export type OpeningSlot = {
    dayOfWeek: number;
    opensAt: string; // "08:00"
    closesAt: string; // "19:00"
};

/** "08:30" -> 510 */
export function toMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

/** Jour et heure actuels à Madagascar, quel que soit le fuseau du serveur */
export function getNow() {
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
        dayIndex: DAY_INDEX[get("weekday")],
        minutes: Number(get("hour")) * 60 + Number(get("minute")),
    };
}

export function getOpenStatus(slots: OpeningSlot[] = []) {
    const { dayIndex, minutes } = getNow();
    const previousDay = (dayIndex + 6) % 7;

    let closesAt: string | null = null;

    for (const slot of slots) {
        const start = toMinutes(slot.opensAt);
        const end = toMinutes(slot.closesAt);
        const overnight = end <= start;

        // Plages d'aujourd'hui
        if (slot.dayOfWeek === dayIndex) {
            const open = overnight
                ? minutes >= start
                : minutes >= start && minutes < end;

            if (open) closesAt = slot.closesAt;
        }

        // Plage de la veille qui déborde après minuit
        if (slot.dayOfWeek === previousDay && overnight && minutes < end) {
            closesAt = slot.closesAt;
        }
    }

    return {
        todayIndex: dayIndex,
        today: DAY_NAMES[dayIndex],
        isOpen: closesAt !== null,
        closesAt,
    };
}

/** Semaine complète, du lundi au dimanche, prête à afficher */
export function getWeekSchedule(slots: OpeningSlot[] = []) {
    return [1, 2, 3, 4, 5, 6, 0].map((day) => {
        const daySlots = slots
            .filter((s) => s.dayOfWeek === day)
            .sort((a, b) => a.opensAt.localeCompare(b.opensAt));

        return {
            dayIndex: day,
            day: DAY_NAMES[day],
            closed: daySlots.length === 0,
            label: daySlots.length
                ? daySlots.map((s) => `${s.opensAt} - ${s.closesAt}`).join(" · ")
                : "Fermé",
        };
    });
}

/** Résumé compact : regroupe les jours consécutifs ayant les mêmes horaires */
export function getScheduleSummary(slots: OpeningSlot[] = []) {
    const week = getWeekSchedule(slots);

    const groups: { days: string[]; label: string; closed: boolean }[] = [];

    for (const d of week) {
        const last = groups[groups.length - 1];

        if (last && last.label === d.label) {
            last.days.push(d.day.slice(0, 3));
        } else {
            groups.push({
                days: [d.day.slice(0, 3)],
                label: d.label,
                closed: d.closed,
            });
        }
    }

    return groups.map((g) => ({
        days:
            g.days.length === 1
                ? g.days[0]
                : `${g.days[0]} - ${g.days[g.days.length - 1]}`,
        label: g.label,
        closed: g.closed,
    }));
}