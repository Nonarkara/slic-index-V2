import { useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import RankingIntegrityBanner from "./RankingIntegrityBanner";
import { rankingRegions } from "./rankingsData";
import { getCopy } from "./siteCopy";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

/* ───── pillar config ───── */

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#f97316",
  viability: "#22c55e",
  capability: "#3b82f6",
  community: "#a855f7",
  creative: "#ec4899",
};

const PILLAR_LABELS: Record<Locale, Record<PillarId, string>> = {
  en: { pressure: "Pressure", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "แรงกดดัน", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "压力", viability: "宜居", capability: "能力", community: "社区", creative: "创新" },
};

const PILLAR_HINTS: Record<Locale, Record<PillarId, string>> = {
  en: {
    pressure: "Affordability, housing costs, work-life balance",
    viability: "Safety, transit, clean air, climate & sunlight",
    capability: "Healthcare access, education, opportunity",
    community: "Belonging, tolerance, cultural life, birth rate",
    creative: "Innovation, research, entrepreneurship",
  },
  th: {
    pressure: "ค่าครองชีพ ที่อยู่อาศัย สมดุลชีวิต",
    viability: "ความปลอดภัย ขนส่ง อากาศ ภูมิอากาศ",
    capability: "สาธารณสุข การศึกษา โอกาส",
    community: "ความเป็นส่วนหนึ่ง ความอดทน วัฒนธรรม",
    creative: "นวัตกรรม วิจัย ผู้ประกอบการ",
  },
  zh: {
    pressure: "生活成本、住房、工作生活平衡",
    viability: "安全、交通、空气、气候与日照",
    capability: "医疗、教育、机会",
    community: "归属、包容、文化生活",
    creative: "创新、研究、创业",
  },
};

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

/* ───── published data ───── */

interface PublishedCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  cityType: string;
  coverageGrade: string;
  manifestStatus: string;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  slicScore: number;
  rank: number;
  rankingStatus: string;
}

const CANONICAL = publishedData.canonicalWeights as Record<PillarId, number>;
const allCities = (publishedData.cities ?? []) as PublishedCity[];
const rankedCities = allCities.filter((c) => c.rankingStatus === "Ranked");

function scoreCityWithWeights(city: PublishedCity, weights: Record<PillarId, number>): number {
  const total = PILLAR_ORDER.reduce((s, p) => s + weights[p], 0);
  if (total === 0) return 0;
  return PILLAR_ORDER.reduce((s, p) => {
    const pillarScore = city[`${p}Score` as keyof PublishedCity] as number;
    return s + (pillarScore * weights[p]) / total;
  }, 0);
}

/* ───── copy ───── */

const interactiveCopy: Record<Locale, {
  heroEyebrow: string;
  heroTitle: string;
  heroIntro: string;
  allocatorTitle: string;
  allocatorHint: string;
  resetLabel: string;
  canonicalBadge: string;
  customBadge: string;
  canonicalNote: string;
  consequencesTitle: string;
  noConsequences: string;
  yourScore: string;
  slicScore: string;
  slicRank: string;
  citiesLabel: string;
  top10: string;
  top50: string;
  showAll: string;
  regionLabel: string;
  allRegions: string;
  whyThisRanking: string;
  whyExplanation: string;
}> = {
  en: {
    heroEyebrow: "Explore the index",
    heroTitle: "Your city, your priorities",
    heroIntro: "Distribute 100 points across five dimensions of city life. Watch cities re-rank in real time as your priorities shift. The SLIC canonical ranking is a starting point — your ranking is what matters to you.",
    allocatorTitle: "Set your priorities",
    allocatorHint: "Drag the spider web or use the sliders. Total stays at 100.",
    resetLabel: "Reset to SLIC defaults",
    canonicalBadge: "SLIC canonical",
    customBadge: "Your priorities",
    canonicalNote: "SLIC default: P 25 / V 22 / C 18 / Co 15 / Cr 20",
    consequencesTitle: "Trade-off insights",
    noConsequences: "Adjust weights to see trade-off insights.",
    yourScore: "Your",
    slicScore: "SLIC",
    slicRank: "SLIC #",
    citiesLabel: "cities",
    top10: "Top 10",
    top50: "Top 50",
    showAll: "All",
    regionLabel: "Region",
    allRegions: "All",
    whyThisRanking: "Why this default ranking?",
    whyExplanation: "SLIC weights Pressure highest (25%) because affordability is the entry barrier to city life. Viability (22%) covers safety, transit, and climate. Creative (20%) captures economic dynamism. Capability (18%) is healthcare and education access. Community (15%) is belonging and tolerance. Kaohsiung and Taipei lead because they combine strong Capability (95+), excellent Viability (87+), and solid Creative scores with moderate living costs.",
  },
  th: {
    heroEyebrow: "สำรวจดัชนี",
    heroTitle: "เมืองของคุณ ลำดับความสำคัญของคุณ",
    heroIntro: "แจก 100 คะแนนให้ 5 มิติของชีวิตในเมือง ดูเมืองจัดอันดับใหม่ตามลำดับความสำคัญของคุณ อันดับ SLIC เป็นจุดเริ่มต้น — อันดับของคุณคือสิ่งที่สำคัญสำหรับคุณ",
    allocatorTitle: "ตั้งลำดับความสำคัญ",
    allocatorHint: "ลากใยแมงมุมหรือใช้แถบเลื่อน ผลรวมคงที่ที่ 100",
    resetLabel: "รีเซ็ตเป็นค่า SLIC",
    canonicalBadge: "อันดับ SLIC",
    customBadge: "ลำดับของคุณ",
    canonicalNote: "ค่าเริ่มต้น SLIC: P 25 / V 22 / C 18 / Co 15 / Cr 20",
    consequencesTitle: "มุมมองข้อแลกเปลี่ยน",
    noConsequences: "ปรับน้ำหนักเพื่อดูข้อแลกเปลี่ยน",
    yourScore: "ของคุณ",
    slicScore: "SLIC",
    slicRank: "SLIC #",
    citiesLabel: "เมือง",
    top10: "10 อันดับ",
    top50: "50 อันดับ",
    showAll: "ทั้งหมด",
    regionLabel: "ภูมิภาค",
    allRegions: "ทั้งหมด",
    whyThisRanking: "ทำไมอันดับเริ่มต้นนี้?",
    whyExplanation: "SLIC ให้น้ำหนักแรงกดดันสูงสุด (25%) เพราะค่าครองชีพเป็นอุปสรรคแรกของชีวิตในเมือง ความน่าอยู่ (22%) ครอบคลุมความปลอดภัย ขนส่ง และภูมิอากาศ เกาสงและไทเปนำเพราะรวมศักยภาพสูง (95+) ความน่าอยู่ดี (87+) และคะแนนสร้างสรรค์ดีในต้นทุนปานกลาง",
  },
  zh: {
    heroEyebrow: "探索指数",
    heroTitle: "你的城市，你的优先级",
    heroIntro: "将100分分配到城市生活的五个维度。随着你的优先级变化，城市实时重新排名。SLIC标准排名是起点——你的排名才是对你有意义的。",
    allocatorTitle: "设定你的优先级",
    allocatorHint: "拖动蛛网图或使用滑块，总分保持100。",
    resetLabel: "重置为SLIC默认值",
    canonicalBadge: "SLIC标准",
    customBadge: "你的优先级",
    canonicalNote: "SLIC默认: P 25 / V 22 / C 18 / Co 15 / Cr 20",
    consequencesTitle: "权衡洞察",
    noConsequences: "调整权重以查看权衡洞察。",
    yourScore: "你的",
    slicScore: "SLIC",
    slicRank: "SLIC #",
    citiesLabel: "城市",
    top10: "前10",
    top50: "前50",
    showAll: "全部",
    regionLabel: "地区",
    allRegions: "全部",
    whyThisRanking: "为什么是这个默认排名?",
    whyExplanation: "SLIC将压力权重设为最高(25%)，因为生活成本是城市生活的首要门槛。宜居(22%)涵盖安全、交通和气候。高雄和台北领先，因为它们结合了强大的能力(95+)、优秀的宜居(87+)和可观的创新分数，且成本适中。",
  },
};

/* ───── severity styles ───── */

const severityStyles: Record<string, React.CSSProperties> = {
  severe: { borderLeft: "4px solid #ef4444", background: "rgba(239,68,68,0.08)", padding: "10px 14px" },
  moderate: { borderLeft: "4px solid #f59e0b", background: "rgba(245,158,11,0.06)", padding: "10px 14px" },
  mild: { borderLeft: "4px solid #3b82f6", background: "rgba(59,130,246,0.06)", padding: "10px 14px" },
};

/* ───── main component ───── */

export default function RankingsPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const copy = getCopy(locale);
  const ui = interactiveCopy[locale];
  const labels = PILLAR_LABELS[locale];
  const hints = PILLAR_HINTS[locale];

  // Weight allocation state
  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({
      id,
      label: labels[id],
      color: PILLAR_COLORS[id],
      value: CANONICAL[id],
    })),
  );

  // Filters
  const [region, setRegion] = useState<string>("All");
  const [showCountValue, setShowCountValue] = useState<number>(50);

  // Derived state
  const weights = useMemo(() => {
    const w: Record<string, number> = {};
    pillars.forEach((p) => { w[p.id] = p.value; });
    return w as Record<PillarId, number>;
  }, [pillars]);

  const isCustom = useMemo(() => {
    return PILLAR_ORDER.some((id) => weights[id] !== CANONICAL[id]);
  }, [weights]);

  const consequences = useMemo<FiredConsequence[]>(
    () => evaluateConsequences(weights),
    [weights],
  );

  // Re-rank cities with user weights
  const results = useMemo(() => {
    let filtered = rankedCities;
    if (region !== "All") {
      filtered = filtered.filter((c) => c.region === region);
    }
    return filtered
      .map((city) => ({
        ...city,
        customScore: Math.round(scoreCityWithWeights(city, weights) * 10) / 10,
      }))
      .sort((a, b) => b.customScore - a.customScore);
  }, [weights, region]);

  const displayResults = results.slice(0, showCountValue);

  const handleReset = () => {
    setPillars(
      PILLAR_ORDER.map((id) => ({
        id,
        label: labels[id],
        color: PILLAR_COLORS[id],
        value: CANONICAL[id],
      })),
    );
  };

  // Why explanation toggle
  const [showWhy, setShowWhy] = useState(false);

  return (
    <>
      <header className="rankings-hero section">
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p className="eyebrow">{ui.heroEyebrow}</p>
          <h1 className="rankings-title">{ui.heroTitle}</h1>
          <p className="hero-intro" style={{ maxWidth: 640, margin: "12px auto 0" }}>
            {ui.heroIntro}
          </p>
          <RankingIntegrityBanner locale={locale} />
        </div>
      </header>

      <main>
        <section className="section" style={{ paddingTop: 16 }}>
          <div className="rankings-workbench">
            {/* ─── LEFT: Spider Panel ─── */}
            <aside className="rankings-spider-panel">
              <div>
                <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {ui.allocatorTitle}
                </h2>
                <p style={{ fontSize: 12, opacity: 0.5, margin: 0 }}>{ui.allocatorHint}</p>
              </div>

              <ZeroSumAllocator pillars={pillars} onChange={setPillars} />

              <button type="button" className="rankings-reset-btn" onClick={handleReset}>
                {ui.resetLabel}
              </button>

              {/* Pillar hints */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {PILLAR_ORDER.map((id) => (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, opacity: 0.5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: PILLAR_COLORS[id], flexShrink: 0 }} />
                    <span><strong>{labels[id]}</strong> — {hints[id]}</span>
                  </div>
                ))}
              </div>

              {/* Canonical reference */}
              <div className="rankings-canonical-info">
                <div style={{ marginBottom: 6 }}>{ui.canonicalNote}</div>
                <button
                  type="button"
                  onClick={() => setShowWhy(!showWhy)}
                  style={{
                    background: "none", border: "none", padding: 0,
                    color: "rgba(99,179,237,0.8)", fontSize: 11, cursor: "pointer",
                    textDecoration: "underline", textUnderlineOffset: "2px",
                  }}
                >
                  {ui.whyThisRanking}
                </button>
                {showWhy && (
                  <p style={{ marginTop: 8, fontSize: 11, lineHeight: 1.6, opacity: 0.7 }}>
                    {ui.whyExplanation}
                  </p>
                )}
              </div>

              {/* Trade-off insights */}
              {consequences.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, marginBottom: 8, opacity: 0.4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {ui.consequencesTitle}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {consequences.map((c) => (
                      <div key={c.id} style={severityStyles[c.severity]}>
                        <p style={{ fontSize: 12, lineHeight: 1.5, margin: 0 }}>{c.narrative}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* ─── RIGHT: Results Panel ─── */}
            <div className="rankings-results-panel">
              {/* Filter bar */}
              <div className="rankings-filter-bar">
                <span className={`rankings-mode-badge ${isCustom ? "is-custom" : "is-canonical"}`}>
                  {isCustom ? ui.customBadge : ui.canonicalBadge}
                </span>

                {/* Region filter */}
                <div className="region-switch" role="tablist" aria-label={ui.regionLabel} style={{ marginLeft: "auto" }}>
                  <button
                    type="button"
                    className={region === "All" ? "region-button active" : "region-button"}
                    onClick={() => setRegion("All")}
                  >
                    {ui.allRegions}
                  </button>
                  {rankingRegions.filter((r) => r !== "All").map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={r === region ? "region-button active" : "region-button"}
                      onClick={() => setRegion(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, opacity: 0.5 }}>
                  {results.length} {ui.citiesLabel}
                </span>
                <div className="rankings-count-toggle">
                  {([10, 50, 999] as const).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={showCountValue === n ? "active" : ""}
                      onClick={() => setShowCountValue(n)}
                    >
                      {n === 10 ? ui.top10 : n === 50 ? ui.top50 : ui.showAll}
                    </button>
                  ))}
                </div>
              </div>

              {/* City list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {displayResults.map((city, index) => {
                  const pillarScores = {
                    pressure: city.pressureScore,
                    viability: city.viabilityScore,
                    capability: city.capabilityScore,
                    community: city.communityScore,
                    creative: city.creativeScore,
                  };
                  const isTop = index < 3;
                  return (
                    <div
                      key={city.cityId}
                      className={`rankings-city-row${isTop ? " is-top" : ""}`}
                    >
                      <span style={{
                        fontSize: 16, fontWeight: 800,
                        fontVariantNumeric: "tabular-nums",
                        opacity: isTop ? 0.9 : 0.35,
                        textAlign: "center",
                      }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{city.displayName}</span>
                          <span style={{ fontSize: 12, opacity: 0.4 }}>{city.country}</span>
                          {isCustom && (
                            <span style={{ fontSize: 10, opacity: 0.3 }}>{ui.slicRank}{city.rank}</span>
                          )}
                        </div>
                        {/* Mini pillar bars */}
                        <div className="rankings-pillar-bars">
                          {PILLAR_ORDER.map((pid) => (
                            <div key={pid}>
                              <div style={{ width: `${pillarScores[pid]}%`, background: PILLAR_COLORS[pid] }} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rankings-dual-score">
                        <div className="custom-score">{city.customScore}</div>
                        {isCustom && (
                          <div className="canonical-ref">{ui.slicScore} {city.slicScore}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  className="primary-action"
                  href="/methodology"
                  onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}
                >
                  {copy.nav.methodology}
                </a>
                <a className="secondary-action" href="/downloads/slic-ranked-cities-v2.csv" download>
                  Download CSV
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
