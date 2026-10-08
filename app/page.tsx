import Link from "next/link";
import SearchBar from "@/components/SearchBar";

const popularMedicines = [
    { name: "Paracétamol", category: "Antalgique", icon: "💊", tint: "bg-green-100" },
    { name: "Amoxicilline", category: "Antibiotique", icon: "🧪", tint: "bg-sky-100" },
    { name: "Ibuprofène", category: "Anti-inflammatoire", icon: "🩹", tint: "bg-amber-100" },
];

const steps = [
    {
        icon: "🔍",
        title: "Recherchez",
        text: "Tapez le nom du médicament dont vous avez besoin.",
    },
    {
        icon: "🏥",
        title: "Comparez",
        text: "Consultez les pharmacies qui pourraient le proposer.",
    },
    {
        icon: "📍",
        title: "Rendez-vous sur place",
        text: "Vérifiez les horaires, appelez ou lancez l'itinéraire.",
    },
];

const highlights = ["Gratuit", "Rapide", "Sans inscription"];

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-slate-50">
                {/* Halos décoratifs */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green-200/40 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 top-32 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
                />

                <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-24 text-center">
                    <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-1.5 text-sm font-medium text-green-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Votre recherche de médicaments simplifiée
                    </span>

                    <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
                        Trouvez votre médicament{" "}
                        <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                            facilement
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
                        Recherchez un médicament et découvrez les pharmacies qui
                        pourraient le proposer près de chez vous.
                    </p>

                    <div className="mt-10 w-full">
                        <SearchBar />
                    </div>

                    <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
                        {highlights.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
                                    ✓
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Recherches populaires */}
            <section className="mx-auto max-w-5xl px-6 py-16">
                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Recherches populaires
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Les médicaments les plus consultés
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {popularMedicines.map((medicine) => (
                        <Link
                            key={medicine.name}
                            href="/medicaments"
                            className="group flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
                        >
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${medicine.tint}`}
                            >
                                {medicine.icon}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-slate-900">
                                    {medicine.name}
                                </h3>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    {medicine.category}
                                </p>
                            </div>

                            <span
                                aria-hidden="true"
                                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-green-600"
                            >
                                →
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Comment ça marche */}
            <section className="border-y bg-white">
                <div className="mx-auto max-w-5xl px-6 py-16">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Comment ça marche ?
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Trois étapes pour trouver votre traitement
                        </p>
                    </div>

                    <div className="mt-10 grid gap-8 md:grid-cols-3">
                        {steps.map((step, index) => (
                            <div key={step.title} className="relative text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl ring-1 ring-green-100">
                                    {step.icon}
                                </div>

                                <span className="mt-4 inline-block rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                                    Étape {index + 1}
                                </span>

                                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                                    {step.title}
                                </h3>
                                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bandeau final */}
            <section className="mx-auto max-w-5xl px-6 py-16">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 px-8 py-12 text-center shadow-lg md:px-16">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-white/10"
                    />

                    <div className="relative">
                        <h2 className="text-2xl font-bold text-white md:text-3xl">
                            Besoin d&apos;une pharmacie près de vous ?
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-green-50">
                            Consultez les horaires, les coordonnées et les
                            médicaments disponibles dans chaque pharmacie.
                        </p>  

                        <Link
                            href="/pharmacies"
                            className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-green-700 shadow-sm transition hover:bg-green-50"
                        >
                            Voir les pharmacies
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}