import type {
  CitySpotlight,
  LandingData,
  LandingMeta,
  MethodologyPillar,
  RankedCity,
  SignalCard,
} from "./types";
import { getRankingsBoard } from "./rankingsData";

type RawRecord = Record<string, unknown>;

const defaultMeta: LandingMeta = {
  title: "Smart and Liveable Cities Index",
  strapline: "A ranking for cities that expand human possibility, not just headline wealth or polished prestige.",
  intro:
    "SLIC is an AI-assisted city dashboard and ranking system. It combines official baselines, data-quality checks, real affordability logic, and social sentiment analysis so cities can move up or down as conditions, attention, and lived urban signals change.",
  lastUpdated: "2026-03-14T12:00:00+07:00",
  citiesTracked: 103,
  signalsTracked: 92,
  sourcesConnected: 35,
};

const defaultRankings: RankedCity[] = getRankingsBoard({ mode: "slic", scope: "field" }).slice(0, 10);

const defaultSignals: SignalCard[] = [
  {
    id: "search-attention",
    label: "Search attention",
    value: "74 cities rising",
    trend: "up",
    context: "Interest signals are designed to refresh continuously rather than waiting for an annual ranking cycle.",
    updatedAt: "2m ago",
  },
  {
    id: "news-velocity",
    label: "News velocity",
    value: "1,248 city mentions",
    trend: "up",
    context: "Cross-market coverage rose 14% over the last 24 hours.",
    updatedAt: "4m ago",
  },
  {
    id: "flight-connectivity",
    label: "Flight connectivity",
    value: "9,420 active routes",
    trend: "up",
    context: "Regional movement is expanding fastest across East and Southeast Asia.",
    updatedAt: "6m ago",
  },
  {
    id: "population-trend",
    label: "Population trend",
    value: "23 cities gaining residents",
    trend: "up",
    context: "Migration pressure keeps rewarding cities with cost flexibility and cultural pull.",
    updatedAt: "9m ago",
  },
  {
    id: "affordability-pressure",
    label: "Affordability pressure",
    value: "11 cities elevated",
    trend: "down",
    context: "Rent stress is widening the gap between headline prosperity and daily livability.",
    updatedAt: "11m ago",
  },
  {
    id: "civic-sentiment",
    label: "Civic sentiment",
    value: "74 / 100 positive",
    trend: "up",
    context: "Social listening points toward stronger emotional attachment in culturally dense cities.",
    updatedAt: "12m ago",
  },
];

const defaultPillars: MethodologyPillar[] = [
  {
    id: "pressure",
    name: "Growth",
    description: "Economic dynamism, market forces, and their natural impact on affordability. Growth invites capitalism — the market determines housing costs and living expenses unless the state intervenes with welfare.",
    metrics: ["economic dynamism", "market activity", "GDP growth", "investment flow", "affordability outcome"],
    note: "The largest pillar weight because a city's growth trajectory shapes everything — from job creation to whether ordinary people can still afford to live there.",
  },
  {
    id: "viability",
    name: "Viability",
    description: "Safety, ecology, mobility, climate comfort, and the physical conditions that make a city practically liveable day to day.",
    metrics: ["safety", "ecology", "mobility", "digital infra", "climate & sunlight"],
    note: "Climate and sunlight penalize both Nordic darkness and Gulf desert heat. Technology counts only if it improves lived outcomes.",
  },
  {
    id: "capability",
    name: "Capability",
    description: "Human capital, education access, healthcare quality, equality, and the capacity for people to develop and thrive.",
    metrics: ["education", "healthcare", "equality", "human capital", "civic freedom"],
    note: "The goal is viable ambition, not prestige for its own sake.",
  },
  {
    id: "community",
    name: "Community",
    description: "Cities should widen people's sense of possibility through culture, belonging, tolerance, diversity, birth rate optimism, and meaning.",
    metrics: ["culture", "tolerance", "belonging", "birth rate", "social vitality"],
    note: "Birth rate as societal optimism: if people don't want to have children there, the city has failed at something fundamental.",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Cities should make it practical to open, build, and scale productive work without drowning people in friction.",
    metrics: ["opening ease", "government stability", "tax regime", "incentives", "competitive energy"],
    note: "This is where SLIC rewards cities that support ambition rather than merely asking people to comply.",
  },
];

const defaultSpotlights: CitySpotlight[] = [
  {
    id: "kaohsiung",
    city: "Kaohsiung",
    country: "Taiwan",
    kicker: "Where livability becomes real",
    reason:
      "Kaohsiung ranks #1 because it delivers what most indices only talk about: safe streets, affordable healthcare and education, LGBTQ+ protections, religious tolerance, subtropical climate, and room to breathe without sacrificing economic vitality.",
    highlights: ["safe and tolerant", "affordable quality healthcare", "subtropical comfort", "strong transit"],
  },
  {
    id: "taipei",
    city: "Taipei",
    country: "Taiwan",
    kicker: "Precision without coldness",
    reason:
      "Taipei at #2 demonstrates why SLIC looks beyond GDP. It combines safety, transit, civility, food culture, day-to-day practicality, and genuine tolerance into a city that both Westerners and Asians trust.",
    highlights: ["excellent transit", "deep food culture", "LGBTQ+ marriage equality", "high daily convenience"],
  },
  {
    id: "bangkok",
    city: "Bangkok",
    country: "Thailand",
    kicker: "The world's most visited city",
    reason:
      "Bangkok is #1 most visited city in the world for a reason. Hospitality, price flexibility, LGBTQ+ welcome, religious pluralism, and easy business setup create a city that rewards every kind of life.",
    highlights: ["super tolerant", "multiple budget levels", "24/7 urban rhythm", "easy business setup"],
  },
  {
    id: "busan",
    city: "Busan",
    country: "South Korea",
    kicker: "Economic muscle, human scale",
    reason:
      "Busan represents the index's central thesis: you can keep dynamism, logistics strength, and metropolitan relevance without turning daily life into the pressure cooker that Seoul has become.",
    highlights: ["port economy", "beach culture", "affordable housing", "relaxed urban rhythm"],
  },
  {
    id: "shanghai",
    city: "Shanghai",
    country: "China",
    kicker: "Proof that prosperity has limits",
    reason:
      "Shanghai belongs here because SLIC is not romantic. It rewards extraordinary capability while still marking the affordability and pressure costs attached to mega-city success.",
    highlights: ["economic gravity", "world-class transit", "clean urban management", "rising housing pressure"],
  },
  {
    id: "penang",
    city: "Penang",
    country: "Malaysia",
    kicker: "History with circuitry",
    reason:
      "Penang shows why smaller cities can outperform better-known names. Heritage, food, and industrial depth combine into a city that feels both grounded and economically alive.",
    highlights: ["heritage streets", "food capital", "semiconductor links", "liveable scale"],
  },
];

const defaultLandingData: LandingData = {
  meta: defaultMeta,
  rankings: defaultRankings,
  signals: defaultSignals,
  pillars: defaultPillars,
  spotlights: defaultSpotlights,
};

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function safeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeMeta(input: unknown): LandingMeta {
  if (!isRecord(input)) {
    return defaultMeta;
  }

  return {
    title: safeString(input.title, defaultMeta.title),
    strapline: safeString(input.strapline, defaultMeta.strapline),
    intro: safeString(input.intro, defaultMeta.intro),
    lastUpdated: safeString(input.lastUpdated, defaultMeta.lastUpdated),
    citiesTracked: safeNumber(input.citiesTracked, defaultMeta.citiesTracked),
    signalsTracked: safeNumber(input.signalsTracked, defaultMeta.signalsTracked),
    sourcesConnected: safeNumber(input.sourcesConnected, defaultMeta.sourcesConnected),
  };
}

function normalizeScores(input: unknown, fallback: RankedCity["scores"]): RankedCity["scores"] {
  if (!isRecord(input)) {
    return fallback;
  }

  const pressure = safeNumber(input.pressure, fallback.pressure);
  const viability = safeNumber(input.viability, fallback.viability);
  const capability = safeNumber(input.capability, fallback.capability);
  const community = safeNumber(input.community, fallback.community);
  const creative = safeNumber(input.creative, fallback.creative);
  const slic = safeNumber(
    input.slic,
    Math.round(pressure * 0.25 + viability * 0.22 + capability * 0.18 + community * 0.15 + creative * 0.20),
  );

  return { slic, pressure, viability, capability, community, creative };
}

function normalizeRankings(input: unknown): RankedCity[] {
  if (!Array.isArray(input) || input.length === 0) {
    return defaultRankings;
  }

  return input.slice(0, 10).map((item, index) => {
    const fallback = defaultRankings[index] ?? defaultRankings[defaultRankings.length - 1];

    if (!isRecord(item)) {
      return fallback;
    }

    return {
      id: safeString(item.id, fallback.id),
      name: safeString(item.name, fallback.name),
      country: safeString(item.country, fallback.country),
      region: safeString(item.region, fallback.region),
      tagline: safeString(item.tagline, fallback.tagline),
      signal: safeString(item.signal, fallback.signal),
      delta: safeNumber(item.delta, fallback.delta),
      tags: Array.isArray(item.tags)
        ? item.tags.map((tag) => safeString(tag, "")).filter(Boolean).slice(0, 3)
        : fallback.tags,
      scores: normalizeScores(item.scores, fallback.scores),
    };
  });
}

function normalizeSignals(input: unknown): SignalCard[] {
  if (!Array.isArray(input) || input.length === 0) {
    return defaultSignals;
  }

  return input.slice(0, 6).map((item, index) => {
    const fallback = defaultSignals[index] ?? defaultSignals[defaultSignals.length - 1];

    if (!isRecord(item)) {
      return fallback;
    }

    const trend = safeString(item.trend, fallback.trend);

    return {
      id: safeString(item.id, fallback.id),
      label: safeString(item.label, fallback.label),
      value: safeString(item.value, fallback.value),
      trend: trend === "up" || trend === "down" || trend === "steady" ? trend : fallback.trend,
      context: safeString(item.context, fallback.context),
      updatedAt: safeString(item.updatedAt, fallback.updatedAt),
    };
  });
}

function normalizePillars(input: unknown): MethodologyPillar[] {
  if (!Array.isArray(input) || input.length === 0) {
    return defaultPillars;
  }

  return input.slice(0, 5).map((item, index) => {
    const fallback = defaultPillars[index] ?? defaultPillars[defaultPillars.length - 1];

    if (!isRecord(item)) {
      return fallback;
    }

    return {
      id: fallback.id,
      name: safeString(item.name, fallback.name),
      description: safeString(item.description, fallback.description),
      metrics: Array.isArray(item.metrics)
        ? item.metrics.map((metric) => safeString(metric, "")).filter(Boolean).slice(0, 5)
        : fallback.metrics,
      note: safeString(item.note, fallback.note),
    };
  });
}

function normalizeSpotlights(input: unknown): CitySpotlight[] {
  if (!Array.isArray(input) || input.length === 0) {
    return defaultSpotlights;
  }

  return input.slice(0, 6).map((item, index) => {
    const fallback = defaultSpotlights[index] ?? defaultSpotlights[defaultSpotlights.length - 1];

    if (!isRecord(item)) {
      return fallback;
    }

    return {
      id: safeString(item.id, fallback.id),
      city: safeString(item.city, fallback.city),
      country: safeString(item.country, fallback.country),
      kicker: safeString(item.kicker, fallback.kicker),
      reason: safeString(item.reason, fallback.reason),
      highlights: Array.isArray(item.highlights)
        ? item.highlights.map((highlight) => safeString(highlight, "")).filter(Boolean).slice(0, 4)
        : fallback.highlights,
    };
  });
}

export function buildLandingData(rawIndex?: unknown): LandingData {
  if (!isRecord(rawIndex)) {
    return defaultLandingData;
  }

  return {
    meta: normalizeMeta(rawIndex.meta),
    rankings: normalizeRankings(rawIndex.rankings),
    signals: normalizeSignals(rawIndex.signals),
    pillars: normalizePillars(rawIndex.pillars),
    spotlights: normalizeSpotlights(rawIndex.spotlights),
  };
}
