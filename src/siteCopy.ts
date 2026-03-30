import type { Locale } from "./types";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  th: "ไทย",
  zh: "中文",
};

export const siteCopy = {
  en: {
    nav: {
      home: "Home",
      aboutSlic: "About SLIC",
      methodology: "Methodology",
      rankings: "Rankings",
      exercise: "Exercise",
      thailand: "Thailand",
      ideas: "Steal This Idea",
      history: "The Journey",
      timeMachine: "V2 (Dark)",
    },
    shared: {
      updated: "Updated",
      allRegions: "All",
      exportCsv: "Export filtered CSV",
      downloadSheetTemplate: "Download sheet template",
      liveTop10: "Preview top 10",
      openFullRanking: "Open the ranking preview",
      coreBoard: "Screened board",
      extendedField: "candidate field",
      liveStatus: "Published ranking live",
      liveScope: "157 cities / 35 signals / 35 sources / verified workbook export",
      localTime: "Local time",
    },
    rankings: {
      eyebrow: "Global ranking",
      title: "SLIC city ranking",
      intro:
        "Top 10 stays card-based for depth. From rank 11 onward, the list shifts into a table while the spreadsheet template carries the transparent input, source-trail, and recalculation workflow.",
      tieNote:
        "When cities sit in the same score band, live momentum breaks the tie. SLIC does not reshuffle cities arbitrarily just to manufacture motion.",
      scopeLabel: "Board scope",
      regionLabel: "Region filter",
      scopeSummary:
        "The public core board applies baseline screens for safety confidence, coercive civic atmosphere, and disposable room to live. The extended field keeps the full candidate set visible for benchmarking and workbook review.",
      topTenTitle: "Top 10 cards",
      topTenSummary:
        "These cards foreground the lived-economy variables: PPP income, post-tax disposable room, early-career housing load, safety, tolerance, business climate, healthcare, education, ecology, and diversity of experience.",
      tableTitle: "Remaining ranked cities",
      tableSummary:
        "The full list remains sortable by score mode and filterable by region. Use the spreadsheet template to inspect formulas, attach trusted sources, and recompute the board transparently.",
      finePrintEyebrow: "Publication note",
      finePrintTitle: "How to reuse, cite, and read this ranking",
      finePrintSummary:
        "SLIC is intended to be quoted, studied, replicated, and criticised in public. The key condition is attribution and honest description of how the board is produced.",
      usageLabel: "Public-use notice",
      usageBody:
        "This ranking may be quoted, discussed, benchmarked, taught, or reused for editorial, research, classroom, and non-deceptive public-interest work, provided the source remains visible and no one implies paid placement or endorsement.",
      creditLabel: "Suggested credit",
      creditBody:
        "Suggested credit: Non Arkara and Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [date of access]. Include the deployment URL of the public page when republishing.",
      aiLabel: "Algorithmic and AI disclosure",
      aiBody:
        "This ranking is produced from the verified SLIC workbook export with 157 cities scored across 35 signals, 35 connected sources, and five declared public pillars. Source URLs and source tiers are attached to every data point in the workbook.",
      liveLabel: "Live-system note",
      liveBody:
        "Rankings are published from the verified workbook export. Country_Context and City_Inputs have been populated from trusted sources with full provenance. City positions reflect audited data and declared mathematics.",
      cautionLabel: "Reading note",
      cautionBody:
        "The ranking should be read as a declared algorithmic judgement about city life, not as investment advice, legal advice, or a claim that any single metric can settle what makes a city worth living in.",
      income: "PPP income / head",
      disposable: "Post-tax PPP room",
      housing: "Graduate housing load",
      healthcare: "Healthcare",
      education: "Education",
      ecology: "Ecology",
      diversity: "Experience diversity",
      business: "Creative & growth",
      safety: "Safety",
      tolerance: "Tolerance",
      localClock: "City clock",
      openingEase: "Opening ease",
      taxRegime: "Tax regime",
      stability: "Stability",
      incentives: "Incentives",
      listening: "Listening pulse",
      topics: "Conversation",
      culturalDemand: "Cultural demand",
      rationale: "Why this city is here",
      rank: "Rank",
      city: "City",
      country: "Country",
      region: "Region",
      score: "Score",
      access: "Access",
    },
    thailand: {
      eyebrow: "Thailand index",
      title: "Thailand ranking scaffold",
      intro:
        "This companion track is where province-level GDP, pollution, hospitals, schools, infrastructure, income, longevity, and competitiveness will be compared across Thailand.",
      note:
        "The data workbook already has a Thai scoring scaffold. The public page is the next surface to expand once province and city feeds are loaded.",
    },
    footer: {
      eyebrow: "SLIC disclosure",
      title: "Transparent city ranking infrastructure",
      summary:
        "This build is a public-facing SLIC prototype for ranking cities through lived viability, dignity, community, and creative economic energy.",
      transparencyLabel: "Transparency and privacy",
      disclosure:
        "No city, developer, government, vendor, or sponsor paid for inclusion, weighting, placement, or editorial treatment in this index.",
      privacy:
        "This build is designed around public, aggregated, city-level and country-level data. Experimental testimony or social-listening layers must be aggregated and non-personal before publication.",
      coverage:
        "Coverage grades, fallback proxies, and missing-data rules remain visible. High GDP alone does not determine rank.",
      collaborationLabel: "Prepared in collaboration with",
      collaboration:
        "Created by Non Arkara and Associate Professor Poon Thiengburanathum as a SLIC product prepared in collaboration with the Ministry of Digital Economy and Society, the Digital Economy Promotion Agency, Smart City Thailand Office, and Axiom AI.",
      note:
        "Methodology, weights, and source hierarchy remain declared. The next publishable release must attach trusted source URLs, source tiers, and workbook-derived scores before reopening the public ranking as final.",
    },
  },
  th: {
    nav: {
      home: "หน้าแรก",
      aboutSlic: "เกี่ยวกับ SLIC",
      methodology: "ระเบียบวิธี",
      rankings: "การจัดอันดับ",
      exercise: "แบบฝึกหาเมือง",
      thailand: "อันดับประเทศไทย",
      ideas: "ขโมยไอเดียนี้",
      history: "เบื้องหลัง",
      timeMachine: "V2 (มืด)",
    },
    shared: {
      updated: "อัปเดต",
      allRegions: "ทั้งหมด",
      exportCsv: "ส่งออก CSV ตามตัวกรอง",
      downloadSheetTemplate: "ดาวน์โหลดเทมเพลตสเปรดชีต",
      liveTop10: "10 อันดับตัวอย่าง",
      openFullRanking: "เปิดบอร์ดอันดับตัวอย่าง",
      coreBoard: "บอร์ดที่ผ่านเกณฑ์",
      extendedField: "ชุดเมืองทั้งหมด",
      liveStatus: "กำลังจัดอันดับใหม่ด้วยข้อมูลที่ตรวจสอบได้",
      liveScope: "157 เมือง / 35 สัญญาณ / 35 แหล่งข้อมูล / การส่งออกเวิร์กบุ๊กที่ได้รับการยืนยัน",
      localTime: "เวลาท้องถิ่น",
    },
    rankings: {
      eyebrow: "การจัดอันดับโลก",
      title: "การจัดอันดับเมือง SLIC",
      intro:
        "10 อันดับแรกจะแสดงเป็นการ์ดเพื่อให้เห็นรายละเอียด ส่วนอันดับที่ 11 ลงไปจะเป็นตาราง ขณะที่เทมเพลตสเปรดชีตรับหน้าที่เรื่องอินพุต แหล่งอ้างอิง และการคำนวณใหม่อย่างโปร่งใส",
      tieNote:
        "เมื่อเมืองอยู่ในช่วงคะแนนเดียวกัน ระบบจะใช้โมเมนตัมสดเป็นตัวตัดสิน ไม่ได้สลับอันดับแบบสุ่มเพื่อสร้างภาพว่ามีความเคลื่อนไหว",
      scopeLabel: "ขอบเขตบอร์ด",
      regionLabel: "ตัวกรองภูมิภาค",
      scopeSummary:
        "บอร์ดหลักสาธารณะจะกรองผ่านเกณฑ์ความปลอดภัย บรรยากาศกดดันแบบควบคุมเข้ม และพื้นที่รายได้ใช้สอยจริง ส่วนชุดเมืองทั้งหมดจะยังเปิดไว้เพื่อการเปรียบเทียบและการทบทวนผ่านเวิร์กบุ๊ก",
      topTenTitle: "การ์ด 10 อันดับแรก",
      topTenSummary:
        "การ์ดแต่ละใบเน้นตัวแปรชีวิตจริง ได้แก่ รายได้แบบ PPP พื้นที่รายได้หลังภาษี ภาระที่อยู่อาศัยของคนเริ่มทำงาน ความปลอดภัย ความอดทนต่อความแตกต่าง สภาพแวดล้อมธุรกิจ สุขภาพ การศึกษา นิเวศวิทยา และความหลากหลายของประสบการณ์",
      tableTitle: "เมืองที่เหลือในอันดับ",
      tableSummary:
        "รายการทั้งหมดสลับโหมดคะแนนและกรองตามภูมิภาคได้ ส่วนเทมเพลตสเปรดชีตใช้สำหรับตรวจสูตร แนบแหล่งข้อมูลที่เชื่อถือได้ และคำนวณบอร์ดใหม่อย่างโปร่งใส",
      finePrintEyebrow: "หมายเหตุการเผยแพร่",
      finePrintTitle: "แนวทางการนำไปใช้ อ้างอิง และอ่านอันดับนี้",
      finePrintSummary:
        "SLIC ตั้งใจให้ถูกอ้างถึง ศึกษา ทำซ้ำ และวิจารณ์ได้ในที่สาธารณะ เงื่อนไขสำคัญคือการให้เครดิตและการอธิบายอย่างตรงไปตรงมาว่าบอร์ดนี้ถูกสร้างขึ้นอย่างไร",
      usageLabel: "ประกาศการใช้งานสาธารณะ",
      usageBody:
        "การจัดอันดับนี้สามารถนำไปอ้างถึง สนทนา เปรียบเทียบ ใช้ในการเรียนการสอน งานวิจัย หรือการสื่อสารสาธารณะได้ ตราบใดที่แหล่งที่มาชัดเจน และไม่มีการสื่อให้เข้าใจว่าเมืองใดจ่ายเงินเพื่อซื้ออันดับหรือได้รับการรับรองเป็นพิเศษ",
      creditLabel: "รูปแบบการให้เครดิตที่แนะนำ",
      creditBody:
        "ตัวอย่างการให้เครดิต: Non Arkara และ Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [วันที่เข้าถึง]. เมื่อนำไปเผยแพร่ต่อควรแนบ URL ของหน้าสาธารณะที่ใช้ด้วย",
      aiLabel: "คำชี้แจงเรื่องอัลกอริทึมและ AI",
      aiBody:
        "หน้าสาธารณะปัจจุบันยังเป็นเพียงรอบ preview ระหว่างการจัดอันดับใหม่ ขณะที่เวิร์กบุ๊ก SLIC กำลังถูกเติมด้วยข้อมูลจากแหล่งที่เชื่อถือได้ อันดับสุดท้ายต้องมาจากเวิร์กบุ๊กที่ผ่านการยืนยันแล้วและแนบ URL แหล่งข้อมูลพร้อมระดับแหล่งข้อมูลอย่างชัดเจน ไม่ใช่ตรรกะชั่วคราวของรอบ preview",
      liveLabel: "หมายเหตุเรื่องระบบสด",
      liveBody:
        "ขณะนี้กำลังอยู่ระหว่างการจัดอันดับใหม่ จนกว่า Country_Context และ City_Inputs จะถูกกรอกด้วยข้อมูลจากแหล่งที่เชื่อถือได้และถูกนำขึ้นผ่านเวิร์กบุ๊กสู่หน้าสาธารณะ ลำดับเมืองไม่ควรถูกอ้างว่าเป็นอันดับสุดท้าย",
      cautionLabel: "ข้อควรอ่าน",
      cautionBody:
        "อันดับนี้ควรถูกอ่านในฐานะ algorithmic judgement ที่ประกาศสูตรอย่างชัดเจน ไม่ใช่คำแนะนำด้านการลงทุน กฎหมาย หรือคำอ้างว่าตัวชี้วัดใดตัวเดียวสามารถตัดสินคุณค่าของเมืองได้ทั้งหมด",
      income: "รายได้ต่อหัวแบบ PPP",
      disposable: "พื้นที่รายได้หลังภาษี",
      housing: "ภาระที่อยู่อาศัยของคนเริ่มทำงาน",
      healthcare: "สาธารณสุข",
      education: "การศึกษา",
      ecology: "นิเวศวิทยา",
      diversity: "ความหลากหลายของประสบการณ์",
      business: "สร้างสรรค์และการเติบโต",
      safety: "ความปลอดภัย",
      tolerance: "ความเปิดกว้าง",
      localClock: "เวลาของเมือง",
      openingEase: "ความง่ายในการเริ่มธุรกิจ",
      taxRegime: "ภาระภาษี",
      stability: "เสถียรภาพ",
      incentives: "แรงจูงใจ",
      listening: "ชีพจรการพูดถึง",
      topics: "ประเด็นสนทนา",
      culturalDemand: "แรงดึงดูดทางวัฒนธรรม",
      rationale: "เหตุผลที่เมืองนี้อยู่ในลิสต์",
      rank: "อันดับ",
      city: "เมือง",
      country: "ประเทศ",
      region: "ภูมิภาค",
      score: "คะแนน",
      access: "การเข้าถึง",
    },
    thailand: {
      eyebrow: "ดัชนีประเทศไทย",
      title: "โครงร่างอันดับประเทศไทย",
      intro:
        "เส้นทางนี้ใช้เปรียบเทียบ GDP ระดับจังหวัด มลพิษ โรงพยาบาล โรงเรียน โครงสร้างพื้นฐาน รายได้ อายุยืน และความสามารถในการแข่งขันทั่วประเทศ",
      note:
        "ในเวิร์กบุ๊กมีโครงสร้างคะแนนไทยอยู่แล้ว หน้าสาธารณะจะขยายต่อเมื่อข้อมูลจังหวัดและเมืองถูกป้อนเข้ามา",
    },
    footer: {
      eyebrow: "คำชี้แจง SLIC",
      title: "โครงสร้างการจัดอันดับเมืองที่โปร่งใส",
      summary:
        "หน้านี้เป็นต้นแบบสาธารณะของ SLIC สำหรับจัดอันดับเมืองผ่านคุณภาพชีวิตจริง ศักดิ์ศรี ความเป็นชุมชน และพลังเศรษฐกิจเชิงสร้างสรรค์",
      transparencyLabel: "ความโปร่งใสและความเป็นส่วนตัว",
      disclosure:
        "ไม่มีเมือง ผู้พัฒนา รัฐบาล ผู้ขาย หรือผู้สนับสนุนรายใดจ่ายเงินเพื่อการบรรจุ การถ่วงน้ำหนัก การจัดลำดับ หรือการนำเสนอในดัชนีนี้",
      privacy:
        "ต้นแบบนี้ออกแบบจากข้อมูลสาธารณะและข้อมูลรวมระดับเมืองและประเทศเท่านั้น ส่วนชั้นข้อมูลทดลองเชิงคำบอกเล่าหรือ social listening ต้องถูกรวมและตัดข้อมูลส่วนบุคคลก่อนเผยแพร่",
      coverage:
        "เกรดความครอบคลุม ตัวแทนข้อมูล และกติกาข้อมูลขาดหายจะถูกเปิดเผยอย่างชัดเจน GDP สูงเพียงอย่างเดียวไม่ทำให้เมืองชนะ",
      collaborationLabel: "จัดทำร่วมกับ",
      collaboration:
        "สร้างโดย Non Arkara และ Associate Professor Poon Thiengburanathum ในฐานะผลิตภัณฑ์ SLIC ที่จัดทำร่วมกับกระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม สำนักงานส่งเสริมเศรษฐกิจดิจิทัล Smart City Thailand Office และ Axiom AI",
      note:
        "ระเบียบวิธี น้ำหนัก และลำดับชั้นแหล่งข้อมูลยังคงประกาศอย่างชัดเจน รุ่นที่พร้อมเผยแพร่จริงต้องแนบ URL แหล่งข้อมูล ระดับแหล่งข้อมูล และคะแนนที่ได้จากเวิร์กบุ๊กก่อนเปิดอันดับสาธารณะอีกครั้งในฐานะฉบับสุดท้าย",
    },
  },
  zh: {
    nav: {
      home: "首页",
      aboutSlic: "关于 SLIC",
      methodology: "方法论",
      rankings: "排名",
      exercise: "匹配练习",
      thailand: "泰国榜单",
      ideas: "偷师这个创意",
      history: "发展历程",
      timeMachine: "V2 (暗色)",
    },
    shared: {
      updated: "更新于",
      allRegions: "全部",
      exportCsv: "导出筛选后的 CSV",
      downloadSheetTemplate: "下载表格模板",
      liveTop10: "预览前10",
      openFullRanking: "打开榜单预览",
      coreBoard: "筛选榜单",
      extendedField: "候选城市池",
      liveStatus: "已验证数据重排进行中",
      liveScope: "157 座城市 / 35 个信号 / 35 个数据源 / 已验证的工作簿导出",
      localTime: "当地时间",
    },
    rankings: {
      eyebrow: "全球榜单",
      title: "SLIC 城市排名",
      intro:
        "前10名继续用卡片展示，以保留信息密度；第11名以后改为表格，而透明的输入、来源轨迹与重算流程则交给表格模板处理。",
      tieNote:
        "当城市处在同一分数带时，会用实时动量打破平局；SLIC 不会为了制造“动态感”而随意洗牌。",
      scopeLabel: "榜单范围",
      regionLabel: "地区筛选",
      scopeSummary:
        "公开核心榜单会先通过安全感、压迫性治理氛围、以及真实可支配生活空间的基础筛选。完整候选城市池仍然保留，用于基准比较与工作簿复核。",
      topTenTitle: "前10卡片",
      topTenSummary:
        "这些卡片突出真实生活变量：PPP 人均收入、税后可支配生活空间、初入职场住房负担、安全感、包容度、商业成长环境、医疗、教育、生态条件，以及生活体验的多样性。",
      tableTitle: "其余上榜城市",
      tableSummary:
        "完整榜单可按评分模式排序，也可按地区筛选。使用表格模板可以检查公式、附上可信来源，并透明地重算榜单。",
      finePrintEyebrow: "发布说明",
      finePrintTitle: "如何引用、复用并理解这份榜单",
      finePrintSummary:
        "SLIC 这份榜单本来就允许被引用、研究、复现与批评。关键条件是保留来源并诚实说明它是如何被生成的。",
      usageLabel: "公共使用说明",
      usageBody:
        "这份榜单可用于引用、讨论、教学、研究、媒体转载与公共基准比较，只要来源清楚、引用诚实，并且不暗示任何城市为排名付费或获得了额外背书。",
      creditLabel: "建议署名格式",
      creditBody:
        "建议署名：Non Arkara 与 Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [访问日期]。转载时建议同时附上公开页面的部署 URL。",
      aiLabel: "算法与 AI 披露",
      aiBody:
        "这份排名由经过验证的 SLIC 工作簿导出生成，包含 157 座城市的 35 个信号、35 个连接的数据源以及五个公开支柱。工作簿中的每个数据点都附带了来源 URL 和来源层级。",
      liveLabel: "实时系统说明",
      liveBody:
        "重排仍在进行中。在 Country_Context 与 City_Inputs 由可信来源填充并通过工作簿进入公开页面之前，当前城市位置不应被视为最终排序，也不应作为定稿引用。",
      cautionLabel: "阅读提醒",
      cautionBody:
        "这份榜单应被理解为一个公开声明过公式的算法性城市判断，而不是投资建议、法律建议，或某个单一指标能够裁定城市价值的宣称。",
      income: "PPP 调整后人均收入",
      disposable: "税后生活空间",
      housing: "初入职场住房负担",
      healthcare: "医疗",
      education: "教育",
      ecology: "生态",
      diversity: "体验多样性",
      business: "创造力与增长",
      safety: "安全",
      tolerance: "包容度",
      localClock: "城市时间",
      openingEase: "开业便利度",
      taxRegime: "税制",
      stability: "稳定性",
      incentives: "激励环境",
      listening: "舆情脉冲",
      topics: "讨论主题",
      culturalDemand: "文化吸引力",
      rationale: "入选理由",
      rank: "排名",
      city: "城市",
      country: "国家",
      region: "地区",
      score: "分数",
      access: "可及性",
    },
    thailand: {
      eyebrow: "泰国指数",
      title: "泰国榜单框架",
      intro:
        "这一条线将比较泰国各府的 GDP、人均收入、污染、医院、学校、基础设施、寿命与竞争力。",
      note:
        "工作簿里已经有泰国评分框架。等省级和城市数据接入后，公开页面就可以继续扩展。",
    },
    footer: {
      eyebrow: "SLIC 声明",
      title: "透明的城市排名基础设施",
      summary:
        "这是一个公开的 SLIC 原型，用来按真实生活可行性、尊严、共同体与创造性经济活力来理解城市。",
      transparencyLabel: "透明度与隐私",
      disclosure:
        "没有任何城市、开发商、政府机构、供应商或赞助方为进入榜单、权重设定、排名位置或编辑呈现支付费用。",
      privacy:
        "当前版本只面向公开、聚合的城市级与国家级数据。实验性的证词或社交聆听层在公开前必须被聚合并去除个人识别信息。",
      coverage:
        "数据覆盖等级、替代代理与缺失规则会被明确公开。高 GDP 本身不能决定名次。",
      collaborationLabel: "合作完成",
      collaboration:
        "该项目由 Non Arkara 与 Associate Professor Poon Thiengburanathum 共同发起，作为 SLIC 产品，与 Ministry of Digital Economy and Society、Digital Economy Promotion Agency、Smart City Thailand Office、Axiom AI 协作完成。",
      note:
        "方法、权重与来源层级保持公开。下一版只有在附齐可信来源 URL、来源层级与工作簿导出分数后，才应重新开放为最终公开榜单。",
    },
  },
} as const;

export function getCopy(locale: Locale) {
  return siteCopy[locale];
}
