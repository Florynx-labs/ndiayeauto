import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Reveal } from "@/components/site/Reveal";
import { EMAIL, PHONE, WHATSAPP_URL } from "@/data/vehicles";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NDIAYE AUTO SERVICE Bamako" },
      {
        name: "description",
        content:
          "Contactez NDIAYE AUTO SERVICE à Bamako : téléphone, WhatsApp, e-mail et formulaire de demande d'importation.",
      },
      { property: "og:title", content: "Contact — NDIAYE AUTO SERVICE Bamako" },
      {
        property: "og:description",
        content: "Téléphone, WhatsApp, e-mail et formulaire de demande.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Votre nom est requis").max(100),
  email: z.string().trim().email("Adresse e-mail invalide").max(255),
  phone: z.string().trim().min(6, "Numéro invalide").max(30),
  message: z.string().trim().min(10, "Décrivez votre demande").max(1000),
});

type FormValues = z.infer<typeof schema>;

function ContactPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  const onSubmit = (values: FormValues) => {
    const text = `Bonjour, je suis ${values.name} (${values.phone}). ${values.message}`;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setSent(true);
    reset();
  };

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Contact</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">Parlons de votre projet.</h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">
            Notre équipe vous répond du lundi au samedi, de 8h à 19h.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 rounded-[18px] border border-border bg-card p-8"
              noValidate
            >
              <div>
                <label htmlFor="name" className="mb-2 block text-xs text-muted-foreground">
                  Nom complet
                </label>
                <input id="name" className={inputClass} placeholder="Votre nom" {...register("name")} />
                {errors.name && <p className="mt-2 text-xs text-primary">{errors.name.message}</p>}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs text-muted-foreground">
                    E-mail
                  </label>
                  <input id="email" type="email" className={inputClass} placeholder="vous@email.com" {...register("email")} />
                  {errors.email && <p className="mt-2 text-xs text-primary">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-xs text-muted-foreground">
                    Téléphone
                  </label>
                  <input id="phone" className={inputClass} placeholder="+223 …" {...register("phone")} />
                  {errors.phone && <p className="mt-2 text-xs text-primary">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-xs text-muted-foreground">
                  Votre demande
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className={inputClass}
                  placeholder="Modèle recherché, budget, délais…"
                  {...register("message")}
                />
                {errors.message && <p className="mt-2 text-xs text-primary">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow disabled:opacity-60"
              >
                Envoyer ma demande
              </button>
              <p aria-live="polite" className="min-h-5 text-xs text-muted-foreground">
                {sent ? "Merci ! Votre demande a été préparée sur WhatsApp." : ""}
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <div className="overflow-hidden rounded-[18px] border border-border">
              <iframe
                title="Localisation de NDIAYE AUTO SERVICE à Bamako"
                src="https://www.google.com/maps?q=Bamako,Mali&output=embed"
                loading="lazy"
                className="h-80 w-full border-0"
              />
            </div>
            <ul className="grid gap-3 text-sm">
              <li className="flex items-start gap-3 rounded-[18px] border border-border bg-card p-5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                Route de Sotuba, ACI 2000 — Bamako, Mali
              </li>
              <li className="flex items-center gap-3 rounded-[18px] border border-border bg-card p-5">
                <Phone className="size-4 shrink-0 text-primary" />
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-primary">
                  {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3 rounded-[18px] border border-border bg-card p-5">
                <MessageCircle className="size-4 shrink-0 text-primary" />
                <a href={WHATSAPP_URL} className="hover:text-primary">
                  Discuter sur WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3 rounded-[18px] border border-border bg-card p-5">
                <Mail className="size-4 shrink-0 text-primary" />
                <a href={`mailto:${EMAIL}`} className="hover:text-primary">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-4 rounded-[18px] border border-border bg-card p-5">
                <a href="https://facebook.com" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                  <Facebook className="size-5" />
                </a>
                <a href="https://instagram.com" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                  <Instagram className="size-5" />
                </a>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
}