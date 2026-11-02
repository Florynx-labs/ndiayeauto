import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function handle(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user.role !== "admin") {
    return Response.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  if (request.method === "GET") {
    const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    return Response.json({ brands: brands.map((brand) => brand.name), items: brands });
  }

  if (request.method === "POST") {
    const parsed = z.object({ name: z.string().trim().min(2).max(40) }).safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) {
      return Response.json({ error: "Nom de marque invalide (2 à 40 caractères)." }, { status: 400 });
    }
    const name = parsed.data.name;
    const duplicate = await prisma.brand.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (duplicate) return Response.json({ error: "Cette marque existe déjà." }, { status: 409 });
    const brand = await prisma.brand.create({ data: { name } });
    return Response.json({ brand }, { status: 201 });
  }

  if (request.method === "DELETE") {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ error: "Identifiant manquant." }, { status: 400 });
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) return Response.json({ error: "Marque introuvable." }, { status: 404 });
    const used = await prisma.vehicle.count({ where: { brand: brand.name } });
    if (used > 0) {
      return Response.json(
        { error: `Impossible de supprimer ${brand.name} : ${used} véhicule(s) utilisent encore cette marque.` },
        { status: 409 },
      );
    }
    await prisma.brand.delete({ where: { id } });
    return Response.json({ success: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

export const Route = createFileRoute("/api/admin/brands")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
      DELETE: ({ request }) => handle(request),
    },
  },
});
