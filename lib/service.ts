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