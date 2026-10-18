"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Pill,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "PHARMACIST" | "PHARMACY";
};

const links = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/medicaments", label: "Médicaments", icon: Pill },
  { href: "/pharmacies", label: "Pharmacies", icon: Building2 },
];

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // menu du compte (ordinateur)
  const [mobileOpen, setMobileOpen] = useState(false); // panneau mobile

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.id ? data : null))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  // Ferme les menus à chaque changement de page
  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Ferme avec la touche Échap
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isPharmacy = user?.role === "PHARMACIST" || user?.role === "PHARMACY";
  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  async function handleLogout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold text-white shadow-sm">
            +
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Medi<span className="text-emerald-600">ko</span>
          </span>
        </Link>

        {/* Navigation ordinateur */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive(href)
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}

          <div className="ml-3 border-l pl-5">
            {authLoading ? (
              <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-100" />
            ) : user ? (
              <div className="relative">
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
                    className={`text-slate-600 transition-transform ${menuOpen ? "rotate-180" : ""
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

                    <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                      <div className="border-b border-slate-100 px-3 py-2">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isPharmacy ? "Pharmacie" : "Utilisateur"}
                        </p>
                      </div>

                      <Link
                        href="/profil"
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <UserRound size={16} />
                        Mon profil
                      </Link>

                      {isPharmacy && (
                        <Link
                          href="/espace-pharmacie"
                          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard size={16} />
                          Espace pharmacie
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
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
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50"
                >
                  <LogIn size={16} />
                  Se connecter
                </Link>

                <Link
                  href="/signup"
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  <UserPlus size={16} />
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bouton hamburger (mobile) */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Panneau mobile */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 z-10 cursor-default bg-slate-900/20 md:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full z-20 max-h-[calc(100vh-4rem)] overflow-y-auto border-b bg-white shadow-lg md:hidden"
          >
            <div className="mx-auto max-w-6xl space-y-1 px-4 py-4">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition ${isActive(href)
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}

              <div className="my-3 border-t border-slate-100" />

              {authLoading ? (
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-base font-semibold text-white">
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isPharmacy ? "Pharmacie" : "Utilisateur"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profil"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base text-slate-700 hover:bg-slate-50"
                  >
                    <UserRound size={20} />
                    Mon profil
                  </Link>

                  {isPharmacy && (
                    <Link
                      href="/espace-pharmacie"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard size={20} />
                      Espace pharmacie
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={20} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="grid gap-3 pt-1 sm:grid-cols-2">
                  <Link
                    href="/signin"
                    className="flex items-center justify-center gap-2 rounded-xl border border-green-600 px-4 py-3 text-base font-medium text-green-600 transition hover:bg-green-50"
                  >
                    <LogIn size={18} />
                    Se connecter
                  </Link>

                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-base font-medium text-white transition hover:bg-green-700"
                  >
                    <UserPlus size={18} />
                    S&apos;inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}