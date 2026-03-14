import { useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import { buildLandingData } from "./landingData";
import { rankingRegions } from "./rankingsData";
import RankingIntegrityBanner from "./RankingIntegrityBanner";
import { editorialPhotos, homeSupportPhotos } from "./editorialPhotos";
import { getMethodologyData } from "./methodologyData";
import PillarWeightChart from "./PillarWeightChart";
import { getCopy } from "./siteCopy";
import SiteFooter from "./SiteFooter";
import SmartCityFeedPanel from "./SmartCityFeedPanel";
import type { Locale, SitePath } from "./types";

const data = buildLandingData();

/* ───── pillar config (shared with RankingsPage) ───── */

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

const PILLAR_HINTS: Record<Locale, Record<PillarId, string>> = {
  en: {
    pressure: "Economic dynamism, market forces, affordability as natural outcome",
    viability: "Safety, transit, clean air, climate & sunlight",
    capability: "Healthcare access, education, opportunity",
    community: "Belonging, tolerance, cultural life, birth rate",
    creative: "Innovation, research, entrepreneurship",
  },
  th: {
    pressure: "พลวัตเศรษฐกิจ กลไกตลาด ค่าครองชีพตามกลไก",
    viability: "ความปลอดภัย ขนส่ง อากาศ ภูมิอากาศ",
    capability: "สาธารณสุข การศึกษา โอกาส",
    community: "ความเป็นส่วนหนึ่ง ความอดทน วัฒนธรรม",
    creative: "นวัตกรรม วิจัย ผู้ประกอบการ",
  },
  zh: {
    pressure: "经济活力、市场力量、自然可负担性",
    viability: "安全、交通、空气、气候与日照",
    capability: "医疗、教育、机会",
    community: "归属、包容、文化生活",
    creative: "创新、研究、创业",
  },
};

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

/* Default: equal weights — users start from a neutral position */
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
  intro: string;
  allocatorTitle: string;
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
    eyebrow: "Build your own city ranking",
    title: "SLIC is an index. You decide what matters.",
    strapline: "We built a database of 103 cities across five dimensions of urban life. We don't tell you which city is best — you do. Drag the spider chart, shift your priorities, and watch cities re-rank in real time.",
    intro: "Every city scores on Growth, Viability, Capability, Community, and Creative. By default each dimension weighs equally at 20 points. Move them around — what you value most shapes where you should live.",
    allocatorTitle: "Set your priorities",
    allocatorHint: "Drag the spider web or use the sliders. Total stays at 100.",
    resetLabel: "Reset to equal weights",
    equalBadge: "Equal weights",
    customBadge: "Your priorities",
    equalNote: "Default: 20 / 20 / 20 / 20 / 20 — all dimensions equal",
    consequencesTitle: "Trade-off insights",
    yourScore: "Score",
    citiesLabel: "cities",
    top10: "Top 10",
    top50: "Top 50",
    showAll: "All",
    regionLabel: "Region",
    allRegions: "All",
    seeSlicRanking: "See how SLIC ranks cities",
    seeMethodology: "Read the methodology",
  },
  th: {
    eyebrow: "สร้างอันดับเมืองของคุณเอง",
    title: "SLIC คือดัชนี คุณเลือกเองว่าอะไรสำคัญ",
    strapline: "เราสร้างฐานข้อมูลเมือง 103 เมืองจาก 5 มิติของชีวิตเมือง เราไม่ได้บอกว่าเมืองไหนดีที่สุด — คุณเลือกเอง ลากแผนภูมิใยแมงมุม ปรับลำดับความสำคัญ แล้วดูเมืองจัดอันดับใหม่แบบเรียลไทม์",
    intro: "ทุกเมืองได้คะแนนในด้าน การเติบโต ความน่าอยู่ ศักยภาพ ชุมชน และความสร้างสรรค์ ค่าเริ่มต้นแต่ละด้านเท่ากันที่ 20 คะแนน ย้ายตามใจ — สิ่งที่คุณให้ค่ามากที่สุดจะกำหนดว่าคุณควรอยู่ที่ไหน",
    allocatorTitle: "ตั้งลำดับความสำคัญ",
    allocatorHint: "ลากใยแมงมุมหรือใช้แถบเลื่อน ผลรวมคงที่ที่ 100",
    resetLabel: "รีเซ็ตเป็นน้ำหนักเท่ากัน",
    equalBadge: "น้ำหนักเท่ากัน",
    customBadge: "ลำดับของคุณ",
    equalNote: "ค่าเริ่มต้น: 20 / 20 / 20 / 20 / 20 — ทุกมิติเท่ากัน",
    consequencesTitle: "มุมมองข้อแลกเปลี่ยน",
    yourScore: "คะแนน",
    citiesLabel: "เมือง",
    top10: "10 อันดับ",
    top50: "50 อันดับ",
    showAll: "ทั้งหมด",
    regionLabel: "ภูมิภาค",
    allRegions: "ทั้งหมด",
    seeSlicRanking: "ดูอันดับ SLIC",
    seeMethodology: "อ่านระเบียบวิธี",
  },
  zh: {
    eyebrow: "构建你自己的城市排名",
    title: "SLIC 是一个指数。你来决定什么重要。",
    strapline: "我们建立了一个涵盖 103 座城市、五个城市生活维度的数据库。我们不会告诉你哪座城市最好——你自己来。拖动蛛网图，调整优先级，看城市实时重新排名。",
    intro: "每座城市在增长、宜居、能力、社区和创新五个维度上都有得分。默认每个维度权重相等，各 20 分。随意调整——你最看重什么，就决定了你应该住在哪里。",
    allocatorTitle: "设定你的优先级",
    allocatorHint: "拖动蛛网图或使用滑块，总分保持100。",
    resetLabel: "重置为等权重",
    equalBadge: "等权重",
    customBadge: "你的优先级",
    equalNote: "默认: 20 / 20 / 20 / 20 / 20 — 所有维度平等",
    consequencesTitle: "权衡洞察",
    yourScore: "得分",
    citiesLabel: "城市",
    top10: "前10",
    top50: "前50",
    showAll: "全部",
    regionLabel: "地区",
    allRegions: "全部",
    seeSlicRanking: "查看 SLIC 排名",
    seeMethodology: "阅读方法论",
  },
};

/* ───── severity styles ───── */

const severityStyles: Record<string, React.CSSProperties> = {
  severe: { borderLeft: "4px solid #ef4444", background: "rgba(239,68,68,0.08)", padding: "10px 14px" },
  moderate: { borderLeft: "4px solid #f59e0b", background: "rgba(245,158,11,0.06)", padding: "10px 14px" },
  mild: { borderLeft: "4px solid #3b82f6", background: "rgba(59,130,246,0.06)", padding: "10px 14px" },
};

/* ───── editorial copy for lower sections ───── */

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
      { title: "Outcomes over gadgetry", body: "Technology matters only when it improves the lived city. Sensors and dashboards are tools, not the destination." },
      { title: "Livability over GDP optics", body: "A wealthy city can still fail if housing stress, overwork, or thin community make meaningful life difficult." },
      { title: "Culture is infrastructure too", body: "Belonging, hospitality, variety, and urban character are part of what makes a city resilient and worth choosing." },
    ],
    methodologyTitle: "Five declared pillars on the landing page, full doctrine in the paper.",
    methodologySummary: "The homepage keeps the public story legible. The methodology paper carries the formal score, notation, source hierarchy, and worksheet logic for the full city field.",
    weightLabel: "What the official score actually weighs",
    weightTitle: "Five declared pillars, one fixed public formula.",
    weightSummary: "Growth carries the largest share in the SLIC canonical ranking, followed by viability, capability, community, and creative vitality.",
    methodologySurfaceTitle: "What SLIC is trying to surface",
    methodologySurfaceSummary: "The strongest cities here are not just clean or rich. They are places where people can still afford life, move with confidence, find community, and keep ambition alive without the city draining them dry.",
    methodologyAction: "Enter the full methodology",
    spotlightsEyebrow: "City spotlights",
    spotlightsTitle: "Examples that prove the thesis",
    spotlightsSummary: "The index is designed to surface compelling cities that traditional prestige rankings often flatten or ignore.",
  },
  th: {
    manifestoTitle: "การจัดอันดับที่มองเมืองเป็นที่อยู่อาศัย ไม่ใช่ถ้วยรางวัลสำหรับโชว์",
    manifestoBody: "การจัดอันดับจำนวนมากให้รางวัลกับชื่อเสียง ราคาแพง หรือแบรนด์ของเมือง แต่ SLIC ถามว่าเมืองไหนยังทำให้คนสร้างชีวิต รักษาศักดิ์ศรี รู้สึกปลอดภัย และยังมีพื้นที่ให้ความทะเยอทะยานเติบโตได้โดยไม่ถูกเมืองบดขยี้",
    manifestoFormula: "คุณค่าของเมือง = พื้นที่ชีวิตจริง + ความมั่นใจในชีวิตประจำวัน + ความเปิดกว้างทางสังคม + โอกาสในการเติบโต",
    manifestoDoctrine: [
      { title: "ผลลัพธ์มาก่อนอุปกรณ์", body: "เทคโนโลยีมีความหมายก็ต่อเมื่อทำให้ชีวิตเมืองดีขึ้นจริง เซนเซอร์และแดชบอร์ดเป็นเพียงเครื่องมือ ไม่ใช่จุดหมาย" },
      { title: "คุณภาพชีวิตมาก่อนภาพลวงตา GDP", body: "เมืองที่มั่งคั่งก็ยังล้มเหลวได้ หากค่าที่อยู่อาศัย ความเหนื่อยล้า หรือชุมชนที่บางเกินไปทำให้ชีวิตที่มีความหมายเกิดขึ้นยาก" },
      { title: "วัฒนธรรมก็คือโครงสร้างพื้นฐาน", body: "ความรู้สึกเป็นส่วนหนึ่ง การต้อนรับ ความหลากหลาย และคาแรกเตอร์ของเมือง เป็นส่วนหนึ่งของความยืดหยุ่นและความน่าเลือกของเมือง" },
    ],
    methodologyTitle: "หน้าแรกแสดงห้าเสาหลัก ส่วนหลักการเต็มอยู่ใน methodology paper",
    methodologySummary: "หน้าแรกทำให้เรื่องนี้อ่านง่ายสำหรับสาธารณะ ส่วน methodology paper จะแสดงสมการเต็ม สัญลักษณ์ ลำดับชั้นของแหล่งข้อมูล และตรรกะของตารางคะแนนทั้งชุดเมือง",
    weightLabel: "น้ำหนักที่สูตรทางการใช้จริง",
    weightTitle: "ห้าเสาหลักที่ประกาศชัด และสูตรสาธารณะเพียงสูตรเดียว",
    weightSummary: "ในอันดับ SLIC ทางการ การเติบโตมีน้ำหนักมากที่สุด ตามด้วยความน่าอยู่ ศักยภาพ ชุมชน และพลังสร้างสรรค์",
    methodologySurfaceTitle: "สิ่งที่ SLIC พยายามทำให้มองเห็น",
    methodologySurfaceSummary: "เมืองที่แข็งแรงในดัชนีนี้ไม่ใช่แค่สะอาดหรือรวย แต่เป็นเมืองที่คนยังพอมีชีวิตที่จ่ายไหว เคลื่อนที่ได้อย่างมั่นใจ มีชุมชน และยังรักษาความทะเยอทะยานไว้ได้โดยไม่ถูกเมืองดูดพลังจนหมด",
    methodologyAction: "เข้าสู่ methodology เต็มรูปแบบ",
    spotlightsEyebrow: "ตัวอย่างเมือง",
    spotlightsTitle: "ตัวอย่างที่พิสูจน์สมมติฐาน",
    spotlightsSummary: "ดัชนีนี้ถูกออกแบบมาเพื่อดึงเมืองที่น่าสนใจขึ้นมาให้เห็น แม้อันดับเชิงชื่อเสียงแบบเดิมมักทำให้เมืองเหล่านี้ถูกทำให้แบนหรือถูกมองข้าม",
  },
  zh: {
    manifestoTitle: "把城市当成可以生活的地方，而不是拿来炫耀的奖杯。",
    manifestoBody: "太多城市排名奖赏的是声望、高价与品牌。SLIC 追问的是：一个人能否在这里建立生活、保持尊严、拥有安全感，并在不被城市榨干的情况下继续成长。",
    manifestoFormula: "城市价值 = 真实生活空间 + 日常信心 + 社会开放度 + 生产性机会",
    manifestoDoctrine: [
      { title: "结果优先于炫技", body: "技术只有在改善真实城市生活时才值得计分。传感器和仪表盘只是工具，不是目的。" },
      { title: "宜居性优先于 GDP 表演", body: "一个城市即使富有，也可能因为住房压力、过劳或脆弱的共同体而难以承载有意义的生活。" },
      { title: "文化本身也是基础设施", body: "归属感、好客、多样性与城市个性，本来就是城市韧性与吸引力的一部分。" },
    ],
    methodologyTitle: "首页呈现五个公开支柱，完整方法在论文页展开。",
    methodologySummary: "首页保持公共叙事的清晰度；方法论页面则完整展示分数公式、符号表、来源层级与 100 城评分工作表逻辑。",
    weightLabel: "官方分数到底在权衡什么",
    weightTitle: "五个公开支柱，一条固定的公开公式。",
    weightSummary: "在 SLIC 标准排名中，增长权重最高，其次是宜居、能力、社区和创新活力。",
    methodologySurfaceTitle: "SLIC 想真正显现的东西",
    methodologySurfaceSummary: "这个榜单里的强城，不只是干净或富有，而是那些仍让人负担得起生活、能安心移动、能找到共同体，并且还能保留上升动力的地方。",
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
      reason: "ไทเปแสดงให้เห็นว่าดัชนีนี้มองเกิน GDP เมืองนี้เปลี่ยนความปลอดภัย ระบบขนส่ง มารยาท วัฒนธรรมอาหาร และความเป็นระเบียบในชีวิตประจำวันให้กลายเป็นเมืองที่ไว้ใจได้อย่างแท้จริง",
      highlights: ["ปลอดภัยและสงบ", "ขนส่งดีเยี่ยม", "วัฒนธรรมอาหารเข้มข้น", "สะดวกในชีวิตประจำวัน"],
    },
    bangkok: {
      kicker: "ยุ่งในแบบที่มีชีวิต",
      reason: "กรุงเทพฯ ได้คะแนนเพราะความหลากหลายมีความหมาย ทั้งการต้อนรับ ความยืดหยุ่นของราคา ชีวิตกลางคืน อาหาร และพลังทางสังคม ทำให้เมืองนี้ยังตอบแทนชีวิตได้หลายรูปแบบ",
      highlights: ["หลายระดับราคา", "จังหวะเมือง 24/7", "การต้อนรับสูง", "ความหนาแน่นทางวัฒนธรรม"],
    },
    jeju: {
      kicker: "ชีวิตเกาะที่ยังมีความทรงจำ",
      reason: "เชจูย้ำว่าความน่าอยู่รวมถึงความสงบ ความงาม ประเพณีท้องถิ่น และพื้นที่ให้หายใจ ความสงบนั้นเองก็เป็นสินทรัพย์ทางการแข่งขันได้",
      highlights: ["ชายฝั่งและเส้นทางธรรมชาติ", "แรงกดดันต่ำกว่า", "อัตลักษณ์ท้องถิ่นชัด", "ฐานความปลอดภัยแข็งแรง"],
    },
    busan: {
      kicker: "กล้ามเนื้อเศรษฐกิจในขนาดที่ยังเป็นมนุษย์",
      reason: "ปูซานสะท้อนแกนกลางของดัชนีนี้ คุณสามารถเก็บพลวัต ความแข็งแรงด้านโลจิสติกส์ และความสำคัญระดับมหานครไว้ได้ โดยไม่ทำให้ชีวิตประจำวันกลายเป็นความตึงเครียดตลอดเวลา",
      highlights: ["เศรษฐกิจท่าเรือ", "ความน่าอยู่แบบเมืองชายฝั่ง", "สมดุลดีกว่า", "จังหวะเมืองแข็งแรง"],
    },
    shanghai: {
      kicker: "หลักฐานว่าความมั่งคั่งก็มีต้นทุน",
      reason: "เซี่ยงไฮ้อยู่ในลิสต์นี้เพราะดัชนีไม่ได้โรแมนติกกับความสามารถ มันให้รางวัลกับศักยภาพอันโดดเด่นได้ แต่ก็ยังบันทึกต้นทุนด้าน affordability และแรงกดดันที่ติดมากับความสำเร็จของมหานคร",
      highlights: ["แรงโน้มเศรษฐกิจ", "ระบบขนส่งระดับโลก", "การจัดการเมืองสะอาด", "แรงกดดันด้านที่อยู่อาศัยเพิ่มขึ้น"],
    },
    penang: {
      kicker: "ประวัติศาสตร์ที่อยู่กับวงจรอุตสาหกรรม",
      reason: "ปีนังแสดงให้เห็นว่าเมืองขนาดเล็กกว่าสามารถชนะชื่อดังได้ มรดก อาหาร และความลึกทางอุตสาหกรรมรวมกันเป็นเมืองที่ทั้งมีรากและยังมีชีวิตทางเศรษฐกิจ",
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
      reason: "曼谷得分高，是因为多样性本身就重要。好客、价格弹性、夜生活、食物与社会能量，让这座城市能回报非常不同的人生路径。",
      highlights: ["预算层级多", "24/7 城市节奏", "好客度强", "文化密度高"],
    },
    jeju: {
      kicker: "有记忆的岛屿生活",
      reason: "济州提醒我们，宜居性也包括安静、美感、地方传统与呼吸空间。平静本身也可以是一种竞争优势。",
      highlights: ["海岸与步道", "压力更低", "地方个性强", "安全基线高"],
    },
    busan: {
      kicker: "有经济肌肉，也保有人类尺度",
      reason: "釜山体现了这个指数的核心：一座城市可以保持活力、物流实力与都市重要性，而不必把日常生活变成持续紧绷。",
      highlights: ["港口经济", "滨海宜居性", "平衡更好", "城市节奏强"],
    },
    shanghai: {
      kicker: "繁荣也有边界",
      reason: "上海出现在这里，是因为这个指数并不浪漫化大城市能力。它可以奖励非凡能力，同时也清楚标记超大城市成功附带的可负担性与生活压力成本。",
      highlights: ["经济引力", "世界级交通", "城市管理整洁", "住房压力上升"],
    },
    penang: {
      kicker: "历史与产业线路并存",
      reason: "槟城说明了为什么较小城市也能胜过更有名的名字。遗产、食物与产业深度结合起来，形成一座既有根又有经济生命力的城市。",
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
  const copy = getCopy(locale);
  const methodology = getMethodologyData(locale);
  const editorialCopy = homeEditorialCopy[locale];
  const ui = heroCopy[locale];
  const labels = PILLAR_LABELS[locale];
  const hints = PILLAR_HINTS[locale];

  // Weight allocation state — starts equal
  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({
      id,
      label: labels[id],
      color: PILLAR_COLORS[id],
      value: EQUAL_WEIGHT,
    })),
  );

  // Filters
  const [region, setRegion] = useState<string>("All");
  const [showCountValue, setShowCountValue] = useState<number>(10);

  // Derived state
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
        value: EQUAL_WEIGHT,
      })),
    );
  };

  const pillarIntros: Record<Locale, Array<{ name: string; question: string; color: string }>> = {
    en: [
      { name: "Growth", question: "Can you afford to live here?", color: PILLAR_COLORS.pressure },
      { name: "Viability", question: "Is it safe, clean, and connected?", color: PILLAR_COLORS.viability },
      { name: "Capability", question: "Can you access healthcare and education?", color: PILLAR_COLORS.capability },
      { name: "Community", question: "Will you belong here?", color: PILLAR_COLORS.community },
      { name: "Creative", question: "Can you build something here?", color: PILLAR_COLORS.creative },
    ],
    th: [
      { name: "การเติบโต", question: "คุณจ่ายไหวไหม?", color: PILLAR_COLORS.pressure },
      { name: "ความน่าอยู่", question: "ปลอดภัย สะอาด เดินทางสะดวกไหม?", color: PILLAR_COLORS.viability },
      { name: "ศักยภาพ", question: "เข้าถึงการรักษาและการศึกษาได้ไหม?", color: PILLAR_COLORS.capability },
      { name: "ชุมชน", question: "คุณจะรู้สึกเป็นส่วนหนึ่งไหม?", color: PILLAR_COLORS.community },
      { name: "ความสร้างสรรค์", question: "คุณสร้างอะไรที่นี่ได้ไหม?", color: PILLAR_COLORS.creative },
    ],
    zh: [
      { name: "增长", question: "你住得起吗？", color: PILLAR_COLORS.pressure },
      { name: "宜居", question: "安全、干净、交通便利吗？", color: PILLAR_COLORS.viability },
      { name: "能力", question: "能获得医疗和教育吗？", color: PILLAR_COLORS.capability },
      { name: "社区", question: "你会有归属感吗？", color: PILLAR_COLORS.community },
      { name: "创新", question: "你能在这里创造什么吗？", color: PILLAR_COLORS.creative },
    ],
  };

  return (
    <>
      {/* ═══════ INTRO HERO: Name, thesis, five pillars ═══════ */}
      <header className="hero section">
        <div className="hero-grid" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24 }}>
          <div className="hero-copy" style={{ maxWidth: 720 }}>
            <p className="eyebrow" style={{ fontSize: 12, letterSpacing: "0.14em" }}>
              {locale === "en" ? "Smart and Liveable Cities Index 2026" : locale === "th" ? "ดัชนีเมืองฉลาดและน่าอยู่ 2026" : "智慧与宜居城市指数 2026"}
            </p>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", lineHeight: 1.15, margin: "8px 0 16px" }}>
              {locale === "en"
                ? "What makes a city worth living in?"
                : locale === "th"
                  ? "อะไรทำให้เมืองน่าอยู่?"
                  : "什么让一座城市值得居住？"}
            </h1>
            <p className="hero-strapline" style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.7, maxWidth: 600, margin: "0 auto" }}>
              {locale === "en"
                ? "Not GDP. Not prestige. Not skylines. SLIC measures five dimensions of real urban life across 103 cities. We built the index. You build the ranking."
                : locale === "th"
                  ? "ไม่ใช่ GDP ไม่ใช่ชื่อเสียง ไม่ใช่ตึกสูง SLIC วัด 5 มิติของชีวิตเมืองจริงใน 103 เมือง เราสร้างดัชนี คุณสร้างอันดับ"
                  : "不是 GDP，不是声望，不是天际线。SLIC 衡量 103 座城市真实城市生活的五个维度。我们建立指数，你来构建排名。"}
            </p>
          </div>

          {/* Five pillars as question cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            width: "100%",
            maxWidth: 780,
            marginTop: 8,
          }}>
            {pillarIntros[locale].map((pillar) => (
              <div
                key={pillar.name}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${pillar.color}30`,
                  borderRadius: 10,
                  padding: "16px 14px",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: pillar.color,
                    boxShadow: `0 0 8px ${pillar.color}50`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: pillar.color,
                  }}>
                    {pillar.name}
                  </span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, opacity: 0.65 }}>
                  {pillar.question}
                </p>
              </div>
            ))}
          </div>

          {/* Arrow / scroll cue */}
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <p style={{
              fontSize: 13, fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
              opacity: 0.5,
              margin: 0,
            }}>
              {locale === "en" ? "Now set your priorities" : locale === "th" ? "ตั้งลำดับความสำคัญของคุณ" : "现在设定你的优先级"}
            </p>
            <span style={{ fontSize: 20, opacity: 0.3, lineHeight: 1 }}>&#8595;</span>
          </div>
        </div>
      </header>

      {/* ═══════ WORKBENCH INTRO ═══════ */}
      <section className="rankings-hero section" style={{ paddingTop: 32, paddingBottom: 16 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p className="eyebrow">{ui.eyebrow}</p>
          <h2 className="rankings-title" style={{ fontSize: "clamp(22px, 4vw, 34px)" }}>{ui.title}</h2>
          <p style={{ fontSize: 14, opacity: 0.55, lineHeight: 1.7, marginTop: 8 }}>
            {ui.strapline}
          </p>
          <RankingIntegrityBanner locale={locale} />
        </div>
      </section>

      <main>
        {/* ═══════ WORKBENCH: Spider + City Results ═══════ */}
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

              {/* Equal weights reference */}
              <div className="rankings-canonical-info">
                <div style={{ marginBottom: 6 }}>{ui.equalNote}</div>
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
                  {isCustom ? ui.customBadge : ui.equalBadge}
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
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  className="primary-action"
                  href="/rankings"
                  onClick={(e) => { e.preventDefault(); onNavigate("/rankings"); }}
                >
                  {ui.seeSlicRanking}
                </a>
                <a
                  className="secondary-action"
                  href="/methodology"
                  onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}
                >
                  {ui.seeMethodology}
                </a>
              </div>
            </div>
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

            <div className="methodology-fragment-stack">
              {methodology.equationSection.groups.flatMap((group) => group.equations).slice(0, 3).map((equation) => (
                <article className="methodology-fragment" key={equation.title}>
                  <p className="panel-label">{equation.title}</p>
                  <pre className="formula-display formula-display-compact methodology-fragment-formula">
                    {equation.formula}
                  </pre>
                  <p>{equation.explanation}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="landing-context-grid">
            <article className="paper-card landing-context-card">
              <p className="panel-label">{editorialCopy.methodologySurfaceTitle}</p>
              <h3>{editorialCopy.methodologyTitle}</h3>
              <p>{editorialCopy.methodologySurfaceSummary}</p>
            </article>
            {homeSupportPhotos.map((photo) => (
              <figure className="photo-frame photo-frame-support" key={photo.id}>
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
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

          <div className="spotlight-intro-visual">
            <figure className="photo-frame photo-frame-wide spotlight-hero-photo">
              <img src={editorialPhotos[3]?.src} alt={editorialPhotos[3]?.alt} loading="lazy" />
            </figure>
          </div>

          <div className="spotlight-grid">
            {data.spotlights.map((spotlight) => {
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
