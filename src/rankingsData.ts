import cityUniverseCsv from "./data/slic_city_universe.csv?raw";
import { rankingPublication } from "./rankingPublication";
import type {
  CityAccessProfile,
  CityLifeMetrics,
  FullRankedCity,
  RankedCity,
} from "./types";

interface CityUniverseRow {
  city_id: string;
  cohort: string;
  manifest_status: "locked" | "provisional";
  city_type: "primary" | "secondary";
  country: string;
  inclusion_rationale: string;
}

interface RegionProfile {
  pressure: number;
  viability: number;
  capability: number;
  community: number;
  creative: number;
  pppIncomePerHead: number;
  graduateHousingShare: number;
  experienceDiversity: number;
  healthcare: CityAccessProfile;
  education: CityAccessProfile;
  tags: string[];
}

interface CityScreenProfile {
  safety: number;
  affordability: number;
  equality: number;
  civicFreedom: number;
  ecology: number;
  crowding: number;
  hygiene?: number;
  climate?: number;
  roadSafety?: number;
  foodCulture?: number;
  boringIndex?: number;
  flatExperience?: number;
  taxReturn?: number;
  healthcareCost?: number;
  religiousViolence?: number;
  housingPriceIndex?: number;
  /** 0-100: low = stagnant/retirement, high = growing/dynamic */
  growthMomentum?: number;
  /** 0-100: low = intolerant (anti-LGBTQ, ethnic discrimination), high = open */
  toleranceOpenness?: number;
  /** 0-100: low = everything is green, high = concrete desert / no parks */
  greenSpaceDeficit?: number;
}

interface CityAccent {
  accentHex: string;
  accentSoftHex: string;
  accentLabel: string;
}

type CityOverride = Omit<FullRankedCity, "globalRank" | "coreBoardEligible" | "scores"> & {
  scores: Pick<FullRankedCity["scores"], "pressure" | "viability" | "capability" | "community"> &
    Partial<Pick<FullRankedCity["scores"], "creative">>;
};

const regionProfiles: Record<string, RegionProfile> = {
  "Southeast Asia": {
    pressure: 77,
    viability: 72,
    capability: 75,
    community: 81,
    creative: 78,
    pppIncomePerHead: 22000,
    graduateHousingShare: 25,
    experienceDiversity: 86,
    healthcare: {
      access: "Broad mixed access",
      affordability: "Low to moderate cost",
      summary: "Public and private care both matter, and quality varies city by city.",
    },
    education: {
      access: "Broad public access",
      affordability: "Low to moderate cost",
      summary: "Good options exist when public quality and private affordability stay aligned.",
    },
    tags: ["variety", "hospitality", "cost range"],
  },
  "East Asia": {
    pressure: 76,
    viability: 81,
    capability: 79,
    community: 75,
    creative: 79,
    pppIncomePerHead: 30000,
    graduateHousingShare: 29,
    experienceDiversity: 74,
    healthcare: {
      access: "Universal or near-universal",
      affordability: "Low cost",
      summary: "Strong access baseline with high operational competence in leading systems.",
    },
    education: {
      access: "Broad public access",
      affordability: "Low cost",
      summary: "Public systems are usually strong and tertiary pathways are well-established.",
    },
    tags: ["systems", "transit", "discipline"],
  },
  "South Asia": {
    pressure: 66,
    viability: 57,
    capability: 62,
    community: 63,
    creative: 62,
    pppIncomePerHead: 14000,
    graduateHousingShare: 27,
    experienceDiversity: 71,
    healthcare: {
      access: "Mixed access",
      affordability: "Moderate out-of-pocket",
      summary: "Access can be broad, but quality and financial burden are uneven.",
    },
    education: {
      access: "Mixed public-private",
      affordability: "Low to moderate cost",
      summary: "Good institutions exist, but consistency and access remain uneven.",
    },
    tags: ["ambition", "pressure", "uneven"],
  },
  "Western and Northern Europe": {
    pressure: 68,
    viability: 83,
    capability: 76,
    community: 78,
    creative: 70,
    pppIncomePerHead: 32000,
    graduateHousingShare: 38,
    experienceDiversity: 78,
    healthcare: {
      access: "Universal public access",
      affordability: "Free to low cost",
      summary: "Healthcare is broadly accessible, with funding systems that reduce direct cost shocks.",
    },
    education: {
      access: "Universal public access",
      affordability: "Free to low cost",
      summary: "Public education is strong, but housing pressure can still dilute opportunity.",
    },
    tags: ["order", "public systems", "cost pressure"],
  },
  "Southern/Eastern Europe and Eurasia": {
    pressure: 73,
    viability: 73,
    capability: 73,
    community: 76,
    creative: 74,
    pppIncomePerHead: 23000,
    graduateHousingShare: 27,
    experienceDiversity: 76,
    healthcare: {
      access: "Broad public access",
      affordability: "Low cost",
      summary: "Public systems are often accessible, though quality differs sharply by city.",
    },
    education: {
      access: "Broad public access",
      affordability: "Low cost",
      summary: "Education is usually affordable, especially outside the most prestigious capitals.",
    },
    tags: ["heritage", "value", "human scale"],
  },
  "North America": {
    pressure: 71,
    viability: 70,
    capability: 71,
    community: 64,
    creative: 73,
    pppIncomePerHead: 31000,
    graduateHousingShare: 41,
    experienceDiversity: 77,
    healthcare: {
      access: "Mixed access",
      affordability: "Moderate to high cost",
      summary: "Strong providers exist, but direct cost remains a major differentiator.",
    },
    education: {
      access: "Broad access",
      affordability: "Moderate to high cost",
      summary: "Educational quality can be strong while affordability remains a real constraint.",
    },
    tags: ["scale", "uneven value", "opportunity"],
  },
  "Latin America": {
    pressure: 71,
    viability: 65,
    capability: 68,
    community: 78,
    creative: 67,
    pppIncomePerHead: 20000,
    graduateHousingShare: 28,
    experienceDiversity: 85,
    healthcare: {
      access: "Mixed public-private",
      affordability: "Low to moderate cost",
      summary: "Everyday access is often decent, but consistency depends heavily on city and income level.",
    },
    education: {
      access: "Broad public-private mix",
      affordability: "Low to moderate cost",
      summary: "Affordable options exist, though quality dispersion remains significant.",
    },
    tags: ["street life", "culture", "contrast"],
  },
  "Middle East": {
    pressure: 74,
    viability: 78,
    capability: 76,
    community: 60,
    creative: 72,
    pppIncomePerHead: 29000,
    graduateHousingShare: 31,
    experienceDiversity: 62,
    healthcare: {
      access: "Strong urban access",
      affordability: "Low to moderate cost",
      summary: "Service quality can be high in major cities, though social access differs by system.",
    },
    education: {
      access: "Mixed access",
      affordability: "Moderate cost",
      summary: "Good institutions exist, but public-private splits shape real affordability.",
    },
    tags: ["connectivity", "state capacity", "heat"],
  },
  Africa: {
    pressure: 67,
    viability: 61,
    capability: 64,
    community: 68,
    creative: 63,
    pppIncomePerHead: 16000,
    graduateHousingShare: 26,
    experienceDiversity: 73,
    healthcare: {
      access: "Mixed access",
      affordability: "Low to moderate cost",
      summary: "Quality can concentrate in stronger cities while broad access still varies.",
    },
    education: {
      access: "Mixed access",
      affordability: "Low to moderate cost",
      summary: "Affordability is often better than prestige cities, but quality is uneven.",
    },
    tags: ["trajectory", "regional hub", "contrast"],
  },
  Oceania: {
    pressure: 62,
    viability: 76,
    capability: 72,
    community: 70,
    creative: 62,
    pppIncomePerHead: 30000,
    graduateHousingShare: 40,
    experienceDiversity: 72,
    healthcare: {
      access: "Universal public baseline",
      affordability: "Free to low cost",
      summary: "Healthcare access is generally strong, but cost of living still weighs on daily life.",
    },
    education: {
      access: "Broad public access",
      affordability: "Low to moderate cost",
      summary: "Good public systems exist, though housing and distance affect the overall equation.",
    },
    tags: ["pleasant", "distance", "cost"],
  },
};

const regionScreenProfiles: Record<string, CityScreenProfile> = {
  "Southeast Asia": { safety: 74, affordability: 79, equality: 65, civicFreedom: 72, ecology: 61, crowding: 64 },
  "East Asia": { safety: 84, affordability: 72, equality: 74, civicFreedom: 76, ecology: 67, crowding: 60 },
  "South Asia": { safety: 55, affordability: 74, equality: 55, civicFreedom: 63, ecology: 45, crowding: 77 },
  "Western and Northern Europe": { safety: 86, affordability: 53, equality: 79, civicFreedom: 85, ecology: 79, crowding: 55 },
  "Southern/Eastern Europe and Eurasia": { safety: 72, affordability: 74, equality: 64, civicFreedom: 66, ecology: 60, crowding: 57 },
  "North America": { safety: 67, affordability: 50, equality: 56, civicFreedom: 78, ecology: 57, crowding: 61 },
  "Latin America": { safety: 61, affordability: 71, equality: 51, civicFreedom: 70, ecology: 55, crowding: 63 },
  "Middle East": { safety: 79, affordability: 59, equality: 42, civicFreedom: 48, ecology: 38, crowding: 61 },
  Africa: { safety: 58, affordability: 73, equality: 50, civicFreedom: 63, ecology: 52, crowding: 58 },
  Oceania: { safety: 82, affordability: 48, equality: 70, civicFreedom: 84, ecology: 83, crowding: 49 },
};

const cityScreenOverrides: Record<string, Partial<CityScreenProfile>> = {

  pyongyang: { safety: 50, affordability: 30, equality: 20, civicFreedom: 5, ecology: 30, crowding: 50, boringIndex: 90, religiousViolence: 5, taxReturn: 30, flatExperience: 90 },
  kabul: { safety: 10, affordability: 50, equality: 10, civicFreedom: 10, ecology: 30, crowding: 80, religiousViolence: 95, hygiene: 30 },
  caracas: { safety: 10, affordability: 30, equality: 30, civicFreedom: 30, ecology: 40, crowding: 70, roadSafety: 30 },
  "port-au-prince": { safety: 5, affordability: 20, equality: 20, civicFreedom: 30, ecology: 20, crowding: 85, hygiene: 20, roadSafety: 20, religiousViolence: 20 },
  damascus: { safety: 10, affordability: 30, equality: 25, civicFreedom: 15, ecology: 30, crowding: 70, religiousViolence: 70 },
  lagos: { safety: 30, affordability: 60, equality: 30, civicFreedom: 50, ecology: 30, crowding: 95, hygiene: 35, roadSafety: 30 },
  kinshasa: { safety: 25, affordability: 50, equality: 30, civicFreedom: 40, ecology: 30, crowding: 80, hygiene: 30 },
  yakutsk: { safety: 70, affordability: 60, equality: 60, civicFreedom: 30, ecology: 40, crowding: 30, climate: 5, flatExperience: 80, boringIndex: 85 },
  norilsk: { safety: 65, affordability: 55, equality: 60, civicFreedom: 30, ecology: 5, crowding: 20, climate: 5, hygiene: 20, flatExperience: 85, boringIndex: 90 },
  london: { safety: 80, affordability: 15, equality: 60, civicFreedom: 85, ecology: 65, crowding: 85, housingPriceIndex: 95, taxReturn: 60, flatExperience: 40, boringIndex: 40 },
  "new-york": { safety: 70, affordability: 10, equality: 50, civicFreedom: 85, ecology: 55, crowding: 90, housingPriceIndex: 98, healthcareCost: 95, taxReturn: 50 },
  "san-francisco": { safety: 60, affordability: 5, equality: 55, civicFreedom: 88, ecology: 70, crowding: 60, housingPriceIndex: 99, hygiene: 40, roadSafety: 65 },
  geneva: { safety: 95, affordability: 10, equality: 75, civicFreedom: 90, ecology: 85, crowding: 30, boringIndex: 90, flatExperience: 85, housingPriceIndex: 95 },
  monaco: { safety: 98, affordability: 5, equality: 70, civicFreedom: 85, ecology: 80, crowding: 40, boringIndex: 95, flatExperience: 90, housingPriceIndex: 99 },
  vancouver: { safety: 85, affordability: 15, equality: 70, civicFreedom: 90, ecology: 90, crowding: 45, boringIndex: 80, flatExperience: 85, housingPriceIndex: 96 },

  // ── Top-tier cities: high growth, tolerant, affordable, liveable ──
  taipei: { safety: 93, affordability: 84, equality: 82, civicFreedom: 84, ecology: 79, crowding: 56, growthMomentum: 78, toleranceOpenness: 82, greenSpaceDeficit: 35 },
  busan: { safety: 89, affordability: 80, equality: 74, civicFreedom: 77, ecology: 74, crowding: 46, growthMomentum: 72, toleranceOpenness: 65, greenSpaceDeficit: 30 },
  fukuoka: { safety: 91, affordability: 82, equality: 76, civicFreedom: 85, ecology: 78, crowding: 44, growthMomentum: 70, toleranceOpenness: 68, greenSpaceDeficit: 28 },
  bangkok: { safety: 77, affordability: 90, equality: 64, civicFreedom: 79, ecology: 52, crowding: 69, growthMomentum: 80, toleranceOpenness: 78, greenSpaceDeficit: 42 },
  jakarta: { safety: 60, affordability: 74, equality: 52, civicFreedom: 68, ecology: 37, crowding: 82 },
  makati: { safety: 76, affordability: 66, equality: 55, civicFreedom: 68, ecology: 51, crowding: 68 },
  "jeju-city": { safety: 91, affordability: 79, equality: 76, civicFreedom: 84, ecology: 90, crowding: 39 },
  penang: { safety: 81, affordability: 85, equality: 68, civicFreedom: 80, ecology: 65, crowding: 58 },
  kaohsiung: { safety: 87, affordability: 85, equality: 80, civicFreedom: 84, ecology: 71, crowding: 49, growthMomentum: 76, toleranceOpenness: 80, greenSpaceDeficit: 22 },
  shanghai: { safety: 87, affordability: 58, equality: 60, civicFreedom: 48, ecology: 54, crowding: 72 },
  shenzhen: { safety: 85, affordability: 62, equality: 61, civicFreedom: 49, ecology: 61, crowding: 69 },
  tianjin: { safety: 82, affordability: 68, equality: 60, civicFreedom: 48, ecology: 56, crowding: 63 },
  yokohama: { safety: 90, affordability: 68, equality: 75, civicFreedom: 84, ecology: 73, crowding: 54 },
  singapore: { safety: 95, affordability: 42, equality: 71, civicFreedom: 60, ecology: 74, crowding: 67, growthMomentum: 68, toleranceOpenness: 32 },
  phuket: { safety: 75, affordability: 60, equality: 62, civicFreedom: 78, ecology: 62, crowding: 79 },
  "chiang-mai": { safety: 79, affordability: 87, equality: 68, civicFreedom: 81, ecology: 52, crowding: 52, growthMomentum: 72, toleranceOpenness: 76 },
  "kuala-lumpur": { safety: 74, affordability: 77, equality: 58, civicFreedom: 68, ecology: 58, crowding: 64, toleranceOpenness: 38 },
  "george-town": { safety: 81, affordability: 84, equality: 68, civicFreedom: 80, ecology: 64, crowding: 57 },
  kuching: { safety: 80, affordability: 86, equality: 69, civicFreedom: 81, ecology: 73, crowding: 42 },
  "hat-yai": { safety: 72, affordability: 84, equality: 61, civicFreedom: 73, ecology: 63, crowding: 48 },
  sapporo: { safety: 89, affordability: 78, equality: 77, civicFreedom: 85, ecology: 84, crowding: 41 },
  nagasaki: { safety: 88, affordability: 80, equality: 77, civicFreedom: 85, ecology: 80, crowding: 39 },
  kobe: { safety: 88, affordability: 72, equality: 75, civicFreedom: 84, ecology: 74, crowding: 51 },
  tokyo: { safety: 92, affordability: 35, equality: 76, civicFreedom: 85, ecology: 67, crowding: 86, growthMomentum: 45 },
  seoul: { safety: 87, affordability: 55, equality: 71, civicFreedom: 76, ecology: 59, crowding: 74, growthMomentum: 60 },
  suwon: { safety: 88, affordability: 76, equality: 73, civicFreedom: 77, ecology: 68, crowding: 52, growthMomentum: 74, toleranceOpenness: 64 },
  hiroshima: { safety: 89, affordability: 76, equality: 77, civicFreedom: 84, ecology: 79, crowding: 42 },
  vienna: { safety: 92, affordability: 46, equality: 82, civicFreedom: 86, ecology: 84, crowding: 49 },
  zurich: { safety: 95, affordability: 28, equality: 78, civicFreedom: 87, ecology: 88, crowding: 46 },
  paris: { safety: 80, affordability: 27, equality: 70, civicFreedom: 82, ecology: 63, crowding: 78 },
  graz: { safety: 90, affordability: 73, equality: 83, civicFreedom: 87, ecology: 82, crowding: 38 },
  porto: { safety: 83, affordability: 77, equality: 75, civicFreedom: 84, ecology: 74, crowding: 52 },
  braga: { safety: 84, affordability: 79, equality: 76, civicFreedom: 84, ecology: 78, crowding: 37 },
  tallinn: { safety: 85, affordability: 74, equality: 67, civicFreedom: 82, ecology: 77, crowding: 34 },
  helsinki: { safety: 89, affordability: 43, equality: 82, civicFreedom: 87, ecology: 85, crowding: 36 },
  moscow: { safety: 74, affordability: 76, equality: 60, civicFreedom: 35, ecology: 58, crowding: 63 },
  budapest: { safety: 80, affordability: 79, equality: 65, civicFreedom: 70, ecology: 66, crowding: 55 },
  krakow: { safety: 84, affordability: 78, equality: 67, civicFreedom: 77, ecology: 63, crowding: 53, growthMomentum: 76, toleranceOpenness: 68 },
  bucharest: { safety: 73, affordability: 76, equality: 58, civicFreedom: 68, ecology: 57, crowding: 56 },
  belgrade: { safety: 72, affordability: 78, equality: 60, civicFreedom: 64, ecology: 56, crowding: 58 },
  "nizhny-novgorod": { safety: 70, affordability: 78, equality: 59, civicFreedom: 34, ecology: 59, crowding: 47 },
  katowice: { safety: 81, affordability: 80, equality: 65, civicFreedom: 74, ecology: 55, crowding: 43 },
  gdansk: { safety: 84, affordability: 75, equality: 66, civicFreedom: 78, ecology: 71, crowding: 43, growthMomentum: 74, toleranceOpenness: 66 },
  torun: { safety: 83, affordability: 79, equality: 67, civicFreedom: 78, ecology: 72, crowding: 34 },
  bratislava: { safety: 85, affordability: 67, equality: 71, civicFreedom: 81, ecology: 69, crowding: 43 },
  chicago: { safety: 63, affordability: 49, equality: 50, civicFreedom: 78, ecology: 54, crowding: 63 },
  pittsburgh: { safety: 76, affordability: 63, equality: 57, civicFreedom: 80, ecology: 62, crowding: 41, growthMomentum: 72, toleranceOpenness: 75 },
  toronto: { safety: 78, affordability: 36, equality: 67, civicFreedom: 82, ecology: 66, crowding: 64 },
  montreal: { safety: 77, affordability: 54, equality: 68, civicFreedom: 82, ecology: 69, crowding: 52 },
  "mexico-city": { safety: 59, affordability: 68, equality: 47, civicFreedom: 71, ecology: 45, crowding: 81 },
  guadalajara: { safety: 66, affordability: 73, equality: 52, civicFreedom: 73, ecology: 54, crowding: 61 },
  merida: { safety: 79, affordability: 72, equality: 58, civicFreedom: 80, ecology: 66, crowding: 41 },
  "san-jose": { safety: 79, affordability: 62, equality: 63, civicFreedom: 82, ecology: 76, crowding: 43 },
  "panama-city": { safety: 71, affordability: 58, equality: 53, civicFreedom: 77, ecology: 61, crowding: 62 },
  "san-juan": { safety: 65, affordability: 52, equality: 59, civicFreedom: 79, ecology: 69, crowding: 58 },
  "sao-paulo": { safety: 57, affordability: 63, equality: 42, civicFreedom: 72, ecology: 48, crowding: 77 },
  "buenos-aires": { safety: 69, affordability: 67, equality: 56, civicFreedom: 75, ecology: 62, crowding: 60 },
  santiago: { safety: 72, affordability: 56, equality: 58, civicFreedom: 77, ecology: 58, crowding: 68 },
  bogota: { safety: 58, affordability: 67, equality: 45, civicFreedom: 72, ecology: 51, crowding: 70 },
  lima: { safety: 57, affordability: 63, equality: 46, civicFreedom: 69, ecology: 44, crowding: 72 },
  curitiba: { safety: 67, affordability: 72, equality: 49, civicFreedom: 73, ecology: 63, crowding: 48 },
  medellin: { safety: 66, affordability: 70, equality: 50, civicFreedom: 74, ecology: 56, crowding: 58 },
  montevideo: { safety: 74, affordability: 60, equality: 66, civicFreedom: 82, ecology: 72, crowding: 39 },
  cordoba: { safety: 68, affordability: 70, equality: 54, civicFreedom: 76, ecology: 60, crowding: 44 },
  valparaiso: { safety: 64, affordability: 65, equality: 56, civicFreedom: 75, ecology: 59, crowding: 55 },
  // ── Gulf: desert money, low tolerance, artificial growth ──
  dubai: { safety: 88, affordability: 35, equality: 30, civicFreedom: 35, ecology: 33, crowding: 64, toleranceOpenness: 25, greenSpaceDeficit: 85 },
  "abu-dhabi": { safety: 89, affordability: 39, equality: 33, civicFreedom: 39, ecology: 35, crowding: 53, toleranceOpenness: 22, greenSpaceDeficit: 82 },
  doha: { safety: 88, affordability: 30, equality: 28, civicFreedom: 35, ecology: 31, crowding: 49, toleranceOpenness: 20, greenSpaceDeficit: 80 },
  riyadh: { safety: 80, affordability: 55, equality: 38, civicFreedom: 38, ecology: 28, crowding: 58, toleranceOpenness: 15, greenSpaceDeficit: 88 },
  "tel-aviv": { safety: 80, affordability: 29, equality: 56, civicFreedom: 63, ecology: 58, crowding: 66 },
  muscat: { safety: 84, affordability: 62, equality: 50, civicFreedom: 56, ecology: 37, crowding: 39 },
  manama: { safety: 82, affordability: 58, equality: 49, civicFreedom: 55, ecology: 34, crowding: 45, toleranceOpenness: 28, greenSpaceDeficit: 78 },
  jeddah: { safety: 78, affordability: 60, equality: 45, civicFreedom: 45, ecology: 29, crowding: 54, toleranceOpenness: 15, greenSpaceDeficit: 90 },
  "kuwait-city": { safety: 82, affordability: 43, equality: 34, civicFreedom: 42, ecology: 27, crowding: 50, toleranceOpenness: 18, greenSpaceDeficit: 85 },
  amman: { safety: 70, affordability: 61, equality: 50, civicFreedom: 61, ecology: 42, crowding: 55 },
  "cape-town": { safety: 49, affordability: 57, equality: 31, civicFreedom: 76, ecology: 61, crowding: 63 },
  johannesburg: { safety: 41, affordability: 59, equality: 29, civicFreedom: 74, ecology: 52, crowding: 59 },
  nairobi: { safety: 58, affordability: 71, equality: 45, civicFreedom: 66, ecology: 46, crowding: 67 },
  kigali: { safety: 85, affordability: 69, equality: 54, civicFreedom: 52, ecology: 71, crowding: 36 },
  casablanca: { safety: 60, affordability: 68, equality: 48, civicFreedom: 59, ecology: 47, crowding: 59 },
  "port-louis": { safety: 82, affordability: 67, equality: 61, civicFreedom: 79, ecology: 73, crowding: 34 },
  gaborone: { safety: 72, affordability: 72, equality: 56, civicFreedom: 73, ecology: 58, crowding: 33 },
  windhoek: { safety: 69, affordability: 68, equality: 47, civicFreedom: 73, ecology: 63, crowding: 31 },
  accra: { safety: 62, affordability: 72, equality: 48, civicFreedom: 68, ecology: 48, crowding: 61 },
  dakar: { safety: 61, affordability: 70, equality: 49, civicFreedom: 67, ecology: 49, crowding: 57 },
  // ── Oceania: pleasant but low growth, retirement economy, unaffordable ──
  auckland: { safety: 87, affordability: 43, equality: 72, civicFreedom: 87, ecology: 83, crowding: 51, growthMomentum: 35, boringIndex: 65 },
  sydney: { safety: 85, affordability: 26, equality: 68, civicFreedom: 86, ecology: 74, crowding: 63, growthMomentum: 42, boringIndex: 45, housingPriceIndex: 94 },
  melbourne: { safety: 84, affordability: 30, equality: 69, civicFreedom: 86, ecology: 72, crowding: 61, growthMomentum: 40, boringIndex: 48 },
  brisbane: { safety: 84, affordability: 48, equality: 68, civicFreedom: 86, ecology: 79, crowding: 42, growthMomentum: 38, boringIndex: 72 },
  wellington: { safety: 88, affordability: 46, equality: 76, civicFreedom: 88, ecology: 84, crowding: 37, growthMomentum: 30, boringIndex: 74 },
  perth: { safety: 86, affordability: 44, equality: 67, civicFreedom: 86, ecology: 79, crowding: 35, growthMomentum: 34, boringIndex: 78 },
  adelaide: { safety: 87, affordability: 52, equality: 69, civicFreedom: 86, ecology: 78, crowding: 34, growthMomentum: 32, boringIndex: 80 },
  hobart: { safety: 89, affordability: 47, equality: 71, civicFreedom: 87, ecology: 86, crowding: 27, growthMomentum: 25, boringIndex: 88 },
  christchurch: { safety: 88, affordability: 50, equality: 71, civicFreedom: 87, ecology: 82, crowding: 31, growthMomentum: 28, boringIndex: 76 },
  suva: { safety: 67, affordability: 64, equality: 57, civicFreedom: 74, ecology: 69, crowding: 42 },
  bengaluru: { safety: 55, affordability: 64, equality: 49, civicFreedom: 72, ecology: 41, crowding: 83 },
  hyderabad: { safety: 58, affordability: 67, equality: 50, civicFreedom: 72, ecology: 44, crowding: 77 },
  colombo: { safety: 74, affordability: 74, equality: 62, civicFreedom: 69, ecology: 57, crowding: 59 },
  dhaka: { safety: 44, affordability: 74, equality: 48, civicFreedom: 58, ecology: 24, crowding: 90 },
  karachi: { safety: 38, affordability: 70, equality: 47, civicFreedom: 50, ecology: 29, crowding: 86 },
  lahore: { safety: 63, affordability: 80, equality: 57, civicFreedom: 59, ecology: 33, crowding: 73 },
  chattogram: { safety: 52, affordability: 72, equality: 49, civicFreedom: 57, ecology: 38, crowding: 74 },
  kathmandu: { safety: 61, affordability: 67, equality: 55, civicFreedom: 68, ecology: 34, crowding: 61 },
  thimphu: { safety: 83, affordability: 79, equality: 66, civicFreedom: 73, ecology: 86, crowding: 21 },
  male: { safety: 76, affordability: 39, equality: 56, civicFreedom: 67, ecology: 45, crowding: 71 },
  davao: { safety: 72, affordability: 69, equality: 51, civicFreedom: 58, ecology: 55, crowding: 47 },
  denpasar: { safety: 71, affordability: 56, equality: 55, civicFreedom: 69, ecology: 57, crowding: 76 },
};

const defaultAccentByRegion: Record<string, CityAccent> = {
  "Southeast Asia": {
    accentHex: "#0f3f99",
    accentSoftHex: "rgba(15, 63, 153, 0.10)",
    accentLabel: "Electric blue urban mix",
  },
  "East Asia": {
    accentHex: "#1b5fbf",
    accentSoftHex: "rgba(27, 95, 191, 0.10)",
    accentLabel: "Calm systems blue",
  },
  "South Asia": {
    accentHex: "#7a5d1f",
    accentSoftHex: "rgba(122, 93, 31, 0.10)",
    accentLabel: "Heat and pressure amber",
  },
  "Western and Northern Europe": {
    accentHex: "#455a89",
    accentSoftHex: "rgba(69, 90, 137, 0.10)",
    accentLabel: "Civic slate blue",
  },
  "Southern/Eastern Europe and Eurasia": {
    accentHex: "#2e5f8a",
    accentSoftHex: "rgba(46, 95, 138, 0.10)",
    accentLabel: "Stone-and-river blue",
  },
  "North America": {
    accentHex: "#334f85",
    accentSoftHex: "rgba(51, 79, 133, 0.10)",
    accentLabel: "Wide-grid steel blue",
  },
  "Latin America": {
    accentHex: "#0f6690",
    accentSoftHex: "rgba(15, 102, 144, 0.10)",
    accentLabel: "Street-life blue",
  },
  "Middle East": {
    accentHex: "#996b1f",
    accentSoftHex: "rgba(153, 107, 31, 0.10)",
    accentLabel: "Desert-gold pressure",
  },
  Africa: {
    accentHex: "#245f67",
    accentSoftHex: "rgba(36, 95, 103, 0.10)",
    accentLabel: "Equatorial teal",
  },
  Oceania: {
    accentHex: "#255b96",
    accentSoftHex: "rgba(37, 91, 150, 0.10)",
    accentLabel: "Southern ocean blue",
  },
};

const cityAccentOverrides: Record<string, CityAccent> = {
  bangkok: {
    accentHex: "#1e56c5",
    accentSoftHex: "rgba(30, 86, 197, 0.11)",
    accentLabel: "Electric street blue",
  },
  busan: {
    accentHex: "#2258a8",
    accentSoftHex: "rgba(34, 88, 168, 0.10)",
    accentLabel: "Harbour cobalt",
  },
  fukuoka: {
    accentHex: "#2d6bb8",
    accentSoftHex: "rgba(45, 107, 184, 0.10)",
    accentLabel: "Startup bay blue",
  },
  "jeju-city": {
    accentHex: "#2c8d8a",
    accentSoftHex: "rgba(44, 141, 138, 0.10)",
    accentLabel: "Island volcanic teal",
  },
  taipei: {
    accentHex: "#304ca8",
    accentSoftHex: "rgba(48, 76, 168, 0.10)",
    accentLabel: "Transit indigo",
  },
  penang: {
    accentHex: "#1f75a5",
    accentSoftHex: "rgba(31, 117, 165, 0.10)",
    accentLabel: "Straits heritage blue",
  },
  kaohsiung: {
    accentHex: "#19739c",
    accentSoftHex: "rgba(25, 115, 156, 0.10)",
    accentLabel: "Dockyard blue",
  },
  kuching: {
    accentHex: "#2b6d78",
    accentSoftHex: "rgba(43, 109, 120, 0.10)",
    accentLabel: "River-market teal",
  },
  makati: {
    accentHex: "#3557a4",
    accentSoftHex: "rgba(53, 87, 164, 0.10)",
    accentLabel: "Finance-district blue",
  },
  shanghai: {
    accentHex: "#193f7a",
    accentSoftHex: "rgba(25, 63, 122, 0.10)",
    accentLabel: "River-port navy",
  },
};

function accentForCity(city: CityOverride, row: CityUniverseRow): CityAccent {
  return (
    cityAccentOverrides[city.id] ??
    defaultAccentByRegion[row.cohort] ?? {
      accentHex: "#0f3f99",
      accentSoftHex: "rgba(15, 63, 153, 0.10)",
      accentLabel: "SLIC blue reference tone",
    }
  );
}

const countryTaxAssumptions: Record<string, number> = {
  Thailand: 0.12,
  Singapore: 0.15,
  Malaysia: 0.14,
  Indonesia: 0.14,
  Philippines: 0.12,
  Taiwan: 0.14,
  "South Korea": 0.18,
  Japan: 0.2,
  China: 0.19,
  India: 0.14,
  "Sri Lanka": 0.13,
  Bangladesh: 0.11,
  Pakistan: 0.1,
  Nepal: 0.1,
  Bhutan: 0.08,
  Maldives: 0.09,
  France: 0.28,
  Austria: 0.27,
  Switzerland: 0.22,
  Netherlands: 0.24,
  Denmark: 0.31,
  Portugal: 0.2,
  Estonia: 0.2,
  Finland: 0.27,
  Russia: 0.13,
  Hungary: 0.19,
  Poland: 0.18,
  Romania: 0.16,
  Serbia: 0.14,
  Slovakia: 0.18,
  "United States": 0.24,
  Canada: 0.26,
  Mexico: 0.16,
  Panama: 0.12,
  "Costa Rica": 0.14,
  "Puerto Rico": 0.18,
  Brazil: 0.18,
  Argentina: 0.2,
  Chile: 0.18,
  Colombia: 0.16,
  Peru: 0.14,
  Uruguay: 0.18,
  "United Arab Emirates": 0.06,
  Qatar: 0.05,
  "Saudi Arabia": 0.06,
  Israel: 0.24,
  Oman: 0.06,
  Bahrain: 0.05,
  Kuwait: 0.05,
  Jordan: 0.14,
  "South Africa": 0.2,
  Kenya: 0.14,
  Rwanda: 0.12,
  Morocco: 0.13,
  Mauritius: 0.12,
  Botswana: 0.14,
  Namibia: 0.15,
  Ghana: 0.12,
  Senegal: 0.11,
  "New Zealand": 0.24,
  Australia: 0.25,
  Fiji: 0.11,
};

const topCityOverrides: Record<string, CityOverride> = {
  taipei: {
    id: "taipei",
    name: "Taipei",
    country: "Taiwan",
    region: "East Asia",
    tagline: "Quiet confidence with everyday convenience.",
    signal: "Transit density and food culture keep daily life rich without overwhelming the city.",
    delta: 2,
    tags: ["safe", "transit", "culture"],
    scores: { pressure: 88, viability: 94, capability: 93, community: 97 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "High-systems, high-street-life benchmark aligned with earlier SLIC discussion.",
    sentimentEmojis: ["🍜", "🚇", "🏯", "🌿", "😊"],
    metrics: {
      pppIncomePerHead: 36800,
      graduateHousingShare: 28,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "High-access system with strong everyday reliability for routine and specialist care.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Strong public and tertiary options keep education quality high without extreme cost load.",
      },
      experienceDiversity: 90,
    },
  },
  busan: {
    id: "busan",
    name: "Busan",
    country: "South Korea",
    region: "East Asia",
    tagline: "A port city with breathing room.",
    signal: "Combines livability, coastline, and economic heft without Seoul-level pressure.",
    delta: 4,
    tags: ["coast", "balance", "industry"],
    scores: { pressure: 90, viability: 92, capability: 91, community: 91 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "User anchor for second-city infrastructure quality, coastal livability, and economic competence.",
    sentimentEmojis: ["🌊", "🐟", "🏖️", "🚢", "😌"],
    metrics: {
      pppIncomePerHead: 34100,
      graduateHousingShare: 26,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "Strong hospital network and nationally backed access keep baseline care dependable.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Solid public and university pathways with less pressure than Seoul.",
      },
      experienceDiversity: 84,
    },
  },
  fukuoka: {
    id: "fukuoka",
    name: "Fukuoka",
    country: "Japan",
    region: "East Asia",
    tagline: "Compact, social, and startup ready.",
    signal: "Strong urban management and a human-scale rhythm keep it competitive and easy to inhabit.",
    delta: 1,
    tags: ["startup", "walkable", "food"],
    scores: { pressure: 89, viability: 91, capability: 90, community: 90 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "User anchor and strong challenger city for innovation, access, and livability balance.",
    sentimentEmojis: ["🍜", "🚶", "🌸", "💡", "😄"],
    metrics: {
      pppIncomePerHead: 31900,
      graduateHousingShare: 25,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "National healthcare access with a manageable urban scale makes routine care easy to reach.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Strong schooling and university options support early-career formation.",
      },
      experienceDiversity: 82,
    },
  },
  bangkok: {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    region: "Southeast Asia",
    tagline: "High energy, high variety, still deeply liveable.",
    signal: "The city wins on vibrancy, affordability breadth, hospitality, and sheer diversity of experience.",
    delta: 5,
    tags: ["variety", "nightlife", "hospitality"],
    scores: { pressure: 91, viability: 82, capability: 89, community: 94 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "User anchor and regional benchmark for hospitality, economic dynamism, and affordability-pressure tradeoffs.",
    sentimentEmojis: ["🍛", "🛕", "🌙", "🛺", "🥰"],
    metrics: {
      pppIncomePerHead: 24300,
      graduateHousingShare: 22,
      healthcare: {
        access: "Broad mixed access",
        affordability: "Low cost",
        summary: "Private and public care both matter, and major hospitals remain comparatively affordable.",
      },
      education: {
        access: "Broad public-private mix",
        affordability: "Low to moderate cost",
        summary: "There is real range, from affordable public options to premium private pathways.",
      },
      experienceDiversity: 97,
    },
  },
  jakarta: {
    id: "jakarta",
    name: "Jakarta",
    country: "Indonesia",
    region: "Southeast Asia",
    tagline: "A regional giant with real pressure and real economic gravity.",
    signal: "Jakarta belongs in the field because scale, ambition, and corporate gravity matter, even when congestion and sanitation risks keep it from the very top.",
    delta: 1,
    tags: ["regional hub", "pressure", "corporate core"],
    scores: { pressure: 79, viability: 60, capability: 72, community: 69 },
    manifestStatus: "provisional",
    cityType: "primary",
    inclusionRationale: "Included as a necessary Southeast Asian benchmark for scale, competitiveness, and infrastructure-pressure tradeoffs.",
    sentimentEmojis: ["🏙️", "🚦", "💼", "🌧️", "😤"],
    metrics: {
      pppIncomePerHead: 18500,
      graduateHousingShare: 30,
      healthcare: {
        access: "Broad mixed access",
        affordability: "Low to moderate cost",
        summary: "Large hospital capacity exists, but access quality varies sharply by district and provider.",
      },
      education: {
        access: "Broad public-private mix",
        affordability: "Moderate cost",
        summary: "The city offers range and institutional depth, but commuting and urban pressure raise the real cost of opportunity.",
      },
      experienceDiversity: 83,
    },
  },
  "jeju-city": {
    id: "jeju-city",
    name: "Jeju",
    country: "South Korea",
    region: "East Asia",
    tagline: "Island calm with specific local character.",
    signal: "Natural beauty, safety, and a slower pace make it a strong quality-of-life outlier.",
    delta: 3,
    tags: ["nature", "island", "calm"],
    scores: { pressure: 79, viability: 93, capability: 88, community: 92 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "User anchor for lifestyle quality, hospitality, and island-scale livability.",
    sentimentEmojis: ["🏝️", "🌋", "🍊", "🐴", "😎"],
    metrics: {
      pppIncomePerHead: 29400,
      graduateHousingShare: 24,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "Coverage is strong, though specialist depth is lower than the biggest mainland metros.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Education is accessible, with the city winning more on life quality than elite academic density.",
      },
      experienceDiversity: 79,
    },
  },
  penang: {
    id: "penang",
    name: "Penang",
    country: "Malaysia",
    region: "Southeast Asia",
    tagline: "Trading history meets modern industry.",
    signal: "Food, heritage, and semiconductor-linked economic depth make it more dynamic than its size suggests.",
    delta: 2,
    tags: ["heritage", "food", "industry"],
    scores: { pressure: 88, viability: 84, capability: 87, community: 89 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "User anchor for semiconductor economy, cultural texture, and secondary-city livability.",
    sentimentEmojis: ["🍜", "🏛️", "💻", "🎨", "😋"],
    metrics: {
      pppIncomePerHead: 22800,
      graduateHousingShare: 24,
      healthcare: {
        access: "Broad mixed access",
        affordability: "Low cost",
        summary: "Public and private options coexist, with good value relative to many richer cities.",
      },
      education: {
        access: "Broad public-private mix",
        affordability: "Low to moderate cost",
        summary: "Affordable schooling and tertiary options help keep the city attractive for families.",
      },
      experienceDiversity: 88,
    },
  },
  makati: {
    id: "makati",
    name: "Makati",
    country: "Philippines",
    region: "Southeast Asia",
    tagline: "A polished business district tested against the wider metro reality.",
    signal: "Makati stays interesting because it concentrates finance, services, and livable pockets, but SLIC still checks it against affordability, safety, and urban pressure.",
    delta: 2,
    tags: ["business core", "district scale", "services"],
    scores: { pressure: 80, viability: 72, capability: 76, community: 73 },
    manifestStatus: "provisional",
    cityType: "primary",
    inclusionRationale: "Included as a metro-core test case for whether a well-serviced district can sustain a broader livability argument.",
    sentimentEmojis: ["🏢", "☕", "🚕", "🌴", "🙂"],
    metrics: {
      pppIncomePerHead: 20800,
      graduateHousingShare: 34,
      healthcare: {
        access: "Broad private-led access",
        affordability: "Moderate cost",
        summary: "High-end options are visible, but affordability is less forgiving than in several stronger Southeast Asian peers.",
      },
      education: {
        access: "Broad private-public mix",
        affordability: "Moderate cost",
        summary: "The city has strong institutions nearby, though access depends more on household budget than in the best-value Asian systems.",
      },
      experienceDiversity: 81,
    },
  },
  kaohsiung: {
    id: "kaohsiung",
    name: "Kaohsiung",
    country: "Taiwan",
    region: "East Asia",
    tagline: "A harbor city with room to grow.",
    signal: "Cleaner edges, strong place-making, and a practical waterfront economy push it upward.",
    delta: 1,
    tags: ["harbor", "clean", "young"],
    scores: { pressure: 84, viability: 88, capability: 86, community: 86 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Harbor-city comparator with strong place-making and manageable scale.",
    sentimentEmojis: ["⚓", "🌅", "🎨", "🚄", "😊"],
    metrics: {
      pppIncomePerHead: 29700,
      graduateHousingShare: 23,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "Strong urban access with comparatively low everyday financial friction.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Reliable public pathways and lower daily pressure than the capital.",
      },
      experienceDiversity: 80,
    },
  },
  shanghai: {
    id: "shanghai",
    name: "Shanghai",
    country: "China",
    region: "East Asia",
    tagline: "Massive capability, visible trade-offs.",
    signal: "Incredible transit and economic vitality are moderated by real affordability pressure.",
    delta: -1,
    tags: ["mega-city", "finance", "transit"],
    scores: { pressure: 92, viability: 90, capability: 85, community: 73 },
    manifestStatus: "provisional",
    cityType: "primary",
    inclusionRationale: "Economic gravity benchmark included to test how mega-city capability meets affordability pressure.",
    sentimentEmojis: ["🏙️", "💹", "🚄", "🌃", "😤"],
    metrics: {
      pppIncomePerHead: 27500,
      graduateHousingShare: 35,
      healthcare: {
        access: "Broad urban access",
        affordability: "Moderate cost",
        summary: "High capability exists, but everyday access depends more on system tier and city cost pressure.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low to moderate cost",
        summary: "Very strong academic density, though competition and housing costs raise the total burden.",
      },
      experienceDiversity: 76,
    },
  },
  shenzhen: {
    id: "shenzhen",
    name: "Shenzhen",
    country: "China",
    region: "East Asia",
    tagline: "A high-speed economic machine with fewer historical layers than its peers.",
    signal: "Shenzhen is deeply competitive and technically capable, but its cultural depth and housing pressure keep the city in active debate within SLIC.",
    delta: 3,
    tags: ["innovation", "speed", "manufacturing"],
    scores: { pressure: 89, viability: 82, capability: 80, community: 68 },
    manifestStatus: "provisional",
    cityType: "primary",
    inclusionRationale: "Included as a necessary East Asian benchmark for innovation, productive economic power, and high-pressure urban modernity.",
    sentimentEmojis: ["💻", "🏗️", "🚄", "📦", "⚡"],
    metrics: {
      pppIncomePerHead: 31200,
      graduateHousingShare: 37,
      healthcare: {
        access: "Broad urban access",
        affordability: "Moderate cost",
        summary: "Capability is strong, but everyday access still depends on system tier and overall cost pressure.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low to moderate cost",
        summary: "High institutional ambition is visible, though the city feels more competitive than relaxed.",
      },
      experienceDiversity: 74,
    },
  },
  tianjin: {
    id: "tianjin",
    name: "Tianjin",
    country: "China",
    region: "East Asia",
    tagline: "A northern port city with scale, industry, and more breathing room than the capital.",
    signal: "Tianjin is useful for SLIC because it tests whether large-scale Chinese urban capability can be delivered without maximum-cost prestige pressure.",
    delta: 1,
    tags: ["port city", "industry", "scale"],
    scores: { pressure: 81, viability: 79, capability: 78, community: 72 },
    manifestStatus: "provisional",
    cityType: "secondary",
    inclusionRationale: "Secondary East Asian challenger included for industrial relevance, port-city utility, and relief from capital-city prestige bias.",
    sentimentEmojis: ["⚓", "🏭", "🚇", "🌆", "🙂"],
    metrics: {
      pppIncomePerHead: 26400,
      graduateHousingShare: 30,
      healthcare: {
        access: "Broad urban access",
        affordability: "Moderate cost",
        summary: "Strong metro-scale capacity exists, though experience still varies by system tier and district.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low to moderate cost",
        summary: "The city has serious educational capacity without the same prestige-cost premium as the very top-tier capitals.",
      },
      experienceDiversity: 72,
    },
  },
  yokohama: {
    id: "yokohama",
    name: "Yokohama",
    country: "Japan",
    region: "East Asia",
    tagline: "Port-city composure with metropolitan access.",
    signal: "It offers a high-function baseline and strong public-space quality without constant friction.",
    delta: 0,
    tags: ["harbor", "composed", "access"],
    scores: { pressure: 81, viability: 88, capability: 84, community: 83 },
    manifestStatus: "provisional",
    cityType: "secondary",
    inclusionRationale: "Port-city comparator with strong metropolitan access and public-space quality.",
    sentimentEmojis: ["⚓", "🌸", "🎡", "🍜", "😌"],
    metrics: {
      pppIncomePerHead: 32400,
      graduateHousingShare: 31,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "Reliable national coverage and strong hospital access support everyday stability.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Good schooling and metro-scale access without Tokyo-level housing stress.",
      },
      experienceDiversity: 75,
    },
  },
  auckland: {
    id: "auckland",
    name: "Auckland",
    country: "New Zealand",
    region: "Oceania",
    tagline: "Exceptionally pleasant, less economically urgent.",
    signal: "A quality-of-life standout whose score softens once competitiveness and long-term opportunity are factored in.",
    delta: -2,
    tags: ["pleasant", "green", "cost"],
    scores: { pressure: 72, viability: 89, capability: 82, community: 85 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Primary Oceanian benchmark for human-capital quality, openness, and cost pressure.",
    sentimentEmojis: ["🌿", "⛵", "🏔️", "☕", "😊"],
    metrics: {
      pppIncomePerHead: 30200,
      graduateHousingShare: 42,
      healthcare: {
        access: "Universal public baseline",
        affordability: "Free to low cost",
        summary: "Healthcare access is strong, but the wider cost-of-living equation is still heavy.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low to moderate cost",
        summary: "Strong public systems, though the total cost of staying in the city remains high.",
      },
      experienceDiversity: 83,
    },
  },
};

function hashValue(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 2147483647;
  }
  return hash;
}


function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function capitalize(word: string): string {
  if (!word) {
    return word;
  }
  return word[0].toUpperCase() + word.slice(1);
}

function displayNameFromId(cityId: string): string {
  return cityId
    .split("-")
    .slice(1)
    .map(capitalize)
    .join(" ");
}

function parseCsv(raw: string): CityUniverseRow[] {
  const rows: string[][] = [];
  let current = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    const next = raw[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      if (current || currentRow.length > 0) {
        currentRow.push(current);
        rows.push(currentRow);
        currentRow = [];
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current || currentRow.length > 0) {
    currentRow.push(current);
    rows.push(currentRow);
  }

  const [headerRow, ...bodyRows] = rows;
  return bodyRows.map((row) => {
    const record = Object.fromEntries(headerRow.map((header, index) => [header, row[index] ?? ""]));
    return {
      city_id: record.city_id,
      cohort: record.cohort,
      manifest_status: record.manifest_status === "locked" ? "locked" : "provisional",
      city_type: record.city_type === "primary" ? "primary" : "secondary",
      country: record.country,
      inclusion_rationale: record.inclusion_rationale,
    };
  });
}

function generatedAccessProfile(
  base: CityAccessProfile,
  affordabilityBias = 0,
): CityAccessProfile {
  let affordability = base.affordability;
  if (affordabilityBias > 0) {
    affordability = "Low to moderate cost";
  }

  return {
    access: base.access,
    affordability,
    summary: base.summary,
  };
}

function generatedMetrics(row: CityUniverseRow, profile: RegionProfile): CityLifeMetrics {
  const income = profile.pppIncomePerHead;
  const housing = profile.graduateHousingShare;
  const diversity = profile.experienceDiversity;

  return {
    pppIncomePerHead: income,
    graduateHousingShare: housing,
    healthcare: generatedAccessProfile(
      profile.healthcare,
      row.city_type === "primary" ? 0.05 : 0,
    ),
    education: generatedAccessProfile(
      profile.education,
      row.city_type === "primary" ? 0.04 : 0,
    ),
    experienceDiversity: diversity,
  };
}

function generatedScores(row: CityUniverseRow, profile: RegionProfile): RankedCity["scores"] {
  const typeAdjustment = row.city_type === "primary" ? 1.5 : 0;
  const lockAdjustment = row.manifest_status === "locked" ? 0.8 : -0.6;
  const pressure = clamp(
    Math.round(profile.pressure + typeAdjustment),
    50,
    81,
  );
  const viability = clamp(
    Math.round(profile.viability + lockAdjustment),
    48,
    81,
  );
  const capability = clamp(
    Math.round(profile.capability + lockAdjustment * 0.5),
    48,
    81,
  );
  const community = clamp(
    Math.round(profile.community),
    50,
    83,
  );
  const creative = clamp(
    Math.round(profile.creative + typeAdjustment + lockAdjustment),
    48,
    86,
  );
  const slic = Math.round(
    pressure * 0.25 + viability * 0.22 + capability * 0.18 +
    community * 0.15 + creative * 0.20,
  );
  return { slic, pressure, viability, capability, community, creative };
}

function generatedTags(row: CityUniverseRow, profile: RegionProfile): string[] {
  const generated = [...profile.tags];
  if (row.city_type === "secondary") {
    generated.unshift("secondary city");
  }
  if (row.manifest_status === "provisional") {
    generated.push("watchlist");
  }
  return generated.slice(0, 3);
}

function generatedTagline(row: CityUniverseRow): string {
  if (row.city_type === "secondary") {
    return "A challenger city worth measuring on lived outcomes, not prestige alone.";
  }
  return "A major urban benchmark tested against cost, pressure, and human possibility.";
}

const regionEmojiPools: Record<string, string[]> = {
  "Southeast Asia": ["🍜", "🛕", "🌴", "🛺", "🌙", "🏖️", "😊", "🥰", "😋", "🌿"],
  "East Asia": ["🚇", "🍜", "🌸", "🏯", "💡", "🎌", "😊", "😌", "🏙️", "🎎"],
  "South Asia": ["🕌", "🍛", "🚂", "🎭", "🌺", "😤", "💪", "🏗️", "🎶", "🙏"],
  "Western and Northern Europe": ["🏰", "🚲", "🎭", "☕", "🌧️", "😊", "🏛️", "🌿", "🎵", "📚"],
  "Southern/Eastern Europe and Eurasia": ["🏛️", "🍷", "☀️", "🎶", "🌊", "😌", "🏰", "🎨", "🍕", "💃"],
  "North America": ["🏙️", "🚗", "🌮", "💻", "🏈", "😤", "🌆", "☕", "🎸", "🌳"],
  "Latin America": ["💃", "🎶", "🌮", "⚽", "🌴", "🥰", "🎭", "🌺", "🏖️", "🎉"],
  "Middle East": ["🕌", "☀️", "🏗️", "🌴", "✈️", "😤", "🏙️", "🍵", "🎨", "💎"],
  Africa: ["🌍", "🎶", "☀️", "🏗️", "🌺", "💪", "🏙️", "🌴", "🎭", "🙏"],
  Oceania: ["🌿", "⛵", "🏔️", "☀️", "🏖️", "😊", "🐨", "🌊", "☕", "🌳"],
};

function generatedSentimentEmojis(row: CityUniverseRow): string[] {
  const pool = regionEmojiPools[row.cohort] ?? regionEmojiPools["Southeast Asia"];
  const startIndex = hashValue(`${row.city_id}-emoji`) % (pool.length - 4);
  return pool.slice(startIndex, startIndex + 5);
}

function generatedSignal(row: CityUniverseRow): string {
  if (row.city_type === "secondary") {
    return "Secondary-city scale and regional relevance make it a useful SLIC counterpoint to over-ranked capitals.";
  }
  return "Its scale and visibility make it a necessary benchmark, but SLIC still forces it through the same affordability and quality-of-life filter.";
}

function screenProfileForCity(row: CityUniverseRow, cityId: string): CityScreenProfile {
  const base = regionScreenProfiles[row.cohort] ?? regionScreenProfiles["Southeast Asia"];
  const override = cityScreenOverrides[cityId] ?? {};

  const safety = clamp(
    Math.round(override.safety ?? base.safety),
    30,
    96,
  );
  const affordability = clamp(
    Math.round(override.affordability ?? base.affordability),
    22,
    96,
  );
  const equality = clamp(
    Math.round(override.equality ?? base.equality),
    20,
    92,
  );
  const civicFreedom = clamp(
    Math.round(override.civicFreedom ?? base.civicFreedom),
    18,
    92,
  );
  const ecology = clamp(
    Math.round(override.ecology ?? base.ecology),
    18,
    94,
  );
  const crowding = clamp(
    Math.round(override.crowding ?? base.crowding),
    18,
    94,
  );

  return { safety, affordability, equality, civicFreedom, ecology, crowding };
}

function effectiveTaxRate(country: string): number {
  return countryTaxAssumptions[country] ?? 0.18;
}

function disposableIncomeEstimate(metrics: CityLifeMetrics, country: string): number {
  const effectiveTax = effectiveTaxRate(country);
  const postTaxIncome = metrics.pppIncomePerHead * (1 - effectiveTax);
  return Math.round(postTaxIncome * (1 - metrics.graduateHousingShare / 100));
}

function disposableIncomeStrength(metrics: CityLifeMetrics, country: string): number {
  return clamp(Math.round(disposableIncomeEstimate(metrics, country) / 280), 24, 96);
}

function taxCompetitiveness(country: string): number {
  return clamp(Math.round(100 - effectiveTaxRate(country) * 180), 26, 96);
}

function baseCreativeScore(
  city: CityOverride,
  row: CityUniverseRow,
  profile: CityScreenProfile,
): number {
  const seeded =
    "creative" in city.scores && typeof city.scores.creative === "number"
      ? city.scores.creative
      : Math.round(
          city.scores.pressure * 0.52 +
            city.scores.viability * 0.14 +
            city.scores.community * 0.14 +
            (regionProfiles[row.cohort]?.creative ?? 70) * 0.2,
        );

  return clamp(
    Math.round(
      seeded +
        (profile.civicFreedom - 68) / 5 +
        (profile.safety - 72) / 12 -
        (profile.crowding - 58) / 12,
    ),
    24,
    96,
  );
}

function screeningPenalty(profile: CityScreenProfile, roomToLiveStrength: number): number {
  let penalty = 0;

  if (profile.safety < 55) {
    penalty -= 14;
  } else if (profile.safety < 65) {
    penalty -= 7;
  } else if (profile.safety > 85) {
    penalty += 2;
  }

  if (roomToLiveStrength < 45) {
    penalty -= 12;
  } else if (roomToLiveStrength < 58) {
    penalty -= 6;
  } else if (roomToLiveStrength > 78) {
    penalty += 2;
  }

  if (profile.equality < 45) {
    penalty -= 8;
  } else if (profile.equality < 60) {
    penalty -= 3;
  }

  if (profile.civicFreedom < 40) {
    penalty -= 12;
  } else if (profile.civicFreedom < 55) {
    penalty -= 6;
  } else if (profile.civicFreedom > 80) {
    penalty += 1;
  }

  if (profile.ecology < 45) {
    penalty -= 10;
  } else if (profile.ecology < 58) {
    penalty -= 4;
  } else if (profile.ecology > 82) {
    penalty += 1;
  }

  if (profile.crowding > 78) {
    penalty -= 8;
  } else if (profile.crowding > 68) {
    penalty -= 4;
  } else if (profile.crowding < 46) {
    penalty += 1;
  }

  // Extensively penalize low priority traits
  if ((profile.hygiene ?? 70) < 50) penalty -= 12;
  if ((profile.climate ?? 70) < 40) penalty -= 12; // too cold
  if ((profile.roadSafety ?? 70) < 50) penalty -= 8;
  if ((profile.foodCulture ?? 70) < 50) penalty -= 6;
  if ((profile.boringIndex ?? 50) > 80) penalty -= 12;
  if ((profile.flatExperience ?? 50) > 80) penalty -= 10;
  if ((profile.taxReturn ?? 70) < 50) penalty -= 8;
  if ((profile.healthcareCost ?? 50) > 80) penalty -= 15;
  if ((profile.religiousViolence ?? 10) > 40) penalty -= 20;
  if ((profile.housingPriceIndex ?? 50) > 90) penalty -= 12;

  // Growth stagnation: retirement homes, aging economies, no domestic consumption
  const growth = profile.growthMomentum ?? 55;
  if (growth < 30) penalty -= 14;
  else if (growth < 42) penalty -= 8;
  else if (growth < 52) penalty -= 4;
  else if (growth > 75) penalty += 3;

  // Tolerance: anti-LGBTQ, ethnic discrimination, religious intolerance
  const tolerance = profile.toleranceOpenness ?? 65;
  if (tolerance < 30) penalty -= 14;
  else if (tolerance < 45) penalty -= 8;
  else if (tolerance < 55) penalty -= 4;

  // Green space deficit: concrete deserts, no parks
  if ((profile.greenSpaceDeficit ?? 40) > 75) penalty -= 6;

  return penalty;
}

function screeningTag(profile: CityScreenProfile, roomToLiveStrength: number): string {
  if ((profile.religiousViolence ?? 10) > 40) return "religious violence";
  if ((profile.hygiene ?? 70) < 50) return "unhygienic";
  if ((profile.climate ?? 70) < 40) return "too cold";
  if ((profile.housingPriceIndex ?? 50) > 95) return "unsustainable housing";
  if ((profile.healthcareCost ?? 50) > 85) return "expensive healthcare";
  if ((profile.growthMomentum ?? 55) < 30) return "stagnant economy";
  if ((profile.boringIndex ?? 50) > 85) return "retirement home";
  if ((profile.boringIndex ?? 50) > 70) return "low dynamism";
  if ((profile.toleranceOpenness ?? 65) < 35) return "intolerant atmosphere";
  if ((profile.flatExperience ?? 50) > 85) return "flat experience";
  if ((profile.taxReturn ?? 70) < 50) return "poor tax return";

  if (profile.civicFreedom < 45) {
    return "coercive atmosphere";
  }
  if (profile.safety < 60) {
    return "safety pressure";
  }
  if (profile.ecology < 50) {
    return "pollution stress";
  }
  if (profile.crowding > 74) {
    return "crowding pressure";
  }
  if (roomToLiveStrength < 50) {
    return "cost burden";
  }
  if (profile.equality < 48) {
    return "high inequality";
  }
  if (roomToLiveStrength > 78) {
    return "strong value";
  }
  if (profile.safety > 85) {
    return "high safety";
  }
  return "balanced fit";
}

function screeningSignal(
  city: CityOverride,
  profile: CityScreenProfile,
  roomToLiveStrength: number,
): string {
  if (profile.safety < 60) {
    return "This city stays in the field for comparison, but its safety confidence is too weak for the featured public board.";
  }

  if (profile.civicFreedom < 45) {
    return "Operational strength is visible, but the coercive civic atmosphere is strong enough to drag the city down in SLIC.";
  }

  if (profile.ecology < 50) {
    return "The city has energy, but environmental pressure and air-quality drag keep it below the featured board.";
  }

  if (profile.crowding > 74) {
    return "The city remains relevant, but crowding and visitor-pressure drag are eroding day-to-day livability.";
  }

  if (roomToLiveStrength < 50) {
    return "Headline income is weakened by tax and housing drag, so real disposable room to live remains thin.";
  }

  return city.signal;
}

function socialListeningTrend(delta: number, profile: CityScreenProfile): number[] {
  const points: number[] = [];
  let current = clamp(
    Math.round(50 + delta * 2 + (profile.safety - 70) / 4 + (profile.ecology - 60) / 5 - (profile.crowding - 58) / 6),
    24,
    86,
  );

  for (let index = 0; index < 8; index += 1) {
    if (index === 7 && delta !== 0) {
        current = clamp(Math.round(current + delta), 18, 94);
    }
    points.push(current);
  }

  return points;
}

function socialListeningTopics(
  city: CityOverride,
  profile: CityScreenProfile,
): string[] {
  const topics: string[] = [];

  if (city.metrics.graduateHousingShare <= 26) {
    topics.push("value");
  } else if (city.metrics.graduateHousingShare >= 34) {
    topics.push("rents");
  }

  if (profile.ecology < 55) {
    topics.push("air");
  } else if (profile.ecology > 78) {
    topics.push("clean streets");
  }

  if (profile.crowding > 70) {
    topics.push("crowding");
  }

  if (city.scores.pressure >= 86) {
    topics.push("jobs");
  }

  if ((city.scores.creative ?? 0) >= 82) {
    topics.push("business");
  }

  if (city.scores.community >= 86) {
    topics.push("culture");
  }

  if (profile.safety >= 84) {
    topics.push("safety");
  }

  if (city.tags.includes("hospitality")) {
    topics.push("hospitality");
  }

  if (city.tags.includes("startup") || city.tags.includes("innovation")) {
    topics.push("innovation");
  }

  return [...new Set(topics)].slice(0, 3);
}

function recalibrateCity(
  city: CityOverride,
  row: CityUniverseRow,
): Omit<FullRankedCity, "globalRank"> {
  const profile = screenProfileForCity(row, city.id);
  const accent = accentForCity(city, row);
  const disposableStrength = disposableIncomeStrength(city.metrics, city.country);
  const disposableIncome = disposableIncomeEstimate(city.metrics, city.country);
  const taxScore = taxCompetitiveness(city.country);
  const roomToLiveStrength = Math.round((profile.affordability + disposableStrength) / 2);
  const cultureStrength = city.metrics.experienceDiversity;

  // === Pressure (25%): life cost, work burden, disposable income ===
  const pressure = clamp(
    Math.round(
      city.scores.pressure +
        (roomToLiveStrength - 65) / 3 +
        (profile.affordability - 65) / 5 +
        (disposableStrength - 60) / 4 -
        (city.metrics.graduateHousingShare - 30) / 6,
    ),
    24,
    97,
  );

  // === Viability (22%): safety, transit, clean air, water, digital ===
  const viability = clamp(
    Math.round(
      city.scores.viability +
        (profile.safety - 75) / 4 +
        (profile.ecology - 64) / 3 -
        (profile.crowding - 58) / 9 +
        (profile.civicFreedom - 70) / 12,
    ),
    28,
    97,
  );

  // === Capability (18%): healthcare, education, equal opportunity ===
  const capability = clamp(
    Math.round(
      city.scores.capability +
        (profile.equality - 60) / 5 +
        (profile.safety - 70) / 10 +
        (profile.civicFreedom - 68) / 8,
    ),
    24,
    97,
  );

  // === Community (15%): hospitality, tolerance, culture ===
  const community = clamp(
    Math.round(
      city.scores.community +
        (profile.equality - 60) / 8 +
        (profile.civicFreedom - 68) / 5 +
        (profile.safety - 70) / 10 +
        (cultureStrength - 76) / 3 -
        (profile.crowding - 58) / 10,
    ),
    24,
    97,
  );

  // === Creative (20%): entrepreneurship, innovation, investment, admin friction ===
  const creativeBase = baseCreativeScore(city, row, profile);
  const businessOpeningEase = clamp(
    Math.round(creativeBase + (profile.civicFreedom - 68) / 4 - (profile.crowding - 58) / 10),
    22,
    97,
  );
  const governmentStability = clamp(
    Math.round(profile.safety * 0.35 + profile.civicFreedom * 0.4 + pressure * 0.25),
    20,
    96,
  );
  const incentiveReadiness = clamp(
    Math.round(businessOpeningEase * 0.42 + governmentStability * 0.28 + taxScore * 0.3),
    20,
    97,
  );
  const creative = clamp(
    Math.round(
      creativeBase * 0.3 +
        businessOpeningEase * 0.24 +
        governmentStability * 0.2 +
        taxScore * 0.16 +
        incentiveReadiness * 0.1,
    ),
    24,
    97,
  );

  const tolerance = clamp(
    Math.round(profile.civicFreedom * 0.5 + profile.equality * 0.28 + cultureStrength * 0.22),
    20,
    97,
  );

  // === Official SLIC composite: 0.25P + 0.22V + 0.18Ca + 0.15Co + 0.20Cr ===
  const slicBase = Math.round(
    pressure * 0.25 + viability * 0.22 + capability * 0.18 +
    community * 0.15 + creative * 0.20,
  );
  const slic = clamp(slicBase + screeningPenalty(profile, roomToLiveStrength), 18, 97);

  const existingTags = city.tags.filter((tag) => tag !== "watchlist");
  const screenTag = screeningTag(profile, roomToLiveStrength);
  const tags = [...new Set([screenTag, ...existingTags])].slice(0, 3);
  const coreBoardEligible =
    row.manifest_status === "locked" &&
    profile.safety >= 62 &&
    roomToLiveStrength >= 52 &&
    profile.civicFreedom >= 45 &&
    profile.ecology >= 50 &&
    profile.crowding <= 80 &&
    slic >= 60;

  return {
    ...city,
    accentHex: accent.accentHex,
    accentSoftHex: accent.accentSoftHex,
    accentLabel: accent.accentLabel,
    signal: screeningSignal(city, profile, roomToLiveStrength),
    tags,
    scores: { slic, pressure, viability, capability, community, creative },
    metrics: {
      ...city.metrics,
      pppDisposableIncome: disposableIncome,
      ecologyScore: profile.ecology,
      crowdingPressure: profile.crowding,
      conversationTrend: socialListeningTrend(city.delta, profile),
      conversationTopics: socialListeningTopics(city, profile),
      safetyConfidence: profile.safety,
      affordabilityStrength: roomToLiveStrength,
      equalityStrength: profile.equality,
      civicFreedom: profile.civicFreedom,
      businessGrowth: creative,
      safetyScore: profile.safety,
      toleranceScore: tolerance,
      businessOpeningEase,
      governmentStability,
      taxCompetitiveness: taxScore,
      incentiveReadiness,
    },
    coreBoardEligible,
  };
}

const parsedCityUniverse = parseCsv(cityUniverseCsv);

function cityScaffoldForRow(row: CityUniverseRow): CityOverride {
  const override = topCityOverrides[row.city_id.replace(/^[a-z]{2}-/, "")];
  if (override) {
    return override;
  }

  const profile = regionProfiles[row.cohort] ?? regionProfiles["Southeast Asia"];
  return {
    id: row.city_id.replace(/^[a-z]{2}-/, ""),
    name: displayNameFromId(row.city_id),
    country: row.country,
    region: row.cohort,
    tagline: generatedTagline(row),
    signal: generatedSignal(row),
    delta: 0,
    tags: generatedTags(row, profile),
    scores: generatedScores(row, profile),
    sentimentEmojis: generatedSentimentEmojis(row),
    manifestStatus: row.manifest_status,
    cityType: row.city_type,
    inclusionRationale: row.inclusion_rationale,
    metrics: generatedMetrics(row, profile),
  };
}

function numericScore(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function roundPublishedScore(value: number): number {
  return Math.round(value * 10) / 10;
}

function buildPublishedGlobalRankings(): FullRankedCity[] {
  const rowsByCityId = new Map(parsedCityUniverse.map((row) => [row.city_id, row]));
  const cities: FullRankedCity[] = [];

  for (const publishedRow of rankingPublication.cities) {
    const row = rowsByCityId.get(publishedRow.cityId);
    if (!row) {
      continue;
    }

    const scaffold = cityScaffoldForRow(row);
    const accent = accentForCity(scaffold, row);

    // Direct 1:1 mapping from verified SLIC pillars
    const pressure = numericScore(publishedRow.pressureScore)
      ? roundPublishedScore(publishedRow.pressureScore)
      : scaffold.scores.pressure;
    const viability = numericScore(publishedRow.viabilityScore)
      ? roundPublishedScore(publishedRow.viabilityScore)
      : scaffold.scores.viability;
    const capability = numericScore(publishedRow.capabilityScore)
      ? roundPublishedScore(publishedRow.capabilityScore)
      : scaffold.scores.capability;
    const community = numericScore(publishedRow.communityScore)
      ? roundPublishedScore(publishedRow.communityScore)
      : scaffold.scores.community;
    const creative = numericScore(publishedRow.creativeScore)
      ? roundPublishedScore(publishedRow.creativeScore)
      : (scaffold.scores.creative ?? scaffold.scores.pressure);
    const slic = numericScore(publishedRow.slicScore)
      ? roundPublishedScore(publishedRow.slicScore)
      : Math.round(pressure * 0.25 + viability * 0.22 + capability * 0.18 + community * 0.15 + creative * 0.20);

    cities.push({
      ...scaffold,
      globalRank: publishedRow.rank,
      coreBoardEligible: row.manifest_status === "locked",
      accentHex: accent.accentHex,
      accentSoftHex: accent.accentSoftHex,
      accentLabel: accent.accentLabel,
      scores: { slic, pressure, viability, capability, community, creative },
      metrics: {
        ...scaffold.metrics,
        safetyConfidence: viability,
        affordabilityStrength: pressure,
        equalityStrength: capability,
        businessGrowth: creative,
        safetyScore: viability,
        toleranceScore: community,
        businessOpeningEase: creative,
        governmentStability: creative,
        incentiveReadiness: creative,
      },
      signal: rankingPublication.publishable
        ? scaffold.signal
        : "Verified-data rerank preview from the source-backed SLIC export.",
    });
  }

  return cities.sort((left, right) => {
    const rankDelta = left.globalRank - right.globalRank;
    if (rankDelta !== 0) {
      return rankDelta;
    }

    return left.id.localeCompare(right.id);
  });
}

function buildGlobalRankings(): FullRankedCity[] {
  const cities = parsedCityUniverse.map((row) => recalibrateCity(cityScaffoldForRow(row), row));

  return cities
    .sort((left, right) => {
      const scoreDelta = right.scores.slic - left.scores.slic;
      if (scoreDelta !== 0) {
        return scoreDelta;
      }
      const momentumDelta = right.delta - left.delta;
      if (momentumDelta !== 0) {
        return momentumDelta;
      }
      const communityDelta = right.scores.community - left.scores.community;
      if (communityDelta !== 0) {
        return communityDelta;
      }
      return left.id.localeCompare(right.id);
    })
    .map((city, index) => ({
      ...city,
      globalRank: index + 1,
    }));
}

const syntheticPreviewFactory = buildGlobalRankings;
void syntheticPreviewFactory;

export const globalRankings: FullRankedCity[] =
  rankingPublication.cities.length > 0 ? buildPublishedGlobalRankings() : [];

// Exercise should always search across the full indexed city universe,
// not only the currently publishable public board.
const exerciseCities: FullRankedCity[] = buildGlobalRankings();

export type RankingScope = "core" | "field";

export function getExerciseCities(): FullRankedCity[] {
  return [...exerciseCities];
}

export function getRankingsBoard({
  mode = "slic",
  region = "All",
  scope = "field",
}: {
  mode?: keyof RankedCity["scores"];
  region?: string;
  scope?: RankingScope;
} = {}): FullRankedCity[] {
  const scopedRows =
    scope === "core"
      ? globalRankings.filter((city) => city.coreBoardEligible)
      : globalRankings;
  const rows = region === "All" ? scopedRows : scopedRows.filter((city) => city.region === region);

  return [...rows].sort((left, right) => {
    const scoreDelta = right.scores[mode] - left.scores[mode];
    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    const liveDelta = right.delta - left.delta;
    if (liveDelta !== 0) {
      return liveDelta;
    }

    return left.globalRank - right.globalRank;
  });
}

export const rankingRegions = ["All", ...new Set(globalRankings.map((city) => city.region))];
