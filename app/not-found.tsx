export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900">
          404
        </h1>

        <p className="mt-4 text-xl text-slate-600">
          Médicament introuvable
        </p>

        <p className="mt-2 text-slate-500">
          Le médicament que vous recherchez n'existe pas.
        </p>
      </div>
    </main>
  );
}