"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "patient" | "pharmacy";

const API_URL = "http://localhost:3005";

const config = {
    patient: {
        icon: "👤",
        title: "Créer un compte patient",
        subtitle: "Rejoignez Mediko pour rechercher vos médicaments.",
        submit: "Créer mon compte",
    },
    pharmacy: {
        icon: "🏥",
        title: "Inscrire ma pharmacie",
        subtitle:
            "Recevez les demandes des patients et répondez-leur directement.",
        submit: "Envoyer ma demande d'inscription",
    },
} as const;

const inputClass =
    "w-full rounded-lg border px-4 py-3 text-black outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

function Field({
    id,
    label,
    children,
    hint,
}: {
    id: string;
    label: string;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-slate-700">
                {label}
            </label>
            {children}
            {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
    );
}

function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [role, setRole] = useState<Role>(
        searchParams.get("type") === "pharmacie" ? "pharmacy" : "patient"
    );

    // Champs communs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Champs pharmacie
    const [pharmacyName, setPharmacyName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [accepted, setAccepted] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pharmacySent, setPharmacySent] = useState(false);

    const current = config[role];

    function switchRole(next: Role) {
        if (next === role) return;
        setRole(next);
        setError("");
    }

    function validate() {
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            return "Veuillez remplir tous les champs obligatoires.";
        }

        if (role === "pharmacy") {
            if (!pharmacyName.trim() || !address.trim() || !city.trim() || !phone.trim()) {
                return "Veuillez remplir toutes les informations de la pharmacie.";
            }
            if (!/^[+\d][\d\s().-]{6,}$/.test(phone.trim())) {
                return "Le numéro de téléphone n'est pas valide.";
            }
            if (!accepted) {
                return "Vous devez confirmer que vous représentez cette pharmacie.";
            }
        }

        if (password.length < 8) {
            return "Le mot de passe doit contenir au moins 8 caractères.";
        }

        if (password !== confirmPassword) {
            return "Les mots de passe ne correspondent pas.";
        }

        return "";
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {  
        e.preventDefault();

        const message = validate();
        if (message) {
            setError(message);
            return;
        }

        setError("");

        const payload =
            role === "patient"
                ? {
                    //   role: "PATIENT",
                      name: name.trim(),
                      email: email.trim(),
                      password,
                  }
                : {
                    //   role: "PHARMACY",
                      name: name.trim(), // nom du responsable
                      email: email.trim(),
                      password,
                      pharmacy: {
                          name: pharmacyName.trim(),
                          address: address.trim(),
                          city: city.trim(),
                          phone: phone.trim(),
                      },
                  };

        try {
            setLoading(true);

            const res = await fetch(`http://localhost:3005/auth/signup`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 409) {
                setError("Un compte existe déjà avec cet email.");
                return;
            }

            if (!res.ok) {
                setError("Une erreur est survenue. Veuillez réessayer.");
                return;
            }

            if (role === "pharmacy") {
                // Le compte pharmacie doit être validé avant utilisation
                setPharmacySent(true);
            } else {
                router.push("/signin");
            }
        } catch {
            setError("Impossible de joindre le serveur. Réessayez.");
        } finally {
            setLoading(false);
        }
    }

    /* Écran de confirmation après l'inscription d'une pharmacie */
    if (pharmacySent) {
        return (
            <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-6 py-12">
                <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
                    <div
                        aria-hidden="true"
                        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl ring-1 ring-green-100"
                    >
                        ✅
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-slate-900">
                        Demande envoyée
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        Merci ! Votre demande d&apos;inscription pour{" "}
                        <strong className="text-slate-900">{pharmacyName}</strong>{" "}
                        est en cours de vérification. Vous pourrez vous connecter
                        dès qu&apos;elle sera validée par l&apos;équipe Mediko.
                    </p>
                    <Link
                        href="/signin"
                        className="mt-6 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                    >
                        Retour à la connexion
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-6 py-12">
            <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
                {/* Sélecteur du type de compte */}
                <div
                    role="tablist"
                    aria-label="Type de compte"
                    className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1"
                >
                    {(["patient", "pharmacy"] as const).map((r) => (
                        <button
                            key={r}
                            type="button"
                            role="tab"
                            aria-selected={role === r}
                            onClick={() => switchRole(r)}
                            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                                role === r
                                    ? "bg-white text-green-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {r === "patient" ? "Patient" : "Pharmacie"}
                        </button>
                    ))}
                </div>

                {/* En-tête */}
                <div className="mt-6 flex items-start gap-3">
                    <div
                        aria-hidden="true"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-xl ring-1 ring-green-100"
                    >
                        {current.icon}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {current.title}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {current.subtitle}
                        </p>
                    </div>
                </div>

                {role === "pharmacy" && (
                    <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                        Votre inscription sera vérifiée avant l&apos;activation du
                        compte. Vous pourrez ensuite renseigner vos horaires et
                        recevoir les demandes des patients.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    {/* Bloc pharmacie */}
                    {role === "pharmacy" && (
                        <fieldset className="flex flex-col gap-4 rounded-xl border p-4">
                            <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Informations de la pharmacie
                            </legend>

                            <Field id="pharmacyName" label="Nom de la pharmacie">
                                <input
                                    id="pharmacyName"
                                    type="text"
                                    value={pharmacyName}
                                    onChange={(e) => setPharmacyName(e.target.value)}
                                    placeholder="Pharmacie Analakely"
                                    autoComplete="organization"
                                    className={inputClass}
                                />
                            </Field>

                            <Field id="address" label="Adresse">
                                <input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Rue, quartier"
                                    autoComplete="street-address"
                                    className={inputClass}
                                />
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field id="city" label="Ville">
                                    <input
                                        id="city"
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Antananarivo"
                                        autoComplete="address-level2"
                                        className={inputClass}
                                    />
                                </Field>

                                <Field id="phone" label="Téléphone">
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+261 20 22 000 00"
                                        autoComplete="tel"
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                        </fieldset>
                    )}

                    {/* Bloc compte */}
                    <Field
                        id="name"
                        label={role === "pharmacy" ? "Nom du responsable" : "Nom complet"}
                    >
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={
                                role === "pharmacy" ? "Dr Jean Rakoto" : "Jean Rakoto"
                            }
                            autoComplete="name"
                            className={inputClass}
                        />
                    </Field>

                    <Field
                        id="email"
                        label={role === "pharmacy" ? "Email professionnel" : "Email"}
                    >
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={
                                role === "pharmacy"
                                    ? "contact@mapharmacie.mg"
                                    : "vous@exemple.com"
                            }
                            autoComplete="email"
                            className={inputClass}
                        />
                    </Field>

                    <Field id="password" label="Mot de passe">
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="8 caractères minimum"
                                autoComplete="new-password"
                                className={`${inputClass} pr-20`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-green-700"
                            >
                                {showPassword ? "Masquer" : "Afficher"}
                            </button>
                        </div>
                    </Field>

                    <Field id="confirmPassword" label="Confirmer le mot de passe">
                        <input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className={inputClass}
                        />
                    </Field>

                    {role === "pharmacy" && (
                        <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="mt-0.5 h-4 w-4 accent-green-600"
                            />
                            Je confirme représenter cette pharmacie et être
                            autorisé(e) à l&apos;inscrire sur Mediko.
                        </label>
                    )}

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 rounded-lg bg-green-600 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Envoi en cours..." : current.submit}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Déjà un compte ?{" "}
                    <Link
                        href="/signin"
                        className="font-medium text-green-600 hover:underline"
                    >
                        Se connecter
                    </Link>
                </p>
            </div>
        </main>
    );
}

// useSearchParams doit être dans un <Suspense> pour que le build Next.js passe
export default function SignUpPage() {
    return (
        <Suspense fallback={null}>
            <SignUpForm />
        </Suspense>
    );
}