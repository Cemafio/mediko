import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-4 font-medium text-green-600">
          Votre recherche de médicaments simplifiée
        </p>

        <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Trouvez votre médicament
          <span className="text-green-600"> facilement</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Recherchez un médicament et découvrez les pharmacies
          qui pourraient le proposer près de chez vous.
        </p>

        {/* Search */}
        <SearchBar />
      </section>

      {/* Popular medicines */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h3 className="mb-6 text-2xl font-bold text-slate-900">
          Recherches populaires
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <h4 className="font-semibold">Paracétamol</h4>
            <p className="mt-2 text-sm text-slate-500">
              Antalgique
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h4 className="font-semibold">Amoxicilline</h4>
            <p className="mt-2 text-sm text-slate-500">
              Antibiotique
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h4 className="font-semibold">Ibuprofène</h4>
            <p className="mt-2 text-sm text-slate-500">
              Antalgique
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}