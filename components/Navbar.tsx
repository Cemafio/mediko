import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-green-600"
        >
          Mediko
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
        </div>
      </div>
    </nav>
  );
}