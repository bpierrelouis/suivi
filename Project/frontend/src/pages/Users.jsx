import { useLoaderData } from "react-router-dom";

// Cette fonction n'est PAS un composant React — c'est appelée par React Router avant l'affichage
export async function loadUsersData() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/utilisateurs`);
  if (!res.ok) throw new Response("Erreur de chargement", { status: res.status });
  return res.json();
}

export default function Users() {
  const users = useLoaderData(); // récupère ce que loadUserData a retourné
  return (
    <div>
      <h1>Utilisateurs</h1>
      <p>{users.length} utilisateurs</p>
    </div>
  );
}