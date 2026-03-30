export type ScoreMode = "slic" | "pressure" | "viability" | "capability" | "community" | "creative";
export type TrendDirection = "up" | "down" | "steady";
export type Locale = "en" | "th" | "zh";
export type SitePath =
  | "/"
  | "/about-slic"
  | "/methodology"
  | "/rankings"
  | "/exercise"
  | "/thailand"
  | "/ideas"
  | "/history";

export interface LandingMeta {
  title: string;
  strapline: string;
  intro: string;
  lastUpdated: string;
  citiesTracked: number;
  signalsTracked: number;
  sourcesConnected: number;
}

export interface RankedCity {
  id: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  signal: string;
  delta: number;
  tags: string[];
  scores: Record<ScoreMode, number>;
}

export interface CityAccessProfile {
  access: string;
  affordability: string;
  summary: string;
}

export interface CityLifeMetrics {
  pppIncomePerHead: number;
  pppDisposableIncome?: number;
  graduateHousingShare: number;
  healthcare: CityAccessProfile;
  education: CityAccessProfile;
  experienceDiversity: number;
  ecologyScore?: number;
  crowdingPressure?: number;
  conversationTrend?: number[];
  conversationTopics?: string[];
  safetyConfidence?: number;
  affordabilityStrength?: number;
  equalityStrength?: number;
  civicFreedom?: number;
  businessGrowth?: number;
  safetyScore?: number;
  toleranceScore?: number;
  businessOpeningEase?: number;
  governmentStability?: number;
  taxCompetitiveness?: number;
  incentiveReadiness?: number;
}

export interface FullRankedCity extends RankedCity {
  globalRank: number;
  manifestStatus: "locked" | "provisional";
  cityType: "primary" | "secondary";
  inclusionRationale: string;
  metrics: CityLifeMetrics;
  coreBoardEligible: boolean;
  accentHex?: string;
  accentSoftHex?: string;
  accentLabel?: string;
  sentimentEmojis?: string[];
}

export interface SignalCard {
  id: string;
  label: string;
  value: string;
  trend: TrendDirection;
  context: string;
  updatedAt: string;
}

export interface MethodologyPillar {
  id: Exclude<ScoreMode, "slic">;
  name: string;
  description: string;
  metrics: string[];
  note: string;
}

export interface CitySpotlight {
  id: string;
  city: string;
  country: string;
  kicker: string;
  reason: string;
  highlights: string[];
}

export interface LandingData {
  meta: LandingMeta;
  rankings: RankedCity[];
  signals: SignalCard[];
  pillars: MethodologyPillar[];
  spotlights: CitySpotlight[];
}

export interface MethodologyReference {
  id: number;
  label: string;
  publisher: string;
  url?: string;
  note: string;
}

export interface MethodologyCritique {
  title: string;
  body: string;
  implication: string;
  citations: number[];
}

export interface MethodologyEquation {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  citations: number[];
}

export interface MethodologyEquationGroup {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  equations: MethodologyEquation[];
}

export interface MethodologySymbol {
  symbol: string;
  definition: string;
  explanation: string;
}

export interface MethodologyFlowStage {
  id: string;
  title: string;
  body: string;
  formula: string;
}

export interface MethodologyRemoteWorkflowStage {
  id: string;
  title: string;
  body: string;
}

export interface MethodologyWorkedExampleInput {
  label: string;
  value: string;
  note: string;
}

export interface MethodologyWorkedExampleStep {
  title: string;
  formula: string;
  result: string;
  explanation: string;
}

export interface MethodologyWorkedExample {
  city: string;
  note: string;
  inputs: MethodologyWorkedExampleInput[];
  steps: MethodologyWorkedExampleStep[];
  finalScore: string;
  conclusion: string;
}

export interface MethodologyModelFamily {
  id: string;
  title: string;
  formula: string;
  role: string;
  explanation: string;
}

export interface MethodologyFigure {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export interface MethodologySectionCopy {
  eyebrow: string;
  title: string;
  summary: string;
}

export interface MethodologyHero {
  eyebrow: string;
  title: string;
  strapline: string;
  intro: string;
  doctrineTitle: string;
  doctrineBody: string;
  contextTitle: string;
  contextItems: string[];
  explicitTitle: string;
  explicitItems: string[];
}

export interface MethodologyReaderGuide extends MethodologySectionCopy {
  layTitle: string;
  technicalTitle: string;
  laySteps: string[];
  technicalSteps: string[];
}

export interface MethodologyMetric {
  name: string;
  weight: number;
  description: string;
  inputs: string[];
}

export interface DetailedMethodologyPillar {
  id: string;
  name: string;
  weight: number;
  thesis: string;
  justification: string;
  citations: number[];
  metrics: MethodologyMetric[];
}

export interface MethodologyRule {
  title: string;
  body: string;
  citations: number[];
}

export interface SourceTier {
  tier: string;
  title: string;
  description: string;
}

export interface WorksheetColumn {
  field: string;
  purpose: string;
  source: string;
}

export interface MethodologyData {
  hero: MethodologyHero;
  readerGuide: MethodologyReaderGuide;
  critiqueSection: MethodologySectionCopy;
  critiques: MethodologyCritique[];
  processSection: MethodologySectionCopy & {
    figures: MethodologyFigure[];
  };
  flowSection: MethodologySectionCopy & {
    stages: MethodologyFlowStage[];
  };
  remoteSensingSection: MethodologySectionCopy & {
    quantifyTitle: string;
    quantifyItems: string[];
    qualifyTitle: string;
    qualifyItems: string[];
    workflowTitle: string;
    workflowStages: MethodologyRemoteWorkflowStage[];
    citations: number[];
  };
  equationSection: MethodologySectionCopy & {
    groups: MethodologyEquationGroup[];
  };
  glossarySection: MethodologySectionCopy & {
    symbols: MethodologySymbol[];
  };
  workedExampleSection: MethodologySectionCopy & {
    example: MethodologyWorkedExample;
  };
  modelSection: MethodologySectionCopy & {
    families: MethodologyModelFamily[];
  };
  countryContextSection: MethodologySectionCopy;
  weightChartLabel: string;
  pillarsSection: MethodologySectionCopy;
  pillars: DetailedMethodologyPillar[];
  protocolSection: MethodologySectionCopy;
  rules: MethodologyRule[];
  sourceSection: MethodologySectionCopy;
  sourceTiers: SourceTier[];
  worksheetSection: MethodologySectionCopy;
  worksheetColumns: WorksheetColumn[];
  referencesSection: MethodologySectionCopy;
  references: MethodologyReference[];
}

export interface KnowledgeRackDocument {
  doc_id: string;
  title: string;
  file_name: string;
  source_type: string;
  source_path: string;
  raw_copy_path: string;
  text_path: string;
  sha256: string;
  pages: number | null;
  words: number;
  chars: number;
  chunk_count: number;
  modified_at: string;
  extracted_at: string;
}

export interface KnowledgeRackChunk {
  chunk_id: string;
  doc_id: string;
  index: number;
  title: string;
  source_path: string;
  text: string;
  chars: number;
  words: number;
}
