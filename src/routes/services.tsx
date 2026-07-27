import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, FileCheck2, Globe2, ShieldCheck, Wallet, Wrench } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos services — NDIAYE AUTO SERVICE" },
      {
        name: "description",
        content:
          "Vente de véhicules neufs et d'occasion, importation sur commande, dédouanement, financement et suivi après-vente à Bamako.",
      },
      { property: "og:title", content: "Nos services — NDIAYE AUTO SERVICE" },
      {
        property: "og:description",
        content: "Vente, importation, dédouanement, financement et après-vente à Bamako.",
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
    title: "Vente de véhicules",
    text: "Un stock renouvelé chaque semaine : SUV, berlines, pickups et utilitaires, neufs ou d'occasion.",
  },
  {
    icon: Globe2,
    title: "Importation sur commande",
    text: "Recherche du modèle exact, vérification de l'historique, négociation et transport jusqu'à Bamako.",
  },
  {
    icon: FileCheck2,
    title: "Formalités administratives",
    text: "Dédouanement, carte grise, mutation et assurance : tout est pris en charge par nos équipes.",
  },
  {
    icon: ShieldCheck,
    title: "Inspection technique",
    text: "Contrôle en 120 points, essai routier et rapport détaillé remis avant chaque achat.",
  },
  {
    icon: Wallet,
    title: "Financement",
    text: "Solutions de crédit et de leasing avec nos partenaires bancaires maliens.",
  },
  {
    icon: Wrench,
    title: "Après-vente",
    text: "Entretien, pièces détachées et accompagnement pendant toute la vie du véhicule.",
  },
];

function ServicesPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Services</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">
            Un accompagnement de bout en bout.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">
            De la recherche du véhicule à sa mise en circulation, nous prenons en charge chaque
            étape avec la même exigence.
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
            <h2 className="text-2xl font-semibold sm:text-3xl">Un besoin particulier ?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              Décrivez-nous votre projet, nous revenons vers vous sous 24 heures.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow"
            >
              Faire une demande
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}