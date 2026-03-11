export interface SmartCityFeedItem {
  id: string;
  source: string;
  headline: string;
  publishedAt: string;
  url: string;
  topic: string;
  /** Lowercase city name — if set, this article only appears on that city's card. */
  cityKey?: string;
}

export const smartCityFeed: SmartCityFeedItem[] = [
  {
    id: "boston-climate-workforce",
    source: "SmartCitiesWorld",
    headline: "Boston continues to build climate-ready workforce",
    publishedAt: "2026-02-20",
    url: "https://www.smartcitiesworld.net/news/boston-continues-to-build-climate-ready-workforce",
    topic: "Workforce",
    cityKey: "boston",
  },
  {
    id: "municipal-pilots",
    source: "SmartCitiesWorld",
    headline: "Municipalities invited to apply for fully funded pilots",
    publishedAt: "2026-02-10",
    url: "https://www.smartcitiesworld.net/news/municipalities-invited-to-apply-for-fully-funded-pilots",
    topic: "Pilots",
  },
  {
    id: "san-diego-electrification",
    source: "SmartCitiesWorld",
    headline: "San Diego approves contract to electrify City buildings",
    publishedAt: "2026-02-03",
    url: "https://www.smartcitiesworld.net/news/san-diego-approves-contract-to-electrify-city-buildings",
    topic: "Energy",
    cityKey: "san diego",
  },
  {
    id: "pathways2resilience",
    source: "SmartCitiesWorld",
    headline: "Pathways2Resilience programme names latest cohort of climate-ready regions",
    publishedAt: "2026-01-24",
    url: "https://www.smartcitiesworld.net/news/pathways2resilience-programme-names-latest-cohort-of-climate-ready-regions",
    topic: "Climate resilience",
  },
  {
    id: "latin-america-climate-action",
    source: "C40 Knowledge Hub",
    headline:
      "How climate action in Latin American cities can build fairer, more inclusive communities",
    publishedAt: "2025-12-23",
    url: "https://www.c40knowledgehub.org/s/article/How-climate-action-in-Latin-American-cities-can-build-fairer-more-inclusive-communities?language=en_US",
    topic: "Urban climate",
  },
  {
    id: "google-smart-city-expo",
    source: "Tomorrow.City",
    headline: "Google at Smart City Expo World Congress 2025: Making AI helpful for cities",
    publishedAt: "2025-11-04",
    url: "https://tomorrow.city/a/google-at-smart-city-expo-world-congress-2025-making-ai-helpful-for-cities/",
    topic: "AI for cities",
  },
  {
    id: "world-bank-gscp",
    source: "Tomorrow.City",
    headline: "Building smarter, inclusive, and resilient cities with the World Bank GSCP",
    publishedAt: "2025-11-05",
    url: "https://tomorrow.city/a/building-smarter-inclusive-and-resilient-cities-with-the-world-bank-gscp/",
    topic: "Inclusion",
  },
  {
    id: "citiverse-rising",
    source: "Tomorrow.City",
    headline: "Citiverse Rising: Virtual worlds and AI agents for urban transformation",
    publishedAt: "2025-11-04",
    url: "https://tomorrow.city/a/citiverse-rising-virtual-worlds-and-ai-agents-for-urban-transformation/",
    topic: "Digital twins",
  },
  {
    id: "wef-clean-air",
    source: "World Economic Forum",
    headline: "Boosting clean air strategies in cities around the world",
    publishedAt: "2025-06-30",
    url: "https://www.weforum.org/stories/2025/06/boosting-clean-air-strategies-in-cities-around-the-world/",
    topic: "Clean air",
  },
  {
    id: "arlington-ai-traffic",
    source: "SmartCitiesWorld",
    headline: "Arlington to accelerate AI traffic management",
    publishedAt: "2025-12-12",
    url: "https://www.smartcitiesworld.net/news/arlington-to-accelerate-ai-traffic-management",
    topic: "Mobility AI",
    cityKey: "arlington",
  },
];
