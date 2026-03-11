import { useEffect, useState } from "react";
import HomePage from "./HomePage";
import IdeasPage from "./IdeasPage";
import MethodologyPage from "./MethodologyPage";
import RankingsPage from "./RankingsPage";
import SlicProfilePage from "./SlicProfilePage";
import SiteMasthead from "./SiteMasthead";
import { localeLabels } from "./siteCopy";
import ThailandPage from "./ThailandPage";
import type { Locale, SitePath } from "./types";
import { trackVisitor } from "./visitorTracking";

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

  if (pathname === "/thailand") {
    return "/thailand";
  }

  if (pathname === "/ideas") {
    return "/ideas";
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
              ? "100 อันดับเมือง SLIC"
              : locale === "zh"
                ? "SLIC 前100城市"
                : "SLIC Top 100"
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
                : locale === "th"
                  ? "ดัชนีเมืองฉลาดและน่าอยู่"
                  : locale === "zh"
                    ? "智慧与宜居城市指数"
                    : "Smart and Liveable Cities Index";

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
        {route === "/methodology" ? (
          <MethodologyPage onNavigate={navigate} locale={locale} />
        ) : route === "/about-slic" ? (
          <SlicProfilePage onNavigate={navigate} locale={locale} />
        ) : route === "/rankings" ? (
          <RankingsPage onNavigate={navigate} locale={locale} />
        ) : route === "/thailand" ? (
          <ThailandPage onNavigate={navigate} locale={locale} />
        ) : route === "/ideas" ? (
          <IdeasPage onNavigate={navigate} locale={locale} onLocaleChange={setLocale} />
        ) : (
          <HomePage onNavigate={navigate} locale={locale} />
        )}
      </div>
    </div>
  );
}
