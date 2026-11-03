import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin/")({ component: Dashboard });
type Vehicle = { id: string; name: string; brand: string; year: number; price: number; status: string; images: string[] };
type Brand = { id: string; name: string };

function Dashboard() {
  const nav = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [items, setItems] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandName, setBrandName] = useState("");
  const [error, setError] = useState("");
  const [brandBusy, setBrandBusy] = useState(false);

  async function load() {
    const [vehiclesResponse, brandsResponse] = await Promise.all([
      fetch("/api/admin/vehicles"),
      fetch("/api/admin/brands"),
    ]);
    const vehicleData = await vehiclesResponse.json();
    const brandData = await brandsResponse.json();
    if (vehiclesResponse.status === 401 || brandsResponse.status === 401) {
      await nav({ to: "/admin/login" });
      return;
    }
    if (!vehiclesResponse.ok || !brandsResponse.ok) {
      setError(vehicleData.error || brandData.error || "Erreur de chargement.");
      return;
    }
    setItems(vehicleData.vehicles);
    setBrands(brandData.items);
  }

  useEffect(() => {
    if (!isPending && session?.user.role === "admin") void load();
    else if (!isPending && !session) void nav({ to: "/admin/login" });
  }, [isPending, session?.user.id]);

  async function removeVehicle(id: string) {
    if (!confirm("Supprimer ce véhicule ?")) return;
    const response = await fetch("/api/admin/vehicles?id=" + encodeURIComponent(id), { method: "DELETE" });
    if (response.ok) setItems((current) => current.filter((vehicle) => vehicle.id !== id));
    else setError("Suppression impossible.");
  }

  async function addBrand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBrandBusy(true);
    setError("");
    const response = await fetch("/api/admin/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: brandName }),
    });
    const data = await response.json();
    setBrandBusy(false);
    if (!response.ok) {
      setError(data.error || "Impossible d'ajouter cette marque.");
      return;
    }
    setBrands((current) => [...current, data.brand].sort((a, b) => a.name.localeCompare(b.name, "fr")));
    setBrandName("");
  }

  async function removeBrand(brand: Brand) {
    if (!confirm(`Supprimer la marque ${brand.name} ?`)) return;
    const response = await fetch("/api/admin/brands?id=" + encodeURIComponent(brand.id), { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Suppression impossible.");
      return;
    }
    setBrands((current) => current.filter((item) => item.id !== brand.id));
  }

  if (isPending || !session) return <main className="p-10">Chargement…</main>;
  if (session.user.role !== "admin") return <main className="p-10">Accès refusé.</main>;

  return (
    <main className="min-h-screen bg-background px-5 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-7">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">NDIAYE AUTO SERVICE</p>
            <h1 className="mt-2 text-3xl font-semibold">Tableau de bord</h1>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="rounded-full border border-border px-4 py-3 text-sm">Voir le site</Link>
            <button onClick={() => authClient.signOut().then(() => nav({ to: "/admin/login" }))} className="rounded-full border border-border px-4 py-3 text-sm">Déconnexion</button>
          </div>
        </header>

        {error && <p role="alert" className="mt-5 rounded-xl border border-destructive/30 p-4 text-sm text-destructive">{error}</p>}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Total véhicules", items.length],
            ["Disponibles", items.filter((vehicle) => vehicle.status === "AVAILABLE").length],
            ["Vendus", items.filter((vehicle) => vehicle.status === "SOLD").length],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Stock automobile</h2>
              <p className="text-sm text-muted-foreground">Gestion des annonces et disponibilités.</p>
            </div>
            <Link to="/admin/vehicles/new" className="rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground">+ Ajouter un véhicule</Link>
          </div>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {items.map((vehicle) => (
              <article key={vehicle.id} className="flex flex-wrap items-center gap-4 p-4">
                <img src={vehicle.images[0]} alt="" className="size-20 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{vehicle.name}</p>
                  <p className="text-sm text-muted-foreground">{vehicle.brand} · {vehicle.year} · {new Intl.NumberFormat("fr-FR").format(vehicle.price)} FCFA</p>
                  <span className="text-xs text-muted-foreground">{vehicle.status}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/admin/vehicles/$vehicleId"
                    params={{ vehicleId: vehicle.id }}
                    className="rounded-full border border-border px-3 py-2 text-sm transition-colors hover:border-primary"
                  >
                    Modifier
                  </Link>
                  <button onClick={() => void removeVehicle(vehicle.id)} className="rounded-full border border-border px-3 py-2 text-sm text-destructive">Supprimer</button>
                </div>
              </article>
            ))}
            {items.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Aucun véhicule enregistré.</p>}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Marques automobiles</h2>
              <p className="mt-1 text-sm text-muted-foreground">Gérez les marques visibles sur l'accueil et disponibles lors de l'ajout d'un véhicule.</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm">{brands.length} marques</span>
          </div>
          <form onSubmit={addBrand} className="mt-5 flex flex-wrap gap-2">
            <input required minLength={2} maxLength={40} value={brandName} onChange={(event) => setBrandName(event.target.value)} placeholder="Nouvelle marque (ex. Renault)" className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm" />
            <button disabled={brandBusy} className="rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground disabled:opacity-50">{brandBusy ? "Ajout…" : "Ajouter la marque"}</button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm">
                <span>{brand.name}</span>
                <button type="button" onClick={() => void removeBrand(brand)} aria-label={`Supprimer ${brand.name}`} className="text-muted-foreground transition-colors hover:text-destructive">×</button>
              </div>
            ))}
            {brands.length === 0 && <p className="text-sm text-muted-foreground">Aucune marque configurée.</p>}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Une marque utilisée par au moins un véhicule ne peut pas être supprimée.</p>
        </section>
      </div>
    </main>
  );
}
