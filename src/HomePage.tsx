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

/* ───── launch section copy ───── */

const LAUNCH_PHOTOS = {
  hero: "/launch-photos/20260318145941_DSC09480.jpg",
  stage: "/launch-photos/20260318145249_ABC01948.jpg",
  slide: "/launch-photos/20260318145319_DSC09441.jpg",
  laptop: "/launch-photos/20260317094731-_DON7077.jpg",
  networking: "/launch-photos/20260318151147_DSC09510.jpg",
};

const launchCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  stats: Array<{ value: string; label: string }>;
  paragraphs: string[];
  pullquote: string;
  photoCaption: string;
}> = {
  en: {
    eyebrow: "The Launch",
    title: "The SLIC Index Launched on the World\u2019s Smartest Stage",
    stats: [
      { value: "174", label: "cities" },
      { value: "53", label: "countries" },
      { value: "3,000+", label: "professionals" },
      { value: "2,250", label: "booths" },
    ],
    paragraphs: [
      "Dr. Non Arkara from Thailand\u2019s Digital Economy Promotion Agency (depa) was one of two keynote speakers at the City Vision stage\u2014the centerpiece of the Smart City Summit & Expo (SCSE) 2026 in Taipei. The Vice President of Taiwan opened the event. The Mayor of Taipei spoke on stage. Foreign ministers and city leaders from around the world gathered under one roof.",
      "He showed them a war dashboard built in 45 minutes\u2014satellite data from NASA mapping real-time conflict zones. A bus tracker for Phuket that runs without GPS. A citizen reporting system that cut response times from 67 hours to 2 hours. Then he launched the SLIC Index. 103 cities. Five dimensions. Kaohsiung: #1. Taipei: #2. Bangkok: #4. Singapore: #8.",
      "The room went quiet. Then the questions started. A European mayor\u2019s alliance asked to use it instead of The Economist\u2019s index. City leaders from across Asia and the Americas came up afterward: \u201CCan you do this for my city?\u201D",
    ],
    pullquote: "\u201CWe built an index. You build the ranking.\u201D",
    photoCaption: "City Vision in Action stage, SCSE 2026, Taipei",
  },
  th: {
    eyebrow: "การเปิดตัว",
    title: "SLIC Index เปิดตัวบนเวทีสมาร์ทซิตี้ที่ใหญ่ที่สุดของโลก",
    stats: [
      { value: "174", label: "เมือง" },
      { value: "53", label: "ประเทศ" },
      { value: "3,000+", label: "ผู้เชี่ยวชาญ" },
      { value: "2,250", label: "บูธ" },
    ],
    paragraphs: [
      "\u0e14\u0e23.\u0e13\u0e13 \u0e2d\u0e32\u0e04\u0e32\u0e23\u0e30 \u0e08\u0e32\u0e01\u0e2a\u0e33\u0e19\u0e31\u0e01\u0e07\u0e32\u0e19\u0e2a\u0e48\u0e07\u0e40\u0e2a\u0e23\u0e34\u0e21\u0e40\u0e28\u0e23\u0e29\u0e10\u0e01\u0e34\u0e08\u0e14\u0e34\u0e08\u0e34\u0e17\u0e31\u0e25 (depa) \u0e40\u0e1b\u0e47\u0e19\u0e2b\u0e19\u0e36\u0e48\u0e07\u0e43\u0e19\u0e2a\u0e2d\u0e07 keynote speaker \u0e1a\u0e19\u0e40\u0e27\u0e17\u0e35 City Vision\u2014\u0e2b\u0e31\u0e27\u0e43\u0e08\u0e02\u0e2d\u0e07\u0e07\u0e32\u0e19 Smart City Summit & Expo (SCSE) 2026 \u0e17\u0e35\u0e48\u0e44\u0e17\u0e40\u0e1b \u0e23\u0e2d\u0e07\u0e1b\u0e23\u0e30\u0e18\u0e32\u0e19\u0e32\u0e18\u0e34\u0e1a\u0e14\u0e35\u0e44\u0e15\u0e49\u0e2b\u0e27\u0e31\u0e19\u0e40\u0e1b\u0e34\u0e14\u0e07\u0e32\u0e19 \u0e1c\u0e39\u0e49\u0e27\u0e48\u0e32\u0e01\u0e23\u0e38\u0e07\u0e44\u0e17\u0e40\u0e1b\u0e02\u0e36\u0e49\u0e19\u0e1e\u0e39\u0e14\u0e1a\u0e19\u0e40\u0e27\u0e17\u0e35 \u0e23\u0e31\u0e10\u0e21\u0e19\u0e15\u0e23\u0e35\u0e41\u0e25\u0e30\u0e1c\u0e39\u0e49\u0e19\u0e33\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e08\u0e32\u0e01\u0e17\u0e31\u0e48\u0e27\u0e42\u0e25\u0e01\u0e21\u0e32\u0e23\u0e27\u0e21\u0e15\u0e31\u0e27\u0e01\u0e31\u0e19",
      "\u0e40\u0e02\u0e32\u0e42\u0e0a\u0e27\u0e4c war dashboard \u0e17\u0e35\u0e48\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e43\u0e19 45 \u0e19\u0e32\u0e17\u0e35 \u0e23\u0e30\u0e1a\u0e1a\u0e15\u0e34\u0e14\u0e15\u0e32\u0e21\u0e23\u0e16\u0e40\u0e21\u0e25\u0e4c\u0e20\u0e39\u0e40\u0e01\u0e47\u0e15\u0e42\u0e14\u0e22\u0e44\u0e21\u0e48\u0e43\u0e0a\u0e49 GPS \u0e23\u0e30\u0e1a\u0e1a\u0e23\u0e49\u0e2d\u0e07\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48\u0e25\u0e14\u0e40\u0e27\u0e25\u0e32\u0e15\u0e2d\u0e1a\u0e2a\u0e19\u0e2d\u0e07\u0e08\u0e32\u0e01 67 \u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07\u0e40\u0e2b\u0e25\u0e37\u0e2d 2 \u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07 \u0e41\u0e25\u0e49\u0e27\u0e40\u0e1b\u0e34\u0e14\u0e15\u0e31\u0e27 SLIC Index \u0e40\u0e01\u0e32\u0e2a\u0e07: #1 \u0e44\u0e17\u0e40\u0e1b: #2 \u0e01\u0e23\u0e38\u0e07\u0e40\u0e17\u0e1e: #4",
      "\u0e2b\u0e49\u0e2d\u0e07\u0e40\u0e07\u0e35\u0e22\u0e1a\u0e25\u0e07 \u0e41\u0e25\u0e49\u0e27\u0e04\u0e33\u0e16\u0e32\u0e21\u0e01\u0e47\u0e40\u0e23\u0e34\u0e48\u0e21 \u0e1e\u0e31\u0e19\u0e18\u0e21\u0e34\u0e15\u0e23\u0e19\u0e32\u0e22\u0e01\u0e40\u0e17\u0e28\u0e21\u0e19\u0e15\u0e23\u0e35\u0e22\u0e38\u0e42\u0e23\u0e1b\u0e02\u0e2d\u0e43\u0e0a\u0e49\u0e41\u0e17\u0e19\u0e14\u0e31\u0e0a\u0e19\u0e35\u0e02\u0e2d\u0e07 The Economist \u0e1c\u0e39\u0e49\u0e19\u0e33\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e08\u0e32\u0e01\u0e40\u0e2d\u0e40\u0e0a\u0e35\u0e22\u0e41\u0e25\u0e30\u0e2d\u0e40\u0e21\u0e23\u0e34\u0e01\u0e32\u0e16\u0e32\u0e21\u0e27\u0e48\u0e32: \u201C\u0e17\u0e33\u0e43\u0e2b\u0e49\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e02\u0e2d\u0e07\u0e40\u0e23\u0e32\u0e44\u0e14\u0e49\u0e44\u0e2b\u0e21?\u201D",
    ],
    pullquote: "\u201C\u0e40\u0e23\u0e32\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e14\u0e31\u0e0a\u0e19\u0e35 \u0e04\u0e38\u0e13\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a\u201D",
    photoCaption: "\u0e40\u0e27\u0e17\u0e35 City Vision in Action, SCSE 2026, \u0e44\u0e17\u0e40\u0e1b",
  },
  zh: {
    eyebrow: "\u53d1\u5e03",
    title: "SLIC \u6307\u6570\u5728\u5168\u7403\u6700\u5927\u667a\u6167\u57ce\u5e02\u821e\u53f0\u4e0a\u53d1\u5e03",
    stats: [
      { value: "174", label: "\u57ce\u5e02" },
      { value: "53", label: "\u56fd\u5bb6" },
      { value: "3,000+", label: "\u4e13\u4e1a\u4eba\u58eb" },
      { value: "2,250", label: "\u5c55\u4f4d" },
    ],
    paragraphs: [
      "\u6765\u81ea\u6cf0\u56fd\u6570\u5b57\u7ecf\u6d4e\u4fc3\u8fdb\u5c40 (depa) \u7684 Non Arkara \u535a\u58eb\u662f City Vision \u821e\u53f0\u7684\u4e24\u4f4d\u4e3b\u9898\u6f14\u8bb2\u8005\u4e4b\u4e00\u2014\u2014\u8fd9\u662f 2026 \u5e74\u53f0\u5317\u667a\u6167\u57ce\u5e02\u5c55\u89c8\u4f1a (SCSE) \u7684\u6838\u5fc3\u821e\u53f0\u3002\u53f0\u6e7e\u526f\u603b\u7edf\u5f00\u5e55\uff0c\u53f0\u5317\u5e02\u957f\u767b\u53f0\u6f14\u8bb2\uff0c\u5404\u56fd\u5916\u4ea4\u90e8\u957f\u548c\u57ce\u5e02\u9886\u5bfc\u4eba\u9f50\u805a\u4e00\u5802\u3002",
      "\u4ed6\u5c55\u793a\u4e8645\u5206\u949f\u5185\u6784\u5efa\u7684\u6218\u4e89\u4eea\u8868\u76d8\u3001\u4e0d\u4f7f\u7528GPS\u7684\u666e\u5409\u5c9b\u516c\u4ea4\u8ffd\u8e2a\u5668\u3001\u5c06\u54cd\u5e94\u65f6\u95f4\u4ece67\u5c0f\u65f6\u7f29\u77ed\u52302\u5c0f\u65f6\u7684\u5e02\u6c11\u62a5\u544a\u7cfb\u7edf\u3002\u7136\u540e\u53d1\u5e03\u4e86 SLIC \u6307\u6570\u3002\u9ad8\u96c4: #1\u3002\u53f0\u5317: #2\u3002\u66fc\u8c37: #4\u3002\u65b0\u52a0\u5761: #8\u3002",
      "\u5168\u573a\u9759\u9ed8\u3002\u7136\u540e\u95ee\u9898\u5f00\u59cb\u4e86\u3002\u6b27\u6d32\u5e02\u957f\u8054\u76df\u8981\u6c42\u7528\u5b83\u66ff\u4ee3\u300a\u7ecf\u6d4e\u5b66\u4eba\u300b\u7684\u6307\u6570\u3002\u4e9a\u6d32\u548c\u7f8e\u6d32\u7684\u57ce\u5e02\u9886\u5bfc\u4eba\u95ee\uff1a\u201c\u80fd\u4e3a\u6211\u7684\u57ce\u5e02\u505a\u8fd9\u4e2a\u5417\uff1f\u201d",
    ],
    pullquote: "\u201c\u6211\u4eec\u5efa\u7acb\u6307\u6570\u3002\u4f60\u6765\u6784\u5efa\u6392\u540d\u3002\u201d",
    photoCaption: "City Vision in Action \u821e\u53f0\uff0cSCSE 2026\uff0c\u53f0\u5317",
  },
};

/* spotlightTranslations removed in V2.1 — spotlights section cut */

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

  /* ── visitor counter + geography (fetched from Google Sheets via Apps Script) ── */
  const [visitors, setVisitors] = useState(12424);
  const [visitorCountries, setVisitorCountries] = useState<Array<{ country: string; pct: number }>>([]);
  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbxq3-DKKX4IuNDQF1SnxCujF1NjBqDlDlSADhc4PdOvpRbi5llSMZHmspkNUc7MVHV99w/exec?action=count", { mode: "cors" })
      .then((r) => r.json())
      .then((d) => {
        if (d.count) setVisitors(d.count);
        if (d.countries) setVisitorCountries(d.countries);
      })
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
            <h1 className="hero-title-v2">
              {ui.title}
            </h1>
            <p className="hero-strapline-v2">
              {ui.strapline}
            </p>

            {/* Visitor counter — thin pill */}
            <div className="visitor-pill">
              <span className="visitor-pill-dot" />
              <span className="visitor-pill-number">{visitors.toLocaleString()}</span>
              <span className="visitor-pill-label">
                {locale === "en" ? "visitors since March 18, 2026" : locale === "th" ? "ผู้เยี่ยมชมตั้งแต่ 18 มีนาคม 2569" : "自2026年3月18日以来的访客"}
              </span>
            </div>
            {visitorCountries.length > 0 && (
              <div className="visitor-geo visitor-geo-v2">
                {visitorCountries.filter((c) => c.country !== "Unknown").slice(0, 6).map((c) => (
                  <span key={c.country} className="visitor-geo-chip">
                    {c.country} <strong>{c.pct}%</strong>
                  </span>
                ))}
              </div>
            )}

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
            <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={420} />
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

        {/* ═══════ THE LAUNCH ═══════ */}
        <section className="launch-section section">
          <p className="eyebrow">{launchCopy[locale].eyebrow}</p>

          <div className="launch-hero-grid">
            <figure className="launch-hero-photo">
              <img src={LAUNCH_PHOTOS.hero} alt={launchCopy[locale].photoCaption} loading="lazy" />
              <figcaption>{launchCopy[locale].photoCaption}</figcaption>
            </figure>

            <div className="launch-hero-text">
              <h2>{launchCopy[locale].title}</h2>
              <p className="launch-inline-stats">
                {launchCopy[locale].stats.map((s, i) => (
                  <span key={s.label}>
                    {i > 0 && " · "}
                    <span className="launch-inline-stat">{s.value}</span> {s.label}
                  </span>
                ))}
              </p>
              <p>{launchCopy[locale].paragraphs[0]}</p>
            </div>
          </div>

          <div className="launch-photo-strip">
            {[LAUNCH_PHOTOS.stage, LAUNCH_PHOTOS.slide, LAUNCH_PHOTOS.laptop, LAUNCH_PHOTOS.networking].map((src) => (
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>

          <div className="launch-narrative">
            {launchCopy[locale].paragraphs.slice(1).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <blockquote className="launch-pullquote">
              {launchCopy[locale].pullquote}
            </blockquote>
          </div>
        </section>

        {/* ═══════ THE THESIS ═══════ */}
        <section className="thesis section" id="methodology">
          <p className="eyebrow">{locale === "en" ? "The thesis" : locale === "th" ? "แก่นความคิด" : "核心论点"}</p>
          <h2 className="thesis-title">{editorialCopy.manifestoTitle}</h2>
          <pre className="manifesto-formula thesis-formula">{editorialCopy.manifestoFormula}</pre>

          <div className="thesis-pillars-strip">
            {data.pillars.map((pillar) => (
              <div className="thesis-pillar" key={pillar.id}>
                <span className="thesis-pillar-dot" style={{ background: PILLAR_COLORS[pillar.id as PillarId] }} />
                <h4>{pillar.name}</h4>
                <p>{pillar.description}</p>
              </div>
            ))}
          </div>

          <PillarWeightChart pillars={methodology.pillars} compact shareLabel={methodology.weightChartLabel} />

          <blockquote className="thesis-doctrine-quote">
            <strong>{editorialCopy.manifestoDoctrine[0].title}</strong>
            <p>{editorialCopy.manifestoDoctrine[0].body}</p>
          </blockquote>

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

      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
