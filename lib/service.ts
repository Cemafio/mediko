import { log } from "node:console";

const API_URL = "http://localhost:3005";
// Fetch medicines from the backend
export async function getMedicines() {
  const response = await fetch(`${API_URL}/medicine`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des médicaments");
  }

  const data = await response.json();

  console.log("Médicaments reçus du backend :", data);

  return data;
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
export async function getPharmacies() {
  const response = await fetch(`${API_URL}/pharmacies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des pharmacies");
  }

  const data = await response.json();

  console.log("Pharmacies reçues du backend :", data);

  return data;
}
export async function signin(email:string, password:string){
  const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          email: email,
          password: password,
        }
      )
  });

  if (!response.ok) {
    console.log(response);
    
    throw new Error(`Erreur lors de la connexion.`);
  }

  const data = await response.json();

  console.log("Connexion réussie :", data);

  return data;

}

export async function createPharmacie(
  name: string,
  address: string,
  city: string,
  phone: string,
  email: string,
  dayOfWeek: number,
  opensAt: string,
  closesAt: string
) {
  const response = await fetch(`${API_URL}/pharmacies`, {
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
      openingHours: [
        {
          dayOfWeek,
          opensAt,
          closesAt,
        },
      ],
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Erreur API :", data);

    throw new Error(
      Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message ?? "Erreur lors de l'inscription de la pharmacie."
    );
  }

  console.log("Inscription réussie :", data);

  return data;
}
