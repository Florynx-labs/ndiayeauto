import { Link } from "@tanstack/react-router";
import { Calendar, Fuel, Gauge, Settings2 } from "lucide-react";
import { formatMileage, formatPrice, type Vehicle } from "@/data/vehicles";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="group overflow-hidden rounded-[18px] border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
      <div className="relative aspect-[3/2] overflow-hidden bg-surface">
        <img
          src={vehicle.image}
          alt={`${vehicle.name} — ${vehicle.year}`}
          loading="lazy"
          width={1200}
          height={800}
          className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full border border-glass-border bg-glass px-3 py-1 text-[11px] font-medium tracking-wide text-foreground backdrop-blur-md">
          {vehicle.body}
        </span>
      </div>
      <div className="space-y-4 p-6">
        <div className="space-y-1">
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">{vehicle.brand}</p>
          <h3 className="truncate text-lg font-semibold text-foreground">{vehicle.name}</h3>
        </div>
        <ul className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0" />
            {vehicle.year}
          </li>
          <li className="flex items-center gap-2">
            <Gauge className="size-4 shrink-0" />
            {formatMileage(vehicle.mileage)}
          </li>
          <li className="flex items-center gap-2">
            <Fuel className="size-4 shrink-0" />
            {vehicle.fuel}
          </li>
          <li className="flex items-center gap-2">
            <Settings2 className="size-4 shrink-0" />
            {vehicle.transmission}
          </li>
        </ul>
        <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
          <p className="font-display text-lg font-semibold text-foreground">
            {formatPrice(vehicle.price)}
          </p>
          <Link
            to="/catalogue/$vehicleId"
            params={{ vehicleId: vehicle.id }}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Voir le véhicule
          </Link>
        </div>
      </div>
    </article>
  );
}