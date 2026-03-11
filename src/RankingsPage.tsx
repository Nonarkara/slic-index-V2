import { useEffect, useMemo, useState } from "react";
import { formatCityTime } from "./cityTimezones";
import RankingTrendMiniChart from "./RankingTrendMiniChart";
import { getRankingsBoard, rankingRegions } from "./rankingsData";
import { rankingPhotos } from "./reportPhotos";
import { smartCityFeed, type SmartCityFeedItem } from "./smartCityFeed";
import { getCopy } from "./siteCopy";
import SiteFooter from "./SiteFooter";
import type { FullRankedCity, Locale, ScoreMode, SitePath } from "./types";

/**
 * Pick a source-desk article for each top-10 city.
 *
 * 1. If an article's `cityKey` matches the city name → use it.
 * 2. Otherwise give the city the next available *general* article
 *    (one with no cityKey, or whose cityKey city isn't in the top 10).
 *
 * City-specific articles about cities *outside* the top 10
 * (e.g. San Diego, Arlington) are never shown on an unrelated city card.
 */
function pickSourceItems(cities: FullRankedCity[]): (SmartCityFeedItem | null)[] {
  const usedIds = new Set<string>();
  const result: (SmartCityFeedItem | null)[] = new Array(cities.length).fill(null);

  // Pass 1 — assign city-specific matches
  for (let i = 0; i < cities.length; i++) {
    const cityName = cities[i].name.toLowerCase();
    const match = smartCityFeed.find(
      (item) => item.cityKey === cityName && !usedIds.has(item.id),
    );
    if (match) {
      result[i] = match;
      usedIds.add(match.id);
    }
  }

  // General pool: articles with no cityKey
  const generalPool = smartCityFeed.filter(
    (item) => !item.cityKey && !usedIds.has(item.id),
  );
  let gi = 0;

  // Pass 2 — fill remaining slots with general articles
  for (let i = 0; i < cities.length; i++) {
    if (!result[i] && gi < generalPool.length) {
      result[i] = generalPool[gi];
      usedIds.add(generalPool[gi].id);
      gi++;
    }
  }

  return result;
}

const modeLabels: Record<ScoreMode, Record<Locale, string>> = {
  balanced: { en: "Balanced", th: "สมดุล", zh: "综合" },
  physical: { en: "Physical", th: "กายภาพ", zh: "基础条件" },
  economic: { en: "Economic", th: "เศรษฐกิจ", zh: "经济" },
  community: { en: "Community", th: "ชุมชน", zh: "社区" },
  business: { en: "Business", th: "ธุรกิจ", zh: "商业" },
};

const accentTileLabel: Record<Locale, string> = {
  en: "City accent",
  th: "โทนของเมือง",
  zh: "城市色调",
};

const accentFallbackLabel: Record<Locale, string> = {
  en: "SLIC blue reference tone",
  th: "โทนอ้างอิงสีน้ำเงินของ SLIC",
  zh: "SLIC 蓝色基准色调",
};

const rankingEditorialCopy: Record<
  Locale,
  {
    visualEyebrow: string;
    visualTitle: string;
    sourceDeskEyebrow: string;
    sourceDeskTitle: string;
    sourceDeskSummary: string;
    sourceDeskLabel: string;
    sourcePublished: string;
    sourceOpen: string;
    sourceTrail: string;
  }
> = {
  en: {
    visualEyebrow: "How the ranking reads a city",
    visualTitle: "Movement, friction, public life, and the quality of the urban frame",
    sourceDeskEyebrow: "Smart-city source desk",
    sourceDeskTitle: "Current source trails around urban technology and city systems",
    sourceDeskSummary:
      "This desk records current smart-city reporting, official commentary, and urban-innovation signals that can be followed back to named sources.",
    sourceDeskLabel: "Source desk",
    sourcePublished: "Published",
    sourceOpen: "Open source",
    sourceTrail: "Signal trail",
  },
  th: {
    visualEyebrow: "วิธีที่อันดับนี้อ่านเมือง",
    visualTitle: "การเคลื่อนไหว แรงเสียดทาน ชีวิตสาธารณะ และคุณภาพของกรอบเมือง",
    sourceDeskEyebrow: "โต๊ะสัญญาณเมืองอัจฉริยะ",
    sourceDeskTitle: "ร่องรอยแหล่งข่าวปัจจุบันด้านเทคโนโลยีเมืองและระบบเมือง",
    sourceDeskSummary:
      "ส่วนนี้บันทึกข่าว การอธิบายเชิงทางการ และสัญญาณนวัตกรรมเมืองที่สามารถย้อนกลับไปยังแหล่งข้อมูลที่ระบุชื่อชัดเจนได้",
    sourceDeskLabel: "โต๊ะแหล่งข่าว",
    sourcePublished: "เผยแพร่",
    sourceOpen: "เปิดแหล่งข่าว",
    sourceTrail: "ร่องรอยสัญญาณ",
  },
  zh: {
    visualEyebrow: "榜单如何阅读一座城市",
    visualTitle: "流动、摩擦、公共生活与城市框架的真实质量",
    sourceDeskEyebrow: "智慧城市信号台",
    sourceDeskTitle: "围绕城市科技与城市系统的当前来源线索",
    sourceDeskSummary:
      "这一栏记录当前的智慧城市报道、官方评论与城市创新信号，并且都能回溯到具名来源。",
    sourceDeskLabel: "来源台",
    sourcePublished: "发布时间",
    sourceOpen: "打开来源",
    sourceTrail: "信号轨迹",
  },
};

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

function formatCurrency(value: number, locale: Locale): string {
  const language = locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US";
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number, locale: Locale): string {
  const language = locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US";
  return new Intl.NumberFormat(language, { maximumFractionDigits: 0 }).format(value);
}

function scoreLabel(score: number | undefined): string {
  if (typeof score !== "number") {
    return "--";
  }

  return String(Math.round(score));
}

function formatPublishedDate(value: string, locale: Locale): string {
  const language = locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US";
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

function downloadCsv(rows: FullRankedCity[], locale: Locale, mode: ScoreMode, region: string) {
  const headers = [
    "rank",
    "global_rank",
    "city",
    "country",
    "region",
    "mode",
    "score",
    "ppp_income_per_head",
    "ppp_disposable_income",
    "graduate_housing_share",
    "business_growth",
    "business_opening_ease",
    "government_stability",
    "tax_competitiveness",
    "safety_score",
    "tolerance_score",
    "ecology_score",
    "healthcare_access",
    "healthcare_affordability",
    "education_access",
    "education_affordability",
    "experience_diversity",
  ];

  const csvRows = rows.map((city, index) =>
    [
      index + 1,
      city.globalRank,
      city.name,
      city.country,
      city.region,
      mode,
      city.scores[mode],
      city.metrics.pppIncomePerHead,
      city.metrics.pppDisposableIncome ?? "",
      city.metrics.graduateHousingShare,
      city.metrics.businessGrowth ?? "",
      city.metrics.businessOpeningEase ?? "",
      city.metrics.governmentStability ?? "",
      city.metrics.taxCompetitiveness ?? "",
      city.metrics.safetyScore ?? "",
      city.metrics.toleranceScore ?? "",
      city.metrics.ecologyScore ?? "",
      city.metrics.healthcare.access,
      city.metrics.healthcare.affordability,
      city.metrics.education.access,
      city.metrics.education.affordability,
      city.metrics.experienceDiversity,
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(","),
  );

  const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const fileName = `slic-${region.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${mode}-${locale}.csv`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function ModeSwitch({
  mode,
  locale,
  onChange,
}: {
  mode: ScoreMode;
  locale: Locale;
  onChange: (mode: ScoreMode) => void;
}) {
  return (
    <div className="mode-switch" role="tablist" aria-label="Ranking modes">
      {(Object.keys(modeLabels) as ScoreMode[]).map((viewMode) => (
        <button
          key={viewMode}
          type="button"
          className={viewMode === mode ? "mode-button active" : "mode-button"}
          onClick={() => onChange(viewMode)}
          aria-pressed={viewMode === mode}
        >
          {modeLabels[viewMode][locale]}
        </button>
      ))}
    </div>
  );
}

export default function RankingsPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const copy = getCopy(locale);
  const editorialCopy = rankingEditorialCopy[locale];
  const [mode, setMode] = useState<ScoreMode>("balanced");
  const [region, setRegion] = useState<string>("All");
  const [scope, setScope] = useState<"core" | "field">("core");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const filteredRankings = useMemo(() => {
    return getRankingsBoard({ mode, region, scope });
  }, [mode, region, scope]);

  const topCards = filteredRankings.slice(0, 10);
  const topSourceItems = useMemo(() => pickSourceItems(topCards), [topCards]);
  const tableRows = filteredRankings.slice(10);

  return (
    <>
      <header className="rankings-hero section">
        <div className="rankings-hero-grid">
          <div>
            <p className="eyebrow">{copy.rankings.eyebrow}</p>
            <h1 className="rankings-title">{copy.rankings.title}</h1>
            <p className="hero-intro">{copy.rankings.intro}</p>
            <p className="rankings-filter-note">{copy.rankings.tieNote}</p>

            <div className="hero-actions">
              <a
                className="primary-action"
                href="/methodology"
                onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
              >
                {copy.nav.methodology}
              </a>
              <a
                className="secondary-action"
                href="/"
                onClick={(event) => navigateLink(event, onNavigate, "/")}
              >
                {copy.nav.home}
              </a>
            </div>
          </div>

          <div className="rankings-controls">
            <div className="rankings-filter-group">
              <div>
                <p className="panel-label">{copy.rankings.scopeLabel}</p>
                <div className="region-switch" role="tablist" aria-label={copy.rankings.scopeLabel}>
                  <button
                    type="button"
                    className={scope === "core" ? "region-button active" : "region-button"}
                    onClick={() => setScope("core")}
                  >
                    {copy.shared.coreBoard}
                  </button>
                  <button
                    type="button"
                    className={scope === "field" ? "region-button active" : "region-button"}
                    onClick={() => setScope("field")}
                  >
                    {copy.shared.extendedField}
                  </button>
                </div>
              </div>

              <div>
                <p className="panel-label">{copy.rankings.regionLabel}</p>
                <div className="region-switch" role="tablist" aria-label={copy.rankings.regionLabel}>
                  {rankingRegions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={option === region ? "region-button active" : "region-button"}
                      onClick={() => setRegion(option)}
                    >
                      {option === "All" ? copy.shared.allRegions : option}
                    </button>
                  ))}
                </div>
              </div>

              <p className="rankings-filter-note">{copy.rankings.scopeSummary}</p>
            </div>

            <div className="rankings-actions">
              <ModeSwitch mode={mode} locale={locale} onChange={setMode} />
              <button
                type="button"
                className="secondary-action rankings-export"
                onClick={() => downloadCsv(filteredRankings, locale, mode, region)}
              >
                {copy.shared.exportCsv}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="rankings-top section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{copy.shared.liveTop10}</p>
              <h2>{copy.rankings.topTenTitle}</h2>
            </div>
            <p className="section-summary">{copy.rankings.topTenSummary}</p>
          </div>

          <div className="ranking-card-grid ranking-card-grid-top">
            {topCards.map((city, index) => {
              const localTime = formatCityTime(now, city.name, locale);
              const sourceItem = topSourceItems[index];

              return (
                <article className="ranking-detail-card" key={`${city.id}-${mode}`}>
                  <div className="ranking-detail-layout">
                    <div className="ranking-detail-main">
                      <div className="ranking-detail-head">
                        <div>
                          <p className="panel-label">
                            {copy.rankings.rank} {String(index + 1).padStart(2, "0")}
                          </p>
                          <h3>{city.name}</h3>
                          <p className="city-location">
                            {city.country} / {city.region}
                          </p>
                        </div>

                        <div className="ranking-head-meta">
                          {localTime ? (
                            <div className="ranking-city-clock">
                              <span>{copy.rankings.localClock}</span>
                              <strong>{localTime}</strong>
                            </div>
                          ) : null}
                          <div className="detail-score">
                            <strong>{city.scores[mode]}</strong>
                            <span>{modeLabels[mode][locale]}</span>
                          </div>
                        </div>
                      </div>

                      <p className="city-tagline">{city.tagline}</p>
                      <p className="detail-rationale">
                        <strong>{copy.rankings.rationale}:</strong> {city.inclusionRationale}
                      </p>

                      <div className="detail-metric-grid detail-metric-grid-rich">
                        <div>
                          <span>{copy.rankings.income}</span>
                          <strong>{formatCurrency(city.metrics.pppIncomePerHead, locale)}</strong>
                        </div>
                        <div>
                          <span>{copy.rankings.disposable}</span>
                          <strong>
                            {formatCurrency(
                              city.metrics.pppDisposableIncome ?? city.metrics.pppIncomePerHead,
                              locale,
                            )}
                          </strong>
                        </div>
                        <div>
                          <span>{copy.rankings.housing}</span>
                          <strong>{formatPercent(city.metrics.graduateHousingShare, locale)}%</strong>
                        </div>
                        <div>
                          <span>{copy.rankings.safety}</span>
                          <strong>{scoreLabel(city.metrics.safetyScore)}</strong>
                        </div>
                        <div>
                          <span>{copy.rankings.tolerance}</span>
                          <strong>{scoreLabel(city.metrics.toleranceScore)}</strong>
                        </div>
                        <div>
                          <span>{copy.rankings.business}</span>
                          <strong>{scoreLabel(city.metrics.businessGrowth)}</strong>
                        </div>
                        <div>
                          <span>{copy.rankings.healthcare}</span>
                          <strong>{city.metrics.healthcare.affordability}</strong>
                          <small>{city.metrics.healthcare.access}</small>
                        </div>
                        <div>
                          <span>{copy.rankings.education}</span>
                          <strong>{city.metrics.education.affordability}</strong>
                          <small>{city.metrics.education.access}</small>
                        </div>
                        <div>
                          <span>{copy.rankings.ecology}</span>
                          <strong>{scoreLabel(city.metrics.ecologyScore)}</strong>
                        </div>
                        <div>
                          <span>{copy.rankings.diversity}</span>
                          <strong>{scoreLabel(city.metrics.experienceDiversity)}</strong>
                        </div>
                      </div>
                    </div>

                    <aside className="ranking-signal-column">
                      <div className="ranking-insight-panel">
                        <p className="panel-label">{copy.rankings.listening}</p>
                        <RankingTrendMiniChart points={city.metrics.conversationTrend} />
                        <p className="ranking-insight-note">
                          {copy.rankings.safety} {scoreLabel(city.metrics.safetyScore)} /{" "}
                          {copy.rankings.tolerance} {scoreLabel(city.metrics.toleranceScore)} /{" "}
                          {copy.rankings.business} {scoreLabel(city.metrics.businessGrowth)}
                        </p>

                        <div className="ranking-diagnostic-grid">
                          <article>
                            <span>{copy.rankings.safety}</span>
                            <strong>{scoreLabel(city.metrics.safetyScore)}</strong>
                          </article>
                          <article>
                            <span>{copy.rankings.tolerance}</span>
                            <strong>{scoreLabel(city.metrics.toleranceScore)}</strong>
                          </article>
                          <article>
                            <span>{copy.rankings.openingEase}</span>
                            <strong>{scoreLabel(city.metrics.businessOpeningEase)}</strong>
                          </article>
                          <article>
                            <span>{copy.rankings.stability}</span>
                            <strong>{scoreLabel(city.metrics.governmentStability)}</strong>
                          </article>
                          <article>
                            <span>{copy.rankings.taxRegime}</span>
                            <strong>{scoreLabel(city.metrics.taxCompetitiveness)}</strong>
                          </article>
                          <article>
                            <span>{copy.rankings.incentives}</span>
                            <strong>{scoreLabel(city.metrics.incentiveReadiness)}</strong>
                          </article>
                        </div>

                        <div className="ranking-topic-list">
                          {(city.metrics.conversationTopics ?? city.tags).slice(0, 4).map((topic) => (
                            <span key={topic}>{topic}</span>
                          ))}
                        </div>

                        {sourceItem && (
                          <a
                            className="ranking-source-card"
                            href={sourceItem.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              background: `linear-gradient(180deg, ${city.accentSoftHex ?? "rgba(15, 63, 153, 0.08)"} 0%, rgba(255,255,255,0.92) 100%)`,
                              borderColor: city.accentHex ?? "#0f3f99",
                            }}
                          >
                            <div className="ranking-source-card-head">
                              <p className="panel-label">{editorialCopy.sourceDeskLabel}</p>
                              <span className="ranking-source-date">
                                {formatPublishedDate(sourceItem.publishedAt, locale)}
                              </span>
                            </div>
                            <div className="ranking-accent-head">
                              <h4>{city.name}</h4>
                              <span
                                className="ranking-accent-chip"
                                style={{ background: city.accentHex ?? "#0f3f99" }}
                              />
                            </div>
                            <p className="ranking-source-accent">
                              {accentTileLabel[locale]} / {city.accentLabel ?? accentFallbackLabel[locale]}
                            </p>
                            <strong className="ranking-source-title">{sourceItem.headline}</strong>
                            <div className="ranking-source-foot">
                              <span>{sourceItem.source}</span>
                              <span>{editorialCopy.sourceOpen}</span>
                            </div>
                          </a>
                        )}
                      </div>
                    </aside>
                  </div>

                  <div className="metric-taglist">
                    {city.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="ranking-visual-band section" aria-label="Ranking visual context">
          <div className="section-heading compact-heading">
            <p className="eyebrow">{editorialCopy.visualEyebrow}</p>
            <h2>{editorialCopy.visualTitle}</h2>
          </div>

          <div className="field-ledger-grid ranking-photo-grid">
            {rankingPhotos.map((photo, index) => (
              <figure
                className={
                  index === 0
                    ? "photo-frame photo-frame-span-seven"
                    : index === 1
                      ? "photo-frame photo-frame-span-five"
                      : "photo-frame photo-frame-wide"
                }
                key={photo.id}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="ranking-source-desk section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{editorialCopy.sourceDeskEyebrow}</p>
              <h2>{editorialCopy.sourceDeskTitle}</h2>
            </div>
            <p className="section-summary">{editorialCopy.sourceDeskSummary}</p>
          </div>

          <div className="source-desk-grid">
            {smartCityFeed.map((item) => (
              <a
                className="source-desk-card"
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="source-desk-card-head">
                  <p className="panel-label">{editorialCopy.sourceTrail}</p>
                  <span>{item.topic}</span>
                </div>
                <h3>{item.headline}</h3>
                <div className="source-desk-meta">
                  <span>{item.source}</span>
                  <span>
                    {editorialCopy.sourcePublished}: {formatPublishedDate(item.publishedAt, locale)}
                  </span>
                </div>
                <span className="source-desk-link">{editorialCopy.sourceOpen}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="rankings-table-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{copy.rankings.eyebrow}</p>
              <h2>{copy.rankings.tableTitle}</h2>
            </div>
            <p className="section-summary">{copy.rankings.tableSummary}</p>
          </div>

          <div className="sheet-table-shell">
            <table className="sheet-table ranking-table">
              <thead>
                <tr>
                  <th>{copy.rankings.rank}</th>
                  <th>{copy.rankings.city}</th>
                  <th>{copy.rankings.country}</th>
                  <th>{copy.rankings.region}</th>
                  <th>{copy.rankings.score}</th>
                  <th>{copy.rankings.business}</th>
                  <th>{copy.rankings.safety}</th>
                  <th>{copy.rankings.tolerance}</th>
                  <th>{copy.rankings.income}</th>
                  <th>{copy.rankings.disposable}</th>
                  <th>{copy.rankings.housing}</th>
                  <th>{copy.rankings.ecology}</th>
                  <th>{copy.rankings.healthcare}</th>
                  <th>{copy.rankings.education}</th>
                  <th>{copy.rankings.diversity}</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((city, index) => (
                  <tr key={`${city.id}-${mode}-table`}>
                    <td>{index + 11}</td>
                    <td>{city.name}</td>
                    <td>{city.country}</td>
                    <td>{city.region}</td>
                    <td>{city.scores[mode]}</td>
                    <td>{scoreLabel(city.metrics.businessGrowth)}</td>
                    <td>{scoreLabel(city.metrics.safetyScore)}</td>
                    <td>{scoreLabel(city.metrics.toleranceScore)}</td>
                    <td>{formatCurrency(city.metrics.pppIncomePerHead, locale)}</td>
                    <td>
                      {formatCurrency(
                        city.metrics.pppDisposableIncome ?? city.metrics.pppIncomePerHead,
                        locale,
                      )}
                    </td>
                    <td>{formatPercent(city.metrics.graduateHousingShare, locale)}%</td>
                    <td>{scoreLabel(city.metrics.ecologyScore)}</td>
                    <td>{city.metrics.healthcare.affordability}</td>
                    <td>{city.metrics.education.affordability}</td>
                    <td>{scoreLabel(city.metrics.experienceDiversity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ranking-fine-print section" aria-label="Ranking publication note">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{copy.rankings.finePrintEyebrow}</p>
              <h2>{copy.rankings.finePrintTitle}</h2>
            </div>
            <p className="section-summary">{copy.rankings.finePrintSummary}</p>
          </div>

          <div className="ranking-fine-print-layout">
            <div className="ranking-fine-print-copy">
              <article className="fine-print-row">
                <p className="panel-label">{copy.rankings.usageLabel}</p>
                <p>{copy.rankings.usageBody}</p>
              </article>

              <article className="fine-print-row">
                <p className="panel-label">{copy.rankings.aiLabel}</p>
                <p>{copy.rankings.aiBody}</p>
              </article>

              <article className="fine-print-row">
                <p className="panel-label">{copy.rankings.liveLabel}</p>
                <p>{copy.rankings.liveBody}</p>
              </article>

              <article className="fine-print-row">
                <p className="panel-label">{copy.rankings.cautionLabel}</p>
                <p>{copy.rankings.cautionBody}</p>
              </article>
            </div>

            <aside className="paper-card ranking-credit-card">
              <p className="panel-label">{copy.rankings.creditLabel}</p>
              <pre className="formula-display formula-display-compact ranking-credit-formula">
                {copy.rankings.creditBody}
              </pre>
              <p className="ranking-credit-note">
                {copy.rankings.tieNote}
              </p>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
