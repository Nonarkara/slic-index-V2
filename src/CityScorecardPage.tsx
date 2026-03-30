import publishedData from "./data/publishedRankingData.json";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

/* ── Types from enriched JSON ── */

interface MetricDetail {
  raw: number | null;
  score: number | null;
  source: string;
  sourceUrl: string;
  dataLevel: "city" | "national" | "derived" | "composite" | "missing";
  components?: Array<{
    key: string;
    weight: number;
    raw: number | null;
    score: number | null;
    source: string;
    sourceUrl: string;
    dataLevel: string;
  }>;
}

interface PublishedCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  coverageGrade: string;
  overallWeightedCoverage: number;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  slicScore: number;
  rank: number;
  rankingStatus: string;
  metrics: Record<string, MetricDetail>;
  highlights: { strongest: string | null; weakest: string | null };
  pressureCoverage: number;
  viabilityCoverage: number;
  capabilityCoverage: number;
  communityCoverage: number;
  creativeCoverage: number;
}

interface NormStat {
  p05: number | null;
  p95: number | null;
  dir: "positive" | "negative";
}

interface PillarMetricEntry {
  key: string;
  weight: number;
}

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#c5651a",
  viability: "#1a7a58",
  capability: "#1a3a6b",
  community: "#7c3aed",
  creative: "#b83a28",
};

const PILLAR_LABELS: Record<string, Record<PillarId, string>> = {
  en: { pressure: "Growth Pressure", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "แรงกดดันการเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长压力", viability: "宜居性", capability: "能力", community: "社区", creative: "创新" },
};

const PILLAR_WEIGHTS: Record<PillarId, number> = {
  pressure: 25,
  viability: 22,
  capability: 18,
  community: 15,
  creative: 20,
};

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

const METRIC_LABELS: Record<string, string> = {
  pressure_disposable_income_ppp: "Disposable Income (PPP)",
  pressure_housing_burden: "Housing Burden",
  pressure_household_debt_burden: "Household Debt",
  pressure_working_time_pressure: "Working Hours",
  pressure_suicide_mental_strain: "Mental Strain",
  viability_personal_safety: "Personal Safety",
  viability_transit_access_commute: "Transit Access",
  viability_clean_air: "Air Quality",
  viability_water_sanitation_utility: "Water & Sanitation",
  viability_digital_infrastructure: "Digital Infrastructure",
  viability_climate_sunlight_livability: "Climate & Sunlight",
  capability_healthcare_quality: "Healthcare Quality",
  capability_education_quality: "Education Quality",
  capability_equal_opportunity_distributional_fairness: "Equal Opportunity",
  community_hospitality_belonging: "Hospitality & Belonging",
  community_tolerance_pluralism: "Tolerance & Pluralism",
  community_cultural_historic_public_life_vitality: "Cultural Life",
  community_birth_rate_optimism: "Birth Rate Optimism",
  creative_entrepreneurial_dynamism: "Entrepreneurial Dynamism",
  creative_innovation_research_intensity: "Innovation & R&D",
  creative_economic_vitality_productive_context: "Economic Vitality",
  creative_administrative_investment_friction: "Admin Friction",
};

const DATA_LEVEL_LABELS: Record<string, string> = {
  city: "City data",
  national: "National proxy",
  derived: "Derived",
  composite: "Composite",
  missing: "No data",
};

/* ── Helpers ── */

const normStats = (publishedData as any).normStats as Record<string, NormStat>;
const pillarMetrics = (publishedData as any).pillarMetrics as Record<string, PillarMetricEntry[]>;
const allCities = (publishedData.cities ?? []) as PublishedCity[];

function findCity(cityId: string): PublishedCity | undefined {
  return allCities.find((c) => c.cityId === cityId);
}

function pillarScoreKey(pillar: PillarId): keyof PublishedCity {
  return `${pillar}Score` as keyof PublishedCity;
}

function pillarCoverageKey(pillar: PillarId): keyof PublishedCity {
  return `${pillar}Coverage` as keyof PublishedCity;
}

/* ── Components ── */

function NormBar({ score, color }: { score: number | null; color: string }) {
  if (score === null) return <span className="scorecard-no-data">—</span>;
  return (
    <div className="scorecard-norm-bar">
      <div
        className="scorecard-norm-bar-fill"
        style={{ width: `${Math.min(100, Math.max(0, score))}%`, background: color }}
      />
      <span className="scorecard-norm-bar-label">{score.toFixed(1)}</span>
    </div>
  );
}

function DataBadge({ level }: { level: string }) {
  return (
    <span className={`scorecard-data-badge scorecard-data-badge--${level}`}>
      {DATA_LEVEL_LABELS[level] ?? level}
    </span>
  );
}

function MetricRow({
  metricKey,
  detail,
  color,
}: {
  metricKey: string;
  detail: MetricDetail;
  color: string;
}) {
  const label = METRIC_LABELS[metricKey] ?? metricKey;
  return (
    <div className="scorecard-metric-row">
      <div className="scorecard-metric-header">
        <span className="scorecard-metric-name">{label}</span>
        <DataBadge level={detail.dataLevel} />
      </div>
      <div className="scorecard-metric-value">
        {detail.raw !== null ? (
          <span className="scorecard-raw-value">{detail.raw.toLocaleString()}</span>
        ) : (
          <span className="scorecard-raw-value scorecard-raw-value--missing">—</span>
        )}
      </div>
      <NormBar score={detail.score} color={color} />
      {detail.source && detail.sourceUrl ? (
        <a
          className="scorecard-source-link"
          href={detail.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {detail.source}
        </a>
      ) : detail.source ? (
        <span className="scorecard-source-link">{detail.source}</span>
      ) : null}
    </div>
  );
}

function PillarSection({
  pillar,
  city,
}: {
  pillar: PillarId;
  city: PublishedCity;
}) {
  const score = city[pillarScoreKey(pillar)] as number;
  const coverage = city[pillarCoverageKey(pillar)] as number;
  const color = PILLAR_COLORS[pillar];
  const metrics = pillarMetrics?.[pillar] ?? [];

  return (
    <div className="scorecard-pillar-section">
      <div className="scorecard-pillar-header" style={{ borderLeftColor: color }}>
        <div>
          <h3>{PILLAR_LABELS.en[pillar]}</h3>
          <span className="scorecard-pillar-weight">{PILLAR_WEIGHTS[pillar]}% weight</span>
        </div>
        <div className="scorecard-pillar-score" style={{ color }}>
          {score !== null ? score.toFixed(1) : "—"}
        </div>
      </div>
      {coverage !== null && coverage < 1 && (
        <div className="scorecard-coverage-note">
          {Math.round(coverage * 100)}% data coverage
        </div>
      )}
      <div className="scorecard-metric-list">
        {metrics.map((m) => {
          const detail = city.metrics?.[m.key];
          if (!detail) return null;
          return <MetricRow key={m.key} metricKey={m.key} detail={detail} color={color} />;
        })}
      </div>
    </div>
  );
}

/* ── Main Page ── */

export default function CityScorecardPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const cityId = window.location.pathname.split("/city/")[1] ?? "";
  const city = findCity(cityId);

  if (!city) {
    return (
      <section className="section" style={{ paddingTop: "8rem" }}>
        <p className="eyebrow">City not found</p>
        <h1>No data for "{cityId}"</h1>
        <button type="button" className="secondary-action" onClick={() => onNavigate("/rankings")}>
          Back to rankings
        </button>
      </section>
    );
  }

  const pillarScores = PILLAR_ORDER.map((p) => ({
    id: p,
    score: city[pillarScoreKey(p)] as number,
    weight: PILLAR_WEIGHTS[p],
    color: PILLAR_COLORS[p],
    label: PILLAR_LABELS[locale]?.[p] ?? PILLAR_LABELS.en[p],
  }));

  return (
    <>
      <section className="scorecard-hero section">
        <button
          type="button"
          className="scorecard-back"
          onClick={() => onNavigate("/rankings")}
        >
          &larr; {locale === "en" ? "Back to rankings" : locale === "th" ? "กลับสู่อันดับ" : "返回排名"}
        </button>

        <div className="scorecard-hero-split">
          <div>
            <p className="eyebrow">{city.region}</p>
            <h1 className="scorecard-city-name">{city.displayName}</h1>
            <p className="scorecard-country">{city.country}</p>
          </div>
          <div className="scorecard-hero-scores">
            <div className="scorecard-slic-score">{city.slicScore?.toFixed(1) ?? "—"}</div>
            <div className="scorecard-rank">
              #{city.rank} <span>of {allCities.filter((c) => c.rankingStatus === "Ranked").length}</span>
            </div>
            <span className={`scorecard-grade scorecard-grade--${city.coverageGrade?.toLowerCase()}`}>
              {city.coverageGrade} coverage
            </span>
          </div>
        </div>
      </section>

      {/* ── Equation bar ── */}
      <section className="scorecard-equation section">
        <p className="scorecard-equation-label">
          {locale === "en" ? "How we got this number" : locale === "th" ? "ที่มาของตัวเลขนี้" : "这个数字是怎么来的"}
        </p>
        <div className="scorecard-equation-bar">
          {pillarScores.map((p, i) => (
            <span key={p.id} className="scorecard-equation-term">
              {i > 0 && <span className="scorecard-equation-op">+</span>}
              <span className="scorecard-equation-weight">{(p.weight / 100).toFixed(2)}</span>
              <span className="scorecard-equation-times">&times;</span>
              <span className="scorecard-equation-pillar" style={{ color: p.color }}>
                {p.label}({p.score?.toFixed(1) ?? "?"})
              </span>
            </span>
          ))}
          <span className="scorecard-equation-op">=</span>
          <span className="scorecard-equation-result">{city.slicScore?.toFixed(1)}</span>
        </div>
      </section>

      {/* ── Pillar breakdown sections ── */}
      <main className="section scorecard-pillars">
        {PILLAR_ORDER.map((pillar) => (
          <PillarSection key={pillar} pillar={pillar} city={city} />
        ))}
      </main>

      {/* ── Highlights ── */}
      {city.highlights && (city.highlights.strongest || city.highlights.weakest) && (
        <section className="section scorecard-highlights">
          <p className="eyebrow">
            {locale === "en" ? "What stands out" : locale === "th" ? "จุดเด่น" : "亮点"}
          </p>
          <div className="scorecard-highlight-grid">
            {city.highlights.strongest && (
              <div className="scorecard-highlight-card scorecard-highlight-card--strong">
                <span className="scorecard-highlight-label">Strongest metric</span>
                <strong>{METRIC_LABELS[city.highlights.strongest] ?? city.highlights.strongest}</strong>
                <span className="scorecard-highlight-score">
                  {city.metrics?.[city.highlights.strongest]?.score?.toFixed(1) ?? "—"}
                </span>
              </div>
            )}
            {city.highlights.weakest && (
              <div className="scorecard-highlight-card scorecard-highlight-card--weak">
                <span className="scorecard-highlight-label">Weakest metric</span>
                <strong>{METRIC_LABELS[city.highlights.weakest] ?? city.highlights.weakest}</strong>
                <span className="scorecard-highlight-score">
                  {city.metrics?.[city.highlights.weakest]?.score?.toFixed(1) ?? "—"}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Data transparency ── */}
      <section className="section scorecard-transparency">
        <p className="eyebrow">
          {locale === "en" ? "Data transparency" : locale === "th" ? "ความโปร่งใสของข้อมูล" : "数据透明度"}
        </p>
        <div className="scorecard-transparency-grid">
          <div className="scorecard-transparency-stat">
            <strong>{Math.round((city.overallWeightedCoverage ?? 0) * 100)}%</strong>
            <span>overall coverage</span>
          </div>
          {PILLAR_ORDER.map((p) => {
            const cov = city[pillarCoverageKey(p)] as number;
            return (
              <div key={p} className="scorecard-transparency-stat">
                <strong style={{ color: PILLAR_COLORS[p] }}>{Math.round((cov ?? 0) * 100)}%</strong>
                <span>{PILLAR_LABELS.en[p]}</span>
              </div>
            );
          })}
        </div>
        <p className="scorecard-transparency-note">
          Metrics marked "City data" come from verified city-level sources. "National proxy" means the value is a country-level estimate applied to this city. "Derived" means the value is calculated from other inputs.
        </p>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
