import { useLoaderData } from "react-router-dom";

// Cette fonction n'est PAS un composant React — c'est appelée par React Router avant l'affichage
export async function loadProjectsData() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/projets`);
  if (!res.ok) throw new Response("Erreur de chargement", { status: res.status });
  return res.json();
}

export default function Projects() {
  const projets = useLoaderData(); // récupère ce que loadProjectsData a retourné
  return (
    <div>
      <h1>Projets</h1>
      <p>{projets.length} projets</p>
    </div>
  );
}