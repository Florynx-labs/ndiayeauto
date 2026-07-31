import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { ADDRESS, PHONE, TIKTOK_URL, WHATSAPP_URL } from "@/data/vehicles";
import { TikTokIcon } from "@/components/site/TikTokIcon";
import logo from "@/assets/ndiaye-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:px-10 lg:grid-cols-4">
        <div className="space-y-4">
          <img
            src={logo.url}
            alt="NDIAYE AUTO SERVICE"
            className="h-16 w-auto"
            loading="lazy"
          />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Vente de véhicules neufs, d'occasion et sur commande à Bamako. Sélection rigoureuse,
            documents en règle, accompagnement complet.
          </p>
          <div className="flex gap-2">
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener"
              aria-label="TikTok"
              className="grid size-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <TikTokIcon className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Navigation
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { to: "/", label: "Accueil" },
              { to: "/catalogue", label: "Catalogue" },
              { to: "/services", label: "Services" },
              { to: "/a-propos", label: "À propos" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Contact
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {ADDRESS}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-foreground">
                {PHONE}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4 shrink-0" />
              <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="hover:text-foreground">
                WhatsApp {PHONE}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Newsletter
          </h3>
          <p className="mt-5 text-sm text-muted-foreground">
            Recevez nos nouvelles arrivées en avant-première.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLFormElement).reset();
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Adresse e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="votre@email.com"
              className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow"
            >
              OK
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
          <p>© {new Date().getFullYear()} NDIAYE AUTO SERVICE. Tous droits réservés.</p>
          <p>Mentions légales · Politique de confidentialité</p>
        </div>
      </div>
    </footer>
  );
}