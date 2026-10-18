"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, UserRound, LogOut } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "PHARMACIST";
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  // Adapte "name" selon les propriétés de ton objet user.
  const initial = user?.name?.charAt(0).toUpperCase() || "U"; 

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
          <Link href="/" className="text-sm text-slate-600 hover:text-green-600">
            Accueil
          </Link>

          <Link href="/medicaments" className="text-sm text-slate-600 hover:text-green-600">
            Médicaments
          </Link>

          <Link href="/pharmacies" className="text-sm text-slate-600 hover:text-green-600">
            Pharmacies
          </Link>

          {user != null ? (
            <div className="relative ml-2 border-l pl-6">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-1.5 pr-2 transition hover:bg-slate-50"
                aria-expanded={menuOpen}
                aria-label="Menu du compte"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                  {initial}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-slate-600 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Fermer le menu"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user.role === "PHARMACIST" ? "Pharmacie" : "Utilisateur"}
                      </p>
                    </div>

                    <Link
                      href="/profil"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <UserRound size={16} />
                      Mon profil
                    </Link>

                    {user.role === "PHARMACIST" && (
                      <Link
                        href="/espace-pharmacie"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <UserRound size={16} />
                        Espace pharmacie
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        const response = await fetch("/api/auth/logout", {
                          method: "POST",
                        });

                        if (response.ok) {
                          window.location.href = "/";
                        }
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
            ) : (
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
          )}
          
        </div>
      </div>
    </nav>
  );
}