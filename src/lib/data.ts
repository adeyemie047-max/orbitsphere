import type {
  Article,
  Author,
  BreakingHeadline,
  Category,
  CategorySlug,
  Poll,
  VideoStory,
} from "./types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Politics",
    slug: "politics",
    description:
      "In-depth coverage of Nigerian and African politics, elections, policy, and governance.",
    color: "gold",
  },
  {
    id: "2",
    name: "Metro",
    slug: "metro",
    description: "City news, transport, infrastructure, and life across Nigeria's urban centres.",
    color: "gold",
  },
  {
    id: "3",
    name: "Business",
    slug: "business",
    description: "Markets, finance, corporate news, and economic analysis for Africa.",
    color: "gold",
  },
  {
    id: "4",
    name: "Technology",
    slug: "technology",
    description: "Startups, innovation, AI, and the digital transformation of Africa.",
    color: "cyan",
  },
  {
    id: "5",
    name: "Education",
    slug: "education",
    description: "Schools, universities, policy reforms, and the future of learning.",
    color: "cyan",
  },
  {
    id: "6",
    name: "Agriculture",
    slug: "agriculture",
    description: "Food security, farming innovation, and rural development across the continent.",
    color: "blue",
  },
  {
    id: "7",
    name: "Entertainment",
    slug: "entertainment",
    description: "Music, film, culture, and the creative industries shaping African identity.",
    color: "gold",
  },
  {
    id: "8",
    name: "Sports",
    slug: "sports",
    description: "Football, athletics, and the stories behind Africa's sporting triumphs.",
    color: "blue",
  },
  {
    id: "9",
    name: "Opinion",
    slug: "opinion",
    description: "Analysis, commentary, and perspectives from Africa's leading voices.",
    color: "gold",
  },
  {
    id: "10",
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Culture, wellness, travel, and the way Africans live today.",
    color: "cyan",
  },
  {
    id: "11",
    name: "Faith & Culture",
    slug: "faith-culture",
    description: "Religion, tradition, and the cultural forces shaping African society.",
    color: "gold",
  },
];

export const authors: Record<string, Author> = {
  adaeze: {
    id: "1",
    name: "Adaeze Okonkwo",
    role: "Business Editor",
    initials: "AO",
    articleCount: 142,
  },
  emeka: {
    id: "2",
    name: "Emeka Nwosu",
    role: "Business Editor",
    initials: "EN",
    articleCount: 98,
  },
  fatima: {
    id: "3",
    name: "Fatima Al-Hassan",
    role: "Education Correspondent",
    initials: "FA",
    articleCount: 76,
  },
  chukwuemeka: {
    id: "4",
    name: "Chukwuemeka Eze",
    role: "Agriculture Reporter",
    initials: "CE",
    articleCount: 54,
  },
  ngozi: {
    id: "5",
    name: "Ngozi Okafor",
    role: "Senior Economic Analyst",
    initials: "NO",
    articleCount: 89,
  },
  babatunde: {
    id: "6",
    name: "Babatunde Adeyemi",
    role: "Foreign Affairs Correspondent",
    initials: "BA",
    articleCount: 112,
  },
  chisom: {
    id: "7",
    name: "Chisom Ibekwe",
    role: "Culture Writer",
    initials: "CI",
    articleCount: 67,
  },
};

const cat = (slug: CategorySlug) =>
  categories.find((c) => c.slug === slug)!;

export const breakingHeadlines: BreakingHeadline[] = [
  {
    id: "1",
    text: "TINUBU SIGNS NEW ECONOMIC REFORM BILL INTO LAW — CBN REACTS",
    slug: "nigeria-economic-renaissance",
  },
  {
    id: "2",
    text: "AFCON 2025: SUPER EAGLES DEFEAT GHANA 3-1 IN QUALIFIER",
    slug: "super-eagles-afcon-tactical-blueprint",
  },
  {
    id: "3",
    text: "SENATE APPROVES ₦4.2 TRILLION SUPPLEMENTARY BUDGET",
    slug: "senate-electoral-reform-bill",
  },
  {
    id: "4",
    text: "DANGOTE REFINERY BEGINS PETROL EXPORTS TO WEST AFRICA",
    slug: "dangote-refinery-first-year",
  },
  {
    id: "5",
    text: "MICROSOFT OPENS FIRST AFRICAN AI HUB IN LAGOS",
    slug: "mtn-africa-record-revenue-growth",
  },
];

export const articles: Article[] = [
  {
    id: "1",
    title:
      "Nigeria's Economic Renaissance: How Three Bold Policies Are Reshaping the Continent's Largest Economy",
    slug: "nigeria-economic-renaissance",
    excerpt:
      "From currency reforms to the Dangote refinery, a new chapter is being written in Nigeria's economic history — and the world is watching closely.",
    body: `<p>When President Bola Tinubu signed the Economic Reform Act into law last week, few observers predicted the immediate market response. Within 48 hours, the naira had stabilised against major currencies, foreign portfolio investors returned to Nigerian equities, and the Central Bank announced a revised monetary policy framework that analysts describe as the most ambitious in a decade.</p>
<h2>Three Policies, One Vision</h2>
<p>The reform package rests on three pillars: currency market liberalisation, domestic refining capacity expansion, and targeted industrial subsidies for manufacturing. Together, they represent a deliberate shift away from decades of import dependency toward a model of economic self-reliance that ECOWAS officials have long advocated but rarely seen implemented at this scale.</p>
<blockquote>"What we are witnessing is not merely a commercial achievement. This is an act of economic sovereignty — Nigeria deciding, for the first time in a generation, to refine its own wealth rather than export it raw and reimport it processed."</blockquote>
<p>The Dangote Refinery's first-year performance has provided the practical foundation for this narrative. With 36 million barrels processed and petrol exports reaching five West African nations, the refinery has become both symbol and engine of the renaissance story.</p>
<h3>What Comes Next</h3>
<p>Challenges remain. Pipeline infrastructure, domestic pricing policy, and the pace of foreign direct investment will determine whether this moment becomes a lasting transformation or another false dawn. OrbitSphere will continue to track every development.</p>`,
    featuredImage:
      "https://picsum.photos/seed/orbit-hero/1200/675",
    imageCaption:
      "Lagos financial district at dusk — Nigeria's economic capital continues to drive continental growth.",
    author: authors.adaeze,
    category: cat("politics"),
    status: "published",
    isBreaking: true,
    isFeatured: true,
    isInvestigative: false,
    viewsCount: 48200,
    readTime: 6,
    publishedAt: "2026-05-27T08:00:00Z",
    tags: ["Economy", "Reform", "Tinubu", "CBN", "Policy"],
    aiSummary: [
      "President Tinubu signed a landmark Economic Reform Act targeting currency liberalisation, domestic refining, and industrial subsidies.",
      "The naira stabilised within 48 hours as foreign investors returned to Nigerian markets following the announcement.",
      "Analysts warn that pipeline infrastructure and pricing policy remain critical bottlenecks for sustained growth.",
    ],
    comments: [
      {
        id: "1",
        author: "Oluwaseun Adeyinka",
        initials: "OA",
        body: "This is the kind of journalism Nigeria needs more of. Balanced, data-driven, and not afraid to acknowledge the structural challenges that remain.",
        createdAt: "2026-05-27T10:00:00Z",
      },
      {
        id: "2",
        author: "Nkechi Ikemefuna",
        initials: "NI",
        body: "The export to West Africa angle is what excites me most. If Nigeria can become a reliable regional energy supplier, the geopolitical implications are enormous.",
        createdAt: "2026-05-27T08:30:00Z",
      },
    ],
  },
  {
    id: "2",
    title:
      "MTN Africa Reports Record 42% Revenue Growth Driven by Data and Fintech Services",
    slug: "mtn-africa-record-revenue-growth",
    excerpt:
      "The telecom giant's Q1 results signal a broader shift in how African consumers access financial services through mobile networks.",
    body: `<p>MTN Group reported a staggering 42% year-on-year revenue increase in its latest quarterly earnings, driven primarily by data consumption growth and the rapid expansion of its MoMo fintech platform across 14 African markets.</p>
<p>The results exceeded analyst expectations by a wide margin, sending MTN Nigeria shares up 8.4% on the NGX at the close of trading. CEO Ralph Mupita attributed the performance to "a structural shift in how Africans consume connectivity and financial services."</p>
<h2>Fintech as Growth Engine</h2>
<p>MoMo processed over ₦12 trillion in transaction volume during the quarter — a figure that rivals several mid-tier Nigerian banks. The platform's user base grew to 68 million active accounts, making it one of the largest mobile money networks on the continent.</p>`,
    featuredImage:
      "https://picsum.photos/seed/orbit-tech/800/450",
    author: authors.emeka,
    category: cat("technology"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 12400,
    readTime: 4,
    publishedAt: "2026-05-27T09:00:00Z",
    tags: ["MTN", "Fintech", "Telecom", "Africa"],
    aiSummary: [
      "MTN Group reported 42% revenue growth in Q1, driven by data and MoMo fintech services.",
      "MoMo processed ₦12 trillion in transactions with 68 million active accounts.",
      "MTN Nigeria shares rose 8.4% following the earnings announcement.",
    ],
  },
  {
    id: "3",
    title:
      "Super Eagles Coach Reveals Tactical Blueprint Ahead of AFCON 2025 Final",
    slug: "super-eagles-afcon-tactical-blueprint",
    excerpt:
      "In an exclusive interview, the national team coach outlines the formation and strategy that could bring Nigeria its fourth AFCON title.",
    body: `<p>Speaking at the team's training camp in Abidjan, Super Eagles head coach unveiled a 4-3-3 formation designed to maximise the pace of Victor Osimhen and the creativity of Ademola Lookman on the wings.</p>
<p>"We have studied every opponent in this tournament," he said. "Our approach is not reactive — we dictate the tempo from the first whistle."</p>`,
    featuredImage:
      "https://picsum.photos/seed/orbit-sports/800/450",
    author: authors.fatima,
    category: cat("sports"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    isLiveBlog: true,
    viewsCount: 9882,
    readTime: 3,
    publishedAt: "2026-05-27T07:00:00Z",
    tags: ["AFCON", "Super Eagles", "Football", "Nigeria"],
  },
  {
    id: "4",
    title:
      "Senate Passes Landmark Electoral Reform Bill Ahead of 2027 Elections",
    slug: "senate-electoral-reform-bill",
    excerpt:
      "The bill introduces electronic transmission of results, campaign finance limits, and stricter penalties for electoral violence.",
    body: `<p>In a session that stretched past midnight, the Nigerian Senate passed the Electoral Reform Bill 2026 by a vote of 78-9, sending it to the House of Representatives for concurrence.</p>
<p>Key provisions include mandatory electronic transmission of results from polling units, a ₦5 billion campaign spending cap for presidential candidates, and criminal penalties of up to 10 years for electoral violence.</p>`,
    featuredImage:
      "https://picsum.photos/seed/orbit-politics/800/450",
    author: authors.emeka,
    category: cat("politics"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 14200,
    readTime: 5,
    publishedAt: "2026-05-27T06:15:00Z",
    tags: ["Senate", "Elections", "INEC", "Reform"],
    aiSummary: [
      "Senate passed Electoral Reform Bill 2026 by 78-9 vote with electronic results transmission mandate.",
      "Presidential campaign spending capped at ₦5 billion with new violence penalties up to 10 years.",
      "Bill now moves to House of Representatives for concurrence before presidential assent.",
    ],
  },
  {
    id: "5",
    title: "Zenith Bank Posts ₦850 Billion Pre-Tax Profit in Q1 2025 Report",
    slug: "zenith-bank-q1-profit",
    excerpt:
      "The lender's earnings beat consensus estimates as net interest income surged on the back of CBN rate hikes.",
    body: `<p>Zenith Bank Plc reported pre-tax profit of ₦850 billion for the first quarter of 2025, representing a 127% increase over the same period last year.</p>`,
    author: authors.emeka,
    category: cat("business"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 11800,
    readTime: 4,
    publishedAt: "2026-05-27T05:00:00Z",
    tags: ["Zenith Bank", "Banking", "Finance", "NGX"],
  },
  {
    id: "6",
    title:
      "Flutterwave Secures $250M Series D Funding, Eyes Pan-African Expansion",
    slug: "flutterwave-series-d-funding",
    excerpt:
      "The Lagos-based fintech unicorn plans to expand into East Africa and launch new B2B payment products.",
    body: `<p>Flutterwave has closed a $250 million Series D round led by Avenir Growth Capital, valuing the company at $3.5 billion.</p>`,
    author: authors.chukwuemeka,
    category: cat("technology"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 9400,
    readTime: 3,
    publishedAt: "2026-05-27T04:00:00Z",
    tags: ["Flutterwave", "Fintech", "Startups", "Funding"],
  },
  {
    id: "7",
    title:
      "Burna Boy's New Album Breaks Streaming Record Across 47 African Countries",
    slug: "burna-boy-album-record",
    excerpt:
      "The Grammy winner's latest release amassed 50 million streams in its first 72 hours, setting a new continental benchmark.",
    body: `<p>Burna Boy's "African Giant II" has shattered streaming records across 47 African countries within 72 hours of release.</p>`,
    author: authors.chisom,
    category: cat("entertainment"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 8100,
    readTime: 3,
    publishedAt: "2026-05-27T03:00:00Z",
    tags: ["Burna Boy", "Music", "Afrobeats", "Streaming"],
  },
  {
    id: "8",
    title:
      "Lagos-Ibadan Rail Records 500,000th Passenger — Buhari Era Investment Pays Off",
    slug: "lagos-ibadan-rail-milestone",
    excerpt:
      "The standard gauge rail line has exceeded ridership projections, prompting calls for route extensions to Ilorin.",
    body: `<p>The Lagos-Ibadan Standard Gauge Railway celebrated its 500,000th passenger this week, surpassing initial ridership projections by 34%.</p>`,
    author: authors.fatima,
    category: cat("metro"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 6700,
    readTime: 4,
    publishedAt: "2026-05-27T02:00:00Z",
    tags: ["Rail", "Lagos", "Transport", "Infrastructure"],
  },
  {
    id: "9",
    title:
      "CBN Governor Outlines Five-Point Plan to Stabilise Naira at $1 = ₦1,200",
    slug: "cbn-five-point-naira-plan",
    excerpt:
      "The Central Bank governor addressed markets with a comprehensive strategy aimed at restoring investor confidence and curbing inflation.",
    body: `<p>CBN Governor Olayemi Cardoso unveiled a five-point stabilisation plan targeting a naira exchange rate of ₦1,200 per dollar within 18 months.</p>`,
    author: authors.emeka,
    category: cat("business"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 18400,
    readTime: 5,
    publishedAt: "2026-05-26T20:00:00Z",
    tags: ["CBN", "Naira", "Forex", "Monetary Policy"],
  },
  {
    id: "10",
    title:
      "Federal Government Launches 10,000 STEM Scholarship Programme for Northern Girls",
    slug: "stem-scholarship-northern-girls",
    excerpt:
      "A landmark education initiative targets gender disparity in science and technology enrolment across 19 northern states.",
    body: `<p>The Federal Ministry of Education has launched a ₦45 billion STEM scholarship programme targeting 10,000 girls across 19 northern states.</p>`,
    author: authors.fatima,
    category: cat("education"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 5200,
    readTime: 4,
    publishedAt: "2026-05-26T19:00:00Z",
    tags: ["Education", "STEM", "Scholarships", "Gender"],
  },
  {
    id: "11",
    title:
      "Nigeria's Rice Production Hits 10 Million Metric Tons — USDA Validates Achievement",
    slug: "nigeria-rice-production-record",
    excerpt:
      "A decade of agricultural investment is finally yielding results as Nigeria approaches food self-sufficiency in staple grains.",
    body: `<p>The USDA has confirmed Nigeria's rice production reached 10 million metric tons in the 2025/2026 season, validating a decade of agricultural investment.</p>`,
    author: authors.chukwuemeka,
    category: cat("agriculture"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 4800,
    readTime: 3,
    publishedAt: "2026-05-26T18:00:00Z",
    tags: ["Agriculture", "Rice", "Food Security", "USDA"],
  },
  {
    id: "12",
    title:
      "Tinubu Reshuffles Cabinet: Four Ministers Replaced in Surprise Midnight Decree",
    slug: "tinubu-cabinet-reshuffle",
    excerpt:
      "Sources within Aso Rock confirm major portfolio realignments in a move analysts describe as a mid-term course correction ahead of 2027.",
    body: `<p>President Tinubu executed a surprise cabinet reshuffle at midnight, replacing four ministers and creating two new portfolios focused on digital economy and creative industries.</p>`,
    featuredImage:
      "https://picsum.photos/seed/orbit-politics/800/450",
    author: authors.adaeze,
    category: cat("politics"),
    status: "published",
    isBreaking: true,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 22100,
    readTime: 7,
    publishedAt: "2026-05-27T04:00:00Z",
    tags: ["Tinubu", "Cabinet", "Politics", "Aso Rock"],
  },
  {
    id: "13",
    title:
      "Dangote Refinery's First Year: A Revolution in African Energy Independence",
    slug: "dangote-refinery-first-year",
    excerpt:
      "Twelve months after full commercial operations, the refinery has processed 36 million barrels and begun exporting petrol to five West African nations.",
    body: `<p>When the Dangote Petroleum Refinery opened its gates to full commercial operations in early 2025, few could have predicted the velocity of its impact on both the Nigerian economy and the wider African energy landscape. Twelve months on, the numbers tell a story that is simultaneously triumphant and cautionary.</p>
<h2>The Numbers That Changed Everything</h2>
<p>In its first year of operation, the refinery — with a nameplate capacity of 650,000 barrels per day — processed approximately 36 million barrels of crude oil, according to figures obtained exclusively by OrbitSphere from NNPC's upstream tracking division. This single facility has reduced Nigeria's annual fuel import bill by an estimated $4.2 billion, a figure the Minister of Finance described as "transformational" in a statement last week.</p>
<blockquote>"What we are witnessing is not merely a commercial achievement. This is an act of economic sovereignty — Nigeria deciding, for the first time in a generation, to refine its own wealth rather than export it raw and reimport it processed."</blockquote>
<p>Perhaps more consequential than the domestic impact is the refinery's emerging role as a regional energy supplier. Preliminary shipments of refined petroleum products have already reached Benin Republic, Togo, Ghana, Côte d'Ivoire, and Cameroon — a development ECOWAS officials have described as a "practical demonstration of African continental self-reliance."</p>
<h3>West Africa Begins to Look Inward</h3>
<p>Analysts warn that domestic pricing policy and pipeline infrastructure remain the critical bottlenecks for the refinery reaching full capacity. Without addressing these structural challenges, the refinery's transformative potential may be partially unrealised.</p>`,
    featuredImage:
      "https://picsum.photos/seed/orbit-energy/1200/675",
    imageCaption:
      "The Dangote Refinery complex in Lekki, Lagos — the largest single-train refinery in the world. | Credit: OrbitSphere Photo Desk",
    author: authors.adaeze,
    category: cat("business"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: true,
    viewsCount: 24108,
    readTime: 8,
    publishedAt: "2026-05-22T12:00:00Z",
    tags: [
      "Dangote Refinery",
      "Energy",
      "Economy",
      "West Africa",
      "NNPC",
      "Petroleum",
    ],
    aiSummary: [
      "The Dangote Refinery processed 36 million barrels in its first operational year, reducing Nigeria's fuel import bill by an estimated $4.2 billion.",
      "Petrol is now being exported to five West African nations, marking Nigeria's first major energy export diversification in 40 years.",
      "Analysts warn that domestic pricing policy and pipeline infrastructure remain the critical bottlenecks for the refinery reaching full capacity.",
    ],
    comments: [
      {
        id: "1",
        author: "Oluwaseun Adeyinka",
        initials: "OA",
        body: "This is the kind of journalism Nigeria needs more of. Balanced, data-driven, and not afraid to acknowledge the structural challenges that remain. The point about pipeline infrastructure is critical — we've heard this for years.",
        createdAt: "2026-05-22T14:00:00Z",
      },
      {
        id: "2",
        author: "Nkechi Ikemefuna",
        initials: "NI",
        body: "The export to West Africa angle is what excites me most. If Nigeria can become a reliable regional energy supplier, the geopolitical implications are enormous. ECOWAS finally gets an economic anchor it can point to.",
        createdAt: "2026-05-22T16:00:00Z",
      },
    ],
  },
  {
    id: "14",
    title:
      "NASS Budget Committee Recommends ₦28 Trillion for 2026 Fiscal Year",
    slug: "nass-budget-2026-recommendation",
    excerpt:
      "The proposed budget represents a 12% increase over 2025 allocations, with defence and education receiving the largest shares.",
    body: `<p>The National Assembly Budget Committee has recommended a ₦28 trillion budget for the 2026 fiscal year.</p>`,
    author: authors.emeka,
    category: cat("politics"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 8900,
    readTime: 5,
    publishedAt: "2026-05-27T03:00:00Z",
    tags: ["Budget", "NASS", "Fiscal Policy"],
  },
  {
    id: "15",
    title:
      "Obi, Atiku Form Unlikely Alliance Ahead of 2027 Presidential Race",
    slug: "obi-atiku-alliance-2027",
    excerpt:
      "Sources close to both camps confirm exploratory talks on a unified opposition platform for the next general election.",
    body: `<p>In a development that has sent shockwaves through Nigeria's political landscape, Peter Obi and Atiku Abubakar have held exploratory talks about forming a unified opposition platform.</p>`,
    author: authors.adaeze,
    category: cat("politics"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 15600,
    readTime: 4,
    publishedAt: "2026-05-27T02:00:00Z",
    tags: ["Politics", "2027 Elections", "Obi", "Atiku"],
  },
  {
    id: "16",
    title:
      "Nigeria Cannot Afford Another Lost Decade — The Time for Structural Reform is Now or Never",
    slug: "nigeria-structural-reform-opinion",
    excerpt:
      "Three decades of economic half-measures have left Nigeria perpetually on the cusp of transformation. This time, something feels different — but is it enough?",
    body: `<p>Three decades of economic half-measures have left Nigeria perpetually on the cusp of transformation. This time, something feels different — but is it enough?</p>
<p>The current reform momentum, while promising, must be sustained through institutional strengthening, not merely policy announcements. Without independent regulatory bodies and transparent procurement processes, even the best-intentioned reforms will falter.</p>`,
    author: authors.ngozi,
    category: cat("opinion"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 9200,
    readTime: 8,
    publishedAt: "2026-05-26T16:00:00Z",
    tags: ["Opinion", "Economy", "Reform", "Analysis"],
  },
  {
    id: "17",
    title:
      "The African Union's Silence on Sudan Is a Diplomatic Failure of Historic Proportions",
    slug: "au-silence-sudan-analysis",
    excerpt:
      "When the continent's principal multilateral body fails to act on a humanitarian catastrophe in its own backyard, the entire continental project is called into question.",
    body: `<p>When the continent's principal multilateral body fails to act on a humanitarian catastrophe in its own backyard, the entire continental project is called into question.</p>`,
    author: authors.babatunde,
    category: cat("opinion"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 7800,
    readTime: 6,
    publishedAt: "2026-05-26T14:00:00Z",
    tags: ["Sudan", "AU", "Foreign Affairs", "Analysis"],
  },
  {
    id: "18",
    title:
      "Why Nigerian Millennials Are Choosing Quiet Ambition Over Loud Success",
    slug: "nigerian-millennials-quiet-ambition",
    excerpt:
      "A generation shaped by japa, hardship, and social media is quietly rewriting the rules of ambition — and the culture is struggling to keep pace.",
    body: `<p>A generation shaped by japa, hardship, and social media is quietly rewriting the rules of ambition — and the culture is struggling to keep pace.</p>`,
    author: authors.chisom,
    category: cat("lifestyle"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 11200,
    readTime: 5,
    publishedAt: "2026-05-26T12:00:00Z",
    tags: ["Millennials", "Culture", "Lifestyle", "Society"],
  },
  {
    id: "19",
    title:
      "Osimhen Signs for Saudi Club — A New African Record Transfer Fee",
    slug: "osimhen-saudi-record-transfer",
    excerpt:
      "Victor Osimhen's move to Al-Hilal sets a new benchmark for African footballers in the global transfer market.",
    body: `<p>Victor Osimhen has completed a record-breaking transfer to Al-Hilal, becoming the most expensive African footballer in history.</p>`,
    author: authors.fatima,
    category: cat("sports"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 15100,
    readTime: 4,
    publishedAt: "2026-05-26T10:00:00Z",
    tags: ["Osimhen", "Transfer", "Football", "Saudi"],
  },
  {
    id: "20",
    title:
      "How Nigeria's Tech Unicorns Are Rebuilding After the 2024 Downturn",
    slug: "nigeria-tech-unicorns-rebuilding",
    excerpt:
      "Flutterwave, Andela, and others are pivoting toward profitability as venture capital funding tightens across Africa.",
    body: `<p>Nigeria's tech unicorns are navigating a post-hype landscape with renewed focus on unit economics and sustainable growth.</p>`,
    author: authors.chukwuemeka,
    category: cat("technology"),
    status: "published",
    isBreaking: false,
    isFeatured: false,
    isInvestigative: false,
    viewsCount: 12700,
    readTime: 6,
    publishedAt: "2026-05-26T08:00:00Z",
    tags: ["Startups", "Tech", "Venture Capital", "Africa"],
  },
];

export const videoStories: VideoStory[] = [
  {
    id: "1",
    title: "Inside the Dangote Refinery: Africa's Industrial Revolution Begins",
    category: cat("business"),
    duration: "4:32",
    channel: "OrbitSphere TV",
    publishedAt: "2026-05-27T06:00:00Z",
    thumbnail:
      "https://picsum.photos/seed/orbit-video1/600/338",
  },
  {
    id: "2",
    title:
      "Nigeria's Startup Ecosystem: The Billion-Dollar Stories You Haven't Heard",
    category: cat("technology"),
    duration: "7:18",
    channel: "OrbitSphere TV",
    publishedAt: "2026-05-27T04:00:00Z",
    thumbnail:
      "https://picsum.photos/seed/orbit-video2/600/338",
  },
  {
    id: "3",
    title: "Osimhen's Emotional Press Conference After Record-Breaking Transfer",
    category: cat("sports"),
    duration: "3:54",
    channel: "OrbitSphere Sports",
    publishedAt: "2026-05-27T03:00:00Z",
    thumbnail:
      "https://picsum.photos/seed/orbit-video3/600/338",
  },
  {
    id: "4",
    title: "The Aso Rock Files: What Nigerians Don't Know About the Presidency",
    category: cat("politics"),
    duration: "11:02",
    channel: "Investigative Desk",
    publishedAt: "2026-05-26T12:00:00Z",
    thumbnail:
      "https://picsum.photos/seed/orbit-video4/600/338",
  },
];

export const dangotePoll: Poll = {
  id: "1",
  question:
    "Do you believe the Dangote Refinery will bring down fuel prices in 2026?",
  options: [
    { id: "1", text: "Yes, significantly", votes: 2140 },
    { id: "2", text: "Slightly, not enough", votes: 1120 },
    { id: "3", text: "No change expected", votes: 581 },
  ],
  totalVotes: 3841,
  endsIn: "18 hrs remaining",
};

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(slug: CategorySlug): Article[] {
  return articles.filter((a) => a.category.slug === slug);
}

export function getFeaturedArticle(): Article {
  return articles.find((a) => a.isFeatured)!;
}

export function getTrendingArticles(limit = 5): Article[] {
  return [...articles]
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, limit);
}

export function getLatestArticles(limit = 6): Article[] {
  return [...articles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

export function getRelatedArticles(article: Article, limit = 4): Article[] {
  return articles
    .filter(
      (a) =>
        a.id !== article.id && a.category.slug === article.category.slug
    )
    .slice(0, limit);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.author.name.toLowerCase().includes(q)
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const navCategories = categories.filter((c) =>
  [
    "politics",
    "business",
    "technology",
    "sports",
    "entertainment",
    "opinion",
  ].includes(c.slug)
);

export const moreCategories = categories.filter(
  (c) =>
    ![
      "politics",
      "business",
      "technology",
      "sports",
      "entertainment",
      "opinion",
    ].includes(c.slug)
);
