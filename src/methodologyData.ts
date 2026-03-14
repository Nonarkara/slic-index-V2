import type { Locale, MethodologyData, MethodologyReference, SourceTier, WorksheetColumn } from "./types";

const methodologyReferences: MethodologyReference[] = [
  {
    id: 1,
    label: "Smart and Livable City Index Methodology Benchmarking",
    publisher: "Internal benchmarking memo",
    note: "Landscape scan of existing ranking systems and their biases; supplied locally for this project.",
  },
  {
    id: 2,
    label: "About the Indicators API Documentation",
    publisher: "World Bank Data Help Desk",
    url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation",
    note: "Official programmatic access point for World Bank indicators, including GDP, Gini, and PPP series.",
  },
  {
    id: 3,
    label: "GHO OData API",
    publisher: "World Health Organization",
    url: "https://www.who.int/data/gho/info/gho-odata-api",
    note: "Official WHO API for mortality, suicide, health, and related indicators.",
  },
  {
    id: 4,
    label: "ILOSTAT SDMX User Guide",
    publisher: "International Labour Organization",
    url: "https://www.ilo.org/resource/other/ilostat-sdmx-user-guide",
    note: "Official labour-statistics API guidance used for working time, labour structure, and NEET-style inputs.",
  },
  {
    id: 5,
    label: "Data",
    publisher: "WHO/UNICEF Joint Monitoring Programme",
    url: "https://washdata.org/data",
    note: "Official WASH data portal used for safely managed water and sanitation indicators.",
  },
  {
    id: 6,
    label: "UIS Data Browser",
    publisher: "UNESCO Institute for Statistics",
    url: "https://databrowser.uis.unesco.org/",
    note: "Official source for comparable education, science, and culture indicators.",
  },
  {
    id: 7,
    label: "OECD Affordable Housing Database",
    publisher: "OECD",
    url: "https://www.oecd.org/en/data/datasets/oecd-affordable-housing-database.html",
    note: "Cross-national housing affordability, housing conditions, and housing-policy indicators.",
  },
  {
    id: 8,
    label: "OECD Health Statistics",
    publisher: "OECD",
    url: "https://www.oecd.org/health/health-data.htm",
    note: "Official comparative health-system and healthcare-quality indicators.",
  },
  {
    id: 9,
    label: "PISA Dashboard",
    publisher: "OECD",
    url: "https://www.oecd.org/en/data/dashboards/pisa-education-and-skills.html",
    note: "Learning-outcome evidence used for education-quality benchmarking.",
  },
  {
    id: 10,
    label: "Methodology",
    publisher: "World Bank Entrepreneurship Database",
    url: "https://www.worldbank.org/en/programs/entrepreneurship/methodology",
    note: "Official new-business-density methodology used for entrepreneurship and business-formation inputs.",
  },
  {
    id: 11,
    label: "OpenAQ REST API",
    publisher: "OpenAQ",
    url: "https://api.openaq.org/",
    note: "Open global air-quality data and API access for city-level environmental quality proxies.",
  },
  {
    id: 12,
    label: "OECD Definition of Cities and Functional Urban Areas",
    publisher: "OECD",
    url: "https://www.oecd.org/en/data/datasets/oecd-definition-of-cities-and-functional-urban-areas.html",
    note: "Core city-boundary logic for SLIC's functional urban area approach.",
  },
  {
    id: 13,
    label: "What is Measurement Lab?",
    publisher: "M-Lab",
    url: "https://www.measurementlab.net/about/",
    note: "Open internet-performance data source supporting broadband quality proxies.",
  },
  {
    id: 14,
    label: "Home | Gender Data Portal",
    publisher: "World Bank Gender Data Portal",
    url: "https://genderdata.worldbank.org/",
    note: "Official gender-gap and opportunity dataset used in equal-opportunity scoring.",
  },
  {
    id: 15,
    label: "About | World Bank Human Capital",
    publisher: "World Bank Human Capital Data Portal",
    url: "https://humancapital.worldbank.org/en/about",
    note: "Human-capital evidence base for health, education, labour, and skills context.",
  },
  {
    id: 16,
    label: "Intellectual Property Statistics",
    publisher: "World Intellectual Property Organization",
    url: "https://www.wipo.int/web/ip-statistics",
    note: "Official IP statistics used as an innovation and research proxy.",
  },
  {
    id: 17,
    label: "Copernicus Atmosphere Monitoring Service",
    publisher: "Copernicus / CAMS",
    url: "https://atmosphere.copernicus.eu/",
    note: "Official atmosphere service used as an aerosol and air-quality evidence layer for regional pollution context.",
  },
  {
    id: 18,
    label: "Sentinel-5P mission documentation",
    publisher: "Copernicus Data Space Ecosystem",
    url: "https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel5P.html",
    note: "Official atmospheric-composition documentation used to explain aerosol, nitrogen dioxide, and wider urban airshed context.",
  },
  {
    id: 19,
    label: "Sentinel-2 collection overview",
    publisher: "Copernicus Data Space Ecosystem",
    url: "https://dataspace.copernicus.eu/explore-data/data-collections/sentinel-data/sentinel-2",
    note: "Official land-observation source for vegetation, surface condition, and urban land-cover context.",
  },
  {
    id: 20,
    label: "Global NDVI 300 m documentation",
    publisher: "Copernicus Data Space Ecosystem",
    url: "https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/clms/bio-geophysical-parameters/vegetation/vegetation-indices/ndvi_global_300m_10daily_v3.html",
    note: "Official Copernicus vegetation-index documentation used to explain greenness and ecological buffering layers.",
  },
  {
    id: 21,
    label: "Earth observation data portal overview",
    publisher: "JAXA",
    url: "https://earth.jaxa.jp/en/eo-knowledge/data-portal/index.html",
    note: "JAXA overview of accessible Earth-observation products used in SLIC's remote-sensing source ladder.",
  },
  {
    id: 22,
    label: "G-Portal",
    publisher: "JAXA",
    url: "https://earth.jaxa.jp/gpr/",
    note: "JAXA portal used to access satellite-derived land and environmental layers when city sensor coverage is thin.",
  },
  {
    id: 23,
    label: "Vegetation products",
    publisher: "JAXA",
    url: "https://earth.jaxa.jp/en/data/products/vegetation/index.html",
    note: "Official JAXA vegetation products used to describe greenness and land-surface context around cities.",
  },
  {
    id: 24,
    label: "ALOS forest / non-forest map",
    publisher: "JAXA",
    url: "https://earth.jaxa.jp/en/data/2555/index.html",
    note: "ALOS-derived forest and non-forest mapping used as a wider ecological-context layer where relevant.",
  },
  {
    id: 25,
    label: "Landsat vegetation index documentation",
    publisher: "USGS",
    url: "https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index",
    note: "Open Landsat-derived vegetation guidance supporting greenness, land-cover, and environmental context analysis.",
  },
  {
    id: 26,
    label: "Less Is More: Thailand’s Citizen-Centric Approach to Smart, Livable Cities",
    publisher: "Smart City Magazine: Special Edition, Smart City Expo Miami 2024 / Smart Cities Americas",
    url: "https://www.smartcitymiami.com/",
    note: "Citizen-centric smart-city framing that informs SLIC's emphasis on lived quality, public value, and practical urban outcomes over prestige branding.",
  },
  {
    id: 27,
    label: "Effective Soft Power: How Media can Help Cities Harness Smart Technology for Societal Change",
    publisher: "Thai Media Fund Journal 2(2)",
    note: "Media, narrative, and public communication research informing how SLIC treats visibility, discourse, and the role of urban storytelling in social change.",
  },
  {
    id: 28,
    label: "Smart City Primer",
    publisher: "C-asean and US Embassy Bangkok",
    note: "Foundational primer on practical smart-city concepts and methods used as part of the broader research base behind SLIC.",
  },
  {
    id: 29,
    label: "Harnessing Digital Connectivity for Sustainable Cities in ASEAN",
    publisher: "The ASEAN Magazine",
    url: "https://theaseanmagazine.asean.org/article/non-arkaraprasertkul-phd/",
    note: "ASEAN-focused framing on digital connectivity, sustainability, and urban development that supports SLIC's regional methodology logic.",
  },
  {
    id: 30,
    label: "Smart City Initiatives in Thailand: Key Concepts and Methods",
    publisher: "Hitachi Review 70",
    note: "Thailand smart-city methods reference supporting the operational and conceptual framing used in SLIC's city-assessment architecture.",
  },
  {
    id: 31,
    label: "Bangkok’s Urban Presence: Toward the Future of Smart Urbanity (Exhibition Entry)",
    publisher: "2019 Seoul Biennale of Architecture and Urbanism: Collective City Guidebook",
    note: "Public-facing urban research on Bangkok's future smart urbanity, informing SLIC's interest in lived form, visibility, and metropolitan presence.",
  },
  {
    id: 32,
    label: "Gentrification and Its Contentment: An Anthropological Perspective on Housing, Heritage and Urban Social Change in Shanghai",
    publisher: "Urban Studies 55(7)",
    url: "https://doi.org/10.1177/0042098016684313",
    note: "Urban social-change and housing research that informs SLIC's treatment of heritage, displacement pressure, and non-economic urban value.",
  },
  {
    id: 33,
    label: "Mobility in a Global City: Making Sense of Shanghai’s Growing Automobile-Dominated Transport Culture",
    publisher: "Urban Studies 54(10)",
    url: "https://doi.org/10.1177/0042098016637568",
    note: "Mobility and transport-culture research supporting SLIC's interpretation of friction, movement, and car-dominated urban tradeoffs.",
  },
  {
    id: 34,
    label: "World Weather Information Service: Climate Normals",
    publisher: "World Meteorological Organization",
    url: "https://worldweather.wmo.int/",
    note: "Official WMO climate normals used for sunshine hours, temperature comfort, and extreme weather frequency in the climate and sunlight livability metric.",
  },
  {
    id: 35,
    label: "Fertility Rate, Total (births per woman)",
    publisher: "World Bank",
    url: "https://data.worldbank.org/indicator/SP.DYN.TFRT.IN",
    note: "Official World Bank total fertility rate data used as a societal optimism proxy in the Community pillar.",
  },
];

const worksheetColumns: WorksheetColumn[] = [
  {
    field: "city_fua",
    purpose: "Functional urban area name used as the scoring unit.",
    source: "OECD FUA or adapted FUA rule",
  },
  {
    field: "country",
    purpose: "Country context anchor for PPP, Gini, tax, and macro indicators.",
    source: "World Bank / OECD",
  },
  {
    field: "gdp_per_capita_ppp",
    purpose: "Productive context input within Business and Growth.",
    source: "World Bank WDI",
  },
  {
    field: "gdp_growth",
    purpose: "Macro momentum context for economic vitality.",
    source: "World Bank WDI",
  },
  {
    field: "gini_coefficient",
    purpose: "Inequality input for equal opportunity and distributional fairness.",
    source: "World Bank WDI or official national statistics",
  },
  {
    field: "tax_rate_assumption",
    purpose: "User-supplied effective tax adjustment for disposable-income calculations.",
    source: "SLIC analyst input",
  },
  {
    field: "ppp_private_consumption",
    purpose: "PPP conversion term for cross-city money comparisons.",
    source: "World Bank PPP indicator",
  },
  {
    field: "median_gross_income",
    purpose: "Base income input before tax and essential-cost deductions.",
    source: "City, metro, or national labour surveys",
  },
  {
    field: "essential_costs_bundle",
    purpose: "Rent, utilities, internet, transport, and food basket total.",
    source: "Official data first, audited secondary fallback",
  },
  {
    field: "pressure_metrics",
    purpose: "Debt, working hours, suicide, and commute burden inputs.",
    source: "ILO, WHO, OECD, official national or subnational data",
  },
  {
    field: "viability_metrics",
    purpose: "Safety, air, water, transit, digital infrastructure, and climate/sunlight livability inputs.",
    source: "WHO, JMP, OpenAQ, CAMS, M-Lab, WMO, city open data",
  },
  {
    field: "remote_sensing_context",
    purpose: "Satellite aerosol, vegetation, land-cover, and ecological-context layer used when the urban frame is wider than the ground-sensor net.",
    source: "Copernicus CAMS, Sentinel-2/Sentinel-5P, JAXA, Landsat-derived public products",
  },
  {
    field: "capability_metrics",
    purpose: "Healthcare quality, education quality, and equal-opportunity inputs.",
    source: "WHO, OECD, UNESCO UIS, World Bank",
  },
  {
    field: "community_metrics",
    purpose: "Hospitality, tolerance, public-life, birth rate optimism, and adjusted visitor-flow inputs.",
    source: "Policy records, open data, social listening, testimony audit, World Bank TFR",
  },
  {
    field: "creative_metrics",
    purpose: "Business opening ease, stability, tax regime, incentives, and productive momentum.",
    source: "World Bank Entrepreneurship, WIPO, local investment data, analyst tax inputs",
  },
  {
    field: "coverage_and_output",
    purpose: "Coverage grade, pillar scores, and final SLIC score.",
    source: "SLIC model output",
  },
];

const englishSourceTiers: SourceTier[] = [
  {
    tier: "Tier 1",
    title: "City and metro official data",
    description: "Open-data portals, utility regulators, transit feeds, hospital releases, and city statistical offices.",
  },
  {
    tier: "Tier 2",
    title: "State, province, and subnational official data",
    description: "Regional statistical offices, metropolitan observatories, and subnational administrative datasets.",
  },
  {
    tier: "Tier 3",
    title: "National and international official datasets",
    description: "World Bank, WHO, ILO, UNESCO UIS, OECD, WIPO, and WHO/UNICEF JMP.",
  },
  {
    tier: "Tier 4",
    title: "Audited secondary and experimental layers",
    description: "OpenAQ, Copernicus CAMS, Sentinel-2 / Sentinel-5P context, JAXA land products, Landsat-derived vegetation layers, M-Lab, social listening, crowdsourced cost layers, and city testimony with visible caveats.",
  },
  {
    tier: "Tier 5",
    title: "Analyst assessment and cross-reference",
    description: "SLIC analyst manual assessment based on lived experience, cross-reference research, and domain expertise. Used for tolerance, hospitality, cultural life, and other qualitative signals that resist pure data capture.",
  },
];

const thaiSourceTiers: SourceTier[] = [
  {
    tier: "ชั้นที่ 1",
    title: "ข้อมูลทางการระดับเมืองและมหานคร",
    description: "พอร์ทัลข้อมูลเปิด หน่วยงานสาธารณูปโภค ข้อมูลขนส่ง โรงพยาบาล และสำนักงานสถิติของเมืองโดยตรง",
  },
  {
    tier: "ชั้นที่ 2",
    title: "ข้อมูลทางการระดับรัฐ จังหวัด หรือภูมิภาค",
    description: "สำนักงานสถิติระดับภูมิภาค หอดูข้อมูลมหานคร และฐานข้อมูลการบริหารระดับรองลงมา",
  },
  {
    tier: "ชั้นที่ 3",
    title: "ชุดข้อมูลทางการระดับชาติและระหว่างประเทศ",
    description: "World Bank, WHO, ILO, UNESCO UIS, OECD, WIPO และ WHO/UNICEF JMP",
  },
  {
    tier: "ชั้นที่ 4",
    title: "ชั้นข้อมูลรองและชั้นทดลองที่ผ่านการตรวจสอบ",
    description: "OpenAQ, Copernicus CAMS, ข้อมูลบริบท Sentinel-2 / Sentinel-5P, ผลิตภัณฑ์ที่ดินของ JAXA, ชั้น vegetation จาก Landsat, M-Lab, social listening, ชั้นข้อมูลค่าครองชีพ และ testimony ที่มี caveat ชัดเจน",
  },
  {
    tier: "ชั้นที่ 5",
    title: "การประเมินของนักวิเคราะห์และการอ้างอิงข้าม",
    description: "การประเมินด้วยตนเองของนักวิเคราะห์ SLIC จากประสบการณ์จริง การวิจัยอ้างอิงข้าม และความเชี่ยวชาญเฉพาะด้าน",
  },
];

const chineseSourceTiers: SourceTier[] = [
  {
    tier: "第1层",
    title: "城市与都会区官方数据",
    description: "城市开放数据平台、公用事业监管、交通供给、医院质量发布与城市统计部门。",
  },
  {
    tier: "第2层",
    title: "州、省与次国家官方数据",
    description: "区域统计机构、都会观察站，以及省州级行政数据集。",
  },
  {
    tier: "第3层",
    title: "国家与国际官方数据",
    description: "World Bank、WHO、ILO、UNESCO UIS、OECD、WIPO 与 WHO/UNICEF JMP。",
  },
  {
    tier: "第4层",
    title: "经审计的二级与实验层数据",
    description: "OpenAQ、Copernicus CAMS、Sentinel-2 / Sentinel-5P 背景层、JAXA 土地产品、Landsat 植被派生层、M-Lab、社交聆听、众包生活成本层，以及带有明示 caveat 的城市证词。",
  },
  {
    tier: "第5层",
    title: "分析师评估与交叉参考",
    description: "SLIC分析师基于实际经验、交叉参考研究和专业知识的人工评估。",
  },
];

const methodologyContent: Record<Locale, MethodologyData> = {
  en: {
    hero: {
      eyebrow: "Methodology paper",
      title: "The SLIC methodology",
      strapline:
        "A mathematically explicit city ranking for livability, belonging, ambition, and real room to live.",
      intro:
        "SLIC was built as a direct alternative to rankings that over-reward wealth, polished systems, and prestige branding while underweighting safety, pressure, affordability, tolerance, business energy, and the lived texture of urban life. The public model keeps one declared formula, one declared source ladder, visible coverage rules, and a city-by-city worksheet that can be audited and replicated.",
      doctrineTitle: "Official doctrine",
      doctrineBody:
        "Rank cities where people can live well, belong, and become more. SLIC is not a GDP table, not a gadget score, and not a comfort-only ranking.",
      contextTitle: "Country-context inputs",
      contextItems: [
        "GDP per capita (PPP)",
        "GDP growth",
        "Gini coefficient",
        "User-supplied tax rate",
        "PPP private consumption factor",
      ],
      explicitTitle: "What the public formula makes explicit",
      explicitItems: [
        "Safety is scored by outcomes, not surveillance intensity.",
        "Tolerance is scored through low-friction coexistence and equal market access.",
        "Business and growth are explicit public score terms, not hidden background assumptions.",
      ],
    },
    readerGuide: {
      eyebrow: "Reader guide",
      title: "Readable for the public, reproducible for analysts",
      summary:
        "The methodology has to serve two audiences at once: people who want the argument in plain language, and people who want to run the score for their own city universe.",
      layTitle: "Plain-language reading path",
      technicalTitle: "Technical replication path",
      laySteps: [
        "Read the five pillars as five human questions: can I afford life here, can I move and breathe here, can I build capability here, do I belong here, and does the city still generate ambition?",
        "Treat technology as an enabling layer. It only counts when it improves real daily outcomes.",
        "Read expensive prestige cities skeptically. Strong systems do not erase pressure, housing burden, or thin lived variety.",
        "Read secondary cities carefully. SLIC is built to let them win when they deliver real value, hospitality, and room to live.",
      ],
      technicalSteps: [
        "Define the city as a functional urban area or the closest defensible metro unit.",
        "Collect city data first, then subnational, then national fallback data, and record source tier for each metric.",
        "Compute tax-adjusted PPP disposable room before any scoring; salary alone is not enough.",
        "Winsorize at the 5th and 95th percentiles, normalize to 0-100, reverse-score harmful metrics, and publish coverage grades with the ranking.",
      ],
    },
    critiqueSection: {
      eyebrow: "Why legacy rankings fail",
      title: "The gap SLIC is trying to close",
      summary:
        "Existing city indices are useful to study, but most of them encode a theory of the good city that SLIC does not share.",
    },
    critiques: [
      {
        title: "Prestige is often mistaken for livability",
        body:
          "Many rankings structurally lift already rich, highly formal cities by rewarding institutional polish, spending, and brand legibility.",
        implication:
          "SLIC separates lived viability from city prestige and treats GDP per capita as context, not destiny.",
        citations: [1, 2, 14],
      },
      {
        title: "Data scarcity hides underrated cities before scoring begins",
        body:
          "Secondary cities are often missing because the benchmark architecture only accepts cities with convenient pre-existing datasets.",
        implication:
          "SLIC keeps a watchlist, publishes coverage grades, and uses a visible source ladder instead of quietly dropping cities.",
        citations: [1, 14, 15],
      },
      {
        title: "Safety is too often inferred from smart instruments",
        body:
          "Apps, dashboards, and surveillance hardware can be visible while the lived city remains unsafe or coercive.",
        implication:
          "SLIC scores harm, victimization, and daily confidence directly; cameras do not score points by themselves.",
        citations: [1, 11, 13],
      },
      {
        title: "Pressure is usually under-measured",
        body:
          "Disposable income after essentials, debt, working hours, and suicide are central to real city life but often treated as secondary or absent altogether.",
        implication:
          "SLIC gives pressure and room to live its own full public weight.",
        citations: [1, 2, 3, 7],
      },
      {
        title: "Visitor volume is informative but not automatically good",
        body:
          "Heavy tourism can coexist with crowding, crime, or extractive urban conditions.",
        implication:
          "SLIC uses travel demand as a contextual cultural-demand signal that must survive safety, ecology, and civic-pressure checks.",
        citations: [1],
      },
    ],
    processSection: {
      eyebrow: "Method validation",
      title: "The model was stress-tested in rooms, panels, and workshops",
      summary:
        "SLIC is not a one-shot spreadsheet. The framework was repeatedly explained, challenged, and revised in live sessions before it was frozen into a public formula.",
      figures: [
        {
          id: "process-stage",
          src: "/photos/report-people-stage.jpg",
          alt: "People on stage during a public city event.",
          caption: "The framework had to survive public presentation, not just private drafting.",
        },
        {
          id: "process-meeting",
          src: "/photos/report-people-meeting.jpg",
          alt: "Participants meeting around a table with laptops and microphones.",
          caption: "Assumptions were tested in working meetings where data choices and city logic had to be defended.",
        },
        {
          id: "process-workshop",
          src: "/photos/report-people-workshop.jpg",
          alt: "A workshop with a speaker presenting to a seated audience.",
          caption: "Pilot discussions helped separate good-looking indicators from indicators that actually explain urban life.",
        },
      ],
    },
    flowSection: {
      eyebrow: "Score flow",
      title: "How raw indicators become a public SLIC score",
      summary:
        "The score flow is deliberately short and inspectable: raw metrics, normalized metric scores, pillar aggregation, then final weighted score.",
      stages: [
        {
          id: "raw",
          title: "Raw indicators",
          body: "Collect city, metro, subnational, and national signals with visible source tiers.",
          formula: "x_m(c)",
        },
        {
          id: "normalized",
          title: "Normalization",
          body: "Winsorize at P5/P95, scale to 0-100, and reverse-score harmful variables.",
          formula: "s_m(c)",
        },
        {
          id: "pillars",
          title: "Pillar aggregation",
          body: "Combine metric scores into public pillars with declared internal weights.",
          formula: "P_p(c) = Sum alpha_(p,m) x s_m(c)",
        },
        {
          id: "final",
          title: "Final score",
          body: "Apply one fixed public equation and attach a coverage grade.",
          formula: "SLIC(c)",
        },
      ],
    },
    remoteSensingSection: {
      eyebrow: "Remote-sensing layer",
      title: "Satellite evidence widens the urban frame when ground sensors are too sparse",
      summary:
        "SLIC uses remote sensing to widen spatial coverage, especially when city monitoring stations are too few, too localized, or too uneven to describe the full urban airshed or ecological edge. Satellite layers are supporting evidence, not magic truth.",
      quantifyTitle: "What satellite layers help quantify",
      quantifyItems: [
        "Aerosol load and atmospheric composition across the wider urban airshed",
        "Vegetation and greenness buffering through NDVI-style land products",
        "Land cover, moisture, and surface context around dense built form",
        "Regional pollution drift that local station networks may miss",
      ],
      qualifyTitle: "What analysts still have to qualify",
      qualifyItems: [
        "Topography, coastline, wind flow, and seasonal smoke pathways",
        "The difference between a local hotspot and a citywide condition",
        "Urban form, street canyons, and how residents actually experience exposure",
        "Ground truth from official environmental records, testimony, and city evidence",
      ],
      workflowTitle: "How the satellite layer enters the method",
      workflowStages: [
        {
          id: "remote-official",
          title: "Official city and environmental records",
          body: "Ground sensors, utility reports, air-quality records, and official environmental releases remain the primary layer wherever available.",
        },
        {
          id: "remote-context",
          title: "Remote-sensing correction and context",
          body: "Copernicus, JAXA, and open Landsat-derived layers widen the frame for aerosol transport, vegetation cover, land stress, and the ecological edge of the city.",
        },
        {
          id: "remote-listening",
          title: "Social listening and city testimony",
          body: "Resident complaints, visitor testimony, and discussion intensity help identify whether mapped conditions are actually felt in the lived city.",
        },
        {
          id: "remote-judgement",
          title: "Final city judgement",
          body: "SLIC analysts read all three layers together so satellite evidence supports judgement instead of pretending to replace it.",
        },
      ],
      citations: [17, 18, 19, 20, 21, 22, 23, 24, 25],
    },
    equationSection: {
      eyebrow: "Mathematical core",
      title: "The official equation stack",
      summary:
        "The public score uses fixed weights, declared directionality, and formulaic transparency. Every displayed equation is part of the real method, not decorative math.",
      groups: [
        {
          id: "official",
          eyebrow: "Public score",
          title: "Official published formula",
          summary:
            "This is the exact public score logic shown on the site and carried into the workbook.",
          equations: [
            {
              id: "official-score",
              title: "Official SLIC score",
              formula:
                "SLIC(c) = 0.25 Pressure(c) + 0.22 Viability(c) + 0.18 Capability(c) + 0.15 Community(c) + 0.20 Creative(c)",
              explanation:
                "The public leaderboard uses one fixed weighted model. Pressure carries the largest share, with viability, capability, community, and creative vitality kept explicit in the score.",
              citations: [1],
            },
            {
              id: "disposable-income",
              title: "Tax-adjusted PPP disposable income",
              formula:
                "DI_ppp(c) = ((GrossIncome(c) x (1 - TaxRate(country(c)))) - Rent(c) - Utilities(c) - Transit(c) - Internet(c) - Food(c)) / PPP_private_consumption(country(c))",
              explanation:
                "This is the core room-to-live term. It converts post-tax money left after essentials into comparable purchasing-power space.",
              citations: [2, 7],
            },
          ],
        },
        {
          id: "normalization",
          eyebrow: "Metric mechanics",
          title: "Normalization and coverage logic",
          summary:
            "Raw city indicators can only be aggregated after directionality and missingness are handled explicitly.",
          equations: [
            {
              id: "metric-normalization",
              title: "Winsorized metric score",
              formula:
                "s_m(c) = 100 x clamp((winsor(x_m(c)) - P5_m) / (P95_m - P5_m), 0, 1)",
              explanation:
                "Positive metrics scale directly; harmful metrics reverse the numerator so higher scores always mean better outcomes.",
              citations: [1],
            },
            {
              id: "coverage-score",
              title: "Weighted coverage",
              formula:
                "Coverage(c) = Sum over observed metrics m of gamma_m / Sum over required metrics m of gamma_m",
              explanation:
                "Coverage is weighted by metric importance rather than raw field count. A city with thin critical data cannot hide behind many minor fields.",
              citations: [1, 14, 15],
            },
          ],
        },
        {
          id: "subscores",
          eyebrow: "Public subscore equations",
          title: "Subscores that remain visible to readers",
          summary:
            "The visible pillar equations below match the workbook structure used by the public score.",
          equations: [
            {
              id: "safety-viability",
              title: "Viability pillar",
              formula:
                "Viability(c) = 0.185 PersonalSafety + 0.185 TransitAccess + 0.148 CleanAir + 0.148 WaterUtility + 0.148 DigitalInfra + 0.185 ClimateSunlight",
              explanation:
                "Viability rewards observed safety, ecological competence, climate comfort, and the reliability of everyday city systems. Climate and sunlight penalize both Nordic darkness and Gulf desert heat.",
              citations: [3, 5, 11, 13, 17, 34],
            },
            {
              id: "community-tolerance",
              title: "Community pillar",
              formula:
                "Community(c) = 0.263 HospitalityBelonging + 0.263 TolerancePluralism + 0.263 PublicLifeVitality + 0.211 BirthRateOptimism",
              explanation:
                "Community is scored through low-friction coexistence, equal market access, everyday public life, and birth rate as a societal optimism signal.",
              citations: [1, 14, 16, 35],
            },
            {
              id: "business-growth",
              title: "Creative pillar",
              formula:
                "Creative(c) = 0.30 EntrepreneurialDynamism + 0.25 InnovationResearchIntensity + 0.25 EconomicVitality + 0.20 AdministrativeFriction",
              explanation:
                "Creative vitality rises when cities support entrepreneurial dynamism, research depth, productive momentum, and lower-friction administration.",
              citations: [2, 10, 16],
            },
          ],
        },
      ],
    },
    glossarySection: {
      eyebrow: "Notation glossary",
      title: "What every symbol means",
      summary:
        "The notation is intentionally compact. Each symbol is defined once so outside readers can reproduce the score or audit the worksheet.",
      symbols: [
        { symbol: "c", definition: "City or functional urban area", explanation: "The scored urban unit." },
        { symbol: "m", definition: "Metric index", explanation: "A raw indicator such as rent burden, PM2.5, or business opening ease." },
        { symbol: "p", definition: "Pillar index", explanation: "One of the five public pillar bundles." },
        { symbol: "x_m(c)", definition: "Raw metric value", explanation: "Observed value for metric m in city c before normalization." },
        { symbol: "winsor(.)", definition: "Winsorization operator", explanation: "Clamps extreme values to the P5/P95 band before scoring." },
        { symbol: "P5_m, P95_m", definition: "Percentile anchors", explanation: "The lower and upper percentile bounds for metric m." },
        { symbol: "s_m(c)", definition: "Normalized metric score", explanation: "0-100 score after winsorization and direction adjustment." },
        { symbol: "alpha_(p,m)", definition: "Metric weight inside a pillar", explanation: "How strongly metric m contributes to pillar p." },
        { symbol: "gamma_m", definition: "Coverage weight", explanation: "Importance weight used for missing-data coverage tests." },
        { symbol: "w_p", definition: "Public pillar weight", explanation: "Fixed public weight applied to each pillar in the final score." },
        { symbol: "DI_ppp(c)", definition: "PPP disposable room", explanation: "Post-tax purchasing-power room after essential costs." },
      ],
    },
    workedExampleSection: {
      eyebrow: "Worked example",
      title: "Illustrative preview computation",
      summary:
        "This example is illustrative rather than an audited publication row. Its purpose is to show how raw inputs become a final score.",
      example: {
        city: "Illustrative city computation",
        note: "Illustrative example showing the math path from raw inputs to a final score, not a final audited workbook row.",
        inputs: [
          { label: "Gross income", value: "TWD 55,000/month", note: "City-level earnings in local currency" },
          { label: "Effective tax rate", value: "12%", note: "Country context from national data" },
          { label: "Essential costs", value: "TWD 28,000/month", note: "Rent, utilities, internet, transit, and food" },
          { label: "PPP factor", value: "15.3", note: "World Bank PPP private consumption conversion" },
          { label: "Climate sunlight", value: "82", note: "Subtropical warmth, good sunshine hours" },
          { label: "Birth rate (TFR)", value: "1.09", note: "National fertility rate" },
          { label: "Illustrative pillar bundle", value: "Pressure 78 / Viability 80 / Capability 74 / Community 72 / Creative 73", note: "Values after internal metric aggregation" },
        ],
        steps: [
          {
            title: "Disposable room after tax and essentials",
            formula:
              "DI_ppp = ((55,000 x (1 - 0.12)) - 28,000) / 15.3",
            result: "DI_ppp = 1,333 PPP units/month",
            explanation:
              "This converts residual income into PPP terms so money left after essentials is comparable across cities.",
          },
          {
            title: "Negative-metric normalization example",
            formula:
              "SafetyScore = 100 x ((12.0 - 0.8) / (12.0 - 0.3))",
            result: "SafetyScore = 95.7",
            explanation:
              "Because violent harm is negative, the percentile band is reversed so lower harm yields a higher score.",
          },
          {
            title: "Pressure pillar aggregation",
            formula:
              "Pressure = (9x85 + 5x72 + 4x68 + 4x78 + 5x62) / 27",
            result: "Pressure = 75.6",
            explanation:
              "Internal metric weights sum to 27, then collapse to a single public pillar score.",
          },
          {
            title: "Final public score",
            formula:
              "SLIC = 0.25x78 + 0.22x80 + 0.18x74 + 0.15x72 + 0.20x73",
            result: "SLIC = 75.82",
            explanation:
              "The five public pillars are combined once, with fixed public weights and no hidden override layer.",
          },
        ],
        finalScore: "75.82",
        conclusion:
          "The example shows the intended balance: visible deductions for birth rate or community can coexist with visible strengths in pressure and viability, rather than being buried inside prestige averages.",
      },
    },
    modelSection: {
      eyebrow: "Method boundaries",
      title: "One public model, with diagnostics kept separate",
      summary:
        "The public score comes from one fixed weighted model. Internal diagnostics may challenge data quality or structure, but they do not alter the published rank.",
      families: [
        {
          id: "weighted",
          title: "Official public model",
          formula: "SLIC(c) = Sum over pillars p of w_p x P_p(c)",
          role: "Published score",
          explanation:
            "This is the only public scoring engine: fixed weights, transparent normalization, and declared pillar logic that readers can replicate.",
        },
        {
          id: "diagnostics",
          title: "Internal diagnostics",
          formula: "Diagnostics(c) do not modify SLIC(c)",
          role: "Non-scoring checks",
          explanation:
            "Consistency checks, clustering tests, and analyst review can flag weak inputs or unsupported patterns, but they do not add hidden bonuses or penalties to the public score.",
        },
      ],
    },
    countryContextSection: {
      eyebrow: "Country-context terms",
      title: "Macro strength matters, but it does not get to dominate",
      summary:
        "GDP per capita, growth, inequality, PPP, and tax rates all matter, but they enter SLIC as disciplined context or adjustment terms rather than headline determinants.",
    },
    weightChartLabel: "of official score",
    pillarsSection: {
      eyebrow: "Official pillars",
      title: "The five public bundles behind the score",
      summary:
        "Each pillar below matches the workbook weights and metric structure used by the public score.",
    },
    pillars: [
      {
        id: "pressure",
        name: "Growth",
        weight: 25,
        thesis: "Economic dynamism determines a city's trajectory. Growth invites capitalism and market forces that shape affordability — unless the state provides welfare as a counterbalance.",
        justification: "This pillar punishes false prosperity and keeps disposable room central to the score.",
        citations: [2, 3, 7],
        metrics: [
          { name: "Tax-adjusted PPP disposable income", weight: 9, description: "Residual money after tax and essentials, converted through PPP.", inputs: ["gross income", "tax rate", "rent", "utilities", "internet", "transport", "food", "PPP factor"] },
          { name: "Housing burden", weight: 5, description: "Housing cost share of household income or graduate income proxy.", inputs: ["median rent", "housing-cost share"] },
          { name: "Household debt burden", weight: 4, description: "Debt relative to disposable income or strongest available proxy.", inputs: ["household debt", "disposable income"] },
          { name: "Working time pressure", weight: 4, description: "Average hours worked and over-48-hour prevalence.", inputs: ["weekly hours", "overwork share"] },
          { name: "Suicide and severe mental strain", weight: 5, description: "Suicide rate as the sharpest signal of urban pressure that economic metrics alone cannot capture.", inputs: ["suicide rate", "mental-health harm proxy"] },
        ],
      },
      {
        id: "viability",
        name: "Viability",
        weight: 22,
        thesis: "Daily life should be safer, cleaner, easier to move through, and technically competent without turning coercive.",
        justification: "This is where competent cities score, but only on the lived outcomes their systems produce.",
        citations: [3, 5, 11, 13, 17],
        metrics: [
          { name: "Personal safety", weight: 5, description: "Harm, violent crime, visitor victimization, and night-safety signals.", inputs: ["homicide", "serious violent crime", "victimization", "night-safety proxy"] },
          { name: "Transit access and commute burden", weight: 5, description: "Transit reach combined with commute time and late-hour usability.", inputs: ["GTFS", "commute time", "coverage"] },
          { name: "Clean air", weight: 4, description: "PM2.5 and severe pollution exposure with CAMS and OpenAQ context.", inputs: ["PM2.5", "exceedance", "aerosol context"] },
          { name: "Water, sanitation, and utility reliability", weight: 4, description: "Safe water, sanitation, and basic service reliability.", inputs: ["WASH access", "interruptions", "compliance"] },
          { name: "Digital infrastructure", weight: 4, description: "Broadband quality, affordability, and fibre readiness.", inputs: ["fixed broadband", "affordability", "internet performance"] },
          { name: "Climate and sunlight livability", weight: 5, description: "Composite of sunshine hours, temperature comfort relative to 22 deg C optimum, and extreme weather frequency.", inputs: ["sunshine hours", "temperature comfort", "extreme weather"] },
        ],
      },
      {
        id: "capability",
        name: "Capability",
        weight: 18,
        thesis: "A serious city gives people access to good healthcare, good education, and fair pathways into adulthood.",
        justification: "This pillar prefers quality and access outcomes, not institution counts alone.",
        citations: [3, 6, 8, 9, 14, 15],
        metrics: [
          { name: "Healthcare quality", weight: 8, description: "Amenable mortality, capacity, and effective care access.", inputs: ["avoidable mortality", "quality outcomes", "provider capacity"] },
          { name: "Education quality", weight: 6, description: "Learning outcomes, completion, and skills formation.", inputs: ["PISA", "UIS outcomes", "completion", "skills pipeline"] },
          { name: "Equal opportunity and distributional fairness", weight: 4, description: "Gender gaps, youth NEET, and distributional fairness signals.", inputs: ["gender data", "NEET", "Gini", "labour gaps"] },
        ],
      },
      {
        id: "community",
        name: "Community",
        weight: 15,
        thesis: "Hospitality, social legibility, and peaceful coexistence are part of the lived product of the city.",
        justification: "This is where welcoming cities can outrank colder cities even when both are administratively competent.",
        citations: [1, 14, 16],
        metrics: [
          { name: "Hospitality and belonging", weight: 5, description: "Welcoming sentiment, resident attachment, and multilingual usability.", inputs: ["social listening", "testimony audit", "multilingual services"] },
          { name: "Tolerance and pluralism", weight: 5, description: "Low-friction coexistence, equal market access, and lifestyle freedom.", inputs: ["legal openness", "discrimination proxy", "market-access signal"] },
          { name: "Cultural and public-life vitality", weight: 5, description: "Third places, historic continuity, and visitor pull checked against civic strain.", inputs: ["venues", "events", "public attention", "visitor flow"] },
          { name: "Birth rate optimism", weight: 4, description: "Total fertility rate as a societal optimism proxy. If people choose not to have children in a city, something fundamental has failed.", inputs: ["World Bank TFR"] },
        ],
      },
      {
        id: "creative",
        name: "Creative",
        weight: 20,
        thesis: "Cities should not only reduce suffering. They should also generate ambition, invention, and productive energy.",
        justification: "This pillar keeps SLIC from confusing calm with stagnation or comfort with competitiveness.",
        citations: [2, 10, 16],
        metrics: [
          { name: "Entrepreneurial dynamism", weight: 6, description: "Startup formation, business activity, and the local velocity of productive entry.", inputs: ["new business density", "firm formation", "entrepreneurial activity"] },
          { name: "Innovation and research intensity", weight: 5, description: "Patents, research depth, and the city's capacity to generate new ideas.", inputs: ["patents", "R&D", "research institutions"] },
          { name: "Economic vitality and productive context", weight: 5, description: "Investment signal, macro productive context, and the city's economic runway.", inputs: ["investment signal", "GDP per capita PPP", "GDP growth"] },
          { name: "Administrative and investment friction", weight: 4, description: "How much bureaucracy, instability, or permitting drag gets in the way of productive action.", inputs: ["administrative friction", "permitting burden", "rule consistency"] },
        ],
      },
    ],
    protocolSection: {
      eyebrow: "Ranking protocol",
      title: "How cities enter, stay, and get published",
      summary:
        "The ranking has to handle missingness and scale honestly. Famous cities do not get automatic inclusion, and thin-data cities do not get fake precision.",
    },
    rules: [
      {
        title: "Functional urban areas, not city hall boundaries",
        body: "SLIC measures the city as the real labour market and service shed wherever possible, not as an arbitrary municipal core.",
        citations: [12],
      },
      {
        title: "Fixed official weights",
        body: "The public leaderboard uses one official formula. User weighting can exist later as an exploratory tool, not as the published rank.",
        citations: [1],
      },
      {
        title: "Coverage gates before ranking",
        body: "A city is ranked only if its weighted coverage clears the public threshold and no pillar is critically empty. Otherwise it remains watchlist-only.",
        citations: [1, 14, 15],
      },
      {
        title: "Safety is scored by outcomes, not surveillance",
        body: "Camera counts, control architecture, or smart-city theatre do not score by themselves. Lower harm and stronger daily confidence do.",
        citations: [1, 3],
      },
      {
        title: "Tolerance is scored by observable city effects",
        body: "SLIC does not rank religions or identities directly. It scores whether people can live, work, and participate with low friction, equal treatment, and realistic freedom.",
        citations: [1, 14],
      },
      {
        title: "Visitor demand is contextual, not automatic",
        body: "Travel demand enters as a cultural-demand signal only when it survives crowding, safety, ecology, and resident-room checks.",
        citations: [1],
      },
    ],
    sourceSection: {
      eyebrow: "Source hierarchy",
      title: "What the model trusts first",
      summary:
        "The ladder below makes data distance visible. A city-level signal outranks a national proxy, and an audited proxy outranks an unqualified convenience number.",
    },
    sourceTiers: englishSourceTiers,
    worksheetSection: {
      eyebrow: "Scoring worksheet",
      title: "The city-by-city table behind the ranking",
      summary:
        "Once the city universe is loaded, these columns are filled and the model computes pillar scores, the final SLIC score, and the coverage grade.",
    },
    worksheetColumns,
    referencesSection: {
      eyebrow: "References",
      title: "Source library used to justify the framework",
      summary:
        "The methodology cites the internal benchmarking memo plus the official documentation that anchors the scoring workbook and public model.",
    },
    references: methodologyReferences,
  },
  th: {
    hero: {
      eyebrow: "Methodology paper",
      title: "ระเบียบวิธีของ SLIC",
      strapline:
        "กรอบการจัดอันดับเมืองที่เขียนออกมาเป็นสมการชัดเจน เพื่อวัดคุณภาพชีวิต ความรู้สึกเป็นส่วนหนึ่ง ความทะเยอทะยาน และพื้นที่ชีวิตจริง",
      intro:
        "SLIC ถูกสร้างขึ้นเพื่อตอบโต้การจัดอันดับเมืองกระแสหลักที่มักให้รางวัลกับความมั่งคั่ง ภาพลักษณ์ที่เรียบร้อย และความเป็นทางการของระบบ มากกว่าจะให้ค่าน้ำหนักกับความปลอดภัย ความกดดันในชีวิต ความสามารถในการจ่าย ความอดทนต่อความแตกต่าง พลังธุรกิจ และพื้นผิวชีวิตจริงของเมือง เราจึงประกาศสมการสาธารณะ ชุดแหล่งข้อมูล ลำดับชั้นของข้อมูล และกติกาความครอบคลุมอย่างเปิดเผย",
      doctrineTitle: "หลักการทางการ",
      doctrineBody:
        "จัดอันดับเมืองที่คนสามารถอยู่ได้ดี รู้สึกเป็นส่วนหนึ่ง และเติบโตได้มากขึ้น SLIC ไม่ใช่ตาราง GDP ไม่ใช่คะแนนแก็ดเจ็ต และไม่ใช่ดัชนีความสบายอย่างเดียว",
      contextTitle: "ตัวแปรบริบทระดับประเทศ",
      contextItems: [
        "GDP ต่อหัว (PPP)",
        "การเติบโตของ GDP",
        "ค่าสัมประสิทธิ์จีนี",
        "อัตราภาษีที่ผู้ใช้กำหนด",
        "ตัวคูณ PPP ด้านการบริโภคภาคเอกชน",
      ],
      explicitTitle: "สิ่งที่สูตรสาธารณะทำให้เห็นชัด",
      explicitItems: [
        "ความปลอดภัยวัดจากผลลัพธ์ ไม่ใช่ความเข้มข้นของการเฝ้าระวัง",
        "ความเปิดกว้างวัดจากการอยู่ร่วมกันได้จริงและการเข้าถึงตลาดอย่างเท่าเทียม",
        "ธุรกิจและการเติบโตเป็นส่วนหนึ่งของคะแนนสาธารณะโดยตรง ไม่ใช่สมมติฐานแฝง",
      ],
    },
    readerGuide: {
      eyebrow: "คู่มือการอ่าน",
      title: "อ่านง่ายสำหรับสาธารณะ และทำซ้ำได้สำหรับนักวิเคราะห์",
      summary:
        "หน้า methodology ต้องตอบสองกลุ่มพร้อมกัน คือคนที่ต้องการเหตุผลแบบภาษาคน และคนที่ต้องการคำนวณโมเดลนี้กับชุดเมืองของตนเอง",
      layTitle: "เส้นทางอ่านแบบภาษาคน",
      technicalTitle: "เส้นทางอ่านแบบเทคนิค",
      laySteps: [
        "อ่านห้าเสาหลักเป็นห้าคำถามพื้นฐาน: จ่ายไหวไหม อยู่สบายและปลอดภัยไหม สร้างศักยภาพได้ไหม รู้สึกเป็นส่วนหนึ่งไหม และเมืองยังมีแรงผลักให้เติบโตไหม",
        "มองเทคโนโลยีเป็นชั้นสนับสนุน จะได้คะแนนก็ต่อเมื่อทำให้ชีวิตจริงดีขึ้น",
        "อ่านเมืองหรูแพงอย่างระมัดระวัง เพราะระบบที่ดีไม่ได้ลบภาระค่าใช้จ่าย ความเครียด หรือชุมชนที่บางเกินไป",
        "อ่านเมืองรองอย่างตั้งใจ เพราะ SLIC ถูกออกแบบมาเพื่อให้เมืองเหล่านี้ชนะได้เมื่อมีคุณค่าจริงและพื้นที่ให้ชีวิตดำเนินต่อ",
      ],
      technicalSteps: [
        "กำหนดเมืองเป็น functional urban area หรือหน่วยมหานครที่ป้องกันเชิงวิชาการได้",
        "เก็บข้อมูลระดับเมืองก่อน จากนั้นระดับภูมิภาค แล้วค่อยใช้ข้อมูลระดับชาติเป็น fallback พร้อมระบุ source tier ทุกตัวแปร",
        "คำนวณรายได้ใช้สอยจริงหลังภาษีและหลังค่าใช้จ่ายจำเป็นก่อนเริ่มให้คะแนน",
        "winsorize ที่ P5/P95 แปลงเป็น 0-100 กลับทิศคะแนนตัวแปรเชิงลบ และเผยแพร่ coverage grade ไปพร้อมกับอันดับ",
      ],
    },
    critiqueSection: {
      eyebrow: "ข้อจำกัดของอันดับเดิม",
      title: "ช่องว่างที่ SLIC พยายามปิด",
      summary:
        "ดัชนีเมืองเดิมมีประโยชน์ในการอ้างอิง แต่ส่วนใหญ่ตั้งอยู่บนทฤษฎีของเมืองที่ SLIC ไม่ได้ยอมรับทั้งหมด",
    },
    critiques: [
      {
        title: "ชื่อเสียงมักถูกสับสนกับความน่าอยู่",
        body: "หลายดัชนีให้คะแนนกับเมืองที่รวยและมีระบบทางการสวยงามอยู่แล้ว จึงยกเมืองบางแบบขึ้นมาโดยโครงสร้าง",
        implication: "SLIC แยกความน่าอยู่จริงออกจากชื่อเสียงของเมือง และใช้ GDP เป็นเพียงบริบท ไม่ใช่ชะตากรรม",
        citations: [1, 2, 14],
      },
      {
        title: "ข้อมูลที่มีอยู่จำกัดทำให้เมืองรองถูกตัดออกตั้งแต่ต้น",
        body: "เมืองจำนวนมากหายไปเพราะสถาปัตยกรรมของ benchmark รับเฉพาะเมืองที่มีชุดข้อมูลพร้อมใช้แบบสากลอยู่แล้ว",
        implication: "SLIC มี watchlist มี coverage grade และมี source ladder ที่เปิดเผยแทนการตัดเมืองทิ้งเงียบ ๆ",
        citations: [1, 14, 15],
      },
      {
        title: "ความปลอดภัยมักถูกอนุมานจากเครื่องมือ ไม่ใช่ผลลัพธ์",
        body: "แอป กล้อง หรือแดชบอร์ดอาจดูทันสมัย แต่เมืองยังไม่ปลอดภัยหรือมีบรรยากาศกดดันได้",
        implication: "SLIC วัดอันตราย การตกเป็นเหยื่อ และความมั่นใจในชีวิตประจำวันโดยตรง กล้องไม่ได้เพิ่มคะแนนเอง",
        citations: [1, 11, 13],
      },
      {
        title: "แรงกดดันในชีวิตมักถูกวัดน้อยเกินไป",
        body: "รายได้ใช้สอยจริงหลังค่าใช้จ่าย หนี้ ชั่วโมงงาน และการฆ่าตัวตาย เป็นตัวแปรสำคัญของชีวิตเมือง แต่ดัชนีจำนวนมากกลับให้ความสำคัญรองลงมา",
        implication: "SLIC จึงให้แรงกดดันและพื้นที่ชีวิตจริงเป็นเสาหลักสาธารณะเต็มรูปแบบ",
        citations: [1, 2, 3, 7],
      },
      {
        title: "จำนวนนักท่องเที่ยวมีประโยชน์ แต่ไม่ใช่คะแนนโบนัสอัตโนมัติ",
        body: "การท่องเที่ยวหนักอาจอยู่ร่วมกับความแออัด อาชญากรรม หรือเงื่อนไขเมืองแบบเอารัดเอาเปรียบได้",
        implication: "SLIC ใช้ visitor flow เป็นสัญญาณเชิงวัฒนธรรมที่ต้องผ่านการตรวจสอบด้านความปลอดภัย นิเวศวิทยา และแรงกดดันของเมืองก่อน",
        citations: [1],
      },
    ],
    processSection: {
      eyebrow: "การทดสอบวิธี",
      title: "โมเดลนี้ถูกกดดันจริงในห้องประชุม เวที และเวิร์กช็อป",
      summary:
        "SLIC ไม่ใช่สเปรดชีตที่คิดขึ้นครั้งเดียว แต่เป็นกรอบที่ถูกอธิบาย ท้าทาย และปรับแก้ซ้ำ ๆ ในสถานการณ์จริงก่อนจะตรึงเป็นสูตรสาธารณะ",
      figures: [
        {
          id: "process-stage-th",
          src: "/photos/report-people-stage.jpg",
          alt: "ผู้คนบนเวทีงานสาธารณะด้านเมือง",
          caption: "กรอบนี้ต้องอธิบายต่อสาธารณะให้รอด ไม่ใช่แค่สวยในเอกสารภายใน",
        },
        {
          id: "process-meeting-th",
          src: "/photos/report-people-meeting.jpg",
          alt: "การประชุมรอบโต๊ะพร้อมคอมพิวเตอร์และไมโครโฟน",
          caption: "สมมติฐานถูกตรวจในห้องทำงานที่ต้องป้องกันเหตุผลด้านข้อมูลและเหตุผลด้านเมืองพร้อมกัน",
        },
        {
          id: "process-workshop-th",
          src: "/photos/report-people-workshop.jpg",
          alt: "เวิร์กช็อปที่มีผู้บรรยายต่อหน้าผู้เข้าร่วม",
          caption: "การทดลองใช้ช่วยแยกตัวชี้วัดที่ดูดีออกจากตัวชี้วัดที่อธิบายชีวิตเมืองได้จริง",
        },
      ],
    },
    flowSection: {
      eyebrow: "ลำดับการคำนวณ",
      title: "ข้อมูลดิบกลายเป็นคะแนน SLIC ได้อย่างไร",
      summary:
        "ลำดับการคำนวณถูกทำให้สั้นและตรวจสอบได้: ข้อมูลดิบ, คะแนน normalized, คะแนนเสาหลัก, แล้วจึงรวมเป็นคะแนนสุดท้าย",
      stages: [
        { id: "raw-th", title: "ข้อมูลดิบ", body: "เก็บสัญญาณจากระดับเมือง มหานคร ภูมิภาค และประเทศ พร้อม source tier", formula: "x_m(c)" },
        { id: "normalized-th", title: "การ normalize", body: "winsorize ที่ P5/P95 แปลงเป็น 0-100 และกลับทิศตัวแปรเชิงลบ", formula: "s_m(c)" },
        { id: "pillars-th", title: "รวมเป็นเสาหลัก", body: "รวมตัวชี้วัดตามน้ำหนักภายในเสาหลักที่ประกาศไว้", formula: "P_p(c) = Sum alpha_(p,m) x s_m(c)" },
        { id: "final-th", title: "คะแนนสุดท้าย", body: "ใช้สูตรสาธารณะเพียงสูตรเดียว พร้อม coverage grade", formula: "SLIC(c)" },
      ],
    },
    remoteSensingSection: {
      eyebrow: "ชั้นข้อมูลดาวเทียม",
      title: "ข้อมูลดาวเทียมช่วยขยายกรอบของเมืองเมื่อเซนเซอร์ภาคพื้นดินไม่ครอบคลุมพอ",
      summary:
        "SLIC ใช้ remote sensing เพื่อขยายพื้นที่มองเห็นของข้อมูล โดยเฉพาะเมื่อสถานีตรวจวัดในเมืองมีจำนวนน้อย กระจุกตัว หรือไม่สม่ำเสมอจนไม่สามารถอธิบาย airshed และขอบนิเวศของเมืองได้ครบ ชั้นข้อมูลดาวเทียมเป็น supporting evidence ไม่ใช่ความจริงแบบเวทมนตร์",
      quantifyTitle: "สิ่งที่ชั้นข้อมูลดาวเทียมช่วย quantify",
      quantifyItems: [
        "ภาระ aerosol และองค์ประกอบของบรรยากาศในกรอบเมืองที่กว้างกว่า",
        "ระดับความเขียวและ vegetation buffering ผ่านผลิตภัณฑ์ลักษณะ NDVI",
        "land cover ความชื้น และบริบทของพื้นผิวรอบเมืองหนาแน่น",
        "การเคลื่อนตัวของมลพิษระดับภูมิภาคที่สถานีในเมืองอาจจับไม่ครบ",
      ],
      qualifyTitle: "สิ่งที่นักวิเคราะห์ยังต้อง qualify เพิ่ม",
      qualifyItems: [
        "ภูมิประเทศ แนวชายฝั่ง ลม และทิศทางควันตามฤดูกาล",
        "ความต่างระหว่าง hotspot เฉพาะจุดกับสภาพของทั้งเมือง",
        "urban form street canyon และวิธีที่คนในเมืองสัมผัสสภาวะเหล่านั้นจริง",
        "การยืนยันจากข้อมูลภาครัฐ testimony และหลักฐานในพื้นที่จริง",
      ],
      workflowTitle: "ชั้นดาวเทียมเข้าสู่วิธีอย่างไร",
      workflowStages: [
        {
          id: "remote-official-th",
          title: "ข้อมูลทางการด้านสิ่งแวดล้อมและเมือง",
          body: "เซนเซอร์ภาคพื้นดิน รายงานสาธารณูปโภค คุณภาพอากาศ และรายงานทางการยังเป็นชั้นข้อมูลหลักเมื่อมีอยู่จริง",
        },
        {
          id: "remote-context-th",
          title: "การแก้และเติมบริบทด้วย remote sensing",
          body: "Copernicus, JAXA และชั้นข้อมูลสาธารณะจาก Landsat ช่วยขยายกรอบเรื่อง aerosol การเคลื่อนตัวของมลพิษ พืชพรรณ และแรงกดดันเชิงนิเวศรอบเมือง",
        },
        {
          id: "remote-listening-th",
          title: "Social listening และคำบอกเล่าจากเมือง",
          body: "เสียงบ่นของคนเมือง ประสบการณ์ของผู้มาเยือน และความเข้มของการพูดถึง ช่วยบอกว่าปัญหาที่แผนที่เห็นนั้นถูกสัมผัสจริงในชีวิตประจำวันหรือไม่",
        },
        {
          id: "remote-judgement-th",
          title: "การตัดสินสุดท้ายของเมือง",
          body: "นักวิเคราะห์ SLIC อ่านทั้งสามชั้นร่วมกัน เพื่อให้ดาวเทียมทำหน้าที่สนับสนุนการตัดสิน ไม่ใช่แกล้งทำเป็นแทนความจริงภาคพื้นดินได้ทั้งหมด",
        },
      ],
      citations: [17, 18, 19, 20, 21, 22, 23, 24, 25],
    },
    equationSection: {
      eyebrow: "แกนคณิตศาสตร์",
      title: "ชั้นสมการที่ใช้จริง",
      summary:
        "คะแนนสาธารณะใช้ fixed weights, directionality ที่ประกาศชัด และสมการที่ตรวจสอบได้ ทุกสมการที่แสดงคือส่วนหนึ่งของวิธีจริง ไม่ใช่ของตกแต่ง",
      groups: [
        {
          id: "official-th",
          eyebrow: "คะแนนสาธารณะ",
          title: "สูตรทางการที่เผยแพร่",
          summary: "นี่คือแกนคำนวณที่ใช้จริงทั้งบนเว็บไซต์และในเวิร์กบุ๊ก",
          equations: [
            {
              id: "official-score-th",
              title: "คะแนน SLIC อย่างเป็นทางการ",
              formula:
                "SLIC(c) = 0.25 Pressure(c) + 0.22 Viability(c) + 0.18 Capability(c) + 0.15 Community(c) + 0.20 Creative(c)",
              explanation:
                "บอร์ดสาธารณะใช้สูตรถ่วงน้ำหนักทางการเพียงสูตรเดียว โดยให้ Pressure เป็นสัดส่วนใหญ่สุด และคง Viability, Capability, Community และ Creative ไว้อย่างเปิดเผย",
              citations: [1],
            },
            {
              id: "disposable-income-th",
              title: "รายได้ใช้สอยจริงแบบ PPP หลังภาษี",
              formula:
                "DI_ppp(c) = ((GrossIncome(c) x (1 - TaxRate(country(c)))) - Rent(c) - Utilities(c) - Transit(c) - Internet(c) - Food(c)) / PPP_private_consumption(country(c))",
              explanation:
                "นี่คือตัวแปรหลักของพื้นที่ชีวิตจริง เปลี่ยนเงินที่เหลือหลังภาษีและค่าใช้จ่ายจำเป็นให้เทียบกันข้ามเมืองได้",
              citations: [2, 7],
            },
          ],
        },
        {
          id: "normalization-th",
          eyebrow: "กลไกของตัวชี้วัด",
          title: "การ normalize และกติกาข้อมูลขาดหาย",
          summary: "ข้อมูลดิบจะถูกรวมกันได้ก็ต่อเมื่อจัดการเรื่องทิศทางของคะแนนและ missingness อย่างเปิดเผย",
          equations: [
            {
              id: "metric-normalization-th",
              title: "คะแนนตัวชี้วัดหลัง winsorize",
              formula:
                "s_m(c) = 100 x clamp((winsor(x_m(c)) - P5_m) / (P95_m - P5_m), 0, 1)",
              explanation:
                "ตัวแปรเชิงบวกคำนวณตรง ตัวแปรเชิงลบจะกลับทิศตัวเศษเพื่อให้คะแนนที่สูงหมายถึงผลลัพธ์ที่ดีกว่าเสมอ",
              citations: [1],
            },
            {
              id: "coverage-score-th",
              title: "คะแนนความครอบคลุมแบบถ่วงน้ำหนัก",
              formula:
                "Coverage(c) = Sum over observed metrics m of gamma_m / Sum over required metrics m of gamma_m",
              explanation:
                "coverage ถูกถ่วงน้ำหนักตามความสำคัญของตัวแปร เมืองที่ข้อมูลสำคัญบางไม่สามารถซ่อนอยู่หลังตัวแปรย่อยจำนวนมากได้",
              citations: [1, 14, 15],
            },
          ],
        },
        {
          id: "subscores-th",
          eyebrow: "สมการย่อยที่สาธารณะเห็น",
          title: "คะแนนย่อยที่ยังต้องมองเห็นได้",
          summary: "สมการของเสาหลักที่มองเห็นได้ด้านล่างตรงกับโครงสร้างในเวิร์กบุ๊กที่ใช้คำนวณคะแนนสาธารณะ",
          equations: [
            {
              id: "safety-viability-th",
              title: "เสาหลัก Viability",
              formula:
                "Viability(c) = 0.23 PersonalSafety + 0.23 TransitAccess + 0.18 CleanAir + 0.18 WaterUtility + 0.18 DigitalInfrastructure",
              explanation:
                "Viability ให้รางวัลกับความปลอดภัยจริง นิเวศวิทยา และความเสถียรของระบบชีวิตประจำวัน โดยไม่ให้คะแนนกับ surveillance intensity",
              citations: [3, 5, 11, 13, 17],
            },
            {
              id: "community-tolerance-th",
              title: "เสาหลัก Community",
              formula:
                "Community(c) = 0.33 HospitalityBelonging + 0.33 TolerancePluralism + 0.33 PublicLifeVitality",
              explanation:
                "Community ถูกวัดจากการอยู่ร่วมกันได้จริง การเข้าถึงตลาดอย่างเท่าเทียม และชีวิตสาธารณะ ไม่ใช่จากภาพลักษณ์เชิงสัญลักษณ์",
              citations: [1, 14, 16],
            },
            {
              id: "business-growth-th",
              title: "เสาหลัก Creative",
              formula:
                "Creative(c) = 0.30 EntrepreneurialDynamism + 0.25 InnovationResearchIntensity + 0.25 EconomicVitality + 0.20 AdministrativeFriction",
              explanation:
                "Creative จะสูงขึ้นเมื่อเมืองสนับสนุนผู้ประกอบการ ความเข้มข้นของการวิจัย โมเมนตัมทางเศรษฐกิจ และลดแรงเสียดทานด้านการบริหาร",
              citations: [2, 10, 16],
            },
          ],
        },
      ],
    },
    glossarySection: {
      eyebrow: "ตารางสัญลักษณ์",
      title: "ความหมายของสัญลักษณ์ทั้งหมด",
      summary:
        "สัญลักษณ์ถูกทำให้กระชับและนิยามเพียงครั้งเดียว เพื่อให้ผู้อ่านภายนอกทำซ้ำหรือ audit โมเดลได้",
      symbols: [
        { symbol: "c", definition: "เมืองหรือ functional urban area", explanation: "หน่วยเมืองที่ถูกให้คะแนน" },
        { symbol: "m", definition: "ดัชนีตัวชี้วัด", explanation: "ตัวแปรดิบ เช่น ภาระค่าเช่า PM2.5 หรือความง่ายในการเปิดธุรกิจ" },
        { symbol: "p", definition: "ดัชนีเสาหลัก", explanation: "หนึ่งในห้าเสาหลักสาธารณะ" },
        { symbol: "x_m(c)", definition: "ค่าดิบของตัวชี้วัด", explanation: "ค่าที่สังเกตได้ของตัวแปร m ในเมือง c ก่อน normalize" },
        { symbol: "winsor(.)", definition: "ตัวดำเนินการ winsorize", explanation: "ตัดค่าปลายสุดให้อยู่ในช่วง P5/P95 ก่อนให้คะแนน" },
        { symbol: "P5_m, P95_m", definition: "จุดยึดเปอร์เซ็นไทล์", explanation: "ขอบล่างและขอบบนของตัวแปร m" },
        { symbol: "s_m(c)", definition: "คะแนน normalized", explanation: "คะแนน 0-100 หลังจัดการ outlier และทิศทางของตัวแปร" },
        { symbol: "alpha_(p,m)", definition: "น้ำหนักของตัวชี้วัดภายในเสาหลัก", explanation: "บอกว่าตัวแปร m ส่งผลต่อเสาหลัก p มากแค่ไหน" },
        { symbol: "gamma_m", definition: "น้ำหนักความครอบคลุม", explanation: "ใช้คำนวณ coverage เมื่อมีข้อมูลขาดหาย" },
        { symbol: "w_p", definition: "น้ำหนักเสาหลักสาธารณะ", explanation: "น้ำหนักที่ใช้รวมคะแนนสุดท้าย" },
        { symbol: "DI_ppp(c)", definition: "พื้นที่รายได้ใช้สอยจริงแบบ PPP", explanation: "เงินที่เหลือหลังภาษีและค่าใช้จ่ายจำเป็นในหน่วย PPP" },
      ],
    },
    workedExampleSection: {
      eyebrow: "ตัวอย่างคำนวณ",
      title: "ตัวอย่างการคำนวณแบบ illustrative",
      summary:
        "ตัวอย่างนี้มีไว้เพื่ออธิบายเส้นทางของคณิตศาสตร์ ไม่ใช่แถวข้อมูลที่ผ่านการ audit แล้วในเวิร์กบุ๊ก",
      example: {
        city: "Bangkok preview computation",
        note: "ตัวอย่างเชิงอธิบายโดยใช้ค่าพรีวิว เพื่อแสดงเส้นทางของสมการ ไม่ใช่ค่าทางการสุดท้าย",
        inputs: [
          { label: "Gross income", value: "$33,500", note: "รายได้ตัวอย่างในระดับเมือง" },
          { label: "Effective tax rate", value: "18%", note: "ตัวแปรบริบทประเทศที่ผู้ใช้ป้อน" },
          { label: "Essential costs", value: "$15,900", note: "ค่าเช่า ค่าน้ำไฟ อินเทอร์เน็ต เดินทาง และอาหาร" },
          { label: "PPP private consumption factor", value: "0.72", note: "ชั้น conversion ของ World Bank" },
          { label: "Illustrative pillar bundle", value: "Pressure 71 / Viability 84 / Capability 80 / Community 86 / Creative 76", note: "ค่าหลังรวมตัวแปรภายในเสาหลัก" },
        ],
        steps: [
          {
            title: "พื้นที่รายได้หลังภาษีและค่าใช้จ่ายจำเป็น",
            formula: "DI_ppp = ((33,500 x (1 - 0.18)) - 15,900) / 0.72",
            result: "DI_ppp = 16,069",
            explanation: "เปลี่ยนเงินที่เหลือจริงให้เป็นหน่วย PPP เพื่อให้เทียบข้ามเมืองได้",
          },
          {
            title: "ตัวอย่าง normalize ตัวแปรเชิงลบ",
            formula: "SafetyScore = 100 x ((12.0 - 3.2) / (12.0 - 1.4))",
            result: "SafetyScore = 83.0",
            explanation: "เพราะความรุนแรงเป็นตัวแปรเชิงลบ จึงกลับทิศเพื่อให้ความรุนแรงต่ำได้คะแนนสูง",
          },
          {
            title: "การรวมคะแนนภายในเสาแรงกดดัน",
            formula: "Pressure = (9x82 + 5x64 + 4x61 + 4x74 + 3x58) / 25",
            result: "Pressure = 70.9",
            explanation: "น้ำหนักตัวแปรภายในเสารวมกันเป็น 25 ก่อนยุบเป็นคะแนนเสาหลักเดียว",
          },
          {
            title: "คะแนนสาธารณะสุดท้าย",
            formula: "SLIC = 0.25x71 + 0.22x84 + 0.18x80 + 0.15x86 + 0.20x76",
            result: "SLIC = 78.73",
            explanation: "ห้าเสาหลักสาธารณะถูกรวมเพียงครั้งเดียว ด้วยน้ำหนักทางการที่ประกาศชัด",
          },
        ],
        finalScore: "78.73",
        conclusion:
          "ตัวอย่างนี้แสดงให้เห็นว่าเมืองอย่างกรุงเทพฯ สามารถมีจุดแข็งด้านชุมชนและพลังเมืองได้จริง ขณะเดียวกันก็ยังถูกหักคะแนนจากแรงกดดันหรือสิ่งแวดล้อมอย่างโปร่งใส",
      },
    },
    modelSection: {
      eyebrow: "ขอบเขตของวิธี",
      title: "มีสูตรสาธารณะเพียงชุดเดียว ส่วน diagnostics แยกออกต่างหาก",
      summary:
        "คะแนนสาธารณะมาจาก fixed weighted model เพียงชุดเดียว ส่วน diagnostics ภายในอาจใช้ตรวจคุณภาพข้อมูลหรือโครงสร้างตัวแปร แต่ไม่แก้อันดับที่เผยแพร่",
      families: [
        {
          id: "weighted-th",
          title: "Public weighted model",
          formula: "SLIC(c) = Sum over pillars p of w_p x P_p(c)",
          role: "คะแนนที่เผยแพร่",
          explanation: "นี่คือเครื่องยนต์สาธารณะอย่างเป็นทางการ อธิบายง่าย ทำซ้ำได้ และตรงกับสิ่งที่ผู้อ่านเห็นบนหน้าอันดับ",
        },
        {
          id: "diagnostics-th",
          title: "Internal diagnostics",
          formula: "Diagnostics(c) do not modify SLIC(c)",
          role: "การตรวจแบบไม่ให้คะแนน",
          explanation: "การตรวจความสอดคล้อง การทดสอบโครงสร้าง และการทบทวนของนักวิเคราะห์อาจใช้เพื่อจับข้อมูลที่อ่อนหรือไม่สมเหตุผล แต่ไม่เพิ่มโบนัสหรือบทลงโทษลับในคะแนนสาธารณะ",
        },
      ],
    },
    countryContextSection: {
      eyebrow: "บริบทระดับประเทศ",
      title: "ความแข็งแรงระดับมหภาคมีผล แต่ครอบงำคะแนนไม่ได้",
      summary:
        "GDP ต่อหัว การเติบโต ความเหลื่อมล้ำ PPP และภาษี มีผลต่อวิธีนี้ แต่ทั้งหมดเข้าสู่สูตรในฐานะตัวแปรปรับหรือบริบท ไม่ใช่ตัวตัดสินอันดับโดยตรง",
    },
    weightChartLabel: "ของคะแนนทางการ",
    pillarsSection: {
      eyebrow: "เสาหลักทางการ",
      title: "ห้าเสาหลักสาธารณะที่อยู่เบื้องหลังคะแนน",
      summary:
        "เสาทุกต้นด้านล่างตรงกับน้ำหนักและโครงสร้างในเวิร์กบุ๊กที่ใช้คำนวณคะแนนสาธารณะ",
    },
    pillars: [
      {
        id: "pressure",
        name: "Growth",
        weight: 25,
        thesis: "พลวัตเศรษฐกิจกำหนดทิศทางเมือง การเติบโตเชิญชวนทุนนิยมและกลไกตลาดที่ส่งผลต่อค่าครองชีพ เว้นแต่รัฐจะจัดสวัสดิการ",
        justification: "เสานี้วัดพลังเศรษฐกิจและผลกระทบต่อชีวิตจริงของคนเมือง",
        citations: [2, 3, 7],
        metrics: [
          { name: "รายได้ใช้สอยจริงแบบ PPP หลังภาษี", weight: 9, description: "เงินคงเหลือหลังภาษีและค่าใช้จ่ายจำเป็น แปลงเป็น PPP", inputs: ["gross income", "tax rate", "rent", "utilities", "internet", "transport", "food", "PPP factor"] },
          { name: "ภาระที่อยู่อาศัย", weight: 5, description: "สัดส่วนต้นทุนที่อยู่อาศัยต่อรายได้ครัวเรือนหรือรายได้ของคนเริ่มทำงาน", inputs: ["median rent", "housing-cost share"] },
          { name: "ภาระหนี้ครัวเรือน", weight: 4, description: "หนี้เทียบกับรายได้ใช้สอยจริงหรือ proxy ที่ดีที่สุด", inputs: ["household debt", "disposable income"] },
          { name: "แรงกดดันจากชั่วโมงงาน", weight: 4, description: "ชั่วโมงงานเฉลี่ยและสัดส่วนการทำงานเกิน 48 ชั่วโมง", inputs: ["weekly hours", "overwork share"] },
          { name: "การฆ่าตัวตายและภาวะเครียดรุนแรง", weight: 3, description: "การฆ่าตัวตายหรือ mental-harm proxy ที่ป้องกันเชิงวิชาการได้", inputs: ["suicide rate", "mental-health harm proxy"] },
        ],
      },
      {
        id: "viability",
        name: "Viability",
        weight: 22,
        thesis: "ชีวิตประจำวันควรปลอดภัยกว่า หายใจได้ง่ายกว่า เดินทางได้ และมีระบบพื้นฐานที่ทำงานโดยไม่กดทับคน",
        justification: "นี่คือพื้นที่ที่เมืองมีสมรรถนะจะได้คะแนน แต่ต้องเป็นสมรรถนะที่สร้างผลลัพธ์จริง",
        citations: [3, 5, 11, 13, 17],
        metrics: [
          { name: "ความปลอดภัยส่วนบุคคล", weight: 5, description: "อันตราย อาชญากรรมรุนแรง การตกเป็นเหยื่อของผู้มาเยือน และสัญญาณความปลอดภัยยามค่ำคืน", inputs: ["homicide", "serious violent crime", "victimization", "night-safety proxy"] },
          { name: "การเข้าถึงขนส่งและภาระเวลาเดินทาง", weight: 5, description: "ระยะการเข้าถึงระบบขนส่งรวมกับเวลาเดินทางและการใช้งานช่วงดึก", inputs: ["GTFS", "commute time", "coverage"] },
          { name: "อากาศสะอาด", weight: 4, description: "PM2.5 และการเผชิญมลพิษรุนแรง พร้อมข้อมูล CAMS และ OpenAQ", inputs: ["PM2.5", "exceedance", "aerosol context"] },
          { name: "น้ำ สุขาภิบาล และความเสถียรของสาธารณูปโภค", weight: 4, description: "น้ำสะอาด สุขาภิบาล และความต่อเนื่องของบริการพื้นฐาน", inputs: ["WASH access", "interruptions", "compliance"] },
          { name: "โครงสร้างพื้นฐานดิจิทัล", weight: 4, description: "คุณภาพอินเทอร์เน็ต ความสามารถในการจ่าย และความพร้อมด้านไฟเบอร์", inputs: ["fixed broadband", "affordability", "internet performance"] },
        ],
      },
      {
        id: "capability",
        name: "Capability",
        weight: 18,
        thesis: "เมืองที่จริงจังต้องให้คนเข้าถึงสุขภาพที่ดี การศึกษาที่ดี และทางผ่านที่เป็นธรรมสู่ชีวิตผู้ใหญ่",
        justification: "เสานี้ให้ความสำคัญกับคุณภาพและการเข้าถึงจริง ไม่ใช่นับจำนวนสถาบันอย่างเดียว",
        citations: [3, 6, 8, 9, 14, 15],
        metrics: [
          { name: "คุณภาพของระบบสุขภาพ", weight: 8, description: "amenable mortality ศักยภาพของระบบ และการเข้าถึงการรักษาที่มีประสิทธิผล", inputs: ["avoidable mortality", "quality outcomes", "provider capacity"] },
          { name: "คุณภาพของการศึกษา", weight: 6, description: "ผลลัพธ์การเรียนรู้ การจบการศึกษา และสายทักษะ", inputs: ["PISA", "UIS outcomes", "completion", "skills pipeline"] },
          { name: "โอกาสที่เท่าเทียมและความเป็นธรรมในการกระจาย", weight: 4, description: "ช่องว่างทางเพศ NEET และสัญญาณความเป็นธรรมในการกระจายโอกาส", inputs: ["gender data", "NEET", "Gini", "labour gaps"] },
        ],
      },
      {
        id: "community",
        name: "Community",
        weight: 15,
        thesis: "การต้อนรับ การอยู่ร่วมกันได้ และการอ่านตัวเองออกในเมือง เป็นส่วนหนึ่งของผลิตภัณฑ์ที่เมืองสร้างขึ้น",
        justification: "นี่คือพื้นที่ที่เมืองที่เป็นมิตรสามารถชนะเมืองที่เย็นชาได้ แม้ทั้งคู่จะมีระบบจัดการที่ดี",
        citations: [1, 14, 16],
        metrics: [
          { name: "การต้อนรับและความรู้สึกเป็นส่วนหนึ่ง", weight: 5, description: "ความรู้สึกต้อนรับ ความผูกพันของผู้อยู่อาศัย และการใช้งานหลายภาษา", inputs: ["social listening", "testimony audit", "multilingual services"] },
          { name: "ความเปิดกว้างและพหุนิยม", weight: 5, description: "การอยู่ร่วมกันได้อย่างลื่นไหล การเข้าถึงตลาดอย่างเท่าเทียม และเสรีภาพในการใช้ชีวิต", inputs: ["legal openness", "discrimination proxy", "market-access signal"] },
          { name: "ชีวิตสาธารณะและพลังทางวัฒนธรรม", weight: 5, description: "third places ความต่อเนื่องทางประวัติศาสตร์ และ visitor pull ที่ถูกตรวจด้วย civic strain", inputs: ["venues", "events", "public attention", "visitor flow"] },
        ],
      },
      {
        id: "creative",
        name: "Creative",
        weight: 20,
        thesis: "เมืองไม่ควรเพียงลดความทุกข์ แต่ต้องสร้างความทะเยอทะยาน การประดิษฐ์ และพลังทางเศรษฐกิจเชิงผลิตภาพด้วย",
        justification: "เสานี้ป้องกันไม่ให้ SLIC สับสนระหว่างความสงบกับความชะงัก หรือความสบายกับความสามารถในการแข่งขัน",
        citations: [2, 10, 16],
        metrics: [
          { name: "พลวัตของผู้ประกอบการ", weight: 6, description: "การเกิดของธุรกิจใหม่และความเร็วของกิจกรรมเชิงผลิตภาพในเมือง", inputs: ["new business density", "firm formation", "entrepreneurial activity"] },
          { name: "ความเข้มข้นของนวัตกรรมและการวิจัย", weight: 5, description: "สิทธิบัตร ความลึกของการวิจัย และความสามารถของเมืองในการสร้างแนวคิดใหม่", inputs: ["patents", "R&D", "research institutions"] },
          { name: "พลังเศรษฐกิจและบริบทเชิงผลิตภาพ", weight: 5, description: "สัญญาณการลงทุน บริบทเศรษฐกิจเชิงผลิตภาพ และ runway ทางเศรษฐกิจของเมือง", inputs: ["investment signal", "GDP per capita PPP", "GDP growth"] },
          { name: "แรงเสียดทานด้านการบริหารและการลงทุน", weight: 4, description: "ความยุ่งยากด้านราชการ ความไม่แน่นอน หรือภาระใบอนุญาตที่ขัดขวางการลงมือทำ", inputs: ["administrative friction", "permitting burden", "rule consistency"] },
        ],
      },
    ],
    protocolSection: {
      eyebrow: "โปรโตคอลการจัดอันดับ",
      title: "เมืองเข้าระบบ อยู่ในระบบ และถูกเผยแพร่อย่างไร",
      summary:
        "การจัดอันดับต้องจัดการข้อมูลขาดหายและความต่างของขนาดเมืองอย่างซื่อสัตย์ เมืองที่ดังไม่ควรได้สิทธิพิเศษ และเมืองที่ข้อมูลบางก็ไม่ควรมีความแม่นยำปลอม",
    },
    rules: [
      {
        title: "ใช้ functional urban area ไม่ใช่แค่เขตเทศบาล",
        body: "SLIC วัดเมืองตามตลาดแรงงานและพื้นที่บริการจริงของเมือง ไม่ใช่แค่แกนเมืองแบบทางการ",
        citations: [12],
      },
      {
        title: "มีสูตรทางการเพียงสูตรเดียว",
        body: "บอร์ดสาธารณะใช้สูตรเดียว ส่วนการปรับน้ำหนักโดยผู้ใช้อาจมีได้ภายหลังในฐานะเครื่องมือสำรวจ ไม่ใช่อันดับทางการ",
        citations: [1],
      },
      {
        title: "ต้องผ่าน coverage gate ก่อนถูกจัดอันดับ",
        body: "เมืองจะติดอันดับได้ต่อเมื่อ coverage แบบถ่วงน้ำหนักผ่านเกณฑ์ และไม่มีเสาใดว่างจนวิกฤต มิฉะนั้นจะอยู่ใน watchlist เท่านั้น",
        citations: [1, 14, 15],
      },
      {
        title: "ความปลอดภัยวัดจากผล ไม่ใช่จากกล้อง",
        body: "จำนวนกล้องหรือ smart-city theatre ไม่ได้เพิ่มคะแนนเอง สิ่งที่เพิ่มคะแนนคืออันตรายที่ลดลงและความมั่นใจในชีวิตประจำวัน",
        citations: [1, 3],
      },
      {
        title: "ความเปิดกว้างวัดจากผลกระทบที่เกิดขึ้นจริง",
        body: "SLIC ไม่จัดอันดับศาสนาหรืออัตลักษณ์โดยตรง แต่ดูว่าคนสามารถอยู่ ทำงาน และเข้าร่วมทางเศรษฐกิจได้โดยมี friction ต่ำเพียงใด",
        citations: [1, 14],
      },
      {
        title: "แรงดึงดูดของผู้มาเยือนเป็นเพียงบริบท",
        body: "visitor flow จะถูกนับเป็นสัญญาณทางวัฒนธรรมก็ต่อเมื่อผ่านการตรวจด้านความแออัด ความปลอดภัย นิเวศวิทยา และพื้นที่ของผู้อยู่อาศัย",
        citations: [1],
      },
    ],
    sourceSection: {
      eyebrow: "ลำดับชั้นของแหล่งข้อมูล",
      title: "โมเดลเชื่อข้อมูลประเภทไหนก่อน",
      summary:
        "ลำดับนี้ทำให้เห็นระยะห่างของข้อมูลอย่างเปิดเผย ข้อมูลระดับเมืองมีน้ำหนักมากกว่าข้อมูลระดับชาติ และ proxy ที่ผ่านการ audit ดีกว่าตัวเลขสะดวกใช้ที่ไม่มีที่มา",
    },
    sourceTiers: thaiSourceTiers,
    worksheetSection: {
      eyebrow: "ตารางคะแนน",
      title: "ตารางรายเมืองที่อยู่เบื้องหลังอันดับ",
      summary:
        "เมื่อโหลดชุดเมืองแล้ว คอลัมน์เหล่านี้จะถูกเติมและโมเดลจะคำนวณคะแนนเสาหลัก คะแนน SLIC และ coverage grade ออกมา",
    },
    worksheetColumns,
    referencesSection: {
      eyebrow: "เอกสารอ้างอิง",
      title: "คลังแหล่งข้อมูลที่รองรับกรอบนี้",
      summary:
        "หน้า methodology อ้างถึงทั้ง benchmarking memo ภายในและเอกสารทางการที่จะใช้ตรึงเวิร์กบุ๊กและโมเดลสาธารณะ",
    },
    references: methodologyReferences,
  },
  zh: {
    hero: {
      eyebrow: "Methodology paper",
      title: "SLIC 方法论",
      strapline:
        "一套把宜居性、归属感、抱负与真实生活空间写成明确数学结构的城市排名方法。",
      intro:
        "SLIC 之所以存在，是因为主流城市排名往往过度奖赏财富、制度抛光与品牌声望，却低估安全、生活压力、真实可负担性、包容度、商业活力与城市日常肌理。SLIC 因此公开它的分数公式、数据来源层级、覆盖规则以及可以被审计和复现的城市工作表。",
      doctrineTitle: "官方原则",
      doctrineBody:
        "排名那些让人可以生活得好、获得归属、并且变得更强的城市。SLIC 不是 GDP 榜，不是炫技榜，也不是只谈舒适的榜单。",
      contextTitle: "国家层面的背景变量",
      contextItems: [
        "人均 GDP（PPP）",
        "GDP 增长",
        "基尼系数",
        "用户输入的税率",
        "私人消费 PPP 因子",
      ],
      explicitTitle: "公开公式明确写出的东西",
      explicitItems: [
        "安全按结果计分，而不是按监控密度计分。",
        "包容度按低摩擦共处与平等市场准入计分。",
        "商业与增长是公开分数项，而不是藏在背景里的偏好。",
      ],
    },
    readerGuide: {
      eyebrow: "阅读指南",
      title: "既给普通读者看，也给技术读者复现",
      summary:
        "这份方法论必须同时服务两类人：想看论点的人，以及想把这套方法用到自己城市清单上的人。",
      layTitle: "面向普通读者",
      technicalTitle: "面向技术读者",
      laySteps: [
        "把五个支柱读成五个问题：我能不能在这里负担生活？能不能安全呼吸和移动？能不能建立能力？能不能获得归属？这座城市还会不会激发抱负？",
        "把技术看成支撑层。只有改善真实生活时，它才得分。",
        "谨慎阅读高价名城。系统强，不代表压力、住房负担与共同体问题会自动消失。",
        "认真看待二线城市。SLIC 就是为了让它们在真正提供价值、好客与生活空间时有机会赢。",
      ],
      technicalSteps: [
        "把城市定义为 functional urban area 或最可辩护的都会区单元。",
        "优先收集城市级数据，再到次国家层级，最后才用国家级 fallback，并记录 source tier。",
        "在任何打分前，先计算税后 PPP 可支配生活空间；工资本身不够。",
        "在 P5/P95 做 winsorization，统一缩放到 0-100，对负向指标反向计分，并把 coverage grade 与榜单一起发布。",
      ],
    },
    critiqueSection: {
      eyebrow: "旧排名的问题",
      title: "SLIC 想修正的偏差",
      summary:
        "现有城市指数有研究价值，但它们大多建立在 SLIC 并不完全接受的城市理论上。",
    },
    critiques: [
      {
        title: "声望常常被误当成宜居性",
        body: "很多榜单会结构性地抬高本来就富有、规范化程度高、品牌清晰的城市。",
        implication: "SLIC 把真实生活可行性与城市声望拆开，并把 GDP 当作背景而不是命运。",
        citations: [1, 2, 14],
      },
      {
        title: "数据稀缺会让被低估的城市在计分前就消失",
        body: "很多二线城市不是因为不值得比较，而是因为现成国际数据不方便，直接被排除在样本之外。",
        implication: "SLIC 保留 watchlist、公布 coverage grade，并公开 source ladder，而不是静悄悄删掉城市。",
        citations: [1, 14, 15],
      },
      {
        title: "安全常被用 smart 工具替代",
        body: "App、平台和监控硬件可以很显眼，但真实城市仍然可能不安全或压迫感很强。",
        implication: "SLIC 直接看伤害、受害与日常信心；摄像头本身不加分。",
        citations: [1, 11, 13],
      },
      {
        title: "生活压力通常被低估",
        body: "税后剩余收入、债务、工时与自杀率才是真实城市生活的核心变量，但常常被弱化甚至缺席。",
        implication: "SLIC 给压力与生活空间一个完整的公开权重。",
        citations: [1, 2, 3, 7],
      },
      {
        title: "游客量有信息，但绝不是自动加分",
        body: "高旅游量完全可能与拥堵、犯罪或剥夺性的城市条件同时存在。",
        implication: "SLIC 只在游客量通过安全、生态与居民生活空间检查后，把它当作文化需求信号使用。",
        citations: [1],
      },
    ],
    processSection: {
      eyebrow: "方法验证",
      title: "模型在会议、论坛与工作坊里被反复压测",
      summary:
        "SLIC 不是一次性做出来的表格，而是在解释、争论、测试与修正中逐渐冻结成公开公式的。",
      figures: [
        {
          id: "process-stage-zh",
          src: "/photos/report-people-stage.jpg",
          alt: "城市议题公开活动中的舞台场景。",
          caption: "这套框架必须经得起公开说明，而不只是内部自洽。",
        },
        {
          id: "process-meeting-zh",
          src: "/photos/report-people-meeting.jpg",
          alt: "围桌会议场景，桌上有电脑与麦克风。",
          caption: "假设在真实工作会议中被检验，数据选择与城市逻辑都要能被说明。",
        },
        {
          id: "process-workshop-zh",
          src: "/photos/report-people-workshop.jpg",
          alt: "讲者面对听众进行工作坊说明。",
          caption: "试点讨论帮助我们把“看起来漂亮”的指标与真正解释城市生活的指标区分开来。",
        },
      ],
    },
    flowSection: {
      eyebrow: "评分流程",
      title: "原始指标如何变成公开 SLIC 分数",
      summary:
        "评分流程故意保持短而透明：原始指标、标准化指标分数、支柱聚合，最后才是总分。",
      stages: [
        { id: "raw-zh", title: "原始指标", body: "采集城市、都会区、次国家与国家层级信号，并标注 source tier。", formula: "x_m(c)" },
        { id: "normalized-zh", title: "标准化", body: "在 P5/P95 做 winsorization，缩放到 0-100，并对负向变量反向计分。", formula: "s_m(c)" },
        { id: "pillars-zh", title: "支柱聚合", body: "用公开的内部权重把各指标折叠成支柱分数。", formula: "P_p(c) = Sum alpha_(p,m) x s_m(c)" },
        { id: "final-zh", title: "最终分数", body: "应用唯一的公开公式，并附上 coverage grade。", formula: "SLIC(c)" },
      ],
    },
    remoteSensingSection: {
      eyebrow: "遥感层",
      title: "当地面传感器过于稀疏时，卫星证据会把城市框架拉宽",
      summary:
        "当地面监测站数量太少、分布太偏或只能描述局部点位时，SLIC 会使用遥感层来补足整个城市气团与生态边界的空间背景。卫星层是支持性证据，不是神谕。",
      quantifyTitle: "卫星层帮助量化什么",
      quantifyItems: [
        "更大城市气团中的气溶胶负荷与大气成分",
        "通过 NDVI 类地表产品观察植被与绿量缓冲",
        "高密度建成区周边的地表覆盖、水分与表面环境",
        "地方站网可能遗漏的区域性污染漂移",
      ],
      qualifyTitle: "分析师仍需解释什么",
      qualifyItems: [
        "地形、海岸线、风场与季节性烟霾路径",
        "局部热点与全城状态之间的区别",
        "城市形态、街谷效应，以及居民真实感受到的暴露",
        "官方环保记录、证词与现场城市证据的交叉校验",
      ],
      workflowTitle: "卫星层如何进入方法",
      workflowStages: [
        {
          id: "remote-official-zh",
          title: "官方城市与环境记录",
          body: "只要存在可信的地面传感器、环境报告与公用事业记录，它们仍然是第一层证据。",
        },
        {
          id: "remote-context-zh",
          title: "遥感校正与情境补充",
          body: "Copernicus、JAXA 与公开 Landsat 衍生层帮助解释气溶胶传输、植被覆盖、地表压力以及城市生态边界。",
        },
        {
          id: "remote-listening-zh",
          title: "社交聆听与城市证词",
          body: "居民抱怨、访客证词与讨论强度帮助判断地图上的问题是否真正被生活中的人感受到。",
        },
        {
          id: "remote-judgement-zh",
          title: "最终城市判断",
          body: "SLIC 分析师把三层一起阅读，让卫星证据支持判断，而不是假装可以替代地面现实。",
        },
      ],
      citations: [17, 18, 19, 20, 21, 22, 23, 24, 25],
    },
    equationSection: {
      eyebrow: "数学核心",
      title: "真正使用的公式层",
      summary:
        "公开分数使用固定权重、明确方向性与可复制的公式。页面上的数学不是装饰，而是方法本身。",
      groups: [
        {
          id: "official-zh",
          eyebrow: "公开分数",
          title: "官方发布公式",
          summary: "这是网站与工作簿共用的公开分数骨架。",
          equations: [
            {
              id: "official-score-zh",
              title: "官方 SLIC 分数",
              formula:
                "SLIC(c) = 0.25 Pressure(c) + 0.22 Viability(c) + 0.18 Capability(c) + 0.15 Community(c) + 0.20 Creative(c)",
              explanation:
                "公开榜单只有一套固定加权模型。Pressure 权重最大，同时把 Viability、Capability、Community 与 Creative 明确保留在公式中。",
              citations: [1],
            },
            {
              id: "disposable-income-zh",
              title: "税后 PPP 可支配生活空间",
              formula:
                "DI_ppp(c) = ((GrossIncome(c) x (1 - TaxRate(country(c)))) - Rent(c) - Utilities(c) - Transit(c) - Internet(c) - Food(c)) / PPP_private_consumption(country(c))",
              explanation:
                "这是最核心的生活空间项：把税后扣除必需支出后的剩余收入，换算成可比较的 PPP 空间。",
              citations: [2, 7],
            },
          ],
        },
        {
          id: "normalization-zh",
          eyebrow: "指标机制",
          title: "标准化与缺失数据逻辑",
          summary: "只有在方向性与缺失性都被明确处理后，城市原始指标才可以被聚合。",
          equations: [
            {
              id: "metric-normalization-zh",
              title: "winsorized 指标分数",
              formula:
                "s_m(c) = 100 x clamp((winsor(x_m(c)) - P5_m) / (P95_m - P5_m), 0, 1)",
              explanation:
                "正向指标直接缩放，负向指标则反转分子，以保证高分永远意味着更好的城市结果。",
              citations: [1],
            },
            {
              id: "coverage-score-zh",
              title: "加权覆盖度",
              formula:
                "Coverage(c) = Sum over observed metrics m of gamma_m / Sum over required metrics m of gamma_m",
              explanation:
                "覆盖度按指标重要性加权，而不是按字段个数计算。关键数据缺失不能被一堆次要字段掩盖。",
              citations: [1, 14, 15],
            },
          ],
        },
        {
          id: "subscores-zh",
          eyebrow: "公开子分数",
          title: "读者必须看得见的几个支柱",
          summary: "下面这些可见支柱公式与工作簿里用于公开分数的结构保持一致。",
          equations: [
            {
              id: "safety-viability-zh",
              title: "Viability 支柱",
              formula:
                "Viability(c) = 0.23 PersonalSafety + 0.23 TransitAccess + 0.18 CleanAir + 0.18 WaterUtility + 0.18 DigitalInfrastructure",
              explanation:
                "Viability 奖赏真实安全、生态能力与日常系统可靠性；监控密度不在计分项内。",
              citations: [3, 5, 11, 13, 17],
            },
            {
              id: "community-tolerance-zh",
              title: "Community 支柱",
              formula:
                "Community(c) = 0.33 HospitalityBelonging + 0.33 TolerancePluralism + 0.33 PublicLifeVitality",
              explanation:
                "Community 按低摩擦共处、平等市场准入与真实公共生活计分，而不是按象征性标签计分。",
              citations: [1, 14, 16],
            },
            {
              id: "business-growth-zh",
              title: "Creative 支柱",
              formula:
                "Creative(c) = 0.30 EntrepreneurialDynamism + 0.25 InnovationResearchIntensity + 0.25 EconomicVitality + 0.20 AdministrativeFriction",
              explanation:
                "Creative 反映的是创业活力、研究强度、生产性动能，以及更低的行政摩擦。",
              citations: [2, 10, 16],
            },
          ],
        },
      ],
    },
    glossarySection: {
      eyebrow: "符号表",
      title: "每个符号都是什么意思",
      summary:
        "记号系统故意保持紧凑，每个符号只定义一次，方便外部团队复现或审计这套方法。",
      symbols: [
        { symbol: "c", definition: "城市或 functional urban area", explanation: "被评分的城市单元。" },
        { symbol: "m", definition: "指标索引", explanation: "原始变量，如租房负担、PM2.5 或开业便利度。" },
        { symbol: "p", definition: "支柱索引", explanation: "五个公开支柱之一。" },
        { symbol: "x_m(c)", definition: "原始指标值", explanation: "城市 c 在指标 m 上的原始观测值。" },
        { symbol: "winsor(.)", definition: "winsorization 算子", explanation: "在计分前把极端值压回 P5/P95 区间。" },
        { symbol: "P5_m, P95_m", definition: "百分位锚点", explanation: "指标 m 的低位与高位基准。" },
        { symbol: "s_m(c)", definition: "标准化指标分数", explanation: "方向统一后的 0-100 分数。" },
        { symbol: "alpha_(p,m)", definition: "支柱内指标权重", explanation: "指标 m 在支柱 p 中的贡献强度。" },
        { symbol: "gamma_m", definition: "覆盖度权重", explanation: "缺失数据时用于 coverage 计算的重要性权重。" },
        { symbol: "w_p", definition: "公开支柱权重", explanation: "最终总分中各支柱的固定权重。" },
        { symbol: "DI_ppp(c)", definition: "PPP 可支配生活空间", explanation: "扣税与必需支出后的 PPP 剩余空间。" },
      ],
    },
    workedExampleSection: {
      eyebrow: "计算示例",
      title: "一个说明性的预览计算",
      summary:
        "这个例子用于展示数学路径，而不是替代经过审计的正式工作簿数据行。",
      example: {
        city: "Bangkok preview computation",
        note: "说明性例子，使用预览数值展示计算路径，并非最终发布行。",
        inputs: [
          { label: "Gross income", value: "$33,500", note: "城市层面的示意收入输入" },
          { label: "Effective tax rate", value: "18%", note: "用户输入的国家背景项" },
          { label: "Essential costs", value: "$15,900", note: "房租、水电、网络、交通与食物" },
          { label: "PPP private consumption factor", value: "0.72", note: "World Bank 的 PPP 转换层" },
          { label: "Illustrative pillar bundle", value: "Pressure 71 / Viability 84 / Capability 80 / Community 86 / Creative 76", note: "各支柱内部聚合后的示意值" },
        ],
        steps: [
          {
            title: "税后与必需支出后的生活空间",
            formula: "DI_ppp = ((33,500 x (1 - 0.18)) - 15,900) / 0.72",
            result: "DI_ppp = 16,069",
            explanation: "把真实剩余收入转换成 PPP 单位，才能跨城市比较。",
          },
          {
            title: "负向指标的标准化示例",
            formula: "SafetyScore = 100 x ((12.0 - 3.2) / (12.0 - 1.4))",
            result: "SafetyScore = 83.0",
            explanation: "因为暴力伤害是负向变量，所以要反向计分，伤害越低分数越高。",
          },
          {
            title: "压力支柱聚合",
            formula: "Pressure = (9x82 + 5x64 + 4x61 + 4x74 + 3x58) / 25",
            result: "Pressure = 70.9",
            explanation: "内部指标权重先合并成一个公开支柱分数。",
          },
          {
            title: "最终公开分数",
            formula: "SLIC = 0.25x71 + 0.22x84 + 0.18x80 + 0.15x86 + 0.20x76",
            result: "SLIC = 78.73",
            explanation: "五个公开支柱只聚合一次，没有隐藏覆盖层。",
          },
        ],
        finalScore: "78.73",
        conclusion:
          "这个例子说明：像曼谷这样的城市可以凭共同体与城市能量获得优势，同时也会因为压力或生态问题被公开扣分，而不是被声望平均值掩盖。",
      },
    },
    modelSection: {
      eyebrow: "方法边界",
      title: "公开分数只有一个模型，诊断层与之分开",
      summary:
        "公开分数来自唯一的固定加权模型。内部诊断可以检查数据质量或结构是否站得住，但不会改写公开排名。",
      families: [
        {
          id: "weighted-zh",
          title: "Official public model",
          formula: "SLIC(c) = Sum over pillars p of w_p x P_p(c)",
          role: "公开分数",
          explanation: "这是唯一的官方公开引擎：固定权重、透明标准化、清晰支柱逻辑，也是最容易解释和复现的一层。",
        },
        {
          id: "diagnostics-zh",
          title: "Internal diagnostics",
          formula: "Diagnostics(c) do not modify SLIC(c)",
          role: "非计分检查",
          explanation: "一致性检查、结构检验与分析师复核可以标出薄弱输入或不合理模式，但不会给公开分数加入隐藏加分或惩罚。",
        },
      ],
    },
    countryContextSection: {
      eyebrow: "国家背景项",
      title: "宏观实力重要，但不能主宰城市排名",
      summary:
        "人均 GDP、增长、基尼、PPP 与税率都重要，但它们在 SLIC 中只作为调整项或背景项，而不是头号决定因素。",
    },
    weightChartLabel: "属于官方分数",
    pillarsSection: {
      eyebrow: "官方支柱",
      title: "构成总分的五个公开支柱",
      summary:
        "下方每个支柱都与工作簿中计算公开分数的权重和结构保持一致。",
    },
    pillars: [
      {
        id: "pressure",
        name: "Growth",
        weight: 25,
        thesis: "经济活力决定城市的发展轨迹。增长带来资本主义和市场力量，除非国家提供福利，否则自然影响可负担性。",
        justification: "这一支柱衡量经济动力及其对城市居民实际生活的影响。",
        citations: [2, 3, 7],
        metrics: [
          { name: "税后 PPP 可支配生活空间", weight: 9, description: "税后扣除必需支出后的 PPP 剩余空间。", inputs: ["gross income", "tax rate", "rent", "utilities", "internet", "transport", "food", "PPP factor"] },
          { name: "住房负担", weight: 5, description: "住房成本占家庭或年轻职业人收入的比例。", inputs: ["median rent", "housing-cost share"] },
          { name: "家庭债务负担", weight: 4, description: "债务相对于可支配收入或最佳可得 proxy 的比率。", inputs: ["household debt", "disposable income"] },
          { name: "工时压力", weight: 4, description: "平均工时与超长工时 prevalence。", inputs: ["weekly hours", "overwork share"] },
          { name: "自杀与严重心理压力", weight: 3, description: "自杀率或最可辩护的心理伤害 proxy。", inputs: ["suicide rate", "mental-health harm proxy"] },
        ],
      },
      {
        id: "viability",
        name: "Viability",
        weight: 22,
        thesis: "日常生活应当更安全、更能呼吸、更容易移动，而且基础系统要能运转。",
        justification: "这部分奖励的是城市系统真正带来的结果，而不是系统本身的炫耀性存在。",
        citations: [3, 5, 11, 13, 17],
        metrics: [
          { name: "个人安全", weight: 5, description: "伤害、严重犯罪、游客受害与夜间安全信号。", inputs: ["homicide", "serious violent crime", "victimization", "night-safety proxy"] },
          { name: "交通可达性与通勤负担", weight: 5, description: "交通覆盖、通勤时间与晚间可用性。", inputs: ["GTFS", "commute time", "coverage"] },
          { name: "清洁空气", weight: 4, description: "PM2.5、严重污染暴露以及 CAMS / OpenAQ 支撑。", inputs: ["PM2.5", "exceedance", "aerosol context"] },
          { name: "供水、卫生与公用事业可靠性", weight: 4, description: "饮水、卫生与基础服务稳定性。", inputs: ["WASH access", "interruptions", "compliance"] },
          { name: "数字基础设施", weight: 4, description: "宽带质量、可负担性与光纤准备度。", inputs: ["fixed broadband", "affordability", "internet performance"] },
        ],
      },
      {
        id: "capability",
        name: "Capability",
        weight: 18,
        thesis: "一座严肃的城市要让人接触到好的医疗、好的教育，以及公平的成长通道。",
        justification: "这里看的是质量与可及性结果，不只是机构数量。",
        citations: [3, 6, 8, 9, 14, 15],
        metrics: [
          { name: "医疗质量", weight: 8, description: "可避免死亡、供给能力与有效医疗可达性。", inputs: ["avoidable mortality", "quality outcomes", "provider capacity"] },
          { name: "教育质量", weight: 6, description: "学习结果、完成率与技能形成。", inputs: ["PISA", "UIS outcomes", "completion", "skills pipeline"] },
          { name: "机会平等与分配公平", weight: 4, description: "性别差距、青年 NEET 与分配公平信号。", inputs: ["gender data", "NEET", "Gini", "labour gaps"] },
        ],
      },
      {
        id: "community",
        name: "Community",
        weight: 15,
        thesis: "好客、社会可读性与和平共处，本来就是城市产品的一部分。",
        justification: "这让更欢迎人的城市有机会压过更冷的城市，即使它们行政能力都不错。",
        citations: [1, 14, 16],
        metrics: [
          { name: "好客与归属", weight: 5, description: "欢迎感、居民依附与多语言可用性。", inputs: ["social listening", "testimony audit", "multilingual services"] },
          { name: "包容与多元共处", weight: 5, description: "低摩擦共处、平等市场准入与生活方式自由。", inputs: ["legal openness", "discrimination proxy", "market-access signal"] },
          { name: "文化与公共生活活力", weight: 5, description: "第三空间、历史连续性与经 civic strain 校正后的游客吸引力。", inputs: ["venues", "events", "public attention", "visitor flow"] },
        ],
      },
      {
        id: "creative",
        name: "Creative",
        weight: 20,
        thesis: "城市不应只减少痛苦，还要产生抱负、发明与生产性的经济能量。",
        justification: "这一支柱防止 SLIC 把平静误读成停滞，把舒适误读成竞争力。",
        citations: [2, 10, 16],
        metrics: [
          { name: "创业活力", weight: 6, description: "新企业形成与本地生产性进入的速度。", inputs: ["new business density", "firm formation", "entrepreneurial activity"] },
          { name: "创新与研究强度", weight: 5, description: "专利、研究深度与城市生成新想法的能力。", inputs: ["patents", "R&D", "research institutions"] },
          { name: "经济活力与生产性背景", weight: 5, description: "投资信号、生产性宏观背景与城市经济跑道。", inputs: ["investment signal", "GDP per capita PPP", "GDP growth"] },
          { name: "行政与投资摩擦", weight: 4, description: "阻碍生产性行动的官僚负担、审批拖拽或规则不稳。", inputs: ["administrative friction", "permitting burden", "rule consistency"] },
        ],
      },
    ],
    protocolSection: {
      eyebrow: "排名协议",
      title: "城市如何进入、保留并被发布",
      summary:
        "排名必须诚实处理缺失数据与城市规模差异。知名城市不会自动入围，数据很薄的城市也不能拥有虚假的精确度。",
    },
    rules: [
      {
        title: "使用 functional urban area，而不是市政边界",
        body: "SLIC 尽可能按真实劳动力市场与服务范围来界定城市，而不是按狭窄的行政核心。",
        citations: [12],
      },
      {
        title: "只有一套官方权重",
        body: "公开榜单只用一套公式。用户自定义权重未来可以作为探索工具存在，但不能取代官方排名。",
        citations: [1],
      },
      {
        title: "必须先通过 coverage gate",
        body: "只有在加权覆盖率过线且没有关键支柱严重空缺时，城市才会正式上榜，否则只能留在 watchlist。",
        citations: [1, 14, 15],
      },
      {
        title: "安全按结果计分，不按监控计分",
        body: "摄像头数量或 smart-city 表演本身不加分。更低的伤害与更高的日常信心才加分。",
        citations: [1, 3],
      },
      {
        title: "包容按可观察效果计分",
        body: "SLIC 不直接给宗教或身份打分，而是看人们能否以低摩擦、平等与现实自由在城市里生活、工作与参与经济。",
        citations: [1, 14],
      },
      {
        title: "游客需求只是背景信号",
        body: "游客流量只有在通过拥挤、安全、生态与居民空间检查后，才会被当作文化需求信号保留。",
        citations: [1],
      },
    ],
    sourceSection: {
      eyebrow: "来源层级",
      title: "模型最先信任什么数据",
      summary:
        "这个层级公开显示数据距离城市有多近。城市级数据优先于国家代理值，而经审计的 proxy 优于没有出处的便利数字。",
    },
    sourceTiers: chineseSourceTiers,
    worksheetSection: {
      eyebrow: "评分工作表",
      title: "支撑排名的逐城表格",
      summary:
        "城市宇宙一旦确定，下面这些列会被填入，模型再计算支柱分、总分与 coverage grade。",
    },
    worksheetColumns,
    referencesSection: {
      eyebrow: "参考资料",
      title: "支撑这套框架的来源库",
      summary:
        "方法论页面同时引用内部 benchmarking memo 与会锚定工作簿和公开模型的官方文档。",
    },
    references: methodologyReferences,
  },
};

export function getMethodologyData(locale: Locale): MethodologyData {
  return methodologyContent[locale];
}
