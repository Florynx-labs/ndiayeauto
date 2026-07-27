import { createFileRoute } from "@tanstack/react-router";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";
import heroImage from "@/assets/hero-suv.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — NDIAYE AUTO SERVICE" },
      {
        name: "description",
        content:
          "NDIAYE AUTO SERVICE accompagne les automobilistes maliens depuis Bamako : sélection rigoureuse, transparence et service haut de gamme.",
      },
      { property: "og:title", content: "À propos — NDIAYE AUTO SERVICE" },
      {
        property: "og:description",
        content: "Notre histoire, nos valeurs et notre équipe à Bamako.",
      },
      { property: "og:url", content: "/a-propos" },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">À propos</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">
            La référence automobile à Bamako.
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-[18px] border border-border">
            <img
              src={heroImage}
              alt="Showroom NDIAYE AUTO SERVICE"
              loading="lazy"
              width={1920}
              height={1088}
              className="aspect-[21/9] size-full object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-semibold">Notre histoire</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Fondée à Bamako, NDIAYE AUTO SERVICE est née d'une conviction simple : acheter une
              voiture doit être une expérience claire, sereine et valorisante. Nous sélectionnons
              chaque véhicule à la main, vérifions son historique et garantissons des documents en
              règle.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Aujourd'hui, plus de 500 familles et entreprises maliennes nous font confiance pour
              leur mobilité, du premier véhicule à la flotte professionnelle.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl font-semibold">Nos valeurs</h2>
            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Transparence</strong> — un prix clair, un
                historique vérifiable, aucun frais caché.
              </li>
              <li>
                <strong className="text-foreground">Exigence</strong> — chaque véhicule est inspecté
                avant sa mise en vente.
              </li>
              <li>
                <strong className="text-foreground">Proximité</strong> — un conseiller dédié, avant
                et après l'achat.
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            { value: <Counter to={500} prefix="+" />, label: "véhicules livrés" },
            { value: <Counter to={12} />, label: "années d'expérience" },
            { value: <Counter to={100} suffix=" %" />, label: "documents en règle" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="rounded-[18px] border border-border bg-card p-8">
                <p className="font-display text-3xl font-semibold">{s.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}