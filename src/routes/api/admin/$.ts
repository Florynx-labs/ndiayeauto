import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  brand: z.string().trim().min(1),
  year: z.number().int().min(1950).max(new Date().getFullYear() + 2),
  mileage: z.number().int().min(0),
  fuel: z.enum(["Essence", "Diesel", "Hybride", "Électrique"]),
  transmission: z.enum(["Automatique", "Manuelle"]),
  price: z.number().int().positive(),
  body: z.enum(["SUV", "Berline", "Pickup", "Utilitaire", "Citadine", "Coupé"]),
  engine: z.string().max(120).default(""),
  location: z.string().max(160).default("Bamako, Korofina Sud"),
  history: z.string().max(2000).default(""),
  description: z.string().trim().min(10).max(5000),
  features: z.array(z.string().trim().min(1).max(120)).max(40),
  images: z.array(z.string().url()).min(1).max(12),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD"]),
});

const slug = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function handle(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user.role !== "admin") {
    return Response.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (request.method === "GET") {
    if (id) {
      const vehicle = await prisma.vehicle.findUnique({ where: { id } });
      if (!vehicle) return Response.json({ error: "Véhicule introuvable." }, { status: 404 });
      return Response.json({ vehicle });
    }
    const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
    return Response.json({ vehicles });
  }

  if (request.method === "DELETE") {
    if (!id) return Response.json({ error: "ID manquant." }, { status: 400 });
    const existing = await prisma.vehicle.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return Response.json({ error: "Véhicule introuvable." }, { status: 404 });
    await prisma.vehicle.delete({ where: { id } });
    return Response.json({ success: true });
  }

  if (request.method === "POST" || request.method === "PATCH") {
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message || "Données invalides." },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const knownBrand = await prisma.brand.findFirst({
      where: { name: { equals: data.brand, mode: "insensitive" } },
    });
    if (!knownBrand) {
      return Response.json(
        { error: "Cette marque n’existe pas. Ajoutez-la dans la gestion des marques." },
        { status: 400 },
      );
    }

    try {
      if (request.method === "PATCH") {
        if (!id) return Response.json({ error: "ID du véhicule manquant." }, { status: 400 });
        const existing = await prisma.vehicle.findUnique({ where: { id } });
        if (!existing) return Response.json({ error: "Véhicule introuvable." }, { status: 404 });

        const nextSlug = data.name === existing.name
          ? existing.slug
          : `${slug(data.name)}-${Date.now().toString(36)}`;
        const vehicle = await prisma.vehicle.update({
          where: { id },
          data: { ...data, slug: nextSlug },
        });
        return Response.json({ vehicle });
      }

      const vehicle = await prisma.vehicle.create({
        data: { ...data, slug: `${slug(data.name)}-${Date.now().toString(36)}` },
      });
      return Response.json({ vehicle }, { status: 201 });
    } catch (error) {
      console.error("Could not save vehicle:", error);
      return Response.json({ error: "Enregistrement impossible. Vérifiez les données et réessayez." }, { status: 409 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}

export const Route = createFileRoute("/api/admin/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
      PATCH: ({ request }) => handle(request),
      DELETE: ({ request }) => handle(request),
    },
  },
});
