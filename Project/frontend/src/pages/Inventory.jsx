import { useLoaderData } from "react-router-dom";

// Cette fonction n'est PAS un composant React — c'est appelée par React Router avant l'affichage
export async function loadInventoryData() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/materiel`);
  if (!res.ok) throw new Response("Erreur de chargement", { status: res.status });
  return res.json();
}

export default function Inventory() {
  const inventory = useLoaderData(); // récupère ce que loadInventoryData a retourné
  return (
    <div>
      <h1>Inventaire</h1>
      <p>{inventory.length} items</p>
    </div>
  );
}