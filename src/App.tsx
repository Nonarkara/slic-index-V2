import { Suspense, lazy, useEffect, useState } from "react";
import HomePage from "./HomePage";
import SiteMasthead from "./SiteMasthead";
import { localeLabels } from "./siteCopy";
import type { Locale, SitePath } from "./types";
import { trackVisitor } from "./visitorTracking";

const IdeasPage = lazy(() => import("./IdeasPage"));
const ExercisePage = lazy(() => import("./ExercisePage"));
const MethodologyPage = lazy(() => import("./MethodologyPage"));
const RankingsPage = lazy(() => import("./RankingsPage"));
const SlicProfilePage = lazy(() => import("./SlicProfilePage"));
const ThailandPage = lazy(() => import("./ThailandPage"));
const HistoryPage = lazy(() => import("./HistoryPage"));

type DocumentWithViewTransition = Document & {
  startViewTransition?: Document["startViewTransition"];
};

function resolvePath(pathname: string): SitePath {
  if (pathname === "/about-slic") {
    return "/about-slic";
  }

  if (pathname === "/methodology") {
    return "/methodology";
  }

  if (pathname === "/rankings") {
    return "/rankings";
  }

  if (pathname === "/exercise") {
    return "/exercise";
  }

  if (pathname === "/thailand") {
    return "/thailand";
  }

  if (pathname === "/ideas") {
    return "/ideas";
  }

  if (pathname === "/history") {
    return "/history";
  }

  return "/";
}

function commitRoute(path: SitePath): SitePath {
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
  }

  window.scrollTo({ top: 0, behavior: "auto" });
  return resolvePath(path);
}

const routeLoadingCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    body: string;
  }
> = {
  en: {
    eyebrow: "Loading view",
    title: "Preparing the next section.",
    body: "Pulling in the page module and interface assets.",
  },
  th: {
    eyebrow: "กำลังโหลดหน้า",
    title: "กำลังเตรียมส่วนถัดไป",
    body: "กำลังดึงโมดูลของหน้าและองค์ประกอบของอินเทอร์เฟซ",
  },
  zh: {
    eyebrow: "正在加载页面",
    title: "正在准备下一个版块。",
    body: "正在载入页面模块与界面资源。",
  },
};

function RouteLoading({ locale }: { locale: Locale }) {
  const copy = routeLoadingCopy[locale];

  return (
    <section className="route-loading section" aria-live="polite" aria-busy="true">
      <div className="route-loading-card">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
      </div>
    </section>
  );
}

export default function App() {
  const [route, setCurrentRoute] = useState<SitePath>(() => resolvePath(window.location.pathname));
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const syncRoute = () => {
      setCurrentRoute(resolvePath(window.location.pathname));
    };

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    trackVisitor();
  }, []);

  useEffect(() => {
    const localeTitlePrefix = localeLabels[locale];
    const routeTitle =
      route === "/about-slic"
        ? locale === "th"
          ? "เกี่ยวกับ SLIC"
          : locale === "zh"
            ? "关于 SLIC"
            : "About SLIC"
        : route === "/methodology"
          ? locale === "th"
            ? "ระเบียบวิธี SLIC"
            : locale === "zh"
              ? "SLIC 方法论"
              : "SLIC Methodology"
          : route === "/rankings"
            ? locale === "th"
              ? "การจัดอันดับเมือง SLIC"
              : locale === "zh"
                ? "SLIC 城市排名"
                : "SLIC Rankings"
            : route === "/exercise"
              ? locale === "th"
                ? "แบบฝึกหาเมืองที่เหมาะกับคุณ"
                : locale === "zh"
                  ? "城市匹配练习"
                  : "City Match Exercise"
            : route === "/thailand"
              ? locale === "th"
                ? "SLIC ประเทศไทย"
                : locale === "zh"
                  ? "SLIC 泰国"
                  : "SLIC Thailand"
              : route === "/ideas"
                ? locale === "th"
                  ? "ขโมยไอเดียนี้"
                  : locale === "zh"
                    ? "偷师这个创意"
                    : "Steal This Idea"
              : route === "/history"
                ? locale === "th"
                  ? "เบื้องหลัง SLIC"
                  : locale === "zh"
                    ? "SLIC 发展历程"
                    : "How SLIC Was Built"
                : locale === "th"
                  ? "สร้างอันดับเมืองของคุณ"
                  : locale === "zh"
                    ? "构建你的城市排名"
                    : "Build Your City Ranking";

    document.title = `${routeTitle} · ${localeTitlePrefix}`;
  }, [locale, route]);

  const navigate = (path: SitePath) => {
    const nextRoute = resolvePath(path);
    const doc = document as DocumentWithViewTransition;

    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        commitRoute(path);
        setCurrentRoute(nextRoute);
      });
      return;
    }

    commitRoute(path);
    setCurrentRoute(nextRoute);
  };

  return (
    <div className="page-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <SiteMasthead
        locale={locale}
        currentPath={route}
        onLocaleChange={setLocale}
        onNavigate={navigate}
      />
      <div className="page-frame" key={route}>
        <Suspense fallback={<RouteLoading locale={locale} />}>
          {route === "/methodology" ? (
            <MethodologyPage onNavigate={navigate} locale={locale} />
          ) : route === "/about-slic" ? (
            <SlicProfilePage onNavigate={navigate} locale={locale} />
          ) : route === "/rankings" ? (
            <RankingsPage onNavigate={navigate} locale={locale} />
          ) : route === "/exercise" ? (
            <ExercisePage onNavigate={navigate} locale={locale} />
          ) : route === "/thailand" ? (
            <ThailandPage onNavigate={navigate} locale={locale} />
          ) : route === "/ideas" ? (
            <IdeasPage onNavigate={navigate} locale={locale} onLocaleChange={setLocale} />
          ) : route === "/history" ? (
            <HistoryPage onNavigate={navigate} locale={locale} />
          ) : (
            <HomePage onNavigate={navigate} locale={locale} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
