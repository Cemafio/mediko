export default function Loading() {
    return (
        <main className="min-h-screen bg-slate-50">
            <section className="border-b bg-gradient-to-b from-green-50 to-white">
                <div className="mx-auto max-w-5xl px-6 pb-10 pt-12">
                    <div className="h-4 w-20 animate-pulse rounded bg-green-100" />
                    <div className="mt-3 h-9 w-56 animate-pulse rounded bg-slate-200" />
                    <div className="mt-4 h-4 w-80 max-w-full animate-pulse rounded bg-slate-200" />
                    <div className="mt-6 h-12 max-w-2xl animate-pulse rounded-xl bg-white shadow-sm" />
                </div>
            </section>

            <div className="mx-auto max-w-5xl px-6 py-10">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-28 animate-pulse rounded-2xl border bg-white"
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}