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

export type OpeningHours = { day: string; open: string; close: string };

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
        day: EN_TO_FR[get("weekday")],
        minutes: Number(get("hour")) * 60 + Number(get("minute")),
    };
}

function toMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

export function getOpenStatus(openingHours: OpeningHours[] = []) {
    const { day, minutes } = getNow();
    const todayHours = openingHours.find((h) => h.day === day);

    if (!todayHours || todayHours.open === "Fermé") {
        return { today: day, isOpen: false, closesAt: null as string | null };
    }

    const start = toMinutes(todayHours.open);
    const end = toMinutes(todayHours.close);

    // Gère aussi les horaires qui passent minuit (ex. 20:00 - 02:00)
    const isOpen =
        end > start
            ? minutes >= start && minutes < end
            : minutes >= start || minutes < end;

    return {
        today: day,
        isOpen,
        closesAt: isOpen ? todayHours.close : null,
    };
}