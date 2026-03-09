import type { CropPrice, Resource, WeatherData } from "../backend.d";
import { ResourceType } from "../backend.d";

export const mockWeather: WeatherData = {
  date: new Date().toISOString().split("T")[0],
  temperature: 28,
  humidity: 72,
  rainfall: 0,
  windSpeed: 14,
  condition: "Partly Cloudy",
};

export const mockCropPrices: CropPrice[] = [
  {
    cropName: "Wheat",
    pricePerQuintal: 2150,
    unit: "Quintal",
    marketName: "Azadpur Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Rice (Basmati)",
    pricePerQuintal: 3800,
    unit: "Quintal",
    marketName: "Delhi Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Corn (Maize)",
    pricePerQuintal: 1820,
    unit: "Quintal",
    marketName: "Ghazipur Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Soybean",
    pricePerQuintal: 4200,
    unit: "Quintal",
    marketName: "Indore Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Onion",
    pricePerQuintal: 1600,
    unit: "Quintal",
    marketName: "Nasik Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Tomato",
    pricePerQuintal: 2400,
    unit: "Quintal",
    marketName: "Pune Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Potato",
    pricePerQuintal: 1200,
    unit: "Quintal",
    marketName: "Agra Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Cotton",
    pricePerQuintal: 6500,
    unit: "Quintal",
    marketName: "Rajkot Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Sugarcane",
    pricePerQuintal: 385,
    unit: "Quintal",
    marketName: "Lucknow Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Turmeric",
    pricePerQuintal: 8200,
    unit: "Quintal",
    marketName: "Nizamabad Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Chilli (Red)",
    pricePerQuintal: 9500,
    unit: "Quintal",
    marketName: "Guntur Mandi",
    date: new Date().toISOString().split("T")[0],
  },
  {
    cropName: "Garlic",
    pricePerQuintal: 5800,
    unit: "Quintal",
    marketName: "Kota Mandi",
    date: new Date().toISOString().split("T")[0],
  },
];

export const mockTractors: Resource[] = [
  {
    id: BigInt(1),
    ownerName: "Ramesh Kumar",
    pricePerDay: 1200,
    distanceKm: 3.2,
    description:
      "Mahindra 475 DI — 45 HP, hydraulic lift, suitable for wheat & paddy ploughing",
    isAvailable: true,
    resourceType: ResourceType.tractor,
    locationLat: 28.6145,
    locationLng: 77.209,
  },
  {
    id: BigInt(2),
    ownerName: "Suresh Patel",
    pricePerDay: 1500,
    distanceKm: 7.8,
    description:
      "John Deere 5310 — 55 HP, power steering, ideal for deep ploughing & cultivation",
    isAvailable: true,
    resourceType: ResourceType.tractor,
    locationLat: 28.62,
    locationLng: 77.215,
  },
  {
    id: BigInt(3),
    ownerName: "Harjeet Singh",
    pricePerDay: 900,
    distanceKm: 12.5,
    description:
      "Eicher 380 — 39 HP, fuel efficient, best for small to medium farms",
    isAvailable: false,
    resourceType: ResourceType.tractor,
    locationLat: 28.63,
    locationLng: 77.225,
  },
  {
    id: BigInt(4),
    ownerName: "Baldev Rao",
    pricePerDay: 1800,
    distanceKm: 18.3,
    description:
      "New Holland 3600 — 60 HP, with rotavator attachment, multipurpose",
    isAvailable: true,
    resourceType: ResourceType.tractor,
    locationLat: 28.64,
    locationLng: 77.23,
  },
];

export const mockLabours: Resource[] = [
  {
    id: BigInt(5),
    ownerName: "Mukesh Yadav",
    pricePerDay: 400,
    distanceKm: 2.1,
    description:
      "Experienced farm worker — harvesting, sowing, weeding. 8+ years experience.",
    isAvailable: true,
    resourceType: ResourceType.labour,
    locationLat: 28.615,
    locationLng: 77.21,
  },
  {
    id: BigInt(6),
    ownerName: "Geeta Devi",
    pricePerDay: 350,
    distanceKm: 4.5,
    description:
      "Specialist in paddy transplanting and vegetable farming. Team of 5 available.",
    isAvailable: true,
    resourceType: ResourceType.labour,
    locationLat: 28.618,
    locationLng: 77.213,
  },
  {
    id: BigInt(7),
    ownerName: "Ravi Shankar",
    pricePerDay: 450,
    distanceKm: 9.0,
    description:
      "Skilled in operating irrigation systems and crop spraying equipment.",
    isAvailable: false,
    resourceType: ResourceType.labour,
    locationLat: 28.625,
    locationLng: 77.22,
  },
  {
    id: BigInt(8),
    ownerName: "Sita Bai",
    pricePerDay: 380,
    distanceKm: 14.7,
    description:
      "Expert in horticulture — flower, fruit, and vegetable cultivation.",
    isAvailable: true,
    resourceType: ResourceType.labour,
    locationLat: 28.635,
    locationLng: 77.228,
  },
];

export const mockDrones: Resource[] = [
  {
    id: BigInt(9),
    ownerName: "AgriTech Services",
    pricePerDay: 2500,
    distanceKm: 5.3,
    description:
      "DJI Agras T30 — 30L spray tank, covers 15 acres/hour. Pesticide & fertilizer spraying.",
    isAvailable: true,
    resourceType: ResourceType.drone,
    locationLat: 28.616,
    locationLng: 77.211,
  },
  {
    id: BigInt(10),
    ownerName: "KisanDrone Co.",
    pricePerDay: 2000,
    distanceKm: 11.2,
    description:
      "XAG P100 — 16L tank, GPS-guided precision spraying. Includes operator.",
    isAvailable: true,
    resourceType: ResourceType.drone,
    locationLat: 28.628,
    locationLng: 77.222,
  },
  {
    id: BigInt(11),
    ownerName: "FlyFarm India",
    pricePerDay: 3200,
    distanceKm: 19.8,
    description:
      "Zyro AG 20 — Survey + spraying combo. Generates detailed crop health maps.",
    isAvailable: false,
    resourceType: ResourceType.drone,
    locationLat: 28.642,
    locationLng: 77.232,
  },
];
