import { useEffect } from "react";
import type { Locale, SitePath } from "./types";

/**
 * Exercise page now redirects to the unified interactive rankings page.
 * The spider diagram + re-ranking is the primary rankings experience in V2.
 */
export default function ExercisePage({
  onNavigate,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  useEffect(() => {
    onNavigate("/rankings");
  }, [onNavigate]);

  return null;
}
