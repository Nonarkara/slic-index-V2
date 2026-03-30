from __future__ import annotations

from datetime import date
from pathlib import Path

from generate_slic_workbook import build_city_universe
from verified_source_pipeline import (
    CITY_FIELD_LOOKUP,
    CITY_FIELD_SPECS,
    VERIFIED_SOURCE_DIR,
    merge_expected_rows,
    read_csv_rows,
    write_csv,
)


FIELD_SOURCE_GUIDE_PATH = VERIFIED_SOURCE_DIR / "field_source_guide.csv"
CITY_SOURCE_PLAYBOOK_PATH = VERIFIED_SOURCE_DIR / "city_source_playbook.csv"

FIELD_SOURCE_GUIDE_FIELDS = [
    "field",
    "label",
    "pillar",
    "preferred_provider_id",
    "fallback_provider_id",
    "collection_hint",
    "minimum_evidence",
    "notes",
]

CITY_SOURCE_PLAYBOOK_FIELDS = [
    "city_id",
    "display_name",
    "country",
    "field",
    "label",
    "pillar",
    "suggested_provider_id",
    "backup_provider_id",
    "source_url",
    "source_title",
    "last_verified_date",
    "priority",
    "notes",
]

FIELD_GUIDE_PROFILES = {
    "gross_income": {
        "preferred_provider_id": "national_statistical_office",
        "fallback_provider_id": "city_official_portal",
        "collection_hint": "Use disposable or median household income at city, metro, or closest urban functional-area level.",
        "minimum_evidence": "Official city or metro income table with a clear reference year and local-currency definition.",
        "notes": "Avoid lifestyle blogs or commercial cost-of-living sites. National statistical microdata is acceptable if urban breakdowns are official.",
    },
    "rent": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "national_statistical_office",
        "collection_hint": "Use official advertised or observed urban rent benchmarks for a standard long-stay dwelling.",
        "minimum_evidence": "Official city, metro, or national housing dataset with dwelling type or square-metre basis stated.",
        "notes": "If multiple dwelling sizes are available, document the chosen standard in notes before entering the number.",
    },
    "utilities": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "subnational_official_portal",
        "collection_hint": "Use official household utility tariffs or annual service-cost tables covering electricity, water, or bundled utilities.",
        "minimum_evidence": "Official tariff schedule or utility regulator table with billing unit stated.",
        "notes": "If utilities are split across agencies, note the blend used in City_Inputs.",
    },
    "transit_cost": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "subnational_official_portal",
        "collection_hint": "Use the official adult fare for the standard recurring urban pass or ticket chosen for the method.",
        "minimum_evidence": "Official transport authority fare table with validity period stated.",
        "notes": "Do not use trip-planner screenshots or resale pages as the source of record.",
    },
    "internet_cost": {
        "preferred_provider_id": "national_statistical_office",
        "fallback_provider_id": "subnational_official_portal",
        "collection_hint": "Use official communications regulator or statistical releases for household broadband pricing or affordability.",
        "minimum_evidence": "Official regulator or statistical publication with broadband package definition and date.",
        "notes": "Commercial ISP landing pages are a weak fallback and should be avoided when official regulator data exists.",
    },
    "food_cost": {
        "preferred_provider_id": "national_statistical_office",
        "fallback_provider_id": "city_official_portal",
        "collection_hint": "Use official consumer-price baskets, municipal market surveys, or urban CPI components.",
        "minimum_evidence": "Official basket or price index release with city or metro scope explained.",
        "notes": "Document whether the number is a direct basket cost or an indexed proxy.",
    },
    "housing_burden_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "national_statistical_office",
        "collection_hint": "Use official housing-cost share or combine official rent and official income sources transparently.",
        "minimum_evidence": "Official burden ratio or a clearly documented manual combination of official rent and income sources.",
        "notes": "If you compute the burden manually, cite both upstream sources in notes.",
    },
    "household_debt_burden_raw": {
        "preferred_provider_id": "national_statistical_office",
        "fallback_provider_id": "oecd_data",
        "collection_hint": "Use official household debt, arrears, or credit-burden indicators at city, metro, or closest functional-area level.",
        "minimum_evidence": "Official household finance or credit-statistics release with geography and year stated.",
        "notes": "If only regional or national figures exist, mark that explicitly in notes before reuse.",
    },
    "working_time_pressure_raw": {
        "preferred_provider_id": "ilo_ilostat",
        "fallback_provider_id": "national_statistical_office",
        "collection_hint": "Use average weekly hours, excessive-hours share, or equivalent official work-time pressure indicator.",
        "minimum_evidence": "Official labour-force or work-time release with geography, unit, and reference period stated.",
        "notes": "Prefer urban breakdowns; otherwise use the closest official metro or regional labour market release.",
    },
    "suicide_mental_strain_raw": {
        "preferred_provider_id": "who_gho",
        "fallback_provider_id": "national_statistical_office",
        "collection_hint": "Use official suicide mortality, severe mental-health strain, or comparable public-health burden figures.",
        "minimum_evidence": "Official health release with numerator basis and geography stated.",
        "notes": "Do not use editorial rankings or perception surveys for this field.",
    },
    "personal_safety_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "national_statistical_office",
        "collection_hint": "Use official crime incidence, victimisation, or public-safety releases covering the city or metro area.",
        "minimum_evidence": "Official police, justice, or municipal safety dataset with geography and rate definition stated.",
        "notes": "Prefer incidence rates over narrative safety claims.",
    },
    "transit_access_commute_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "subnational_official_portal",
        "collection_hint": "Use official commute-time, service-coverage, or accessibility indicators from transport or mobility agencies.",
        "minimum_evidence": "Official transport or mobility release with geography and calculation method stated.",
        "notes": "Network size alone is not enough; prefer measures tied to access or travel time.",
    },
    "clean_air_raw": {
        "preferred_provider_id": "subnational_official_portal",
        "fallback_provider_id": "openaq",
        "collection_hint": "Use official PM2.5, NO2, or composite air-quality monitoring results tied to the city or metro area.",
        "minimum_evidence": "Official monitoring data with station coverage and time period stated.",
        "notes": "OpenAQ can be an audited fallback, but official environmental monitoring remains preferred.",
    },
    "water_sanitation_utility_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "who_unicef_jmp",
        "collection_hint": "Use official service continuity, potable-water quality, wastewater coverage, or utility reliability indicators.",
        "minimum_evidence": "Official utility or public-health service release with city or metro scope stated.",
        "notes": "If several utilities serve the metro, document the aggregation rule used.",
    },
    "digital_infrastructure_raw": {
        "preferred_provider_id": "subnational_official_portal",
        "fallback_provider_id": "mlab",
        "collection_hint": "Use official broadband availability, fixed-speed coverage, or digital-service quality indicators.",
        "minimum_evidence": "Official telecom or digital-infrastructure release with geography and metric definition stated.",
        "notes": "Measurement Lab is acceptable as audited context, but official digital coverage is preferred.",
    },
    "climate_sunlight_livability_raw": {
        "preferred_provider_id": "wmo_natl_met",
        "fallback_provider_id": "national_statistical_office",
        "collection_hint": "Composite of annual sunshine hours, temperature comfort (22 deg C optimum), and extreme weather frequency.",
        "minimum_evidence": "WMO climate normals or national meteorological service data with annual averages.",
        "notes": "Penalizes both Nordic darkness and Gulf desert heat. Score reflects year-round outdoor livability.",
    },
    "healthcare_quality_raw": {
        "preferred_provider_id": "subnational_official_portal",
        "fallback_provider_id": "who_gho",
        "collection_hint": "Use official healthcare access, capacity, outcomes, or service-quality indicators with city or metro relevance.",
        "minimum_evidence": "Official health-system release with geography and measurement basis stated.",
        "notes": "Prefer local access or outcomes metrics over generic hospital counts.",
    },
    "education_quality_raw": {
        "preferred_provider_id": "subnational_official_portal",
        "fallback_provider_id": "unesco_uis",
        "collection_hint": "Use official school outcomes, completion, attainment, or tertiary-access indicators with local coverage.",
        "minimum_evidence": "Official education release with geography and cohort definition stated.",
        "notes": "If only national figures exist, use them transparently and mark the loss of local granularity.",
    },
    "equal_opportunity_raw": {
        "preferred_provider_id": "national_statistical_office",
        "fallback_provider_id": "city_official_portal",
        "collection_hint": "Use official inequality-of-access, social mobility, poverty, or inclusion indicators at city or metro scale.",
        "minimum_evidence": "Official social or labour statistics release with geography and indicator definition stated.",
        "notes": "Do not duplicate the country Gini value here; use a local opportunity measure if available.",
    },
    "hospitality_belonging_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "subnational_official_portal",
        "collection_hint": "Use official civic-participation, volunteerism, newcomer integration, or resident-satisfaction evidence.",
        "minimum_evidence": "Official municipal or regional social-cohesion release with methodology stated.",
        "notes": "This field can rely on high-quality municipal surveys if the survey owner is official.",
    },
    "tolerance_pluralism_raw": {
        "preferred_provider_id": "national_statistical_office",
        "fallback_provider_id": "city_official_portal",
        "collection_hint": "Use official diversity, anti-discrimination, inclusion, or rights-based indicators with urban relevance.",
        "minimum_evidence": "Official demographic or inclusion release with geography and indicator basis stated.",
        "notes": "Prefer measured inclusion outcomes over branding statements or awards.",
    },
    "cultural_public_life_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "subnational_official_portal",
        "collection_hint": "Use official culture, library, museum, or events participation indicators tied to the city.",
        "minimum_evidence": "Official municipal or regional culture release with attendance or availability measures stated.",
        "notes": "A structured city culture dataset is stronger than promotional tourism copy.",
    },
    "birth_rate_optimism_raw": {
        "preferred_provider_id": "world_bank",
        "fallback_provider_id": "national_statistical_office",
        "collection_hint": "Use total fertility rate (TFR) as a societal optimism proxy. Applied at national level.",
        "minimum_evidence": "World Bank TFR data or official national statistics with clear reference year.",
        "notes": "Higher TFR signals greater societal confidence. Directionality is positive.",
    },
    "entrepreneurial_dynamism_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "national_statistical_office",
        "collection_hint": "Use official business formation, enterprise density, startup registrations, or employer growth indicators.",
        "minimum_evidence": "Official city, chamber, or national business-statistics release with urban geography stated.",
        "notes": "Prefer per-capita or rate-based indicators where possible.",
    },
    "innovation_research_intensity_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "wipo_statistics",
        "collection_hint": "Use official patenting, R&D, university research, or scientific-output indicators with local attribution.",
        "minimum_evidence": "Official university, municipal, or national innovation release with geography and date stated.",
        "notes": "If you fall back to WIPO, explain how the local geography is inferred.",
    },
    "investment_signal_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "oecd_data",
        "collection_hint": "Use official investment project, capital expenditure, office absorption, or productive-enterprise growth indicators.",
        "minimum_evidence": "Official economic development or statistical release with urban geography and year stated.",
        "notes": "Avoid PR roundups unless they are published by the city or official investment agency.",
    },
    "administrative_investment_friction_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "world_bank",
        "collection_hint": "Use official permitting, licensing, or business-service turnaround metrics relevant to the city.",
        "minimum_evidence": "Official service standard or regulatory performance release with a dated methodology.",
        "notes": "If only national ease-of-doing-business proxies exist, mark that clearly as a context fallback.",
    },
    "visitor_flow_context_raw": {
        "preferred_provider_id": "city_official_portal",
        "fallback_provider_id": "national_statistical_office",
        "collection_hint": "Use official visitor arrivals, hotel nights, or tourism load indicators tied to the city.",
        "minimum_evidence": "Official tourism or accommodation release with city or metro scope stated.",
        "notes": "This field is optional in the score, but it is useful context for sense-checking city dynamics.",
    },
    "di_ppp_raw": {
        "preferred_provider_id": "derived",
        "fallback_provider_id": "world_bank",
        "collection_hint": "Disposable income in PPP terms. Computed from components or taken from official regional surveys.",
        "minimum_evidence": "Official income survey or a transparently documented combination of official revenue and cost sources.",
        "notes": "A core V3 metric. If computed manually, ensure all components (rent, food, etc.) are cited.",
    },
}


def build_field_source_guide_rows() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for spec in CITY_FIELD_SPECS:
        profile = FIELD_GUIDE_PROFILES[spec["field"]]
        rows.append(
            {
                "field": spec["field"],
                "label": spec["label"],
                "pillar": spec["pillar"],
                "preferred_provider_id": profile["preferred_provider_id"],
                "fallback_provider_id": profile["fallback_provider_id"],
                "collection_hint": profile["collection_hint"],
                "minimum_evidence": profile["minimum_evidence"],
                "notes": profile["notes"],
            }
        )
    return rows


def expand_city_groups(
    city_id: str,
    groups: list[dict[str, object]],
    city_by_id: dict[str, dict[str, str]],
) -> list[dict[str, str]]:
    city = city_by_id[city_id]
    rows: list[dict[str, str]] = []
    verified_date = date.today().isoformat()
    for group in groups:
        for field in group["fields"]:
            spec = CITY_FIELD_LOOKUP[field]
            rows.append(
                {
                    "city_id": city_id,
                    "display_name": city["display_name"],
                    "country": city["country"],
                    "field": field,
                    "label": spec["label"],
                    "pillar": spec["pillar"],
                    "suggested_provider_id": group["suggested_provider_id"],
                    "backup_provider_id": group["backup_provider_id"],
                    "source_url": group["source_url"],
                    "source_title": group["source_title"],
                    "last_verified_date": verified_date,
                    "priority": group["priority"],
                    "notes": group["notes"],
                }
            )
    return rows


def build_city_source_playbook_rows() -> list[dict[str, str]]:
    city_by_id = {city["city_id"]: city for city in build_city_universe()}

    milan_groups = [
        {
            "fields": (
                "food_cost",
                "digital_infrastructure_raw",
                "education_quality_raw",
                "equal_opportunity_raw",
                "hospitality_belonging_raw",
                "tolerance_pluralism_raw",
                "cultural_public_life_raw",
                "innovation_research_intensity_raw",
                "investment_signal_raw",
                "administrative_investment_friction_raw",
            ),
            "suggested_provider_id": "comune_milano_open_data",
            "backup_provider_id": "istat",
            "source_url": "https://dati.comune.milano.it/",
            "source_title": "Comune di Milano Open Data",
            "priority": "high",
            "notes": "Start with the city open-data portal or statistical yearbook. If the exact indicator is missing, escalate to ISTAT local series before entering a proxy.",
        },
        {
            "fields": ("gross_income",),
            "suggested_provider_id": "comune_milano_open_data",
            "backup_provider_id": "istat",
            "source_url": "https://dati.comune.milano.it/dataset/edfe847d-05f1-4d25-ba44-283d22b1ec73/resource/76b54f5a-24a6-4f7f-a3a9-a6152d8da601/download/redditi_e_principali_variabili_irpef_su_base_comunale_csv_2023.csv",
            "source_title": "Comune di Milano Open Data | Redditi e variabili Irpef su base comunale: 2024 a.i. 2023",
            "priority": "high",
            "notes": "Use the official municipal IRPEF income table and compute the per-contributor city average transparently from the published bracket totals.",
        },
        {
            "fields": ("rent", "housing_burden_raw"),
            "suggested_provider_id": "agenzia_entrate_omi",
            "backup_provider_id": "comune_milano_open_data",
            "source_url": "https://www.agenziaentrate.gov.it/portale/web/english/nsi/omi",
            "source_title": "Agenzia delle Entrate | OMI",
            "priority": "high",
            "notes": "Use official housing-market observatory tables for Milan. Pair with official income data if you need to compute the housing burden manually.",
        },
        {
            "fields": ("utilities", "water_sanitation_utility_raw"),
            "suggested_provider_id": "mm_milano",
            "backup_provider_id": "comune_milano_open_data",
            "source_url": "https://www.mmspa.eu/en/",
            "source_title": "MM S.p.A.",
            "priority": "medium",
            "notes": "Use official utility tariffs or service-reliability material published by Milan's water and network operator.",
        },
        {
            "fields": ("transit_cost",),
            "suggested_provider_id": "atm_milano",
            "backup_provider_id": "comune_milano_open_data",
            "source_url": "https://www.atm.it/en/ViaggiaConNoi/Abbonamenti/Pages/Tipologie.aspx",
            "source_title": "ATM Milano | Travel pass subscriptions",
            "priority": "high",
            "notes": "Use the standard adult annual urban pass and record the annualized fare basis in City_Inputs.",
        },
        {
            "fields": ("transit_access_commute_raw",),
            "suggested_provider_id": "comune_milano_open_data",
            "backup_provider_id": "atm_milano",
            "source_url": "https://dati.comune.milano.it/dataset/0ac0f655-1858-410a-9873-70fd057ef65d/resource/39d6ef17-8882-49b6-b2de-dd4a8486d923/download/ds393_popolazione_pendolari_movimenti_interni_mezzo_tempo_orario_uscita_genere__2011c.csv",
            "source_title": "Comune di Milano Open Data | Censimento 2011: movimenti pendolari interni per mezzo, tempo impiegato, orario di uscita e genere",
            "priority": "high",
            "notes": "Use the official commuting-time distribution and derive the share of internal commuters with travel times of 30 minutes or less.",
        },
        {
            "fields": ("clean_air_raw",),
            "suggested_provider_id": "arpa_lombardia",
            "backup_provider_id": "openaq",
            "source_url": "https://www.arpalombardia.it/agenda/notizie/2026/qualita-dell-aria-prosegue-il-miglioramento-anche-nell-anno-2025/",
            "source_title": "ARPA Lombardia | Qualita dell'aria, prosegue il miglioramento anche nell'anno 2025",
            "priority": "high",
            "notes": "Use the official ARPA Lombardia annual monitoring summary, preferably the city PM2.5 average published for Milan.",
        },
        {
            "fields": ("personal_safety_raw",),
            "suggested_provider_id": "comune_milano_open_data",
            "backup_provider_id": "istat",
            "source_url": "https://dati.comune.milano.it/dataset/34e2d2af-5c3b-4768-918b-ab7e5c0d15da/resource/8b03b9f2-f2d7-4408-b439-bc6efc093cff/download/ds564_reati_denunciati_2004_2023.csv",
            "source_title": "Comune di Milano Open Data | Reati denunciati all'autorita giudiziaria (2004-2023)",
            "priority": "high",
            "notes": "Use the official crime series and convert it into a per-1,000-resident burden using the latest official resident count.",
        },
        {
            "fields": ("healthcare_quality_raw",),
            "suggested_provider_id": "comune_milano_open_data",
            "backup_provider_id": "istat",
            "source_url": "https://dati.comune.milano.it/dataset/71477d58-03a6-468b-81de-b168a264c82c/resource/7632c319-4a2a-4ab5-a39d-74d6ecc7323d/download/ds683_posti_letto_strutture_milano_010925_.csv",
            "source_title": "Comune di Milano Open Data | Sanita: posti letto delle strutture ospedaliere e case di cura",
            "priority": "high",
            "notes": "Use the official bed-capacity series and express it as beds per 1,000 residents using the official population denominator.",
        },
        {
            "fields": ("entrepreneurial_dynamism_raw",),
            "suggested_provider_id": "comune_milano_open_data",
            "backup_provider_id": "istat",
            "source_url": "https://dati.comune.milano.it/dataset/8d8a4d19-0004-48a8-9425-e892deffde10/resource/68ebcbed-a736-4f0a-b654-17232b18deb0/download/ds691_imprese.csv",
            "source_title": "Comune di Milano Open Data | Imprese attive divise per settore merceologico e anno",
            "priority": "high",
            "notes": "Use the official business stock series and convert it into active enterprises per 1,000 residents.",
        },
        {
            "fields": ("visitor_flow_context_raw",),
            "suggested_provider_id": "comune_milano_open_data",
            "backup_provider_id": "istat",
            "source_url": "https://dati.comune.milano.it/dataset/645e64c2-0a51-4823-8a40-633cc162b4af/resource/89f7c6c4-fd98-4e5e-8e9a-041b92bac9d8/download/ds215_presenze_mensili-1.csv",
            "source_title": "Comune di Milano Open Data | Presenze mensili",
            "priority": "high",
            "notes": "Use the official monthly tourism-presence series and sum the full year for annual city visitor context.",
        },
        {
            "fields": ("internet_cost", "working_time_pressure_raw", "suicide_mental_strain_raw"),
            "suggested_provider_id": "istat",
            "backup_provider_id": "comune_milano_open_data",
            "source_url": "https://www.istat.it/en/",
            "source_title": "ISTAT",
            "priority": "medium",
            "notes": "Use official Italian statistical releases with local or metro breakdowns where available.",
        },
        {
            "fields": ("household_debt_burden_raw",),
            "suggested_provider_id": "banca_d_italia",
            "backup_provider_id": "istat",
            "source_url": "https://www.bancaditalia.it/",
            "source_title": "Banca d'Italia",
            "priority": "medium",
            "notes": "Use territorial household-finance or credit indicators. If the city figure is unavailable, document the closest official regional fallback.",
        },
    ]

    bologna_groups = [
        {
            "fields": (
                "gross_income",
                "food_cost",
                "digital_infrastructure_raw",
                "personal_safety_raw",
                "healthcare_quality_raw",
                "education_quality_raw",
                "equal_opportunity_raw",
                "hospitality_belonging_raw",
                "tolerance_pluralism_raw",
                "cultural_public_life_raw",
                "entrepreneurial_dynamism_raw",
                "innovation_research_intensity_raw",
                "investment_signal_raw",
                "administrative_investment_friction_raw",
                "visitor_flow_context_raw",
            ),
            "suggested_provider_id": "comune_bologna_open_data",
            "backup_provider_id": "istat",
            "source_url": "https://opendata.comune.bologna.it/",
            "source_title": "Comune di Bologna Open Data",
            "priority": "high",
            "notes": "Start with Bologna open data and city statistical publications. Escalate to ISTAT only when the city portal does not publish the needed local series.",
        },
        {
            "fields": ("rent", "housing_burden_raw"),
            "suggested_provider_id": "agenzia_entrate_omi",
            "backup_provider_id": "comune_bologna_open_data",
            "source_url": "https://www.agenziaentrate.gov.it/portale/web/english/nsi/omi",
            "source_title": "Agenzia delle Entrate | OMI",
            "priority": "high",
            "notes": "Use OMI housing-market tables for Bologna and pair them with official income data when a housing-burden ratio must be built manually.",
        },
        {
            "fields": ("utilities", "water_sanitation_utility_raw"),
            "suggested_provider_id": "gruppo_hera",
            "backup_provider_id": "comune_bologna",
            "source_url": "https://www.gruppohera.it/",
            "source_title": "Gruppo Hera",
            "priority": "medium",
            "notes": "Use official utility tariffs or service-quality material for Bologna-area households.",
        },
        {
            "fields": ("transit_cost",),
            "suggested_provider_id": "tper_bologna",
            "backup_provider_id": "comune_bologna_open_data",
            "source_url": "https://www.tper.it/tariffe",
            "source_title": "TPER | Fares",
            "priority": "high",
            "notes": "Use the standard recurring urban fare basis and note the pass type in City_Inputs.",
        },
        {
            "fields": ("transit_access_commute_raw",),
            "suggested_provider_id": "comune_bologna_open_data",
            "backup_provider_id": "tper_bologna",
            "source_url": "https://opendata.comune.bologna.it/",
            "source_title": "Comune di Bologna Open Data",
            "priority": "high",
            "notes": "Look for official mobility and commuting datasets first, then use operator service data if necessary.",
        },
        {
            "fields": ("clean_air_raw",),
            "suggested_provider_id": "arpae_emilia_romagna",
            "backup_provider_id": "openaq",
            "source_url": "https://www.arpae.it/it/temi-ambientali/aria",
            "source_title": "ARPAE Emilia-Romagna | Air",
            "priority": "high",
            "notes": "Regional environmental monitoring remains the source of record for Bologna air-quality data.",
        },
        {
            "fields": ("internet_cost", "working_time_pressure_raw", "suicide_mental_strain_raw"),
            "suggested_provider_id": "istat",
            "backup_provider_id": "comune_bologna",
            "source_url": "https://www.istat.it/en/",
            "source_title": "ISTAT",
            "priority": "medium",
            "notes": "Use official national statistical releases with Bologna or metro breakdowns where available.",
        },
        {
            "fields": ("household_debt_burden_raw",),
            "suggested_provider_id": "banca_d_italia",
            "backup_provider_id": "istat",
            "source_url": "https://www.bancaditalia.it/",
            "source_title": "Banca d'Italia",
            "priority": "medium",
            "notes": "Prefer territorial household-finance or consumer-credit indicators and document any regional fallback used.",
        },
    ]

    return (
        expand_city_groups("it-milan", milan_groups, city_by_id)
        + expand_city_groups("it-bologna", bologna_groups, city_by_id)
    )


def ensure_source_guide_files(force: bool = False) -> dict[str, Path]:
    field_rows = build_field_source_guide_rows()
    playbook_rows = build_city_source_playbook_rows()

    if force or not FIELD_SOURCE_GUIDE_PATH.exists():
        write_csv(FIELD_SOURCE_GUIDE_PATH, field_rows, FIELD_SOURCE_GUIDE_FIELDS)
    else:
        write_csv(
            FIELD_SOURCE_GUIDE_PATH,
            merge_expected_rows(read_csv_rows(FIELD_SOURCE_GUIDE_PATH), field_rows, ("field",), FIELD_SOURCE_GUIDE_FIELDS),
            FIELD_SOURCE_GUIDE_FIELDS,
        )

    if force or not CITY_SOURCE_PLAYBOOK_PATH.exists():
        write_csv(CITY_SOURCE_PLAYBOOK_PATH, playbook_rows, CITY_SOURCE_PLAYBOOK_FIELDS)
    else:
        write_csv(
            CITY_SOURCE_PLAYBOOK_PATH,
            merge_expected_rows(
                read_csv_rows(CITY_SOURCE_PLAYBOOK_PATH),
                playbook_rows,
                ("city_id", "field"),
                CITY_SOURCE_PLAYBOOK_FIELDS,
            ),
            CITY_SOURCE_PLAYBOOK_FIELDS,
        )

    return {
        "field_source_guide": FIELD_SOURCE_GUIDE_PATH,
        "city_source_playbook": CITY_SOURCE_PLAYBOOK_PATH,
    }


__all__ = [
    "CITY_SOURCE_PLAYBOOK_PATH",
    "FIELD_SOURCE_GUIDE_PATH",
    "ensure_source_guide_files",
]
