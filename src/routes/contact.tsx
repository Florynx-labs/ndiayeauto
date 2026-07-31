import { createFileRoute } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { TikTokIcon } from "@/components/site/TikTokIcon";
import { ADDRESS, PHONE, TIKTOK_URL, WHATSAPP_URL } from "@/data/vehicles";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NDIAYE AUTO SERVICE Bamako" },
      {
        name: "description",
        content:
          "Contactez NDIAYE AUTO SERVICE à Korofina Sud, Bamako : discutez directement sur WhatsApp ou par téléphone.",
      },
      { property: "og:title", content: "Contact — NDIAYE AUTO SERVICE Bamako" },
      {
        property: "og:description",
        content: "Discutez avec nous sur WhatsApp ou par téléphone au +223 72 72 59 12.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
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
            <div className="flex h-full flex-col justify-center rounded-[18px] border border-border bg-card p-10 text-center">
              <MessageCircle className="mx-auto size-8 text-primary" />
              <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">Discutons sur WhatsApp</h2>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Le plus simple et le plus rapide : envoyez-nous un message et parlez directement à
                un conseiller NDIAYE AUTO SERVICE.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener"
                className="mx-auto mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow"
              >
                <MessageCircle className="size-4" />
                Écrire sur WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <div className="overflow-hidden rounded-[18px] border border-border">
              <iframe
                title="Localisation de NDIAYE AUTO SERVICE à Bamako"
                src="https://www.google.com/maps?q=Korofina+Sud+Station+SOMAYAF+Bamako+Mali&output=embed"
                loading="lazy"
                className="h-80 w-full border-0"
              />
            </div>
            <ul className="grid gap-3 text-sm">
              <li className="flex items-start gap-3 rounded-[18px] border border-border bg-card p-5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {ADDRESS}
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
              <li className="flex items-center gap-4 rounded-[18px] border border-border bg-card p-5">
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener"
                  aria-label="TikTok NDIAYE AUTO SERVICE"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary"
                >
                  <TikTokIcon className="size-5" />
                  @ndiayeauto2
                </a>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
}