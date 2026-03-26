-- ═══════════════════════════════════════════════
-- SLIC Index — Supabase Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL)
-- ═══════════════════════════════════════════════

-- 1. Cities universe
CREATE TABLE IF NOT EXISTS cities (
  city_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  city_type TEXT DEFAULT 'primary',
  manifest_status TEXT DEFAULT 'provisional',
  inclusion_rationale TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Published city scores/rankings
CREATE TABLE IF NOT EXISTS city_scores (
  id BIGSERIAL PRIMARY KEY,
  city_id TEXT REFERENCES cities(city_id),
  version TEXT NOT NULL DEFAULT 'v2',
  pressure_score NUMERIC,
  viability_score NUMERIC,
  capability_score NUMERIC,
  community_score NUMERIC,
  creative_score NUMERIC,
  slic_score NUMERIC,
  rank INTEGER,
  ranking_status TEXT,
  coverage_grade TEXT,
  overall_coverage NUMERIC,
  scored_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(city_id, version)
);

-- 3. Raw metric inputs per city
CREATE TABLE IF NOT EXISTS city_inputs (
  id BIGSERIAL PRIMARY KEY,
  city_id TEXT REFERENCES cities(city_id),
  field TEXT NOT NULL,
  pillar TEXT,
  value NUMERIC,
  value_text TEXT,
  provider_id TEXT,
  source_url TEXT,
  source_title TEXT,
  source_date DATE,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(city_id, field)
);

-- 4. Metrics catalog (22 scored metrics)
CREATE TABLE IF NOT EXISTS metrics_catalog (
  metric_id TEXT PRIMARY KEY,
  pillar TEXT NOT NULL,
  label TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  directionality TEXT DEFAULT 'positive',
  input_fields TEXT[],
  composite_weights JSONB,
  description TEXT
);

-- 5. Visitor tracking
CREATE TABLE IF NOT EXISTS visitors (
  id BIGSERIAL PRIMARY KEY,
  visited_at TIMESTAMPTZ DEFAULT now(),
  ip TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  user_agent TEXT,
  referrer TEXT,
  page TEXT DEFAULT '/',
  version TEXT DEFAULT 'v2'
);

CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at);

-- 6. Country-level context data
CREATE TABLE IF NOT EXISTS country_context (
  country TEXT PRIMARY KEY,
  ppp_factor NUMERIC,
  tax_rate NUMERIC,
  gpi_score NUMERIC,
  gri_score NUMERIC,
  gii_score NUMERIC,
  gdp_per_capita_ppp NUMERIC,
  gdp_growth NUMERIC,
  household_debt_proxy NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════ Row Level Security ═══════

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_context ENABLE ROW LEVEL SECURITY;

-- Public read for city data
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public read scores" ON city_scores FOR SELECT USING (true);
CREATE POLICY "Public read metrics" ON metrics_catalog FOR SELECT USING (true);
CREATE POLICY "Public read country" ON country_context FOR SELECT USING (true);

-- Visitors: anyone can INSERT (tracking), only service_role can SELECT
CREATE POLICY "Anyone can log visit" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role read visitors" ON visitors FOR SELECT
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- City inputs: public read (transparent methodology)
CREATE POLICY "Public read inputs" ON city_inputs FOR SELECT USING (true);
