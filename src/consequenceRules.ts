/**
 * Consequence Rules Engine — provides real-time narrative feedback
 * as users adjust their 100-point pillar allocation.
 *
 * Each rule fires when a specific weight pattern is detected,
 * producing a consequence card with severity and narrative text.
 */

export type Severity = "mild" | "moderate" | "severe";

export interface ConsequenceRule {
  id: string;
  trigger: (weights: Record<string, number>) => boolean;
  narrative: string;
  severity: Severity;
  icon: string;
}

export interface FiredConsequence {
  id: string;
  narrative: string;
  severity: Severity;
  icon: string;
}

const RULES: ConsequenceRule[] = [
  // ─── Extreme single-pillar ───
  {
    id: "pressure-extreme",
    trigger: (w) => w.pressure >= 45,
    narrative:
      "You're betting everything on growth. Cities with unchecked economic dynamism may become unaffordable — the market determines the outcome unless welfare intervenes.",
    severity: "severe",
    icon: "warning",
  },
  {
    id: "viability-extreme",
    trigger: (w) => w.viability >= 45,
    narrative:
      "Infrastructure is important, but cities with perfect pipes and roads can still feel soulless. Where's the life?",
    severity: "severe",
    icon: "warning",
  },
  {
    id: "creative-extreme",
    trigger: (w) => w.creative >= 45,
    narrative:
      "Innovation hubs attract talent — and skyrocketing rents. Your matched cities may be exciting but brutally expensive.",
    severity: "severe",
    icon: "warning",
  },
  {
    id: "community-extreme",
    trigger: (w) => w.community >= 45,
    narrative:
      "Strong communities are beautiful, but without economic dynamism they can stagnate. Tight-knit can become closed-off.",
    severity: "severe",
    icon: "warning",
  },
  {
    id: "capability-extreme",
    trigger: (w) => w.capability >= 45,
    narrative:
      "World-class hospitals and universities are great — but they don't guarantee you can afford to live nearby.",
    severity: "severe",
    icon: "warning",
  },

  // ─── Neglected pillars ───
  {
    id: "pressure-neglected",
    trigger: (w) => w.pressure <= 5,
    narrative:
      "You're ignoring economic growth entirely. Without dynamism, your matched cities may stagnate — but at least they'll stay affordable.",
    severity: "moderate",
    icon: "alert",
  },
  {
    id: "viability-neglected",
    trigger: (w) => w.viability <= 5,
    narrative:
      "Clean air, safe streets, reliable transit — you've deprioritized all of it. Daily life quality may suffer.",
    severity: "moderate",
    icon: "alert",
  },
  {
    id: "community-neglected",
    trigger: (w) => w.community <= 5,
    narrative:
      "Without community, even the richest city feels lonely. Social isolation is a real health risk.",
    severity: "moderate",
    icon: "alert",
  },
  {
    id: "creative-neglected",
    trigger: (w) => w.creative <= 5,
    narrative:
      "No innovation, no startups, no research. Your matched cities may feel stuck in time.",
    severity: "moderate",
    icon: "alert",
  },
  {
    id: "capability-neglected",
    trigger: (w) => w.capability <= 5,
    narrative:
      "Healthcare and education at the bottom of your list? That's a gamble on never getting sick or needing to learn.",
    severity: "moderate",
    icon: "alert",
  },

  // ─── Interesting trade-off combinations ───
  {
    id: "creative-no-community",
    trigger: (w) => w.creative >= 35 && w.community <= 8,
    narrative:
      "Innovation without community can feel isolating. Silicon Valley syndrome: brilliant but disconnected.",
    severity: "moderate",
    icon: "insight",
  },
  {
    id: "pressure-no-viability",
    trigger: (w) => w.pressure >= 35 && w.viability <= 8,
    narrative:
      "High growth but poor infrastructure? That's a boomtown with capital flowing in but no pipes to carry it. Daily life suffers while the economy roars.",
    severity: "moderate",
    icon: "insight",
  },
  {
    id: "community-no-creative",
    trigger: (w) => w.community >= 30 && w.creative <= 8,
    narrative:
      "Strong traditions, low innovation. Your cities may be warm and welcoming but economically static.",
    severity: "mild",
    icon: "insight",
  },
  {
    id: "balanced-mild",
    trigger: (w) => {
      const vals = Object.values(w);
      const max = Math.max(...vals);
      const min = Math.min(...vals);
      return max - min <= 8;
    },
    narrative:
      "A balanced approach. You value everything equally — your matches will be well-rounded cities with no extreme strengths or weaknesses.",
    severity: "mild",
    icon: "balance",
  },
  {
    id: "capability-pressure-high",
    trigger: (w) => w.capability >= 30 && w.pressure >= 30,
    narrative:
      "You want excellent services AND strong growth. That's the Nordic model — high taxes fund great public goods while the economy stays dynamic. Few cities outside Scandinavia achieve this.",
    severity: "mild",
    icon: "insight",
  },
  {
    id: "viability-creative-high",
    trigger: (w) => w.viability >= 30 && w.creative >= 30,
    narrative:
      "Great infrastructure plus innovation? That's Singapore, Zurich, Copenhagen territory — expensive, efficient, and competitive.",
    severity: "mild",
    icon: "insight",
  },
];

export function evaluateConsequences(
  weights: Record<string, number>
): FiredConsequence[] {
  return RULES.filter((rule) => rule.trigger(weights)).map((rule) => ({
    id: rule.id,
    narrative: rule.narrative,
    severity: rule.severity,
    icon: rule.icon,
  }));
}
