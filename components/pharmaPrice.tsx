import Link from "next/link";

type PharmacyPriceCardProps = {
    pharmacy: {
        id: string;
        name: string;
        address?: string | null;
        city?: string | null;
        phone?: string | null;
    };
    price: number;
    quantity: number;
    isCheapest?: boolean;
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price);

function getStock(quantity: number) {
    if (quantity <= 0) {
        return { label: "Rupture de stock", style: "bg-red-50 text-red-700" };
    }
    if (quantity <= 8) {
        return { label: "Stock faible", style: "bg-amber-50 text-amber-700" };
    }
    return { label: "En stock", style: "bg-emerald-50 text-emerald-700" };
}

export default function PharmacyPriceCard({
    pharmacy,
    price,
    quantity,
    isCheapest = false,
}: PharmacyPriceCardProps) {
    const stock = getStock(quantity);
    const phoneHref = pharmacy.phone
        ? `tel:${pharmacy.phone.replace(/[^\d+]/g, "")}`
        : null;

    return (
        <article
            className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                isCheapest ? "border-emerald-300 ring-1 ring-emerald-200" : ""
            }`}
        >
            {isCheapest && quantity > 0 && (
                <span className="absolute -top-3 left-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    Meilleur prix
                </span>
            )}

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900">
                        {pharmacy.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                        {[pharmacy.address, pharmacy.city]
                            .filter(Boolean)
                            .join(", ")}
                    </p>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-xl font-extrabold text-slate-950">
                        {formatPrice(price)}
                        <span className="ml-1 text-sm font-semibold text-slate-500">
                            Ar
                        </span>
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${stock.style}`}
                >
                    {stock.label}
                </span>

                <div className="flex gap-2">
                    {phoneHref && (
                        <a
                            href={phoneHref}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Appeler
                        </a>
                    )}

                    <Link
                        href={`/pharmacies/${pharmacy.id}`}
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700"
                    >
                        Voir la pharmacie
                    </Link>
                </div>
            </div>
        </article>
    );
}