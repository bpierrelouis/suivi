import { Form, useActionData, redirect } from "react-router-dom";

export async function loginAction({ request }) {
  const formData = await request.formData();
  const identifiant = formData.get("identifiant");
  const mot_de_passe = formData.get("mot_de_passe");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifiant, mot_de_passe }),
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data.error };
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  return redirect("/dashboard");
}

export default function Login() {
  const actionData = useActionData();

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#2563eb" />
            <path d="M7 8h10M7 12h10M7 16h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          SUIVI
        </div>

        <div className="card card-pad">
          <div className="auth-title" style={{ marginBottom: 20 }}>
            <h1>Connexion</h1>
            <p>Accède à ton espace de gestion</p>
          </div>

          <Form method="post" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-field">
              <label htmlFor="identifiant">Identifiant</label>
              <input id="identifiant" name="identifiant" type="email" placeholder="alexandre@labo.fr" required />
            </div>
            <div className="form-field">
              <label htmlFor="mot_de_passe">Mot de passe</label>
              <input id="mot_de_passe" name="mot_de_passe" type="password" placeholder="••••••••" required />
            </div>
            <div className="flex items-center" style={{ justifyContent: "space-between", fontSize: 13 }}>
              <label className="checkline"><input type="checkbox" /> Se souvenir de moi</label>
              <a href="#">Mot de passe oublié ?</a>
            </div>

            {actionData?.error && <p style={{ color: "var(--danger)" }}>{actionData.error}</p>}

            <button type="submit" className="btn btn-primary btn-block">Se connecter</button>
          </Form>
        </div>

        <p className="auth-foot">Espace Admin — démo SUIVI · Intradef simulé</p>
      </div>
    </div>
  );
}