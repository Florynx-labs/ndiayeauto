import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import car5 from "@/assets/car-5.jpg";
import car6 from "@/assets/car-6.jpg";

export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  year: number;
  mileage: number;
  fuel: "Essence" | "Diesel" | "Hybride";
  transmission: "Automatique" | "Manuelle";
  price: number;
  body: "SUV" | "Berline" | "Pickup" | "Utilitaire";
  image: string;
  popularity: number;
  engine: string;
  location: string;
  history: string;
  description: string;
  features: string[];
};

export const vehicles: Vehicle[] = [
  {
    id: "toyota-land-cruiser-2021",
    name: "Toyota Land Cruiser V8",
    brand: "Toyota",
    year: 2021,
    mileage: 48000,
    fuel: "Diesel",
    transmission: "Automatique",
    price: 48500000,
    body: "SUV",
    image: car1,
    popularity: 98,
    engine: "4.5L V8 Turbo Diesel — 272 ch",
    location: "Bamako, ACI 2000",
    history: "Première main, carnet d'entretien complet",
    description:
      "Le SUV de référence pour les routes maliennes. Robustesse légendaire, confort haut de gamme et fiabilité éprouvée.",
    features: ["Cuir intégral", "Caméra 360°", "Sièges chauffants", "GPS", "Toit ouvrant"],
  },
  {
    id: "mercedes-classe-e-2022",
    name: "Mercedes-Benz Classe E 300",
    brand: "Mercedes",
    year: 2022,
    mileage: 26000,
    fuel: "Essence",
    transmission: "Automatique",
    price: 39750000,
    body: "Berline",
    image: car2,
    popularity: 91,
    engine: "2.0L Turbo — 258 ch",
    location: "Bamako, Hamdallaye",
    history: "Importée d'Europe, dédouanée",
    description:
      "L'élégance allemande dans sa version la plus aboutie. Une berline silencieuse, connectée et raffinée.",
    features: ["MBUX", "Affichage tête haute", "Burmester", "Aide au stationnement"],
  },
  {
    id: "pickup-double-cabine-2020",
    name: "Pickup Double Cabine 4x4",
    brand: "Nissan",
    year: 2020,
    mileage: 72000,
    fuel: "Diesel",
    transmission: "Manuelle",
    price: 21500000,
    body: "Pickup",
    image: car3,
    popularity: 84,
    engine: "2.5L dCi — 190 ch",
    location: "Bamako, Sotuba",
    history: "Révision complète effectuée",
    description:
      "Un utilitaire polyvalent taillé pour les chantiers et les longues distances, avec un confort de berline.",
    features: ["4x4 enclenchable", "Barres de toit", "Attelage", "Climatisation"],
  },
  {
    id: "bmw-x5-2021",
    name: "BMW X5 xDrive40i",
    brand: "BMW",
    year: 2021,
    mileage: 35000,
    fuel: "Essence",
    transmission: "Automatique",
    price: 45900000,
    body: "SUV",
    image: car4,
    popularity: 95,
    engine: "3.0L 6 cylindres — 340 ch",
    location: "Bamako, ACI 2000",
    history: "Historique constructeur disponible",
    description:
      "Sportivité et prestige réunis. Le X5 offre une conduite dynamique sans compromis sur le confort.",
    features: ["Suspension pneumatique", "Harman Kardon", "Hayon électrique", "Laser Lights"],
  },
  {
    id: "crossover-urbain-2023",
    name: "Hyundai Kona Urban",
    brand: "Hyundai",
    year: 2023,
    mileage: 12000,
    fuel: "Hybride",
    transmission: "Automatique",
    price: 17900000,
    body: "SUV",
    image: car5,
    popularity: 79,
    engine: "1.6L Hybride — 141 ch",
    location: "Bamako, Badalabougou",
    history: "Véhicule quasi neuf, garantie constructeur",
    description:
      "Compact, économique et parfaitement adapté à la circulation urbaine de Bamako.",
    features: ["CarPlay", "Régulateur adaptatif", "Caméra de recul", "LED"],
  },
  {
    id: "utilitaire-cargo-2019",
    name: "Fourgon Cargo L2H2",
    brand: "Peugeot",
    year: 2019,
    mileage: 96000,
    fuel: "Diesel",
    transmission: "Manuelle",
    price: 12400000,
    body: "Utilitaire",
    image: car6,
    popularity: 68,
    engine: "2.2L HDi — 140 ch",
    location: "Bamako, Sotuba",
    history: "Ancien véhicule de société, entretien suivi",
    description:
      "Un volume de chargement généreux pour les professionnels exigeants, prêt à travailler.",
    features: ["Galerie de toit", "Cloison de séparation", "Bluetooth", "Charge utile 1,2 t"],
  },
];

export const brands = [
  "Toyota",
  "Mercedes",
  "BMW",
  "Audi",
  "Lexus",
  "Hyundai",
  "Kia",
  "Nissan",
  "Peugeot",
  "Ford",
];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value) + " FCFA";

export const formatMileage = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value) + " km";

export const WHATSAPP_URL = "https://wa.me/22372725912";
export const PHONE = "+223 72 72 59 12";
export const TIKTOK_URL = "https://www.tiktok.com/@ndiayeauto2";
export const ADDRESS = "Korofina Sud — en face de la station SOMAYAF, Bamako, Mali";