import BrandLockup from "./BrandLockup";
import { collaborationLogos } from "./brandAssets";
import { getCopy } from "./siteCopy";
import type { Locale, SitePath } from "./types";

const footerEndnoteCopy: Record<
  Locale,
  {
    eyebrow: string;
    reuseLabel: string;
    reuseBody: string;
    creditLabel: string;
    creditBody: string;
    aiLabel: string;
    aiBody: string;
    liveLabel: string;
    liveBody: string;
  }
> = {
  en: {
    eyebrow: "Publication protocol",
    reuseLabel: "Reuse and credit",
    reuseBody:
      "SLIC is intended for public citation, teaching, replication, and critique. Keep the source visible, preserve the declared methodology, and do not imply paid placement or endorsement.",
    creditLabel: "Suggested credit",
    creditBody:
      "Non Arkara and Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [date], plus the deployment URL used.",
    aiLabel: "Algorithmic and AI disclosure",
    aiBody:
      "This ranking is produced from the verified SLIC workbook with 103 cities scored across 92 signals and 35 connected sources. Source URLs and source tiers are attached to every data point. The ranking uses one declared public formula with five explicit pillars.",
    liveLabel: "Continuous model",
    liveBody:
      "Rankings are published from the verified workbook export. Country_Context and City_Inputs have been populated from trusted sources with full provenance. The model is designed for continuous updates as new verified data becomes available.",
  },
  th: {
    eyebrow: "ข้อกำหนดการเผยแพร่",
    reuseLabel: "การนำไปใช้และการให้เครดิต",
    reuseBody:
      "SLIC ตั้งใจให้ถูกอ้างถึง ใช้ในการเรียน ทำซ้ำ และวิจารณ์ได้ในที่สาธารณะ เพียงต้องคงแหล่งที่มาและระเบียบวิธีไว้ชัดเจน และห้ามสื่อว่ามีการซื้ออันดับหรือได้รับการรับรองเป็นพิเศษ",
    creditLabel: "รูปแบบเครดิตที่แนะนำ",
    creditBody:
      "Non Arkara และ Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [วันที่], พร้อม URL ของหน้าที่ใช้งานจริง",
    aiLabel: "คำชี้แจงเรื่องอัลกอริทึมและ AI",
    aiBody:
      "การจัดอันดับนี้ผลิตจากเวิร์กบุ๊ก SLIC ที่ผ่านการตรวจสอบแล้ว ครอบคลุม 103 เมือง 92 สัญญาณ และ 35 แหล่งข้อมูลที่เชื่อมต่อ URL แหล่งข้อมูลและระดับแหล่งข้อมูลแนบอยู่กับทุกจุดข้อมูล",
    liveLabel: "โมเดลต่อเนื่อง",
    liveBody:
      "อันดับเผยแพร่จากเวิร์กบุ๊กที่ผ่านการตรวจสอบแล้ว Country_Context และ City_Inputs ถูกกรอกจากแหล่งที่เชื่อถือได้พร้อมแหล่งที่มาครบถ้วน โมเดลออกแบบมาเพื่อการอัปเดตอย่างต่อเนื่อง",
  },
  zh: {
    eyebrow: "发布协议",
    reuseLabel: "复用与署名",
    reuseBody:
      "SLIC 本来就允许公开引用、教学使用、复现与批评。只要保留来源、说明方法，并且不要暗示任何付费上榜或额外背书。",
    creditLabel: "建议署名",
    creditBody:
      "Non Arkara 与 Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [访问日期]，并附上所使用页面的部署 URL。",
    aiLabel: "算法与 AI 披露",
    aiBody:
      "本排名由经过验证的 SLIC 工作簿生成，涵盖 103 个城市、92 个信号和 35 个连接数据源。每个数据点均附有来源 URL 和来源层级。",
    liveLabel: "持续模型",
    liveBody:
      "排名由经过验证的工作簿导出发布。Country_Context 和 City_Inputs 已由可信来源填充，具有完整的数据溯源。模型设计支持持续更新。",
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

export default function SiteFooter({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const copy = getCopy(locale);
  const endnotes = footerEndnoteCopy[locale];

  return (
    <footer className="site-footer section">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <BrandLockup eyebrow={copy.footer.eyebrow} microCopy={copy.footer.title} />
          <p className="site-footer-summary">{copy.footer.summary}</p>
        </div>

        <article className="site-footer-card">
          <p className="panel-label">{copy.footer.transparencyLabel}</p>
          <p>{copy.footer.disclosure}</p>
          <p>{copy.footer.privacy}</p>
          <p>{copy.footer.coverage}</p>
        </article>

        <article className="site-footer-card">
          <p className="panel-label">{copy.footer.collaborationLabel}</p>
          <p>{copy.footer.collaboration}</p>
          <div className="partner-logo-strip" aria-label={copy.footer.collaborationLabel}>
            {collaborationLogos.map((logo) => (
              <div className="partner-logo-card" key={logo.name}>
                <img src={logo.src} alt={logo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="site-footer-endnotes">
        <div className="section-heading compact-heading">
          <p className="eyebrow">{endnotes.eyebrow}</p>
        </div>
        <div className="site-footer-endnote-grid">
          <article className="site-footer-endnote">
            <p className="panel-label">{endnotes.reuseLabel}</p>
            <p>{endnotes.reuseBody}</p>
          </article>
          <article className="site-footer-endnote">
            <p className="panel-label">{endnotes.creditLabel}</p>
            <p>{endnotes.creditBody}</p>
          </article>
          <article className="site-footer-endnote">
            <p className="panel-label">{endnotes.aiLabel}</p>
            <p>{endnotes.aiBody}</p>
          </article>
          <article className="site-footer-endnote">
            <p className="panel-label">{endnotes.liveLabel}</p>
            <p>{endnotes.liveBody}</p>
          </article>
        </div>
      </div>

      <div className="site-footer-bottom">
        <nav className="topnav" aria-label="Site navigation">
          <a href="/" onClick={(event) => navigateLink(event, onNavigate, "/")}>
            {copy.nav.home}
          </a>
          <a href="/about-slic" onClick={(event) => navigateLink(event, onNavigate, "/about-slic")}>
            {copy.nav.aboutSlic}
          </a>
          <a href="/rankings" onClick={(event) => navigateLink(event, onNavigate, "/rankings")}>
            {copy.nav.rankings}
          </a>
          <a href="/exercise" onClick={(event) => navigateLink(event, onNavigate, "/exercise")}>
            {copy.nav.exercise}
          </a>
          <a href="/methodology" onClick={(event) => navigateLink(event, onNavigate, "/methodology")}>
            {copy.nav.methodology}
          </a>
          <a href="/thailand" onClick={(event) => navigateLink(event, onNavigate, "/thailand")}>
            {copy.nav.thailand}
          </a>
          <a href="/ideas" onClick={(event) => navigateLink(event, onNavigate, "/ideas")}>
            {copy.nav.ideas}
          </a>
          <a href="/history" onClick={(event) => navigateLink(event, onNavigate, "/history")}>
            {copy.nav.history}
          </a>
          <a href="https://slic-index.onrender.com" target="_blank" rel="noopener noreferrer">
            {copy.nav.timeMachine}
          </a>
        </nav>
        <p className="site-footer-note">{copy.footer.note}</p>
      </div>
    </footer>
  );
}
