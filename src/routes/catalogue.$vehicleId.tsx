import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Check,
  Fuel,
  Gauge,
  MapPin,
  MessageCircle,
  Phone,
  Settings2,
  Wallet,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import {
  formatMileage,
  formatPrice,
  PHONE,
  WHATSAPP_URL,
} from "@/data/vehicles";
import { getPublicVehicles } from "@/lib/vehicles.server";

export const Route = createFileRoute("/catalogue/$vehicleId")({
  loader: async ({ params }) => {
    const vehicles = await getPublicVehicles();
    const vehicle = vehicles.find((v) => v.id === params.vehicleId);
    if (!vehicle) throw notFound();
    return { vehicle, others: vehicles.filter((v) => v.id !== vehicle.id).slice(0, 3) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Véhicule indisponible" }, { name: "robots", content: "noindex" }] };
    }
    const v = loaderData.vehicle;
    const title = `${v.name} (${v.year}) — NDIAYE AUTO SERVICE`;
    const description = `${v.name}, ${v.year}, ${formatMileage(v.mileage)}, ${v.fuel}, ${v.transmission}. ${formatPrice(v.price)} à Bamako.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/catalogue/${params.vehicleId}` },
      ],
      links: [{ rel: "canonical", href: `/catalogue/${params.vehicleId}` }],
    };
  },
  component: VehicleDetail,
  notFoundComponent: VehicleNotFound,
});

function VehicleNotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 pt-40 pb-24 text-center">
      <h1 className="text-3xl font-semibold">Véhicule introuvable</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Ce véhicule n'est plus disponible ou a été vendu.
      </p>
      <Link
        to="/catalogue"
        className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
      >
        Retour au catalogue
      </Link>
    </div>
  );
}

function VehicleDetail() {
  const { vehicle, others } = Route.useLoaderData();

  const specs = [
    { icon: Calendar, label: "Année", value: String(vehicle.year) },
    { icon: Gauge, label: "Kilométrage", value: formatMileage(vehicle.mileage) },
    { icon: Fuel, label: "Carburant", value: vehicle.fuel },
    { icon: Settings2, label: "Boîte", value: vehicle.transmission },
  ];

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Catalogue
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            <div className="group overflow-hidden rounded-[18px] border border-border bg-surface">
              <img
                src={vehicle.image}
                alt={`${vehicle.name} — vue trois quarts`}
                width={1200}
                height={800}
                className="aspect-[3/2] size-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {others.map((o) => (
                <Link
                  key={o.id}
                  to="/catalogue/$vehicleId"
                  params={{ vehicleId: o.id }}
                  className="overflow-hidden rounded-[18px] border border-border transition-colors hover:border-primary"
                >
                  <img
                    src={o.image}
                    alt={o.name}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="aspect-[3/2] size-full object-cover opacity-70 transition-opacity hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[18px] border border-border bg-card p-7 lg:sticky lg:top-28">
              <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
                {vehicle.brand} · {vehicle.body}
              </p>
              <h1 className="mt-3 text-3xl font-semibold">{vehicle.name}</h1>
              <p className="mt-4 font-display text-2xl font-semibold text-primary">
                {formatPrice(vehicle.price)}
              </p>

              <dl className="mt-7 grid grid-cols-2 gap-4">
                {specs.map((s) => (
                  <div key={s.label} className="rounded-xl border border-border p-3">
                    <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                      <s.icon className="size-3.5" />
                      {s.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-col gap-2">
                <a
                  href={WHATSAPP_URL}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-primary"
                >
                  <Phone className="size-4" />
                  Appeler
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-primary"
                >
                  <Wallet className="size-4" />
                  Demander un financement
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {vehicle.description}
            </p>
            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-3">
                <dt className="text-muted-foreground">Motorisation</dt>
                <dd className="text-right">{vehicle.engine}</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <dt className="text-muted-foreground">Historique</dt>
                <dd className="text-right">{vehicle.history}</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" />
                  Localisation
                </dt>
                <dd className="text-right">{vehicle.location}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-2xl font-semibold">Équipements</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {vehicle.features.map((f: string) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
}