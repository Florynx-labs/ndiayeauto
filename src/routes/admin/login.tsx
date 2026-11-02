import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
export const Route = createFileRoute("/admin/login")({ component: Login });
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    const result = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (result.error) { setError("Identifiants invalides."); return; }
    if (result.data.user.role !== "admin") { await authClient.signOut(); setError("Accès administrateur requis."); return; }
    await navigate({ to: "/admin" });
  }
  return <main className="grid min-h-screen place-items-center bg-background px-5"><div className="w-full max-w-md rounded-3xl border border-border bg-card p-9"><Link to="/" className="text-sm text-muted-foreground">← Retour au site</Link><p className="mt-8 text-xs uppercase tracking-widest text-muted-foreground">Espace sécurisé</p><h1 className="mt-2 text-3xl font-semibold">Administration</h1><p className="mt-3 text-sm text-muted-foreground">Accès réservé à l'équipe NDIAYE AUTO.</p><form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-sm">Adresse e-mail<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background p-3"/></label><label className="block text-sm">Mot de passe<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background p-3"/></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button disabled={busy} className="w-full rounded-full bg-primary p-3 font-medium text-primary-foreground">{busy ? "Connexion…" : "Se connecter"}</button></form><p className="mt-5 text-center text-xs text-muted-foreground">Les inscriptions publiques sont désactivées.</p></div></main>;
}
