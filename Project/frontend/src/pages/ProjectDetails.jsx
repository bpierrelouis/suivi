import { useLoaderData } from "react-router-dom";

// Cette fonction n'est PAS un composant React — c'est appelée par React Router avant l'affichage
export async function loadProjectDetailsData({params}) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/projets/${params.projectId}`);
  if (!res.ok) throw new Response("Erreur de chargement", { status: res.status });
  return res.json();
}

export default function ProjectDetails() {
  const project = useLoaderData(); // récupère ce que loadProjectDetailsData a retourné
  return (
    <div>
      <h1>Détails du projet</h1>
      <p>{project.nom}</p>
    </div>
  );
}
