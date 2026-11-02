import { createFileRoute } from "@tanstack/react-router";
import { Heart, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { VehicleCard } from "@/components/site/VehicleCard";
import { type Vehicle } from "@/data/vehicles";
import { getPublicBrands, getPublicVehicles } from "@/lib/vehicles.server";

export const Route = createFileRoute("/catalogue/")({
  head: () => ({
    meta: [
      { title: "Catalogue de véhicules — NDIAYE AUTO SERVICE" },
      {
        name: "description",
        content:
          "Parcourez nos SUV, berlines, pickups et utilitaires disponibles à Bamako. Recherche instantanée, filtres et tri par prix, année ou popularité.",
      },
      { property: "og:title", content: "Catalogue de véhicules — NDIAYE AUTO SERVICE" },
      {
        property: "og:description",
        content: "SUV, berlines, pickups et utilitaires disponibles à Bamako.",
      },
      { property: "og:url", content: "/catalogue" },
    ],
    links: [{ rel: "canonical", href: "/catalogue" }],
  }),
  loader: async () => ({ vehicles: await getPublicVehicles(), brands: await getPublicBrands() }),
  component: CataloguePage,
});

const bodies = ["SUV", "Berline", "Pickup", "Utilitaire"] as const;
const fuels = ["Essence", "Diesel", "Hybride"] as const;
const transmissions = ["Automatique", "Manuelle"] as const;
const PER_PAGE = 6;

type Sort = "recent" | "price-asc" | "price-desc" | "popular";

function CataloguePage() {
  const { vehicles, brands } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [body, setBody] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [minYear, setMinYear] = useState(2015);
  const [maxMileage, setMaxMileage] = useState(150000);
  const [sort, setSort] = useState<Sort>("recent");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => { try { setFavorites(JSON.parse(localStorage.getItem("ndiaye-auto:favorites") || "[]")); } catch { setFavorites([]); } }, []);
  useEffect(() => { localStorage.setItem("ndiaye-auto:favorites", JSON.stringify(favorites)); }, [favorites]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = vehicles.filter((v: Vehicle) => {
      if (q && !`${v.name} ${v.brand} ${v.body}`.toLowerCase().includes(q)) return false;
      if (brand && v.brand !== brand) return false;
      if (body && v.body !== body) return false;
      if (fuel && v.fuel !== fuel) return false;
      if (transmission && v.transmission !== transmission) return false;
      if (v.price > maxPrice) return false;
      if (v.year < minYear) return false;
      if (v.mileage > maxMileage) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "popular") sorted.sort((a, b) => b.popularity - a.popularity);
    if (sort === "recent") sorted.sort((a, b) => b.year - a.year);
    return sorted;
  }, [query, brand, body, fuel, transmission, maxPrice, minYear, maxMileage, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const selectClass =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none";

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Catalogue</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">Nos véhicules disponibles</h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            Recherche instantanée, filtres détaillés et photos haute définition.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="h-max rounded-[18px] border border-border bg-card p-6 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal className="size-4 text-primary" />
              Filtres
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="q" className="mb-2 block text-xs text-muted-foreground">
                  Recherche
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="q"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Modèle, marque…"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pr-3 pl-9 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="brand" className="mb-2 block text-xs text-muted-foreground">
                  Marque
                </label>
                <select id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={selectClass}>
                  <option value="">Toutes</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="mb-2 block text-xs text-muted-foreground">Carrosserie</span>
                <div className="flex flex-wrap gap-2">
                  {bodies.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBody((v) => (v === b ? "" : b))}
                      aria-pressed={body === b}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        body === b
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="fuel" className="mb-2 block text-xs text-muted-foreground">
                  Carburant
                </label>
                <select id="fuel" value={fuel} onChange={(e) => setFuel(e.target.value)} className={selectClass}>
                  <option value="">Tous</option>
                  {fuels.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="trans" className="mb-2 block text-xs text-muted-foreground">
                  Transmission
                </label>
                <select
                  id="trans"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Toutes</option>
                  {transmissions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="mb-2 block text-xs text-muted-foreground">
                  Prix max : {new Intl.NumberFormat("fr-FR").format(maxPrice)} FCFA
                </label>
                <input
                  id="price"
                  type="range"
                  min={5000000}
                  max={50000000}
                  step={500000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label htmlFor="year" className="mb-2 block text-xs text-muted-foreground">
                  Année min : {minYear}
                </label>
                <input
                  id="year"
                  type="range"
                  min={2010}
                  max={2024}
                  value={minYear}
                  onChange={(e) => setMinYear(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label htmlFor="km" className="mb-2 block text-xs text-muted-foreground">
                  Kilométrage max : {new Intl.NumberFormat("fr-FR").format(maxMileage)} km
                </label>
                <input
                  id="km"
                  type="range"
                  min={10000}
                  max={150000}
                  step={5000}
                  value={maxMileage}
                  onChange={(e) => setMaxMileage(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {filtered.length} véhicule{filtered.length > 1 ? "s" : ""} trouvé
                {filtered.length > 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-xs text-muted-foreground">
                  Trier par
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="recent">Année</option>
                  <option value="popular">Popularité</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {shown.length === 0 ? (
              <p className="mt-16 rounded-[18px] border border-border bg-card p-12 text-center text-sm text-muted-foreground">
                Aucun véhicule ne correspond à votre recherche. Ajustez les filtres ou demandez une
                importation sur mesure.
              </p>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((v, i) => (
                  <Reveal key={v.id} delay={i * 0.06} className="relative">
                    <button
                      type="button"
                      aria-label={
                        favorites.includes(v.id)
                          ? `Retirer ${v.name} des favoris`
                          : `Ajouter ${v.name} aux favoris`
                      }
                      aria-pressed={favorites.includes(v.id)}
                      onClick={() =>
                        setFavorites((f) =>
                          f.includes(v.id) ? f.filter((x) => x !== v.id) : [...f, v.id],
                        )
                      }
                      className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full border border-glass-border bg-glass backdrop-blur-md transition-colors hover:border-primary"
                    >
                      <Heart
                        className={`size-4 ${favorites.includes(v.id) ? "fill-primary text-primary" : "text-foreground"}`}
                      />
                    </button>
                    <VehicleCard vehicle={v} />
                  </Reveal>
                ))}
              </div>
            )}

            {pages > 1 && (
              <nav className="mt-12 flex justify-center gap-2" aria-label="Pagination">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    aria-current={current === i + 1 ? "page" : undefined}
                    className={`size-11 rounded-full border text-sm transition-colors ${
                      current === i + 1
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}