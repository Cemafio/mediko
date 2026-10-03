"use client";

import { useState } from "react";
import MedicineCard from "./MedicineCard";
import { medicines } from "@/data/medicine";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<typeof medicines>([]);

 
    const handleSearch = () => {
        const filteredMedicines = medicines.filter((medicine) =>
            medicine.name.toLowerCase().includes(search.toLowerCase())
        );

        setResults(filteredMedicines);
    };
    
  return (
    <div className="mt-10 flex w-full max-w-2xl flex-col">
      <div className="flex overflow-hidden rounded-xl border bg-white shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
                handleSearch();
            }
            }}
          placeholder="Rechercher un médicament..."
          className="flex-1 px-5 py-4 text-black outline-none"
        />

        <button
          onClick={handleSearch}
          className="bg-green-600 px-7 font-medium text-white hover:bg-green-700"
        >
          Rechercher
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-500 mt-8">
        {/* Valeur actuelle : {search} */}
      </p>

      {search && results.length === 0 && (
        <p className="mt-4 text-center text-sm text-slate-500">
            Aucun médicament trouvé.
        </p>
        )}

        {results.map((medicine) => (
        <MedicineCard 
            key={medicine.id}
            medicine={medicine} 
        />
        ))}    
    </div>
  );
}