import { useEffect, useMemo, useState } from "react";
import BenchmarkFact from "./BenchmarkFact";
import { buildLandingData } from "./landingData";
import { getRankingsBoard } from "./rankingsData";
import { cityBenchmarks } from "./cityBenchmarks";
import { formatCityTime } from "./cityTimezones";
import { editorialPhotos, homeSupportPhotos } from "./editorialPhotos";
import { getMethodologyData } from "./methodologyData";
import PillarWeightChart from "./PillarWeightChart";
import PulseCluster from "./PulseCluster";
import { getCopy } from "./siteCopy";
import SiteFooter from "./SiteFooter";
import SmartCityFeedPanel from "./SmartCityFeedPanel";
import type { FullRankedCity, Locale, ScoreMode, SignalCard, SitePath } from "./types";

const data = buildLandingData();

const modeLabels: Record<ScoreMode, Record<Locale, string>> = {
  balanced: { en: "Balanced", th: "สมดุล", zh: "综合" },
  physical: { en: "Physical", th: "กายภาพ", zh: "基础条件" },
  economic: { en: "Economic", th: "เศรษฐกิจ", zh: "经济" },
  community: { en: "Community", th: "ชุมชน", zh: "社区" },
  business: { en: "Business", th: "ธุรกิจ", zh: "商业" },
};

const modeDescriptions: Record<ScoreMode, Record<Locale, string>> = {
  balanced: {
    en: "Weighted across physical safety, economic room to live, community tolerance, and business growth.",
    th: "ถ่วงน้ำหนักระหว่างความปลอดภัยเชิงกายภาพ พื้นที่รายได้ใช้สอยจริง ความเปิดกว้างของชุมชน และการเติบโตทางธุรกิจ",
    zh: "综合衡量基础安全、真实可支配生活空间、社区包容度与商业增长条件。",
  },
  physical: {
    en: "Prioritizes safety, ecology, mobility, and daily convenience.",
    th: "เน้นความปลอดภัย นิเวศวิทยา การเดินทาง และความสะดวกในชีวิตประจำวัน",
    zh: "优先考虑安全、生态、流动性与日常便利。",
  },
  economic: {
    en: "Prioritizes affordability, opportunity, and long-term competitiveness.",
    th: "เน้นความสามารถในการจ่าย โอกาส และความสามารถในการแข่งขันระยะยาว",
    zh: "优先考虑可负担性、机会与长期竞争力。",
  },
  community: {
    en: "Prioritizes culture, belonging, tolerance, diversity, and social vitality.",
    th: "เน้นวัฒนธรรม ความรู้สึกเป็นส่วนหนึ่ง ความเปิดกว้าง ความหลากหลาย และพลังทางสังคม",
    zh: "优先考虑文化、归属感、包容度、多样性与社会活力。",
  },
  business: {
    en: "Prioritizes business opening ease, stability, tax competitiveness, and productive momentum.",
    th: "เน้นความง่ายในการเริ่มธุรกิจ เสถียรภาพ ภาษีที่แข่งขันได้ และโมเมนตัมเชิงผลิตภาพ",
    zh: "优先考虑开业便利度、稳定性、税制竞争力与生产性动能。",
  },
};

const homeEditorialCopy: Record<
  Locale,
  {
    runtimeNote: string;
    benchmarkTitle: string;
    benchmarkSummary: string;
    benchmarkEvidenceLabel: string;
    benchmarkEvidence: Array<{
      title: string;
      body: string;
    }>;
    manifestoTitle: string;
    manifestoBody: string;
    manifestoFormula: string;
    manifestoDoctrine: Array<{
      title: string;
      body: string;
    }>;
    methodologyTitle: string;
    methodologySummary: string;
    weightLabel: string;
    weightTitle: string;
    weightSummary: string;
    methodologySurfaceTitle: string;
    methodologySurfaceSummary: string;
    methodologyAction: string;
    trackingSummary: string;
    citiesLabel: string;
    signalsLabel: string;
    sourcesLabel: string;
    spotlightsEyebrow: string;
    spotlightsTitle: string;
    spotlightsSummary: string;
  }
> = {
  en: {
    runtimeNote:
      "Most city rankings publish once a year. SLIC is designed as a continuously updating board, with live attention, news, and city-condition signals feeding the same public framework.",
    benchmarkTitle: "Visitor pull matters, but only after the city still works for residents.",
    benchmarkSummary:
      "SLIC treats tourism demand as one live layer inside a broader city equation. Attraction, crowding, affordability, civic confidence, and everyday quality all have to be judged together.",
    benchmarkEvidenceLabel: "How the benchmark is read",
    benchmarkEvidence: [
      {
        title: "Attraction signal",
        body: "High demand shows that a city is visible and desirable, but it does not give a free pass on safety, dignity, or cost.",
      },
      {
        title: "Resident-room check",
        body: "Heavy visitor flow gets discounted when rent, congestion, or extraction start to destroy local room to live.",
      },
      {
        title: "Cultural-demand cross-check",
        body: "SLIC keeps visitor pull only when it survives affordability, ecology, and public-order checks at the same time.",
      },
    ],
    manifestoTitle: "A ranking that treats cities as places to live, not trophies to display.",
    manifestoBody:
      "Too many city rankings reward prestige, cost, or brand power. SLIC asks where a person can still build a life, keep dignity, feel safe, and find some ambition without being crushed by the city itself.",
    manifestoFormula:
      "City value = real room to live + daily confidence + social openness + productive possibility",
    manifestoDoctrine: [
      {
        title: "Outcomes over gadgetry",
        body: "Technology matters only when it improves the lived city. Sensors and dashboards are tools, not the destination.",
      },
      {
        title: "Livability over GDP optics",
        body: "A wealthy city can still fail if housing stress, overwork, or thin community make meaningful life difficult.",
      },
      {
        title: "Culture is infrastructure too",
        body: "Belonging, hospitality, variety, and urban character are part of what makes a city resilient and worth choosing.",
      },
    ],
    methodologyTitle: "Five declared pillars on the landing page, full doctrine in the paper.",
    methodologySummary:
      "The homepage keeps the public story legible. The methodology paper carries the formal score, notation, source hierarchy, and worksheet logic for the 100-city field.",
    weightLabel: "What the official score actually weighs",
    weightTitle: "Five declared pillars, one fixed public formula.",
    weightSummary:
      "Pressure and affordability lead the score, but safety, capability, community, and business vitality remain visible in the final ranking.",
    methodologySurfaceTitle: "What SLIC is trying to surface",
    methodologySurfaceSummary:
      "The strongest cities here are not just clean or rich. They are places where people can still afford life, move with confidence, find community, and keep ambition alive without the city draining them dry.",
    methodologyAction: "Enter the full methodology",
    trackingSummary: "Tracking summary",
    citiesLabel: "cities",
    signalsLabel: "signals",
    sourcesLabel: "sources",
    spotlightsEyebrow: "City spotlights",
    spotlightsTitle: "Examples that prove the thesis",
    spotlightsSummary:
      "The index is designed to surface compelling cities that traditional prestige rankings often flatten or ignore.",
  },
  th: {
    runtimeNote:
      "การจัดอันดับเมืองส่วนใหญ่ออกปีละครั้ง แต่ SLIC ถูกออกแบบให้เป็นบอร์ดที่อัปเดตต่อเนื่อง โดยมีสัญญาณสด ข่าว และภาวะของเมืองไหลเข้าสู่กรอบเดียวกันตลอดเวลา",
    benchmarkTitle: "แรงดึงดูดของผู้มาเยือนมีความหมาย ก็ต่อเมื่อเมืองยังทำงานได้ดีสำหรับคนที่อยู่จริง",
    benchmarkSummary:
      "SLIC มองดีมานด์จากการท่องเที่ยวเป็นเพียงชั้นข้อมูลหนึ่งในสมการเมืองที่กว้างกว่า ทั้งแรงดึงดูด ความแออัด ความสามารถในการจ่าย ความมั่นใจเชิงสาธารณะ และคุณภาพชีวิตประจำวันต้องถูกพิจารณาพร้อมกัน",
    benchmarkEvidenceLabel: "วิธีอ่านบล็อกเปรียบเทียบนี้",
    benchmarkEvidence: [
      {
        title: "สัญญาณของแรงดึงดูด",
        body: "ความต้องการสูงสะท้อนว่าเมืองมีความน่าสนใจ แต่ไม่ได้ทำให้ผ่านเรื่องความปลอดภัย ศักดิ์ศรี หรือค่าครองชีพโดยอัตโนมัติ",
      },
      {
        title: "เช็กพื้นที่ของคนเมือง",
        body: "ถ้านักท่องเที่ยวมากจนค่าเช่า การจราจร หรือแรงกดดันทำลายชีวิตคนท้องถิ่น คะแนนจะถูกหัก ไม่ใช่เฉลิมฉลอง",
      },
      {
        title: "เช็กกับวัฒนธรรมจริง",
        body: "SLIC จะเก็บแรงดึงดูดไว้ก็ต่อเมื่อผ่านการทดสอบด้าน affordability นิเวศวิทยา และความสงบเรียบร้อยสาธารณะพร้อมกัน",
      },
    ],
    manifestoTitle: "การจัดอันดับที่มองเมืองเป็นที่อยู่อาศัย ไม่ใช่ถ้วยรางวัลสำหรับโชว์",
    manifestoBody:
      "การจัดอันดับจำนวนมากให้รางวัลกับชื่อเสียง ราคาแพง หรือแบรนด์ของเมือง แต่ SLIC ถามว่าเมืองไหนยังทำให้คนสร้างชีวิต รักษาศักดิ์ศรี รู้สึกปลอดภัย และยังมีพื้นที่ให้ความทะเยอทะยานเติบโตได้โดยไม่ถูกเมืองบดขยี้",
    manifestoFormula:
      "คุณค่าของเมือง = พื้นที่ชีวิตจริง + ความมั่นใจในชีวิตประจำวัน + ความเปิดกว้างทางสังคม + โอกาสในการเติบโต",
    manifestoDoctrine: [
      {
        title: "ผลลัพธ์มาก่อนอุปกรณ์",
        body: "เทคโนโลยีมีความหมายก็ต่อเมื่อทำให้ชีวิตเมืองดีขึ้นจริง เซนเซอร์และแดชบอร์ดเป็นเพียงเครื่องมือ ไม่ใช่จุดหมาย",
      },
      {
        title: "คุณภาพชีวิตมาก่อนภาพลวงตา GDP",
        body: "เมืองที่มั่งคั่งก็ยังล้มเหลวได้ หากค่าที่อยู่อาศัย ความเหนื่อยล้า หรือชุมชนที่บางเกินไปทำให้ชีวิตที่มีความหมายเกิดขึ้นยาก",
      },
      {
        title: "วัฒนธรรมก็คือโครงสร้างพื้นฐาน",
        body: "ความรู้สึกเป็นส่วนหนึ่ง การต้อนรับ ความหลากหลาย และคาแรกเตอร์ของเมือง เป็นส่วนหนึ่งของความยืดหยุ่นและความน่าเลือกของเมือง",
      },
    ],
    methodologyTitle: "หน้าแรกแสดงห้าเสาหลัก ส่วนหลักการเต็มอยู่ใน methodology paper",
    methodologySummary:
      "หน้าแรกทำให้เรื่องนี้อ่านง่ายสำหรับสาธารณะ ส่วน methodology paper จะแสดงสมการเต็ม สัญลักษณ์ ลำดับชั้นของแหล่งข้อมูล และตรรกะของตารางคะแนน 100 เมือง",
    weightLabel: "น้ำหนักที่สูตรทางการใช้จริง",
    weightTitle: "ห้าเสาหลักที่ประกาศชัด และสูตรสาธารณะเพียงสูตรเดียว",
    weightSummary:
      "แรงกดดันและความสามารถในการจ่ายมีน้ำหนักมาก แต่ความปลอดภัย ศักยภาพมนุษย์ ชุมชน และพลังธุรกิจก็ยังปรากฏชัดในอันดับสุดท้าย",
    methodologySurfaceTitle: "สิ่งที่ SLIC พยายามทำให้มองเห็น",
    methodologySurfaceSummary:
      "เมืองที่แข็งแรงในดัชนีนี้ไม่ใช่แค่สะอาดหรือรวย แต่เป็นเมืองที่คนยังพอมีชีวิตที่จ่ายไหว เคลื่อนที่ได้อย่างมั่นใจ มีชุมชน และยังรักษาความทะเยอทะยานไว้ได้โดยไม่ถูกเมืองดูดพลังจนหมด",
    methodologyAction: "เข้าสู่ methodology เต็มรูปแบบ",
    trackingSummary: "สรุปการติดตาม",
    citiesLabel: "เมือง",
    signalsLabel: "สัญญาณ",
    sourcesLabel: "แหล่งข้อมูล",
    spotlightsEyebrow: "ตัวอย่างเมือง",
    spotlightsTitle: "ตัวอย่างที่พิสูจน์สมมติฐาน",
    spotlightsSummary:
      "ดัชนีนี้ถูกออกแบบมาเพื่อดึงเมืองที่น่าสนใจขึ้นมาให้เห็น แม้อันดับเชิงชื่อเสียงแบบเดิมมักทำให้เมืองเหล่านี้ถูกทำให้แบนหรือถูกมองข้าม",
  },
  zh: {
    runtimeNote:
      "大多数城市排名一年只发布一次。SLIC 被设计成持续更新的公开板块，让实时注意力、新闻与城市状态信号不断回流到同一套方法中。",
    benchmarkTitle: "到访热度只有在城市仍然适合居民生活时才有意义。",
    benchmarkSummary:
      "SLIC 把旅游与城市关注度视为更大城市方程式中的一层信号。吸引力、拥挤度、可负担性、公共秩序与日常生活质量必须一起判断。",
    benchmarkEvidenceLabel: "这组基准如何被解读",
    benchmarkEvidence: [
      {
        title: "吸引力信号",
        body: "高到访量说明城市可见且有吸引力，但并不能自动豁免安全、尊严或生活成本问题。",
      },
      {
        title: "居民生活空间检查",
        body: "如果游客压力开始推高房租、制造拥堵、压缩本地人的生活空间，热度会被扣分而不是被歌颂。",
      },
      {
        title: "文化需求交叉验证",
        body: "只有同时通过可负担性、生态与公共秩序检验的到访热度，才会被 SLIC 保留下来。",
      },
    ],
    manifestoTitle: "把城市当成可以生活的地方，而不是拿来炫耀的奖杯。",
    manifestoBody:
      "太多城市排名奖赏的是声望、高价与品牌。SLIC 追问的是：一个人能否在这里建立生活、保持尊严、拥有安全感，并在不被城市榨干的情况下继续成长。",
    manifestoFormula:
      "城市价值 = 真实生活空间 + 日常信心 + 社会开放度 + 生产性机会",
    manifestoDoctrine: [
      {
        title: "结果优先于炫技",
        body: "技术只有在改善真实城市生活时才值得计分。传感器和仪表盘只是工具，不是目的。",
      },
      {
        title: "宜居性优先于 GDP 表演",
        body: "一个城市即使富有，也可能因为住房压力、过劳或脆弱的共同体而难以承载有意义的生活。",
      },
      {
        title: "文化本身也是基础设施",
        body: "归属感、好客、多样性与城市个性，本来就是城市韧性与吸引力的一部分。",
      },
    ],
    methodologyTitle: "首页呈现五个公开支柱，完整方法在论文页展开。",
    methodologySummary:
      "首页保持公共叙事的清晰度；方法论页面则完整展示分数公式、符号表、来源层级与 100 城评分工作表逻辑。",
    weightLabel: "官方分数到底在权衡什么",
    weightTitle: "五个公开支柱，一条固定的公开公式。",
    weightSummary:
      "压力与可负担性占比较高，但安全、能力、共同体与商业活力同样在最终排名中清晰可见。",
    methodologySurfaceTitle: "SLIC 想真正显现的东西",
    methodologySurfaceSummary:
      "这个榜单里的强城，不只是干净或富有，而是那些仍让人负担得起生活、能安心移动、能找到共同体，并且还能保留上升动力的地方。",
    methodologyAction: "进入完整方法论",
    trackingSummary: "追踪摘要",
    citiesLabel: "城市",
    signalsLabel: "信号",
    sourcesLabel: "来源",
    spotlightsEyebrow: "城市样本",
    spotlightsTitle: "能够证明这套判断的例子",
    spotlightsSummary:
      "这个指数本来就是为了把那些有说服力的城市显出来，即使传统声望排名常常会把它们压平或忽略。",
  },
};

const spotlightTranslations: Record<
  Locale,
  Record<
    string,
    {
      kicker: string;
      reason: string;
      highlights: string[];
    }
  >
> = {
  en: {},
  th: {
    taipei: {
      kicker: "แม่นยำโดยไม่เย็นชา",
      reason:
        "ไทเปแสดงให้เห็นว่าดัชนีนี้มองเกิน GDP เมืองนี้เปลี่ยนความปลอดภัย ระบบขนส่ง มารยาท วัฒนธรรมอาหาร และความเป็นระเบียบในชีวิตประจำวันให้กลายเป็นเมืองที่ไว้ใจได้อย่างแท้จริง",
      highlights: ["ปลอดภัยและสงบ", "ขนส่งดีเยี่ยม", "วัฒนธรรมอาหารเข้มข้น", "สะดวกในชีวิตประจำวัน"],
    },
    bangkok: {
      kicker: "ยุ่งในแบบที่มีชีวิต",
      reason:
        "กรุงเทพฯ ได้คะแนนเพราะความหลากหลายมีความหมาย ทั้งการต้อนรับ ความยืดหยุ่นของราคา ชีวิตกลางคืน อาหาร และพลังทางสังคม ทำให้เมืองนี้ยังตอบแทนชีวิตได้หลายรูปแบบ",
      highlights: ["หลายระดับราคา", "จังหวะเมือง 24/7", "การต้อนรับสูง", "ความหนาแน่นทางวัฒนธรรม"],
    },
    jeju: {
      kicker: "ชีวิตเกาะที่ยังมีความทรงจำ",
      reason:
        "เชจูย้ำว่าความน่าอยู่รวมถึงความสงบ ความงาม ประเพณีท้องถิ่น และพื้นที่ให้หายใจ ความสงบนั้นเองก็เป็นสินทรัพย์ทางการแข่งขันได้",
      highlights: ["ชายฝั่งและเส้นทางธรรมชาติ", "แรงกดดันต่ำกว่า", "อัตลักษณ์ท้องถิ่นชัด", "ฐานความปลอดภัยแข็งแรง"],
    },
    busan: {
      kicker: "กล้ามเนื้อเศรษฐกิจในขนาดที่ยังเป็นมนุษย์",
      reason:
        "ปูซานสะท้อนแกนกลางของดัชนีนี้ คุณสามารถเก็บพลวัต ความแข็งแรงด้านโลจิสติกส์ และความสำคัญระดับมหานครไว้ได้ โดยไม่ทำให้ชีวิตประจำวันกลายเป็นความตึงเครียดตลอดเวลา",
      highlights: ["เศรษฐกิจท่าเรือ", "ความน่าอยู่แบบเมืองชายฝั่ง", "สมดุลดีกว่า", "จังหวะเมืองแข็งแรง"],
    },
    shanghai: {
      kicker: "หลักฐานว่าความมั่งคั่งก็มีต้นทุน",
      reason:
        "เซี่ยงไฮ้อยู่ในลิสต์นี้เพราะดัชนีไม่ได้โรแมนติกกับความสามารถ มันให้รางวัลกับศักยภาพอันโดดเด่นได้ แต่ก็ยังบันทึกต้นทุนด้าน affordability และแรงกดดันที่ติดมากับความสำเร็จของมหานคร",
      highlights: ["แรงโน้มเศรษฐกิจ", "ระบบขนส่งระดับโลก", "การจัดการเมืองสะอาด", "แรงกดดันด้านที่อยู่อาศัยเพิ่มขึ้น"],
    },
    penang: {
      kicker: "ประวัติศาสตร์ที่อยู่กับวงจรอุตสาหกรรม",
      reason:
        "ปีนังแสดงให้เห็นว่าเมืองขนาดเล็กกว่าสามารถชนะชื่อดังได้ มรดก อาหาร และความลึกทางอุตสาหกรรมรวมกันเป็นเมืองที่ทั้งมีรากและยังมีชีวิตทางเศรษฐกิจ",
      highlights: ["ถนนมรดก", "เมืองอาหาร", "เครือข่ายเซมิคอนดักเตอร์", "ขนาดที่ยังอยู่สบาย"],
    },
  },
  zh: {
    taipei: {
      kicker: "精密但不冰冷",
      reason:
        "台北说明了为什么这个指数要超越 GDP。它把安全、交通、礼貌、饮食文化与日常秩序组合成一座真正值得信任的城市。",
      highlights: ["安全安静", "交通极强", "饮食文化深", "日常便利高"],
    },
    bangkok: {
      kicker: "最好的那种复杂与热闹",
      reason:
        "曼谷得分高，是因为多样性本身就重要。好客、价格弹性、夜生活、食物与社会能量，让这座城市能回报非常不同的人生路径。",
      highlights: ["预算层级多", "24/7 城市节奏", "好客度强", "文化密度高"],
    },
    jeju: {
      kicker: "有记忆的岛屿生活",
      reason:
        "济州提醒我们，宜居性也包括安静、美感、地方传统与呼吸空间。平静本身也可以是一种竞争优势。",
      highlights: ["海岸与步道", "压力更低", "地方个性强", "安全基线高"],
    },
    busan: {
      kicker: "有经济肌肉，也保有人类尺度",
      reason:
        "釜山体现了这个指数的核心：一座城市可以保持活力、物流实力与都市重要性，而不必把日常生活变成持续紧绷。",
      highlights: ["港口经济", "滨海宜居性", "平衡更好", "城市节奏强"],
    },
    shanghai: {
      kicker: "繁荣也有边界",
      reason:
        "上海出现在这里，是因为这个指数并不浪漫化大城市能力。它可以奖励非凡能力，同时也清楚标记超大城市成功附带的可负担性与生活压力成本。",
      highlights: ["经济引力", "世界级交通", "城市管理整洁", "住房压力上升"],
    },
    penang: {
      kicker: "历史与产业线路并存",
      reason:
        "槟城说明了为什么较小城市也能胜过更有名的名字。遗产、食物与产业深度结合起来，形成一座既有根又有经济生命力的城市。",
      highlights: ["遗产街区", "美食之城", "半导体链条", "宜居尺度"],
    },
  },
};

const homeSectionCopy: Record<
  Locale,
  {
    heroEyebrow: string;
    heroTitle: string;
    heroStrapline: string;
    heroIntro: string;
    leaderboardTitle: string;
    benchmarkEyebrow: string;
    fieldNotesEyebrow: string;
    fieldNotesTitle: string;
    fieldNotesSummary: string;
    signalEyebrow: string;
    signalTitle: string;
    indexEyebrow: string;
    indexTitle: string;
    modeSurfaceLabel: string;
    leadsOn: string;
    modelPulseLabel: string;
    modelPulseBody: string;
    methodologyDepthLabel: string;
    methodologyDepthBody: string;
    methodologyDepthAction: string;
    manifestoEyebrow: string;
    methodologyEyebrow: string;
  }
> = {
  en: {
    heroEyebrow: "Beyond prestige metrics",
    heroTitle: "Smart and Liveable Cities Index",
    heroStrapline: "A ranking for cities that expand human possibility, not just headline wealth or polished prestige.",
    heroIntro:
      "SLIC is an AI-assisted city dashboard and ranking system. It combines official baselines, data-quality checks, real affordability logic, and social sentiment analysis so cities can move up or down as conditions, attention, and lived urban signals change.",
    leaderboardTitle: "Current leaderboard",
    benchmarkEyebrow: "Benchmark signals",
    fieldNotesEyebrow: "Urban field notes",
    fieldNotesTitle: "Real people, real streets, real urban tradeoffs.",
    fieldNotesSummary:
      "This index is built for cities as they are actually lived: moving bodies, visible infrastructure, social texture, and the difference between prestige and a life that still has room to breathe.",
    signalEyebrow: "Live signal ribbon",
    signalTitle: "Signals moving underneath the ranking",
    indexEyebrow: "Interactive index board",
    indexTitle: "Rank cities by the life they make possible",
    modeSurfaceLabel: "What this mode surfaces",
    leadsOn: "leads on",
    modelPulseLabel: "Model pulse",
    modelPulseBody:
      "The public board is designed to show movement without becoming noisy: outcome-led scoring, live signals, and visible tradeoffs.",
    methodologyDepthLabel: "Methodology depth",
    methodologyDepthBody:
      "The companion methodology page carries the formal SLIC equation, justification, source hierarchy, and the city scoring worksheet schema.",
    methodologyDepthAction: "Open the methodology paper",
    manifestoEyebrow: "Why this exists",
    methodologyEyebrow: "Methodology snapshot",
  },
  th: {
    heroEyebrow: "เหนือกว่าตัวชี้วัดเชิงชื่อเสียง",
    heroTitle: "Smart and Liveable Cities Index",
    heroStrapline: "การจัดอันดับสำหรับเมืองที่ขยายความเป็นไปได้ของมนุษย์ ไม่ใช่แค่ความมั่งคั่งพาดหัวข่าวหรือภาพลักษณ์ที่ขัดเงา",
    heroIntro:
      "SLIC คือแดชบอร์ดและระบบจัดอันดับเมืองที่มี AI ช่วยทำงาน โดยผสานข้อมูลทางการ การตรวจคุณภาพข้อมูล ตรรกะ affordability จริง และการวิเคราะห์ sentiment ทางสังคม เพื่อให้เมืองสามารถขึ้นหรือลงได้ตามสภาพจริง ความสนใจ และสัญญาณชีวิตเมืองที่เปลี่ยนไป",
    leaderboardTitle: "กระดานอันดับล่าสุด",
    benchmarkEyebrow: "สัญญาณเปรียบเทียบ",
    fieldNotesEyebrow: "บันทึกภาคสนามของเมือง",
    fieldNotesTitle: "ผู้คนจริง ถนนจริง และการแลกเปลี่ยนของเมืองจริง",
    fieldNotesSummary:
      "ดัชนีนี้ถูกสร้างขึ้นจากวิธีที่ผู้คนใช้ชีวิตอยู่ในเมืองจริง ทั้งการเคลื่อนไหว โครงสร้างพื้นฐานที่มองเห็นได้ เนื้อสัมผัสทางสังคม และความต่างระหว่างชื่อเสียงกับชีวิตที่ยังมีพื้นที่ให้หายใจ",
    signalEyebrow: "ริบบอนสัญญาณสด",
    signalTitle: "สัญญาณที่กำลังขยับอยู่ใต้กระดานอันดับ",
    indexEyebrow: "กระดานดัชนีแบบโต้ตอบ",
    indexTitle: "จัดอันดับเมืองตามชีวิตที่เมืองทำให้เป็นไปได้",
    modeSurfaceLabel: "โหมดนี้กำลังทำให้เห็นอะไร",
    leadsOn: "เด่นในด้าน",
    modelPulseLabel: "ชีพจรของโมเดล",
    modelPulseBody:
      "บอร์ดสาธารณะถูกออกแบบให้แสดงการเคลื่อนไหวโดยไม่กลายเป็นความวุ่นวาย: คะแนนที่ยึดผลลัพธ์ สัญญาณสด และ tradeoff ที่มองเห็นได้",
    methodologyDepthLabel: "ความลึกของระเบียบวิธี",
    methodologyDepthBody:
      "หน้า methodology companion จะอธิบายสมการ SLIC อย่างเป็นทางการ เหตุผลเชิงวิธีวิทยา ลำดับชั้นของแหล่งข้อมูล และโครงสร้างตารางคะแนนเมือง",
    methodologyDepthAction: "เปิด methodology paper",
    manifestoEyebrow: "เหตุผลที่สิ่งนี้ต้องมี",
    methodologyEyebrow: "ภาพรวมระเบียบวิธี",
  },
  zh: {
    heroEyebrow: "超越声望指标",
    heroTitle: "Smart and Liveable Cities Index",
    heroStrapline: "这是一份为能够扩展人类可能性的城市而设的排名，而不只是奖赏 headline wealth 与 polished prestige。",
    heroIntro:
      "SLIC 是一套由 AI 辅助的城市仪表板与排名系统。它把官方基线、数据质量校验、真实可负担性逻辑与社会情绪分析放进同一框架，让城市能随着条件、注意力与真实城市信号变化而上升或下降。",
    leaderboardTitle: "当前榜单",
    benchmarkEyebrow: "基准信号",
    fieldNotesEyebrow: "城市现场笔记",
    fieldNotesTitle: "真实的人，真实的街道，真实的城市权衡。",
    fieldNotesSummary:
      "这个指数建立在城市被真实生活出来的方式之上：身体如何移动、基础设施是否可感、社会肌理是否存在，以及声望与真正还能呼吸的生活之间的差别。",
    signalEyebrow: "实时信号带",
    signalTitle: "在榜单下方持续流动的信号",
    indexEyebrow: "交互式指数板",
    indexTitle: "按城市能让生活成为什么样来排序",
    modeSurfaceLabel: "这个模式正在显现什么",
    leadsOn: "当前领先于",
    modelPulseLabel: "模型脉冲",
    modelPulseBody:
      "公开榜单被设计成能显示变化，但不制造噪音：结果导向评分、实时信号，以及可见的权衡。",
    methodologyDepthLabel: "方法深度",
    methodologyDepthBody:
      "配套的方法论页面会完整说明 SLIC 公式、理由、来源层级，以及城市评分工作表结构。",
    methodologyDepthAction: "打开方法论论文",
    manifestoEyebrow: "为什么它必须存在",
    methodologyEyebrow: "方法论快照",
  },
};

const pulseLabels: Record<Locale, string[]> = {
  en: ["Phy", "Eco", "Com", "Biz", "Safe", "Tol", "Delta", "Live"],
  th: ["กาย", "ศก", "ชุม", "ธุร", "ปลอ", "เปิด", "เดล", "สด"],
  zh: ["基", "经", "社", "商", "安", "容", "变", "实"],
};

function formatDelta(delta: number): string {
  if (delta > 0) {
    return `+${delta}`;
  }

  if (delta < 0) {
    return `${delta}`;
  }

  return "0";
}

function formatUpdated(dateString: string, locale: Locale): string {
  const parsed = new Date(dateString);

  if (Number.isNaN(parsed.getTime())) {
    return dateString;
  }

  const language = locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US";

  return new Intl.DateTimeFormat(language, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function trendClass(signal: SignalCard): string {
  if (signal.trend === "up") {
    return "trend trend-up";
  }

  if (signal.trend === "down") {
    return "trend trend-down";
  }

  return "trend trend-steady";
}

function scoreWidth(score: number): string {
  const clamped = Math.min(Math.max(score, 0), 100);
  return `${clamped}%`;
}

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
  const sectionCopy = homeSectionCopy[locale];
  const [mode, setMode] = useState<ScoreMode>("balanced");
  const [now, setNow] = useState(() => new Date());
  const benchmarks = cityBenchmarks[locale];
  const formulaSnippets = methodology.equationSection.groups.flatMap((group) => group.equations).slice(0, 3);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const rankings = useMemo(
    () => getRankingsBoard({ mode, region: "All", scope: "core" }).slice(0, 10),
    [mode],
  );

  const leader = rankings[0];
  const heroRankings = rankings.slice(0, 10);
  const tickerSignals = [...data.signals, ...data.signals];

  return (
    <>
      <header className="hero section">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{sectionCopy.heroEyebrow}</p>
            <h1>{sectionCopy.heroTitle}</h1>
            <p className="hero-strapline">{sectionCopy.heroStrapline}</p>
            <p className="hero-intro">{sectionCopy.heroIntro}</p>
            <p className="hero-runtime-note">{editorialCopy.runtimeNote}</p>

            <div className="hero-actions">
              <a
                className="primary-action"
                href="/rankings"
                onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
              >
                {copy.nav.rankings}
              </a>
              <a
                className="secondary-action"
                href="/methodology"
                onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
              >
                {copy.nav.methodology}
              </a>
            </div>

            <div className="hero-stats" aria-label={editorialCopy.trackingSummary}>
              <article>
                <span>{editorialCopy.citiesLabel}</span>
                <strong>{data.meta.citiesTracked}</strong>
              </article>
              <article>
                <span>{editorialCopy.signalsLabel}</span>
                <strong>{data.meta.signalsTracked}</strong>
              </article>
              <article>
                <span>{editorialCopy.sourcesLabel}</span>
                <strong>{data.meta.sourcesConnected}</strong>
              </article>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="hero-ranking-card">
              <div className="hero-ranking-head">
                <div>
                  <p className="panel-label">{copy.shared.liveTop10}</p>
                  <h2>{sectionCopy.leaderboardTitle}</h2>
                  <p className="hero-ranking-summary">{modeDescriptions[mode][locale]}</p>
                </div>
                <p className="updated-note">
                  {copy.shared.updated} {formatUpdated(data.meta.lastUpdated, locale)}
                </p>
              </div>

              <ModeSwitch mode={mode} locale={locale} onChange={setMode} />

              <div className="hero-ranking-list" aria-live="polite">
                {heroRankings.map((city, index) => {
                  const localTime = formatCityTime(now, city.name, locale);

                  return (
                    <article
                      className={index === 0 ? "hero-ranking-row hero-ranking-row-active" : "hero-ranking-row"}
                      key={city.id}
                    >
                      <span className="hero-ranking-rank">{String(index + 1).padStart(2, "0")}</span>
                      <div className="hero-ranking-city">
                        <strong>{city.name}</strong>
                        <span>
                          {city.country} / {city.region}
                        </span>
                        {localTime ? <small>{copy.shared.localTime} {localTime}</small> : null}
                      </div>
                      <div className="hero-ranking-score">
                        <strong>{city.scores[mode]}</strong>
                        <span>{formatDelta(city.delta)}</span>
                      </div>
                    </article>
                  );
                })}
              </div>

              <a
                className="inline-page-link"
                href="/rankings"
                onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
              >
                {copy.shared.openFullRanking}
              </a>
            </div>
          </aside>
        </div>
      </header>

      <section className="benchmark-strip section" aria-label="Benchmark city signals">
        <div className="benchmark-layout">
          <div className="benchmark-stack">
            {benchmarks.map((benchmark) => (
              <BenchmarkFact
                key={benchmark.id}
                label={benchmark.label}
                city={benchmark.city}
                value={benchmark.value}
                note={benchmark.note}
                source={benchmark.source}
              />
            ))}
          </div>

          <div className="benchmark-editorial">
            <div className="benchmark-copy">
              <p className="eyebrow">{sectionCopy.benchmarkEyebrow}</p>
              <h2>{editorialCopy.benchmarkTitle}</h2>
              <p className="section-summary">{editorialCopy.benchmarkSummary}</p>
            </div>

            <div className="benchmark-evidence-card">
              <p className="panel-label">{editorialCopy.benchmarkEvidenceLabel}</p>
              <div className="benchmark-evidence-list" aria-label="Benchmark checks">
                {editorialCopy.benchmarkEvidence.map((item, index) => (
                  <article key={item.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="field-ledger section" aria-label="Urban field notes">
        <div className="field-ledger-copy">
          <p className="eyebrow">{sectionCopy.fieldNotesEyebrow}</p>
          <h2>{sectionCopy.fieldNotesTitle}</h2>
          <p className="section-summary">{sectionCopy.fieldNotesSummary}</p>
        </div>

        <div className="field-ledger-grid">
          {editorialPhotos.slice(0, 3).map((photo, index) => (
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

      <section className="signal-ribbon section" aria-label="Live urban signals">
        <div className="section-heading compact-heading">
          <p className="eyebrow">{sectionCopy.signalEyebrow}</p>
          <h2>{sectionCopy.signalTitle}</h2>
        </div>

        <div className="ticker-shell">
          <div className="ticker-track">
            {tickerSignals.map((signal, index) => (
              <article className="ticker-chip" key={`${signal.id}-${index}`}>
                <span className={trendClass(signal)}>{signal.trend}</span>
                <strong>{signal.label}</strong>
                <span>{signal.value}</span>
                <small>{signal.context}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="signal-grid">
          {data.signals.map((signal) => (
            <article className="signal-card" key={signal.id}>
              <div className="signal-head">
                <span className={trendClass(signal)}>{signal.trend}</span>
                <span className="signal-updated">{signal.updatedAt}</span>
              </div>
              <h3>{signal.label}</h3>
              <p className="signal-value">{signal.value}</p>
              <p className="signal-context">{signal.context}</p>
            </article>
          ))}
        </div>
      </section>

      <main>
        <section className="index-board section" id="index-board">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{sectionCopy.indexEyebrow}</p>
              <h2>{sectionCopy.indexTitle}</h2>
            </div>
            <p className="section-summary">{modeDescriptions[mode][locale]}</p>
          </div>

          <ModeSwitch mode={mode} locale={locale} onChange={setMode} />

          <div className="index-grid">
            <div className="index-list" aria-live="polite">
              {rankings.map((city, index) => (
                <article className="city-row" key={city.id}>
                  <div className="city-rank-block">
                    <span className="city-rank">{String(index + 1).padStart(2, "0")}</span>
                    <span className="city-delta">{formatDelta(city.delta)}</span>
                  </div>

                  <div className="city-main">
                    <div className="city-header">
                      <div>
                        <h3>{city.name}</h3>
                        <p className="city-location">
                          {city.country} / {city.region}
                        </p>
                      </div>
                      <div className="city-mode-score">
                        <span>{modeLabels[mode][locale]}</span>
                        <strong>{city.scores[mode]}</strong>
                      </div>
                    </div>

                    <p className="city-tagline">{city.tagline}</p>
                    <p className="city-signal">{city.signal}</p>

                    <div className="metric-bars" aria-label={`${city.name} sub-scores`}>
                      <ScoreBar city={city} mode="physical" locale={locale} />
                      <ScoreBar city={city} mode="economic" locale={locale} />
                      <ScoreBar city={city} mode="community" locale={locale} />
                      <ScoreBar city={city} mode="business" locale={locale} />
                    </div>
                  </div>

                  <div className="city-signal-column" aria-label={`${city.name} live signal`}>
                    <div className="city-diagnostic-list">
                      <article>
                        <span>{copy.rankings.safety}</span>
                        <strong>{city.metrics.safetyScore ?? city.scores.physical}</strong>
                      </article>
                      <article>
                        <span>{copy.rankings.tolerance}</span>
                        <strong>{city.metrics.toleranceScore ?? city.scores.community}</strong>
                      </article>
                      <article>
                        <span>{copy.rankings.business}</span>
                        <strong>{city.metrics.businessGrowth ?? city.scores.business}</strong>
                      </article>
                    </div>

                    <div className="city-tags" aria-label={`${city.name} tags`}>
                      {city.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="index-sidebar">
              <article className="sidebar-card">
                <p className="panel-label">{sectionCopy.modeSurfaceLabel}</p>
                <h3>
                  {leader.name} {sectionCopy.leadsOn} {modeLabels[mode][locale].toLowerCase()}
                </h3>
                <p>{leader.signal}</p>
              </article>

              <article className="sidebar-card sidebar-card-ai">
                <p className="panel-label">{sectionCopy.modelPulseLabel}</p>
                <PulseCluster
                  values={[
                    leader.scores.physical,
                    leader.scores.economic,
                    leader.scores.community,
                    leader.scores.business,
                    leader.metrics.safetyScore ?? leader.scores.physical,
                    leader.metrics.toleranceScore ?? leader.scores.community,
                    leader.delta * 10 + 50,
                    leader.metrics.businessGrowth ?? leader.scores.business,
                  ]}
                  labels={pulseLabels[locale]}
                />
                <p>{sectionCopy.modelPulseBody}</p>
              </article>

              <article className="sidebar-card">
                <p className="panel-label">{sectionCopy.methodologyDepthLabel}</p>
                <p>{sectionCopy.methodologyDepthBody}</p>
                <a
                  className="inline-page-link"
                  href="/methodology"
                  onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
                >
                  {sectionCopy.methodologyDepthAction}
                </a>
              </article>
            </aside>
          </div>
        </section>

        <section className="manifesto section">
          <div className="manifesto-layout">
            <div className="manifesto-editorial">
              <p className="eyebrow">{sectionCopy.manifestoEyebrow}</p>
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

        <section className="methodology section" id="methodology">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{sectionCopy.methodologyEyebrow}</p>
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
              {formulaSnippets.map((equation) => (
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
              <img src={editorialPhotos[3].src} alt={editorialPhotos[3].alt} loading="lazy" />
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

function ScoreBar({
  city,
  mode,
  locale,
}: {
  city: FullRankedCity;
  mode: Exclude<ScoreMode, "balanced">;
  locale: Locale;
}) {
  return (
    <div className="metric-bar">
      <div className="metric-label">
        <span>{modeLabels[mode][locale]}</span>
        <strong>{city.scores[mode]}</strong>
      </div>
      <div className="metric-track">
        <div className="metric-fill" style={{ width: scoreWidth(city.scores[mode]) }} />
      </div>
    </div>
  );
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
