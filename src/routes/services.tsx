import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Car, Truck } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { WHATSAPP_URL } from "@/data/vehicles";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Vente de véhicules — NDIAYE AUTO SERVICE" },
      {
        name: "description",
        content:
          "NDIAYE AUTO SERVICE : vente de véhicules neufs et d'occasion à Bamako. SUV, berlines, pickups et utilitaires sélectionnés.",
      },
      { property: "og:title", content: "Vente de véhicules — NDIAYE AUTO SERVICE" },
      {
        property: "og:description",
        content: "Vente de véhicules neufs et d'occasion à Bamako.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Car,
    title: "Véhicules d'occasion",
    text: "Un stock renouvelé chaque semaine : SUV, berlines et citadines vérifiés, prêts à rouler.",
  },
  {
    icon: BadgeCheck,
    title: "Véhicules neufs",
    text: "Des modèles neufs disponibles à la vente, avec documents en règle et garantie constructeur.",
  },
  {
    icon: Truck,
    title: "Pickups & utilitaires",
    text: "Pickups et utilitaires robustes pour les professionnels, vendus au meilleur prix du marché.",
  },
];

function ServicesPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Notre activité</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">
            La vente de véhicules, notre seul métier.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">
            NDIAYE AUTO SERVICE se consacre exclusivement à la vente de véhicules neufs et
            d'occasion à Bamako, sélectionnés un par un.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <div className="h-full rounded-[18px] border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40">
                <s.icon className="size-6 text-primary" />
                <h2 className="mt-6 text-lg font-semibold">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 rounded-[18px] border border-border bg-surface p-10 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">Un modèle en tête ?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              Écrivez-nous sur WhatsApp, nous vous répondons rapidement.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener"
                className="inline-flex rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow"
              >
                Écrire sur WhatsApp
              </a>
              <Link
                to="/catalogue"
                className="inline-flex rounded-full border border-border px-6 py-3.5 text-sm font-medium transition-colors hover:border-primary"
              >
                Voir le catalogue
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}