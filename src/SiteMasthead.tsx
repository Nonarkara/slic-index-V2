import { useEffect, useId, useState } from "react";
import LocaleSwitch from "./LocaleSwitch";
import { slicLogo } from "./brandAssets";
import { getCopy } from "./siteCopy";
import type { Locale, SitePath } from "./types";

const mastheadCopy: Record<
  Locale,
  {
    brandTitle: string;
    brandSubtitle: string;
    goHome: string;
    primaryNavigation: string;
    liveScope: string;
    cities: string;
    signals: string;
    languages: string;
    openNavigation: string;
    closeNavigation: string;
  }
> = {
  en: {
    brandTitle: "SLIC Index 2026 V2",
    brandSubtitle: "Smart and Liveable Cities Index",
    goHome: "Go to home",
    primaryNavigation: "Primary navigation",
    liveScope: "Live model scope",
    cities: "cities",
    signals: "signals",
    languages: "languages",
    openNavigation: "Open navigation",
    closeNavigation: "Close navigation",
  },
  th: {
    brandTitle: "SLIC Index 2026 V2",
    brandSubtitle: "ดัชนีเมืองฉลาดและน่าอยู่",
    goHome: "กลับสู่หน้าแรก",
    primaryNavigation: "เมนูหลัก",
    liveScope: "ขอบเขตโมเดลสด",
    cities: "เมือง",
    signals: "สัญญาณ",
    languages: "ภาษา",
    openNavigation: "เปิดเมนูนำทาง",
    closeNavigation: "ปิดเมนูนำทาง",
  },
  zh: {
    brandTitle: "SLIC Index 2026 V2",
    brandSubtitle: "智慧与宜居城市指数",
    goHome: "返回首页",
    primaryNavigation: "主导航",
    liveScope: "实时模型范围",
    cities: "城市",
    signals: "信号",
    languages: "语言",
    openNavigation: "打开导航",
    closeNavigation: "关闭导航",
  },
};

const navPaths: SitePath[] = [
  "/",
  "/about-slic",
  "/rankings",
  "/methodology",
  "/thailand",
  "/ideas",
];

function navLabel(path: SitePath, locale: Locale): string {
  const copy = getCopy(locale);

  if (path === "/") {
    return copy.nav.home;
  }

  if (path === "/about-slic") {
    return copy.nav.aboutSlic;
  }

  if (path === "/rankings") {
    return copy.nav.rankings;
  }

  if (path === "/exercise") {
    return copy.nav.exercise;
  }

  if (path === "/methodology") {
    return copy.nav.methodology;
  }

  if (path === "/ideas") {
    return copy.nav.ideas;
  }

  return copy.nav.thailand;
}

export default function SiteMasthead({
  locale,
  currentPath,
  onLocaleChange,
  onNavigate,
}: {
  locale: Locale;
  currentPath: SitePath;
  onLocaleChange: (locale: Locale) => void;
  onNavigate: (path: SitePath) => void;
}) {
  const copy = getCopy(locale);
  const ui = mastheadCopy[locale];
  const navPanelId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath, locale]);

  const handleNavigate = (path: SitePath) => {
    setMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className={menuOpen ? "site-masthead is-open" : "site-masthead"}>
      <div className="site-masthead-frame">
        <div className="site-masthead-row site-masthead-row-primary">
          <button
            type="button"
            className="masthead-brand"
            onClick={() => handleNavigate("/")}
            aria-label={ui.goHome}
          >
            <span className="masthead-logo" aria-hidden="true">
              <img src={slicLogo.src} alt={slicLogo.alt} />
            </span>
            <span className="masthead-brand-copy">
              <strong>{ui.brandTitle}</strong>
              <span>{ui.brandSubtitle}</span>
            </span>
          </button>

          <div className="masthead-utility">
            <div className="masthead-locale">
              <LocaleSwitch locale={locale} onChange={onLocaleChange} />
            </div>
            <button
              type="button"
              className={menuOpen ? "masthead-menu-toggle active" : "masthead-menu-toggle"}
              aria-expanded={menuOpen}
              aria-controls={navPanelId}
              aria-label={menuOpen ? ui.closeNavigation : ui.openNavigation}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={menuOpen ? "masthead-nav-panel is-open" : "masthead-nav-panel"} id={navPanelId}>
          <div className="site-masthead-row site-masthead-row-secondary">
            <nav className="masthead-nav" aria-label={ui.primaryNavigation}>
              {navPaths.map((path) => (
                <button
                  key={path}
                  type="button"
                  className={path === currentPath ? "masthead-nav-link active" : "masthead-nav-link"}
                  onClick={() => handleNavigate(path)}
                  aria-current={path === currentPath ? "page" : undefined}
                >
                  {navLabel(path, locale)}
                </button>
              ))}
            </nav>

            <div className="masthead-status-rail">
              <div className="masthead-status">
                <span className="masthead-status-dot" aria-hidden="true" />
                <div>
                  <strong>{copy.shared.liveStatus}</strong>
                  <span>{copy.shared.liveScope}</span>
                </div>
              </div>

              <div className="masthead-meta-rail" aria-label={ui.liveScope}>
                <article>
                  <strong>103</strong>
                  <span>{ui.cities}</span>
                </article>
                <article>
                  <strong>24/7</strong>
                  <span>{ui.signals}</span>
                </article>
                <article>
                  <strong>3</strong>
                  <span>{ui.languages}</span>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
