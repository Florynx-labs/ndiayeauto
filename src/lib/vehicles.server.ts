import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma";
import { vehicles as fallback, type Vehicle } from "@/data/vehicles";

export const getPublicVehicles = createServerFn({ method: "GET" }).handler(async (): Promise<Vehicle[]> => {
  if (!process.env.DATABASE_URL) return fallback;
  try {
    const records = await prisma.vehicle.findMany({ where: { status: { not: "SOLD" } }, orderBy: { createdAt: "desc" } });
    if (!records.length) return fallback;
    return records.map((v) => ({
      id: v.slug, name: v.name, brand: v.brand, year: v.year, mileage: v.mileage,
      fuel: v.fuel as Vehicle["fuel"], transmission: v.transmission as Vehicle["transmission"],
      price: v.price, body: v.body as Vehicle["body"], image: v.images[0] || fallback[0].image,
      popularity: 0, engine: v.engine, location: v.location, history: v.history,
      description: v.description, features: v.features,
    }));
  } catch (error) {
    console.error("Could not load vehicle inventory from PostgreSQL:", error);
    return fallback;
  }
});
