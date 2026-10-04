"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
    label?: string;
    fallbackHref?: string;
};

export default function BackButton({
    label = "Page précédente",
    fallbackHref = "/",
}: BackButtonProps) {
    const router = useRouter();

    function handleBack() {
        // S'il y a un historique, on revient en arrière.
        // Sinon (page ouverte directement par lien), on va vers la page de secours.
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackHref);
        }
    }

    return (
        <button
            type="button"
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-1 text-sm text-slate-600 transition hover:text-green-600"
        >
            <span aria-hidden="true">←</span> {label}
        </button>
    );
}