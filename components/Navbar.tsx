import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold text-white shadow-sm">
                +
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Medi<span className="text-emerald-600">ko</span>
            </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-green-600"
          >
            Accueil
          </Link>

          <Link
            href="/medicaments"
            className="text-sm text-slate-600 hover:text-green-600"
          >
            Médicaments
          </Link>

          <Link
            href="/pharmacies"
            className="text-sm text-slate-600 hover:text-green-600"
          >
            Pharmacies
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-slate-600 hover:text-green-600"
          >
            Dashboard
          </Link>

          <div className="ml-2 flex items-center gap-3 border-l pl-6">
            <Link
              href="/signin"
              className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50"
            >
              Se connecter
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}