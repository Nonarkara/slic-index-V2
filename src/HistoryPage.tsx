import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

const PHOTO_BASE = "/Photos history of development/";

interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  photos: string[];
}

const timeline: Record<Locale, TimelineEntry[]> = {
  en: [
    {
      year: "2020–2022",
      title: "The question that started it all",
      body: "Dr. Non Arkara kept running into the same problem: every global city ranking told you where rich people live — not where real people thrive. As a senior official at Thailand's Digital Economy Promotion Agency (depa), he had access to what most index-makers don't — ground truth. Years of stakeholder meetings across Southeast Asia, policy workshops with mayors, and late-night conversations with urban planners who actually live in the cities they study. The question was simple: what if we measured what's left after rent, not what flows through the economy?",
      photos: ["WhatsApp Image 2023-03-17 at 05.20.05 (1).jpeg", "IMG_6651.JPG"],
    },
    {
      year: "2023",
      title: "Workshops, whiteboards, and real data",
      body: "The index took shape through dozens of workshops — not in conference rooms with consultants, but in working sessions with city officials, academics, and residents. Whiteboard after whiteboard filled with frameworks that got tested against reality. What does 'livable' mean for a teacher in Chiang Mai vs. a startup founder in Taipei? The team collected primary data through field visits, stakeholder interviews, and government partnerships across Thailand and the ASEAN region. In March 2023, Dr. Non presented early smart city frameworks at the Smart City Summit & Expo in Taipei for the first time.",
      photos: ["IMG_4446.JPG", "FFC74093-8656-4C1A-904C-EF1B5461267D.jpeg", "Timeline photos.jpg", "LINE_ALBUM_Mini MBA 18 NOV 2023_231120_11.jpg"],
    },
    {
      year: "2024",
      title: "From framework to formula",
      body: "The five pillars crystallized: Growth, Viability, Capability, Community, Creative. Not because they sound good on a slide — because every workshop kept circling back to the same five tensions. Can I afford to live here? Is it safe? Can I grow? Do I belong? Is there friction worth fighting for? Dr. Non brought these to panels at Big Tech Asia in Kuala Lumpur and smart city forums across the region, pressure-testing each pillar against real policy questions. The methodology was peer-reviewed against existing indices — EIU, Monocle, Mercer — and deliberately designed to disagree with them.",
      photos: ["Smart Cities _ Nex Big Tech Event Cam B_1144.jpg", "Smart Cities _ Nex Big Tech Event Cam B_1184.jpg", "DAY1_0368.jpg", "CQW03907.jpg"],
    },
    {
      year: "2025",
      title: "Building V1 — the first public prototype",
      body: "The SLIC Index went from spreadsheets to code. Version 1 launched as a static ranking of 103 cities across five dimensions — the first time this data was public, free, and transparent. No black boxes. No paywall. Every weight visible, every source cited. The response was immediate: city officials, urban researchers, and international organizations started asking questions. The V1 site featured Busan, Taipei, Fukuoka, Bangkok, and Kuching in the top ranks — cities that traditional indices routinely undervalue.",
      photos: ["DSC_2572.jpg", "IMG_3687.JPG"],
    },
    {
      year: "2026",
      title: "V2 — you build the ranking",
      body: "Version 2 changed the game. Instead of handing people a ranking and saying 'trust us,' V2 puts an interactive spider diagram in your hands. Drag the five vertices. Shift your priorities. Watch 103 cities re-rank in real time based on what matters to you. The scoring engine uses cosine similarity and Mazziotta-Pareto penalized means — the same math used in academic composite indices, but exposed to the user instead of hidden behind a PDF. In March 2026, Dr. Non launched V2 as a keynote at the Smart City Summit & Expo in Taipei — the largest smart city event in Asia. 174 cities, 53 countries, 3,000+ professionals. The room went quiet. Then the questions started.",
      photos: [],
    },
    {
      year: "What's next",
      title: "V3 — 1,000 cities, absolute scoring",
      body: "Version 3 is in development. The city universe is expanding from 103 to 352+ cities across the top 50 economies. The scoring engine is moving from relative normalization to absolute anchor-point formulas — meaning a city's score won't change just because a new city enters the index. Every indicator gets fixed goalposts. The goal: a living, breathing dashboard that any city in the world can use to benchmark itself — not against Vienna or Singapore, but against what a good life actually requires.",
      photos: [],
    },
  ],
  th: [
    {
      year: "2563–2565",
      title: "คำถามที่เริ่มต้นทุกอย่าง",
      body: "ดร.นนท์ อัครา พบปัญหาเดิมซ้ำแล้วซ้ำเล่า: ดัชนีเมืองระดับโลกทุกตัวบอกแค่ว่าคนรวยอยู่ที่ไหน ไม่ใช่ว่าคนจริงๆ เติบโตที่ไหน ในฐานะผู้บริหารระดับสูงของสำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) เขาเข้าถึงข้อมูลภาคสนามที่ผู้สร้างดัชนีส่วนใหญ่ไม่มี — ประสบการณ์จริงจากการประชุมผู้มีส่วนได้ส่วนเสียทั่วเอเชียตะวันออกเฉียงใต้",
      photos: ["WhatsApp Image 2023-03-17 at 05.20.05 (1).jpeg", "IMG_6651.JPG"],
    },
    {
      year: "2566",
      title: "เวิร์กช็อป ไวท์บอร์ด และข้อมูลจริง",
      body: "ดัชนีถูกพัฒนาผ่านเวิร์กช็อปหลายสิบครั้ง — ไม่ใช่ในห้องประชุมกับที่ปรึกษา แต่ในเซสชันการทำงานกับเจ้าหน้าที่เมือง นักวิชาการ และผู้อยู่อาศัย ไวท์บอร์ดทีละแผ่นเต็มไปด้วยกรอบความคิดที่ถูกทดสอบกับความเป็นจริง ในเดือนมีนาคม 2566 ดร.นนท์ นำเสนอกรอบเมืองอัจฉริยะครั้งแรกที่งาน Smart City Summit ไทเป",
      photos: ["IMG_4446.JPG", "FFC74093-8656-4C1A-904C-EF1B5461267D.jpeg", "Timeline photos.jpg", "LINE_ALBUM_Mini MBA 18 NOV 2023_231120_11.jpg"],
    },
    {
      year: "2567",
      title: "จากกรอบความคิดสู่สูตร",
      body: "ห้าเสาหลักตกผลึก: การเติบโต ความน่าอยู่ ศักยภาพ ชุมชน ความสร้างสรรค์ ไม่ใช่เพราะฟังดูดีบนสไลด์ แต่เพราะทุกเวิร์กช็อปวนกลับมาที่ความตึงเครียดห้าประการเดิมเสมอ ดร.นนท์ นำสิ่งเหล่านี้ไปทดสอบที่เวที Big Tech Asia กัวลาลัมเปอร์ และฟอรัมเมืองอัจฉริยะทั่วภูมิภาค",
      photos: ["Smart Cities _ Nex Big Tech Event Cam B_1144.jpg", "Smart Cities _ Nex Big Tech Event Cam B_1184.jpg", "DAY1_0368.jpg", "CQW03907.jpg"],
    },
    {
      year: "2568",
      title: "สร้าง V1 — ต้นแบบสาธารณะแรก",
      body: "SLIC Index เปลี่ยนจากสเปรดชีตเป็นโค้ด เวอร์ชัน 1 เปิดตัวเป็นการจัดอันดับ 103 เมืองใน 5 มิติ — ครั้งแรกที่ข้อมูลนี้เปิดเผยฟรีและโปร่งใส ไม่มีกล่องดำ ไม่มี paywall ทุกน้ำหนักมองเห็นได้ ทุกแหล่งอ้างอิง",
      photos: ["DSC_2572.jpg", "IMG_3687.JPG"],
    },
    {
      year: "2569",
      title: "V2 — คุณสร้างอันดับเอง",
      body: "เวอร์ชัน 2 เปลี่ยนเกม แทนที่จะให้อันดับแล้วบอกว่า 'เชื่อเรา' V2 วางแผนภาพแมงมุมแบบโต้ตอบไว้ในมือคุณ ลากจุดทั้ง 5 เปลี่ยนลำดับความสำคัญ ดู 103 เมืองจัดอันดับใหม่แบบเรียลไทม์ ในเดือนมีนาคม 2569 ดร.นนท์ เปิดตัว V2 บนเวทีหลัก Smart City Summit & Expo ไทเป — งานเมืองอัจฉริยะที่ใหญ่ที่สุดในเอเชีย",
      photos: [],
    },
    {
      year: "ก้าวต่อไป",
      title: "V3 — 1,000 เมือง, คะแนนสัมบูรณ์",
      body: "เวอร์ชัน 3 อยู่ระหว่างการพัฒนา จักรวาลเมืองกำลังขยายจาก 103 เป็น 352+ เมืองใน 50 เศรษฐกิจอันดับต้น เป้าหมาย: แดชบอร์ดที่มีชีวิตซึ่งเมืองใดก็ได้ในโลกสามารถใช้เปรียบเทียบตัวเอง",
      photos: [],
    },
  ],
  zh: [
    {
      year: "2020–2022",
      title: "一切从一个问题开始",
      body: "Non Arkara 博士反复遇到同一个问题：每个全球城市排名都只告诉你富人住在哪里——而不是普通人在哪里能真正生活。作为泰国数字经济促进局（depa）的高级官员，他拥有大多数指数制作者没有的东西——来自东南亚各地利益相关者会议、与市长的政策研讨会、以及与真正生活在他们研究的城市中的城市规划师的深夜对话中获得的一手真实数据。",
      photos: ["WhatsApp Image 2023-03-17 at 05.20.05 (1).jpeg", "IMG_6651.JPG"],
    },
    {
      year: "2023",
      title: "研讨会、白板和真实数据",
      body: "该指数通过数十次研讨会成形——不是在顾问的会议室里，而是在与城市官员、学者和居民的工作会议中。一块又一块白板写满了经过现实检验的框架。2023年3月，Non博士首次在台北智慧城市峰会上展示了早期的智慧城市框架。",
      photos: ["IMG_4446.JPG", "FFC74093-8656-4C1A-904C-EF1B5461267D.jpeg", "Timeline photos.jpg", "LINE_ALBUM_Mini MBA 18 NOV 2023_231120_11.jpg"],
    },
    {
      year: "2024",
      title: "从框架到公式",
      body: "五大支柱结晶：增长、宜居、能力、社区、创新。不是因为它们在幻灯片上好看——而是因为每次研讨会都会回到同样的五个张力。Non博士将这些带到吉隆坡的Big Tech Asia和整个地区的智慧城市论坛上进行压力测试。",
      photos: ["Smart Cities _ Nex Big Tech Event Cam B_1144.jpg", "Smart Cities _ Nex Big Tech Event Cam B_1184.jpg", "DAY1_0368.jpg", "CQW03907.jpg"],
    },
    {
      year: "2025",
      title: "构建V1——第一个公开原型",
      body: "SLIC指数从电子表格变成了代码。版本1以103个城市五个维度的静态排名上线——这是这些数据首次公开、免费且透明。没有黑箱，没有付费墙。",
      photos: ["DSC_2572.jpg", "IMG_3687.JPG"],
    },
    {
      year: "2026",
      title: "V2——你来构建排名",
      body: "版本2改变了游戏规则。V2将交互式蛛网图放在你手中。拖动五个顶点，改变你的优先级，看103个城市根据对你重要的事实时重新排名。2026年3月，Non博士在台北智慧城市峰会上作为主题演讲发布了V2——亚洲最大的智慧城市活动。",
      photos: [],
    },
    {
      year: "下一步",
      title: "V3——1000个城市，绝对评分",
      body: "版本3正在开发中。城市范围从103个扩展到352+个城市，覆盖前50大经济体。目标：一个活的仪表板，世界上任何城市都可以用它来衡量自己。",
      photos: [],
    },
  ],
};

export default function HistoryPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const entries = timeline[locale];
  const heading = locale === "en" ? "How the SLIC Index Was Built" : locale === "th" ? "SLIC Index ถูกสร้างขึ้นมาอย่างไร" : "SLIC指数是如何构建的";
  const subtitle = locale === "en"
    ? "Years of real fieldwork, stakeholder workshops, and ground-truth data collection — before a single line of code was written."
    : locale === "th"
      ? "หลายปีของการลงพื้นที่จริง เวิร์กช็อปผู้มีส่วนได้ส่วนเสีย และการเก็บข้อมูลภาคสนาม — ก่อนที่จะเขียนโค้ดแม้แต่บรรทัดเดียว"
      : "多年的实地调研、利益相关者研讨会和一手数据收集——在写下第一行代码之前。";

  return (
    <>
      <main>
        <section className="history-page section">
          <p className="eyebrow">{locale === "en" ? "THE JOURNEY" : locale === "th" ? "เส้นทาง" : "历程"}</p>
          <h1 className="history-title">{heading}</h1>
          <p className="history-subtitle">{subtitle}</p>

          <div className="history-timeline">
            {entries.map((entry, i) => (
              <article key={i} className="history-entry">
                <div className="history-year-col">
                  <span className="history-year">{entry.year}</span>
                  <div className="history-line" />
                </div>
                <div className="history-content">
                  <h2>{entry.title}</h2>
                  <p>{entry.body}</p>
                  {entry.photos.length > 0 && (
                    <div className="history-photos">
                      {entry.photos.map((photo) => (
                        <img
                          key={photo}
                          src={`${PHOTO_BASE}${photo}`}
                          alt=""
                          loading="lazy"
                          className="history-photo"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
