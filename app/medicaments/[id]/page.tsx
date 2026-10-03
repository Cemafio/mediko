export default async function MedicamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b bg-white px-8 py-4">
        <h1 className="text-2xl font-bold text-green-600">
          Mediko
        </h1>

        <div className="flex gap-6">
          <a href="/" className="text-gray-700 hover:text-green-600">
            Accueil
          </a>

          <a href="/medicaments" className="text-gray-700 hover:text-green-600">
            Médicaments
          </a>

          <a href="/pharmacies" className="text-gray-700 hover:text-green-600">
            Pharmacies
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Bienvenue sur la page.
          <span className="text-green-600"> médicaments {id}</span>
        </h2>


      </section>
    </main>
  );
}