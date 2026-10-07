"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    router.push(
      `/medicaments?search=${encodeURIComponent(search)}`
    );
  };

  return (
    <div className="mt-10 flex w-full flex-col">
      <div className="mx-auto flex w-full max-w-2xl overflow-hidden rounded-xl border bg-white shadow-sm">
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
    </div>
  );
}