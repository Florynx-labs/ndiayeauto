import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import imageCompression from "browser-image-compression";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin/vehicles/$vehicleId")({
  component: EditVehicle,
});

type VehicleForm = {
  name: string;
  brand: string;
  year: number;
  mileage: number;
  fuel: "Essence" | "Diesel" | "Hybride" | "Électrique";
  transmission: "Automatique" | "Manuelle";
  price: number;
  body: "SUV" | "Berline" | "Pickup" | "Utilitaire" | "Citadine" | "Coupé";
  engine: string;
  location: string;
  history: string;
  description: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
};

type VehicleRecord = VehicleForm & {
  id: string;
  slug: string;
  features: string[];
  images: string[];
};

const field =
  "mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none";

const emptyForm: VehicleForm = {
  name: "",
  brand: "",
  year: new Date().getFullYear(),
  mileage: 0,
  fuel: "Diesel",
  transmission: "Automatique",
  price: 0,
  body: "SUV",
  engine: "",
  location: "Bamako, Korofina Sud",
  history: "",
  description: "",
  status: "AVAILABLE",
};

function EditVehicle() {
  const { vehicleId } = Route.useParams();
  const nav = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [form, setForm] = useState<VehicleForm>(emptyForm);
  const [features, setFeatures] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user.role !== "admin") {
      void nav({ to: "/admin/login" });
    }
  }, [isPending, session?.user.id, session?.user.role, nav]);

  useEffect(() => {
    if (!session || session.user.role !== "admin") return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [vehicleResponse, brandsResponse] = await Promise.all([
          fetch("/api/admin/vehicles?id=" + encodeURIComponent(vehicleId)),
          fetch("/api/admin/brands"),
        ]);
        const vehicleData = await vehicleResponse.json();
        const brandData = await brandsResponse.json();
        if (!vehicleResponse.ok) throw new Error(vehicleData.error || "Véhicule introuvable.");
        if (!brandsResponse.ok) throw new Error(brandData.error || "Impossible de charger les marques.");
        if (cancelled) return;

        const vehicle = vehicleData.vehicle as VehicleRecord;
        setForm({
          name: vehicle.name,
          brand: vehicle.brand,
          year: vehicle.year,
          mileage: vehicle.mileage,
          fuel: vehicle.fuel,
          transmission: vehicle.transmission,
          price: vehicle.price,
          body: vehicle.body,
          engine: vehicle.engine || "",
          location: vehicle.location || "",
          history: vehicle.history || "",
          description: vehicle.description,
          status: vehicle.status,
        });
        setFeatures((vehicle.features || []).join("\n"));
        setImages(vehicle.images || []);
        setBrands(Array.isArray(brandData.brands) ? brandData.brands : []);
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [vehicleId, session?.user.id, session?.user.role]);

  function update<K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadFiles(files: FileList | null) {
    if (!files) return;
    setUploading(true);
    setError("");
    try {
      const selected = Array.from(files).slice(0, Math.max(0, 12 - images.length));
      for (const file of selected) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp",
        });
        const body = new FormData();
        body.append("file", compressed, "vehicle.webp");
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Envoi de la photo impossible.");
        setImages((current) => [...current, data.url]);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur lors de l'envoi des photos.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/vehicles?id=" + encodeURIComponent(vehicleId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          mileage: Number(form.mileage),
          price: Number(form.price),
          features: features.split("\n").map((item) => item.trim()).filter(Boolean),
          images,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Modification impossible.");
      await nav({ to: "/admin" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  }

  if (isPending || loading) {
    return <main className="min-h-screen bg-background p-10 text-sm text-muted-foreground">Chargement du véhicule…</main>;
  }
  if (!session || session.user.role !== "admin") return null;

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/admin" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          ← Retour au tableau de bord
        </Link>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Gestion du stock</p>
          <h1 className="mt-2 text-3xl font-semibold">Modifier le véhicule</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Les changements seront enregistrés dans la base de données et reflétés sur le site public.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Photos du véhicule</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jusqu'à 12 photos. La première photo est utilisée comme image principale.
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading || images.length >= 12}
              onChange={(event) => {
                void uploadFiles(event.target.files);
                event.currentTarget.value = "";
              }}
              className="mt-4 block w-full text-sm"
            />
            {uploading && <p className="mt-2 text-sm text-muted-foreground">Compression et envoi en cours…</p>}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((url, index) => (
                <div key={url} className="relative">
                  <img src={url} alt={`Photo ${index + 1}`} className="aspect-[4/3] w-full rounded-lg object-cover" />
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-md bg-background/90 px-2 py-1 text-[10px]">
                      Principale
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages((current) => current.filter((item) => item !== url))}
                    aria-label={`Retirer la photo ${index + 1}`}
                    className="absolute right-1 top-1 rounded-full bg-background px-2 py-1 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {images.length === 0 && <p className="mt-3 text-sm text-destructive">Ajoutez au moins une photo pour enregistrer.</p>}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Caractéristiques et annonce</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Nom / modèle
                <input required maxLength={120} value={form.name} onChange={(event) => update("name", event.target.value)} className={field} />
              </label>
              <label className="block text-sm font-medium">
                Marque
                <select required value={form.brand} onChange={(event) => update("brand", event.target.value)} className={field}>
                  <option value="">Choisir une marque</option>
                  {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Année
                <input required type="number" min={1950} max={new Date().getFullYear() + 2} value={form.year} onChange={(event) => update("year", Number(event.target.value))} className={field} />
              </label>
              <label className="block text-sm font-medium">
                Prix (FCFA)
                <input required type="number" min={1} value={form.price} onChange={(event) => update("price", Number(event.target.value))} className={field} />
              </label>
              <label className="block text-sm font-medium">
                Kilométrage (km)
                <input required type="number" min={0} value={form.mileage} onChange={(event) => update("mileage", Number(event.target.value))} className={field} />
              </label>
              <label className="block text-sm font-medium">
                Motorisation
                <input value={form.engine} onChange={(event) => update("engine", event.target.value)} className={field} />
              </label>
              <label className="block text-sm font-medium">
                Localisation
                <input value={form.location} onChange={(event) => update("location", event.target.value)} className={field} />
              </label>
              <label className="block text-sm font-medium">
                Carrosserie
                <select value={form.body} onChange={(event) => update("body", event.target.value as VehicleForm["body"])} className={field}>
                  {["SUV", "Berline", "Pickup", "Utilitaire", "Citadine", "Coupé"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Carburant
                <select value={form.fuel} onChange={(event) => update("fuel", event.target.value as VehicleForm["fuel"])} className={field}>
                  {["Essence", "Diesel", "Hybride", "Électrique"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Transmission
                <select value={form.transmission} onChange={(event) => update("transmission", event.target.value as VehicleForm["transmission"])} className={field}>
                  {["Automatique", "Manuelle"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Disponibilité
                <select value={form.status} onChange={(event) => update("status", event.target.value as VehicleForm["status"])} className={field}>
                  <option value="AVAILABLE">Disponible</option>
                  <option value="RESERVED">Réservé</option>
                  <option value="SOLD">Vendu</option>
                </select>
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium">
              Historique
              <input value={form.history} onChange={(event) => update("history", event.target.value)} className={field} />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Description
              <textarea required minLength={10} maxLength={5000} rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} className={field} />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Équipements (un par ligne)
              <textarea rows={4} value={features} onChange={(event) => setFeatures(event.target.value)} className={field} />
            </label>
          </section>

          {error && <p role="alert" className="rounded-xl border border-destructive/30 p-4 text-sm text-destructive">{error}</p>}
          <div className="flex flex-wrap justify-end gap-3">
            <Link to="/admin" className="rounded-full border border-border px-5 py-3 text-sm">Annuler</Link>
            <button
              type="submit"
              disabled={busy || uploading || images.length === 0}
              className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
