import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Globe2,
  HandshakeIcon,
  MessageCircle,
  Star,
} from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/hero-suv.jpg";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";
import { VehicleCard } from "@/components/site/VehicleCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { brands, WHATSAPP_URL } from "@/data/vehicles";
import { getPublicVehicles } from "@/lib/vehicles.server";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NDIAYE AUTO SERVICE — Véhicules premium à Bamako" },
      {
        name: "description",
        content:
          "Trouvez la voiture idéale à Bamako : véhicules neufs, d'occasion inspectés et importation sur commande. Plus de 500 véhicules vendus.",
      },
      { property: "og:title", content: "NDIAYE AUTO SERVICE — Véhicules premium à Bamako" },
      {
        property: "og:description",
        content:
          "Des véhicules soigneusement sélectionnés pour répondre à vos besoins et à votre budget.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: () => getPublicVehicles(),
  component: Index,
});

const reasons = [
  {
    icon: BadgeCheck,
    title: "Inspection complète",
    text: "Chaque véhicule passe un contrôle technique en 120 points avant sa mise en vente.",
  },
  {
    icon: FileCheck2,
    title: "Documents administratifs",
    text: "Dédouanement, carte grise et mutation : nous gérons toutes les formalités pour vous.",
  },
  {
    icon: Globe2,
    title: "Importation personnalisée",
    text: "Vous choisissez le modèle, nous l'importons depuis l'Europe, les États-Unis ou Dubaï.",
  },
  {
    icon: HandshakeIcon,
    title: "Accompagnement complet",
    text: "Conseil, financement, assurance et suivi après-vente avec un interlocuteur dédié.",
  },
];

const testimonials = [
  {
    name: "Aminata Diallo",
    initials: "AD",
    stars: 5,
    text: "Un accueil irréprochable et un véhicule impeccable. Toutes les démarches ont été faites pour moi en une semaine.",
  },
  {
    name: "Moussa Traoré",
    initials: "MT",
    stars: 5,
    text: "J'ai commandé un pickup depuis Dubaï. Livré en 6 semaines, exactement comme convenu. Je recommande sans hésiter.",
  },
  {
    name: "Fatoumata Keïta",
    initials: "FK",
    stars: 5,
    text: "Des conseils honnêtes et un vrai suivi après l'achat. C'est rare et ça change tout.",
  },
];

const faqs = [
  {
    q: "Puis-je commander un véhicule qui n'est pas au catalogue ?",
    a: "Oui. Indiquez-nous le modèle, l'année, le budget et les options souhaitées : nous recherchons le véhicule et vous transmettons une offre complète, dédouanement inclus.",
  },

];

function Index() {
  const vehicles = Route.useLoaderData();
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : 90]);
  const [slide, setSlide] = useState(0);

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-dvh items-center overflow-hidden">
        <motion.img
          src={heroImage}
          alt="SUV premium éclairé dans un showroom sombre"
          width={1920}
          height={1088}
          style={{ y: heroY }}
          className="absolute inset-0 size-full scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 pt-32 pb-20 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs tracking-[0.32em] text-muted-foreground uppercase"
          >
            Bamako · Mali
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-3xl text-4xl leading-[1.05] font-semibold text-foreground sm:text-6xl lg:text-7xl"
          >
            Trouvez la voiture idéale.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Des véhicules soigneusement sélectionnés pour répondre à vos besoins et à votre budget.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              to="/catalogue"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-glow"
            >
              Découvrir le catalogue
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={WHATSAPP_URL}
              className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-6 py-3.5 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:border-primary"
            >
              <MessageCircle className="size-4" />
              Contacter sur WhatsApp
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              { value: <Counter to={500} prefix="+" />, label: "véhicules vendus" },
              { value: <Counter to={100} suffix=" %" />, label: "clients satisfaits" },
              { value: "Sur demande", label: "importation personnalisée" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-[18px] border border-glass-border bg-glass px-5 py-5 backdrop-blur-md"
              >
                <dt className="font-display text-2xl font-semibold text-foreground">{s.value}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* MARQUES */}
      <section className="border-y border-border bg-surface py-12">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <p className="text-center text-xs tracking-[0.28em] text-muted-foreground uppercase">
            Les marques que nous proposons
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-y-6 sm:grid-cols-3 md:grid-cols-5">
            {brands.map((b) => (
              <li
                key={b}
                className="text-center font-display text-lg font-medium text-muted-foreground opacity-70 transition-all duration-300 hover:text-foreground hover:opacity-100"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* VEHICULES RECENTS */}
      <section className="section-pad">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Stock</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">Véhicules récents</h2>
            </div>
            <Link
              to="/catalogue"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Tout le catalogue
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.slice(0, 6).map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}>
                <VehicleCard vehicle={v} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="section-pad border-y border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Confiance</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-5xl">Pourquoi nous ?</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                <div className="h-full rounded-[18px] border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40">
                  <r.icon className="size-6 text-primary" />
                  <h3 className="mt-6 text-lg font-semibold">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* IMPORTATION */}
      <section className="section-pad">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 md:px-10 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
              Importation
            </p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">
              Le véhicule que vous voulez, importé pour vous.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Vous avez un modèle précis en tête ? Nous le recherchons en Europe, aux États-Unis ou
              à Dubaï, vérifions son historique, négocions le prix et gérons le transport ainsi que
              le dédouanement jusqu'à Bamako.
            </p>
            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow"
            >
              Faire une demande
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-[18px] border border-border">
              <img
                src={heroImage}
                alt="Véhicule premium prêt à être importé"
                loading="lazy"
                width={1920}
                height={1088}
                className="aspect-[4/3] size-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* AVIS */}
      <section className="section-pad border-y border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Avis</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">Ils nous font confiance</h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Avis précédent"
                onClick={() => setSlide((s) => (s - 1 + testimonials.length) % testimonials.length)}
                className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-primary"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Avis suivant"
                onClick={() => setSlide((s) => (s + 1) % testimonials.length)}
                className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-primary"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </Reveal>

          <div className="mt-12 overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${slide * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {testimonials.map((t) => (
                <figure key={t.name} className="w-full shrink-0 px-1">
                  <div className="rounded-[18px] border border-border bg-card p-8 sm:p-12">
                    <div className="flex gap-1" aria-label={`${t.stars} étoiles sur 5`}>
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="size-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground sm:text-2xl">
                      « {t.text} »
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
                        {t.initials}
                      </span>
                      <span className="text-sm text-muted-foreground">{t.name} — Bamako</span>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:px-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">Questions fréquentes</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* CTA CONTACT */}
      <section className="section-pad border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 text-center md:px-10">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-5xl">
              Parlons de votre prochain véhicule.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
              Notre équipe vous répond du lundi au samedi, de 8h à 19h.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow"
              >
                Nous contacter
              </Link>
              <a
                href={WHATSAPP_URL}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
