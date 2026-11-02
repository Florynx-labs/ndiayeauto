import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { vehicles } from "@/data/vehicles";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.SITE_URL || "https://ndiayeauto.vercel.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const databaseVehicles = process.env.DATABASE_URL ? await prisma.vehicle.findMany({ where: { status: { not: "SOLD" } }, select: { slug: true } }).catch(() => []) : [];
        const vehicleSlugs = databaseVehicles.length ? databaseVehicles.map((vehicle) => vehicle.slug) : vehicles.map((vehicle) => vehicle.id);
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/catalogue", changefreq: "daily", priority: "0.9" },
          { path: "/services", changefreq: "monthly", priority: "0.7" },
          { path: "/a-propos", changefreq: "monthly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          ...vehicleSlugs.map((slug) => ({
            path: `/catalogue/${slug}`,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});