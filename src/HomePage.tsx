import { useEffect, useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import { buildLandingData } from "./landingData";
import { rankingRegions } from "./rankingsData";
// RankingIntegrityBanner used on rankings page; home uses inline status line
import { getMethodologyData } from "./methodologyData";
import PillarWeightChart from "./PillarWeightChart";
// getCopy used indirectly via other modules
import SiteFooter from "./SiteFooter";
import SmartCityFeedPanel from "./SmartCityFeedPanel";
import type { Locale, SitePath } from "./types";

const data = buildLandingData();

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
  en: { pressure: "Growth", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "การเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长", viability: "宜居", capability: "能力", community: "社区", creative: "创新" },
};

/* Pillar hints moved to rankings page; home page uses compact legend */

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

const EQUAL_WEIGHT = 20;

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

const heroCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  strapline: string;
  allocatorHint: string;
  resetLabel: string;
  equalBadge: string;
  customBadge: string;
  equalNote: string;
  consequencesTitle: string;
  yourScore: string;
  citiesLabel: string;
  top10: string;
  top50: string;
  showAll: string;
  regionLabel: string;
  allRegions: string;
  seeSlicRanking: string;
  seeMethodology: string;
}> = {
  en: {
    eyebrow: "SLIC Index 2026",
    title: "We built an index.\nYou build the ranking.",
    strapline: "103 cities. Five dimensions. One tool. Drag the spider — shift your priorities — watch cities re-rank in real time.",
    allocatorHint: "Drag the web or use sliders. Total = 100.",
    resetLabel: "Reset",
    equalBadge: "Equal weights",
    customBadge: "Your priorities",
    equalNote: "20 / 20 / 20 / 20 / 20",
    consequencesTitle: "Trade-offs",
    yourScore: "Score",
    citiesLabel: "cities",
    top10: "Top 10",
    top50: "Top 50",
    showAll: "All",
    regionLabel: "Region",
    allRegions: "All",
    seeSlicRanking: "See SLIC ranking",
    seeMethodology: "Methodology",
  },
  th: {
    eyebrow: "SLIC Index 2026",
    title: "เราสร้างดัชนี\nคุณสร้างอันดับ",
    strapline: "103 เมือง 5 มิติ เครื่องมือเดียว ลากใยแมงมุม — ปรับลำดับ — ดูเมืองจัดอันดับใหม่แบบเรียลไทม์",
    allocatorHint: "ลากใยแมงมุมหรือใช้แถบเลื่อน ผลรวม = 100",
    resetLabel: "รีเซ็ต",
    equalBadge: "น้ำหนักเท่ากัน",
    customBadge: "ลำดับของคุณ",
    equalNote: "20 / 20 / 20 / 20 / 20",
    consequencesTitle: "ข้อแลกเปลี่ยน",
    yourScore: "คะแนน",
    citiesLabel: "เมือง",
    top10: "10 อันดับ",
    top50: "50 อันดับ",
    showAll: "ทั้งหมด",
    regionLabel: "ภูมิภาค",
    allRegions: "ทั้งหมด",
    seeSlicRanking: "ดูอันดับ SLIC",
    seeMethodology: "ระเบียบวิธี",
  },
  zh: {
    eyebrow: "SLIC Index 2026",
    title: "我们建立指数\n你来构建排名",
    strapline: "103 座城市，五个维度，一个工具。拖动蛛网 — 调整优先级 — 看城市实时重新排名。",
    allocatorHint: "拖动蛛网图或使用滑块，总分 = 100",
    resetLabel: "重置",
    equalBadge: "等权重",
    customBadge: "你的优先级",
    equalNote: "20 / 20 / 20 / 20 / 20",
    consequencesTitle: "权衡",
    yourScore: "得分",
    citiesLabel: "城市",
    top10: "前10",
    top50: "前50",
    showAll: "全部",
    regionLabel: "地区",
    allRegions: "全部",
    seeSlicRanking: "查看 SLIC 排名",
    seeMethodology: "方法论",
  },
};

/* ───── severity styles ───── */

const severityStyles: Record<string, React.CSSProperties> = {
  severe: { borderLeft: "3px solid #ef4444", background: "rgba(239,68,68,0.06)", padding: "6px 10px", fontSize: 11 },
  moderate: { borderLeft: "3px solid #f59e0b", background: "rgba(245,158,11,0.04)", padding: "6px 10px", fontSize: 11 },
  mild: { borderLeft: "3px solid #3b82f6", background: "rgba(59,130,246,0.04)", padding: "6px 10px", fontSize: 11 },
};

/* ───── editorial copy ───── */

const homeEditorialCopy: Record<
  Locale,
  {
    manifestoTitle: string;
    manifestoBody: string;
    manifestoFormula: string;
    manifestoDoctrine: Array<{ title: string; body: string }>;
    methodologyTitle: string;
    methodologySummary: string;
    weightLabel: string;
    weightTitle: string;
    weightSummary: string;
    methodologySurfaceTitle: string;
    methodologySurfaceSummary: string;
    methodologyAction: string;
    spotlightsEyebrow: string;
    spotlightsTitle: string;
    spotlightsSummary: string;
  }
> = {
  en: {
    manifestoTitle: "A ranking that treats cities as places to live, not trophies to display.",
    manifestoBody:
      "Too many city rankings reward prestige, cost, or brand power. SLIC asks where a person can still build a life, keep dignity, feel safe, and find some ambition without being crushed by the city itself.",
    manifestoFormula:
      "City value = real room to live + daily confidence + social openness + productive possibility",
    manifestoDoctrine: [
      { title: "Outcomes over gadgetry", body: "Technology matters only when it improves the lived city." },
      { title: "Livability over GDP optics", body: "A wealthy city can still fail if housing stress, overwork, or thin community make meaningful life difficult." },
      { title: "Culture is infrastructure too", body: "Belonging, hospitality, variety, and urban character are part of what makes a city resilient and worth choosing." },
    ],
    methodologyTitle: "Five declared pillars, full doctrine in the paper.",
    methodologySummary: "The homepage keeps the public story legible. The methodology paper carries the formal score, notation, source hierarchy, and worksheet logic.",
    weightLabel: "What the official score weighs",
    weightTitle: "Five declared pillars, one fixed public formula.",
    weightSummary: "Growth carries the largest share in the SLIC canonical ranking, followed by viability, capability, community, and creative vitality.",
    methodologySurfaceTitle: "What SLIC is trying to surface",
    methodologySurfaceSummary: "The strongest cities here are not just clean or rich. They are places where people can still afford life, move with confidence, find community, and keep ambition alive without the city draining them dry.",
    methodologyAction: "Enter the full methodology",
    spotlightsEyebrow: "City spotlights",
    spotlightsTitle: "Examples that prove the thesis",
    spotlightsSummary: "The index surfaces compelling cities that traditional prestige rankings often flatten or ignore.",
  },
  th: {
    manifestoTitle: "การจัดอันดับที่มองเมืองเป็นที่อยู่อาศัย ไม่ใช่ถ้วยรางวัลสำหรับโชว์",
    manifestoBody: "การจัดอันดับจำนวนมากให้รางวัลกับชื่อเสียง ราคาแพง หรือแบรนด์ของเมือง แต่ SLIC ถามว่าเมืองไหนยังทำให้คนสร้างชีวิต รักษาศักดิ์ศรี รู้สึกปลอดภัย และยังมีพื้นที่ให้ความทะเยอทะยานเติบโตได้โดยไม่ถูกเมืองบดขยี้",
    manifestoFormula: "คุณค่าของเมือง = พื้นที่ชีวิตจริง + ความมั่นใจในชีวิตประจำวัน + ความเปิดกว้างทางสังคม + โอกาสในการเติบโต",
    manifestoDoctrine: [
      { title: "ผลลัพธ์มาก่อนอุปกรณ์", body: "เทคโนโลยีมีความหมายก็ต่อเมื่อทำให้ชีวิตเมืองดีขึ้นจริง" },
      { title: "คุณภาพชีวิตมาก่อนภาพลวงตา GDP", body: "เมืองที่มั่งคั่งก็ยังล้มเหลวได้ หากค่าที่อยู่อาศัย ความเหนื่อยล้า หรือชุมชนที่บางเกินไปทำให้ชีวิตที่มีความหมายเกิดขึ้นยาก" },
      { title: "วัฒนธรรมก็คือโครงสร้างพื้นฐาน", body: "ความรู้สึกเป็นส่วนหนึ่ง การต้อนรับ ความหลากหลาย และคาแรกเตอร์ของเมือง เป็นส่วนหนึ่งของความยืดหยุ่นและความน่าเลือกของเมือง" },
    ],
    methodologyTitle: "หน้าแรกแสดงห้าเสาหลัก ส่วนหลักการเต็มอยู่ใน methodology paper",
    methodologySummary: "หน้าแรกทำให้เรื่องนี้อ่านง่ายสำหรับสาธารณะ ส่วน methodology paper จะแสดงสมการเต็ม สัญลักษณ์ ลำดับชั้นของแหล่งข้อมูล",
    weightLabel: "น้ำหนักที่สูตรทางการใช้จริง",
    weightTitle: "ห้าเสาหลักที่ประกาศชัด และสูตรสาธารณะเพียงสูตรเดียว",
    weightSummary: "ในอันดับ SLIC ทางการ การเติบโตมีน้ำหนักมากที่สุด ตามด้วยความน่าอยู่ ศักยภาพ ชุมชน และพลังสร้างสรรค์",
    methodologySurfaceTitle: "สิ่งที่ SLIC พยายามทำให้มองเห็น",
    methodologySurfaceSummary: "เมืองที่แข็งแรงในดัชนีนี้ไม่ใช่แค่สะอาดหรือรวย แต่เป็นเมืองที่คนยังพอมีชีวิตที่จ่ายไหว เคลื่อนที่ได้อย่างมั่นใจ มีชุมชน และยังรักษาความทะเยอทะยานไว้ได้",
    methodologyAction: "เข้าสู่ methodology เต็มรูปแบบ",
    spotlightsEyebrow: "ตัวอย่างเมือง",
    spotlightsTitle: "ตัวอย่างที่พิสูจน์สมมติฐาน",
    spotlightsSummary: "ดัชนีนี้ถูกออกแบบมาเพื่อดึงเมืองที่น่าสนใจขึ้นมาให้เห็น แม้อันดับเชิงชื่อเสียงแบบเดิมมักทำให้เมืองเหล่านี้ถูกมองข้าม",
  },
  zh: {
    manifestoTitle: "把城市当成可以生活的地方，而不是拿来炫耀的奖杯。",
    manifestoBody: "太多城市排名奖赏的是声望、高价与品牌。SLIC 追问的是：一个人能否在这里建立生活、保持尊严、拥有安全感，并在不被城市榨干的情况下继续成长。",
    manifestoFormula: "城市价值 = 真实生活空间 + 日常信心 + 社会开放度 + 生产性机会",
    manifestoDoctrine: [
      { title: "结果优先于炫技", body: "技术只有在改善真实城市生活时才值得计分。" },
      { title: "宜居性优先于 GDP 表演", body: "一个城市即使富有，也可能因为住房压力、过劳或脆弱的共同体而难以承载有意义的生活。" },
      { title: "文化本身也是基础设施", body: "归属感、好客、多样性与城市个性，本来就是城市韧性与吸引力的一部分。" },
    ],
    methodologyTitle: "首页呈现五个公开支柱，完整方法在论文页展开。",
    methodologySummary: "首页保持公共叙事的清晰度；方法论页面则完整展示分数公式、符号表、来源层级。",
    weightLabel: "官方分数到底在权衡什么",
    weightTitle: "五个公开支柱，一条固定的公开公式。",
    weightSummary: "在 SLIC 标准排名中，增长权重最高，其次是宜居、能力、社区和创新活力。",
    methodologySurfaceTitle: "SLIC 想真正显现的东西",
    methodologySurfaceSummary: "这个榜单里的强城，不只是干净或富有，而是那些仍让人负担得起生活、能安心移动、能找到共同体的地方。",
    methodologyAction: "进入完整方法论",
    spotlightsEyebrow: "城市样本",
    spotlightsTitle: "能够证明这套判断的例子",
    spotlightsSummary: "这个指数本来就是为了把那些有说服力的城市显出来，即使传统声望排名常常会把它们压平或忽略。",
  },
};

const spotlightTranslations: Record<
  Locale,
  Record<string, { kicker: string; reason: string; highlights: string[] }>
> = {
  en: {},
  th: {
    taipei: {
      kicker: "แม่นยำโดยไม่เย็นชา",
      reason: "ไทเปแสดงให้เห็นว่าดัชนีนี้มองเกิน GDP เมืองนี้เปลี่ยนความปลอดภัย ระบบขนส่ง มารยาท วัฒนธรรมอาหาร และความเป็นระเบียบให้กลายเป็นเมืองที่ไว้ใจได้",
      highlights: ["ปลอดภัยและสงบ", "ขนส่งดีเยี่ยม", "วัฒนธรรมอาหารเข้มข้น", "สะดวกในชีวิตประจำวัน"],
    },
    bangkok: {
      kicker: "ยุ่งในแบบที่มีชีวิต",
      reason: "กรุงเทพฯ ได้คะแนนเพราะความหลากหลายมีความหมาย ทั้งการต้อนรับ ความยืดหยุ่นของราคา ชีวิตกลางคืน อาหาร และพลังทางสังคม",
      highlights: ["หลายระดับราคา", "จังหวะเมือง 24/7", "การต้อนรับสูง", "ความหนาแน่นทางวัฒนธรรม"],
    },
    jeju: {
      kicker: "ชีวิตเกาะที่ยังมีความทรงจำ",
      reason: "เชจูย้ำว่าความน่าอยู่รวมถึงความสงบ ความงาม ประเพณีท้องถิ่น และพื้นที่ให้หายใจ",
      highlights: ["ชายฝั่งและเส้นทางธรรมชาติ", "แรงกดดันต่ำกว่า", "อัตลักษณ์ท้องถิ่นชัด", "ฐานความปลอดภัยแข็งแรง"],
    },
    busan: {
      kicker: "กล้ามเนื้อเศรษฐกิจในขนาดที่ยังเป็นมนุษย์",
      reason: "ปูซานสะท้อนแกนกลางของดัชนีนี้ คุณสามารถเก็บพลวัต ความแข็งแรงด้านโลจิสติกส์ได้โดยไม่ทำให้ชีวิตกลายเป็นความตึงเครียด",
      highlights: ["เศรษฐกิจท่าเรือ", "ความน่าอยู่แบบเมืองชายฝั่ง", "สมดุลดีกว่า", "จังหวะเมืองแข็งแรง"],
    },
    shanghai: {
      kicker: "หลักฐานว่าความมั่งคั่งก็มีต้นทุน",
      reason: "เซี่ยงไฮ้อยู่ในลิสต์นี้เพราะดัชนีไม่ได้โรแมนติกกับความสามารถ มันบันทึกต้นทุนด้าน affordability ที่ติดมากับความสำเร็จ",
      highlights: ["แรงโน้มเศรษฐกิจ", "ระบบขนส่งระดับโลก", "การจัดการเมืองสะอาด", "แรงกดดันด้านที่อยู่อาศัย"],
    },
    penang: {
      kicker: "ประวัติศาสตร์ที่อยู่กับวงจรอุตสาหกรรม",
      reason: "ปีนังแสดงให้เห็นว่าเมืองขนาดเล็กกว่าสามารถชนะชื่อดังได้ มรดก อาหาร และความลึกทางอุตสาหกรรมรวมกัน",
      highlights: ["ถนนมรดก", "เมืองอาหาร", "เครือข่ายเซมิคอนดักเตอร์", "ขนาดที่ยังอยู่สบาย"],
    },
  },
  zh: {
    taipei: {
      kicker: "精密但不冰冷",
      reason: "台北说明了为什么这个指数要超越 GDP。它把安全、交通、礼貌、饮食文化与日常秩序组合成一座真正值得信任的城市。",
      highlights: ["安全安静", "交通极强", "饮食文化深", "日常便利高"],
    },
    bangkok: {
      kicker: "最好的那种复杂与热闹",
      reason: "曼谷得分高，是因为多样性本身就重要。好客、价格弹性、夜生活、食物与社会能量。",
      highlights: ["预算层级多", "24/7 城市节奏", "好客度强", "文化密度高"],
    },
    jeju: {
      kicker: "有记忆的岛屿生活",
      reason: "济州提醒我们，宜居性也包括安静、美感、地方传统与呼吸空间。",
      highlights: ["海岸与步道", "压力更低", "地方个性强", "安全基线高"],
    },
    busan: {
      kicker: "有经济肌肉，也保有人类尺度",
      reason: "釜山体现了这个指数的核心：一座城市可以保持活力、物流实力与都市重要性，而不必把日常生活变成持续紧绷。",
      highlights: ["港口经济", "滨海宜居性", "平衡更好", "城市节奏强"],
    },
    shanghai: {
      kicker: "繁荣也有边界",
      reason: "上海出现在这里，是因为这个指数并不浪漫化大城市能力。它清楚标记超大城市成功附带的成本。",
      highlights: ["经济引力", "世界级交通", "城市管理整洁", "住房压力上升"],
    },
    penang: {
      kicker: "历史与产业线路并存",
      reason: "槟城说明了为什么较小城市也能胜过更有名的名字。遗产、食物与产业深度结合。",
      highlights: ["遗产街区", "美食之城", "半导体链条", "宜居尺度"],
    },
  },
};

/* ───── main component ───── */

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

export default function HomePage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const methodology = getMethodologyData(locale);
  const editorialCopy = homeEditorialCopy[locale];
  const ui = heroCopy[locale];
  const labels = PILLAR_LABELS[locale];

  /* ── visitor counter (fetched from Google Sheets via Apps Script) ── */
  const [visitors, setVisitors] = useState(12424);
  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbz5P8_4CzTfo_0PoRgVWPKg5dI7l2NGn3_pYwCRDjVbFZhxnODO1ZyVWrKLj4cEYtx-nQ/exec?action=count", { mode: "cors" })
      .then((r) => r.json())
      .then((d) => { if (d.count) setVisitors(d.count); })
      .catch(() => {});
  }, []);

  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({
      id,
      label: labels[id],
      color: PILLAR_COLORS[id],
      value: EQUAL_WEIGHT,
    })),
  );

  const [region, setRegion] = useState<string>("All");
  const [showCountValue, setShowCountValue] = useState<number>(10);

  const weights = useMemo(() => {
    const w: Record<string, number> = {};
    pillars.forEach((p) => { w[p.id] = p.value; });
    return w as Record<PillarId, number>;
  }, [pillars]);

  const isCustom = useMemo(() => {
    return PILLAR_ORDER.some((id) => weights[id] !== EQUAL_WEIGHT);
  }, [weights]);

  const consequences = useMemo<FiredConsequence[]>(
    () => evaluateConsequences(weights),
    [weights],
  );

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
        value: EQUAL_WEIGHT,
      })),
    );
  };

  return (
    <>
      {/* ═══════ HERO: Title left + Spider right — visible on load ═══════ */}
      <header className="hero section" style={{ paddingBottom: 8 }}>
        <div className="home-hero-split">
          {/* LEFT — thesis */}
          <div className="home-hero-copy">
            <p className="eyebrow" style={{ marginBottom: 6 }}>{ui.eyebrow}</p>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(24px, 3.8vw, 44px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
              whiteSpace: "pre-line",
            }}>
              {ui.title}
            </h1>
            <p style={{ fontSize: 13, lineHeight: 1.65, opacity: 0.5, margin: "0 0 16px", maxWidth: 420 }}>
              {ui.strapline}
            </p>

            {/* Pillar legend — compact inline */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginBottom: 12 }}>
              {PILLAR_ORDER.map((id) => (
                <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em", opacity: 0.55 }}>
                  <span style={{ width: 6, height: 6, background: PILLAR_COLORS[id], flexShrink: 0 }} />
                  {labels[id]}
                </span>
              ))}
            </div>

            {/* Compact status line */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 0", marginBottom: 8,
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.06em", textTransform: "uppercase",
              opacity: 0.4,
            }}>
              <span style={{ width: 5, height: 5, background: "#22c55e" }} />
              {locale === "en" ? "Published — 103 cities / 92 signals / 35 sources" : locale === "th" ? "เผยแพร่แล้ว — 103 เมือง / 92 สัญญาณ / 35 แหล่ง" : "已发布 — 103 城市 / 92 信号 / 35 来源"}
            </div>

            {/* Visitor counter */}
            <div className="visitor-counter">
              <span className="visitor-counter-dot" />
              <span className="visitor-counter-number">{visitors.toLocaleString()}</span>
              <span className="visitor-counter-label">
                {locale === "en" ? "visitors since March 18, 2026" : locale === "th" ? "ผู้เยี่ยมชมตั้งแต่ 18 มีนาคม 2569" : "自2026年3月18日以来的访客"}
              </span>
            </div>

            {/* Navigation links */}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <a
                className="secondary-action"
                href="/rankings"
                onClick={(e) => { e.preventDefault(); onNavigate("/rankings"); }}
                style={{ fontSize: 11, padding: "6px 14px", minHeight: "auto" }}
              >
                {ui.seeSlicRanking}
              </a>
              <a
                className="secondary-action"
                href="/methodology"
                onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}
                style={{ fontSize: 11, padding: "6px 14px", minHeight: "auto" }}
              >
                {ui.seeMethodology}
              </a>
            </div>
          </div>

          {/* RIGHT — spider */}
          <div className="home-hero-spider">
            <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={300} />
            <button
              type="button"
              className="rankings-reset-btn"
              onClick={handleReset}
              style={{ marginTop: 4 }}
            >
              {ui.resetLabel} ({ui.equalNote})
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ═══════ WORKBENCH: Filters + City Results ═══════ */}
        <section className="section" style={{ paddingTop: 8, paddingBottom: 24 }}>
          {/* Trade-off insights — compact strip */}
          {consequences.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {consequences.map((c) => (
                  <div key={c.id} style={severityStyles[c.severity]}>
                    <p style={{ margin: 0, lineHeight: 1.4 }}>{c.narrative}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter bar — single compact row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span className={`rankings-mode-badge ${isCustom ? "is-custom" : "is-canonical"}`}>
              {isCustom ? ui.customBadge : ui.equalBadge}
            </span>

            <span style={{ fontSize: 11, opacity: 0.35, fontFamily: "'JetBrains Mono', monospace" }}>
              {results.length} {ui.citiesLabel}
            </span>

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{
                marginLeft: "auto",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              <option value="All">{ui.allRegions}</option>
              {rankingRegions.filter((r) => r !== "All").map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

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

          {/* City list — tight rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
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
                    fontSize: 13, fontWeight: 800,
                    fontVariantNumeric: "tabular-nums",
                    opacity: isTop ? 0.9 : 0.3,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{city.displayName}</span>
                      <span style={{ fontSize: 11, opacity: 0.35 }}>{city.country}</span>
                    </div>
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
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════ MANIFESTO ═══════ */}
        <section className="manifesto section">
          <div className="manifesto-layout">
            <div className="manifesto-editorial">
              <p className="eyebrow">{locale === "en" ? "Why this exists" : locale === "th" ? "เหตุผลที่สิ่งนี้ต้องมี" : "为什么它必须存在"}</p>
              <h2>{editorialCopy.manifestoTitle}</h2>
              <p>{editorialCopy.manifestoBody}</p>
              <pre className="manifesto-formula">{editorialCopy.manifestoFormula}</pre>
            </div>
            <div className="manifesto-doctrine">
              {editorialCopy.manifestoDoctrine.map((item, index) => (
                <article className="manifesto-doctrine-row" key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ METHODOLOGY SNAPSHOT ═══════ */}
        <section className="methodology section" id="methodology">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{locale === "en" ? "Methodology snapshot" : locale === "th" ? "ภาพรวมระเบียบวิธี" : "方法论快照"}</p>
              <h2>{editorialCopy.methodologyTitle}</h2>
            </div>
            <p className="section-summary">{editorialCopy.methodologySummary}</p>
          </div>

          <div className="methodology-snapshot-grid">
            <article className="paper-card weight-card">
              <div className="weight-card-head">
                <div>
                  <p className="panel-label">{editorialCopy.weightLabel}</p>
                  <h3>{editorialCopy.weightTitle}</h3>
                </div>
                <p className="section-summary">{editorialCopy.weightSummary}</p>
              </div>
              <PillarWeightChart pillars={methodology.pillars} compact shareLabel={methodology.weightChartLabel} />
            </article>
          </div>

          <div className="pillar-grid">
            {data.pillars.map((pillar) => (
              <article className="pillar-card" key={pillar.id}>
                <p className="pillar-id">{pillar.name}</p>
                <h3>{pillar.description}</h3>
                <div className="metric-taglist">
                  {pillar.metrics.map((metric) => (
                    <span key={metric}>{metric}</span>
                  ))}
                </div>
                <p className="pillar-note">{pillar.note}</p>
              </article>
            ))}
          </div>

          <div className="section-actions">
            <a
              className="primary-action"
              href="/methodology"
              onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
            >
              {editorialCopy.methodologyAction}
            </a>
          </div>
        </section>

        {/* ═══════ CITY SPOTLIGHTS ═══════ */}
        <section className="city-spotlights section" id="city-spotlights">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{editorialCopy.spotlightsEyebrow}</p>
              <h2>{editorialCopy.spotlightsTitle}</h2>
            </div>
            <p className="section-summary">{editorialCopy.spotlightsSummary}</p>
          </div>

          <div className="spotlight-grid">
            {data.spotlights.slice(0, 3).map((spotlight) => {
              const localizedSpotlight = spotlightTranslations[locale][spotlight.id];
              return (
                <article className="spotlight-card" key={spotlight.id}>
                  <p className="spotlight-kicker">
                    {localizedSpotlight?.kicker ?? spotlight.kicker}
                  </p>
                  <h3>
                    {spotlight.city}, {spotlight.country}
                  </h3>
                  <p>{localizedSpotlight?.reason ?? spotlight.reason}</p>
                  <div className="metric-taglist">
                    {(localizedSpotlight?.highlights ?? spotlight.highlights).map((highlight) => (
                      <span key={highlight}>{highlight}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <SmartCityFeedPanel locale={locale} />
      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
