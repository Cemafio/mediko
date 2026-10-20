import { Medicine } from "@/data/medicine";
import { NextResponse } from "next/server";
import { log } from "node:console";

const API_URL = "http://localhost:3005";

type StockValues = {
  name: string;
  description: string;
  dosage: string;
  price: number;
  quantity: number;
};

export type PaginatedMedicines = {
  data: Medicine[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

// Fetch medicines from the backend

export async function getMedicines(
  page = 1,
  limit = 12,
  search = '',
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.set('search', search.trim());
  }

  const response = await fetch(
    `${process.env.API_URL}/medicine?${params.toString()}`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error('Impossible de charger les médicaments');
  }

  return response.json();
}

export async function getStockPharmacy() {
  const response = await fetch(`/api/pharmacy/stock`, {
    cache: "no-store", // le stock change : pas de cache Next.js
  });

  if (!response.ok) {
    // Récupère le message de l'API (ex. "Votre compte est en attente de validation.")
    const body = await response.json().catch(() => null);
    throw new Error(
      `Stock pharmacie : ${response.status} ${body?.message ?? response.statusText}`
    );
  }

  return response.json();
}

async function stockRequest(
  path: string,
  init: RequestInit = {},
) {
  const response = await fetch(`/api/pharmacy/stock${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message ?? response.statusText;

    throw new Error(message);
  }

  // DELETE peut parfois retourner 204 No Content.
  if (response.status === 204) return null;

  return response.json();
}

export function createMedicinesStock(values: StockValues) {
  return stockRequest("", {
    method: "POST",
    body: JSON.stringify(values),
  });
}

export function updateMedicinesStock(
  id: string,
  values: StockValues,
) {
  return stockRequest(`/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });
}

export function deleteMedicinesStock(id: string) {
  return stockRequest(`/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getOneMedicine(id: string) {
  const response = await fetch(`${API_URL}/medicine/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du médicament");
  }

  const data = await response.json();

  console.log("Médicament reçu du backend :", data);

  return data;
}

// Fetch pharmacies from the backend
export async function getPharmacies(
  page = 1,
  limit = 6,
  search = '',
  city = '',
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.set('search', search.trim());
  }

  if (city.trim()) {
    params.set('city', city.trim());
  }

  const response = await fetch(
    `${API_URL}/pharmacies?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(
      'Erreur lors de la récupération des pharmacies',
    );
  }

  return response.json();
}

export async function getCity() {
    const response = await fetch(
    `${API_URL}/pharmacies/cities`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(
      'Erreur lors de la récupération des pharmacies',
    );
  }

  return response.json();
} 

export async function getOnePharmacy() {

    const response = await fetch(`/api/pharmacy`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des pharmacies");
    }

    const data = await response.json();

    console.log("Pharmacy conected :", data);

    return data;
}

export async function getOnePharmacyById(id:string) {

    const response = await fetch(`${API_URL}/pharmacies/findById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de pharmacies, Id: ${id}`);
    }

    const data = await response.json();

    console.log("Pharmacy conected :", data);

    return data;
}

export async function signin(email: string, password: string) {
    const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ?? "Email ou mot de passe incorrect."
        );
    }

    return data;
}

export async function createPharmacie(
  name: string,
  address: string,
  city: string,
  phone: string,
  email: string,
  password: string,
  dayOfWeek: number,
  opensAt: string,
  closesAt: string,
  role:string
) {
  const response = await fetch(`${API_URL}/auth/signupPharmacy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      address,
      city,
      phone,
      email,
      password,
      role,
      openingHours: [
        {
          dayOfWeek: Number(dayOfWeek),
          opensAt,
          closesAt,
        },
      ],
    }),
  });

  const data = await response.json().catch(() => null);

  return {
    status: response.status,
    data,
  };
}

type PharmacyUpdateValues = {
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
};

export async function updatePharmacie(
  dataUpdate: PharmacyUpdateValues
) {
  const response = await fetch("/api/pharmacy", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataUpdate),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? "Erreur lors de la modification de la pharmacie."
    );
  }

  return data;
} 
