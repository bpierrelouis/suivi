const API_URL = "/api";

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "ERREUR_RESEAU");
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function apiBlob(path) {
  const response = await fetch(`${API_URL}${path}`, { credentials: "include" });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.error || "ERREUR_RESEAU");
    error.status = response.status;
    throw error;
  }
  return {
    blob: await response.blob(),
    disposition: response.headers.get("Content-Disposition") || "",
  };
}

export async function apiFile(path, file) {
  const bytes = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const empreinte = [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
  const authorization = await api(`${path}/autorisation`, {
    method: "POST",
    body: JSON.stringify({ nomFichier: file.name, typeMime: file.type, taille: file.size, empreinte }),
  });
  const upload = await fetch(authorization.uploadUrl, { method: "PUT", headers: authorization.headers, body: file });
  if (!upload.ok) throw new Error("ENVOI_STOCKAGE_ECHOUE");
  return api(`${path}/${authorization.pieceJointe.id}/confirmation`, { method: "POST" });
}
