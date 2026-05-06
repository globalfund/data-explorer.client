import { AiFeature, FeatureCategory } from "app/pages/ai-explorer/types";
import { AVAILABLE_DATASETS } from "app/pages/ai-explorer/datasets";

export const FEATURE_CATEGORY_LABELS: Record<FeatureCategory, string> = {
  chat: "Chat Functionality",
  forecasting: "Forecasting and Time-Series Models",
  classification: "Classification and Supervised Learning",
  clustering: "Clustering and Unsupervised Learning",
  nlp: "Natural Language Processing and LLMs",
  anomaly: "Anomaly Detection and Data Quality",
  optimization: "Optimization and Recommendation Systems",
  geospatial: "Geospatial and Network Analysis",
  causal: "Causal Inference and Impact Evaluation",
};

export const FEATURE_CATEGORY_ORDER: FeatureCategory[] = [
  "chat",
  "forecasting",
  "classification",
  "clustering",
  "nlp",
  "anomaly",
  "optimization",
  "geospatial",
  "causal",
];

export const FEATURE_CHECKLIST: AiFeature[] = [
  // Chat Functionality
  {
    id: "0.1",
    code: "0.1",
    title: "Chat About the Available Data",
    summary:
      "Conversational interface for natural language questions over all Global Fund datasets. Ask about grants, financials, results, or eligibility and receive structured, sourced answers.",
    datasets: AVAILABLE_DATASETS,
    methodology:
      "Retrieval-Augmented Generation (RAG): the user query is embedded, relevant data chunks are retrieved from a vector store, and an LLM synthesises the answer with citations.",
    status: "implemented",
    category: "chat",
  },
  {
    id: "0.2",
    code: "0.2",
    title: "Generate and Edit Reports",
    summary:
      "Create structured, shareable data reports directly from the chat interface. Reports can include charts, tables, and narrative summaries, and are editable after generation.",
    datasets: AVAILABLE_DATASETS,
    methodology:
      "Smart agents decompose the report request into structured data queries, retrieve and aggregate the relevant data, then synthesise the findings into a formatted report using an LLM.",
    status: "implemented",
    category: "chat",
  },
  // Forecasting and time-series models
  {
    id: "1.6",
    code: "1.6",
    title: "Allocation Forecasting",
    summary:
      "Predicts future Global Fund allocations to countries and programs based on historical trends, replenishment cycles, and portfolio performance.",
    datasets: ["Allocations"],
    methodology:
      "Time-series regression with cyclical replenishment pattern overlays.",
    status: "implemented",
    category: "forecasting",
  },
  {
    id: "1.7",
    code: "1.7",
    title: "Grant Budgets Forecasting",
    summary:
      "Projects grant budget requirements across periods, surfacing likely under- or over-utilization before it becomes a problem.",
    datasets: ["Grant Budgets"],
    methodology: "ARIMA-based forecasting with budget cycle adjustments.",
    status: "implemented",
    category: "forecasting",
  },
  {
    id: "1.8",
    code: "1.8",
    title: "Grant Commitments Forecasting",
    summary:
      "Estimates future commitment levels across active grants, enabling proactive pipeline management.",
    datasets: ["Grant Commitments"],
    methodology: "Rolling-window regression on disbursement trajectories.",
    status: "implemented",
    category: "forecasting",
  },
  {
    id: "1.1",
    code: "1.1",
    title: "Grant Disbursement Forecasting",
    summary: "Models expected disbursement schedules for active grants.",
    datasets: [
      "Grant Disbursements",
      "Grant Implementation Periods",
      "Grant Agreements",
    ],
    methodology:
      "Train an ARIMA, Prophet, or gradient-boosted model on the Disbursements dataset joined with Implementation Periods to predict future quarterly disbursement amounts per grant. This directly supports treasury management and cash-flow planning. Features include historical disbursement cadence, grant signed amount, principal recipient type, country, and component.",
    status: "pipeline",
    category: "forecasting",
  },
  {
    id: "1.2",
    code: "1.2",
    title: "Absorption Rate Prediction",
    summary:
      "Predicts how efficiently grant funds will be absorbed by principal recipients.",
    datasets: [
      "Financial Metrics",
      "Grant Expenditures",
      "Grant Budgets",
      "Grant Agreements",
    ],
    methodology:
      "Using Financial Metrics and Grant Expenditures, build a regression model that predicts the in-country absorption rate for an implementation period at its midpoint. Early warning of low absorption enables proactive portfolio management. a top operational priority. Features include historical absorption by the same principal recipient, expenditure run-rate, country macro indicators, and components.",
    status: "pipeline",
    category: "forecasting",
  },
  {
    id: "1.3",
    code: "1.3",
    title: "Disease Indicator Trajectory Forecasting",
    summary: "Projects key disease burden indicators into future periods.",
    datasets: ["Reported Results", "Eligibility", "WHO/UNAIDS data"],
    methodology:
      "Using Reported Results time series (people on ART, TB case detection rate, LLIN distribution counts), combined with external epidemiological data (UNAIDS, WHO), build ensemble forecasting models to project country-level disease indicators 3-5 years forward. This supports investment-case modeling for replenishment conferences.",
    status: "pipeline",
    category: "forecasting",
  },
  {
    id: "1.4",
    code: "1.4",
    title: "Health Product Demand Forecasting",
    summary:
      "Anticipates demand for health commodities financed through grants.",
    datasets: ["PQR Transaction Summary", "Reported Results", "Grant Budgets"],
    methodology:
      "Using PQR Transaction Summary data (quantities ordered by product, country, and date) combined with Results data (e.g., people on ART drives ARV demand), build demand forecasting models for key commodities. This reduces stockouts and waste, particularly for LLINs (which have seasonal and campaign-driven demand patterns) and ARVs (driven by treatment cohort growth).",
    status: "pipeline",
    category: "forecasting",
  },
  {
    id: "1.5",
    code: "1.5",
    title: "Donor Contribution Forecasting",
    summary: "Estimates donor pledge fulfillment and contribution timing.",
    datasets: ["Pledges and Contributions"],
    methodology:
      "Model the relationship between pledges and actual contributions using the Pledges and Contributions dataset. Predict contribution timing and amounts per donor for each replenishment cycle. Features: donor type, historical pledge-to-contribution ratio, replenishment period, macroeconomic indicators.",
    status: "pipeline",
    category: "forecasting",
  },
  // Classification and supervised learning
  {
    id: "2.3",
    code: "2.3",
    title: "Eligibility Transition Prediction",
    summary:
      "Classifies which countries are likely to gain or lose eligibility in the next allocation cycle, based on income and disease burden thresholds.",
    datasets: ["Eligibility", "Income classifications", "Disease data"],
    methodology:
      "Using the Eligibility dataset combined with World Bank income data and disease burden trends from Results, classify which countries are likely to transition out of eligibility in the next allocation cycle. Supports sustainability and transition planning.",
    status: "implemented",
    category: "classification",
  },
  {
    id: "2.1",
    code: "2.1",
    title: "Grant Performance Risk Classification",
    summary:
      "Scores grants by implementation risk based on historical performance patterns.",
    datasets: ["Reported Results"],
    methodology:
      "Train a classifier (XGBoost, random forest) to predict whether a grant will receive a low performance rating (B2 or C) at its next progress update. This creates a risk identification tool for fund portfolio managers. Features drawn from early expenditure patterns, historical ratings for the same principal recipient, financial metrics, and indicator achievement rates.",
    status: "pipeline",
    category: "classification",
  },
  {
    id: "2.2",
    code: "2.2",
    title: "Principal Recipient Capacity Scoring",
    summary: "Evaluates the organizational capacity of principal recipients.",
    datasets: ["Grant financials", "Implementation data"],
    methodology:
      "Build a composite scoring model that classifies principal recipients by implementation capacity using historical financial and programmatic performance across all their grants. Supports grant-making decisions during allocation periods. Features: average absorption rate, on-time reporting, indicator achievement rates, grant portfolio size, PR type.",
    status: "pipeline",
    category: "classification",
  },
  {
    id: "2.4",
    code: "2.4",
    title: "Budget Line-Item Classification",
    summary: "Auto-classifies budget line items into standardized categories.",
    datasets: ["Budget breakdowns"],
    methodology:
      "Train a text classifier on the Grant Budgets dataset's module/intervention/cost category taxonomy to automatically categorize new budget submissions. Useful for standardizing budget reviews across active grants.",
    status: "pipeline",
    category: "classification",
  },
  // Clustering and unsupervised learning
  {
    id: "3.1",
    code: "3.1",
    title: "Country Portfolio Segmentation",
    summary: "Groups countries by portfolio characteristics and risk profile.",
    datasets: ["Allocations", "Results", "Country data"],
    methodology:
      "Apply k-means or hierarchical clustering to countries using features derived from Allocations, Financial Metrics, Reported Results, and Eligibility (allocation size, absorption rate, indicator achievement, income level, disease burden). Identify natural groupings of countries with similar profiles to tailor technical assistance and portfolio management strategies. ",
    status: "pipeline",
    category: "clustering",
  },
  {
    id: "3.2",
    code: "3.2",
    title: "Grant Archetype Discovery",
    summary: "Discovers natural grant archetypes from implementation patterns.",
    datasets: ["Grant financials", "Results"],
    methodology:
      'Cluster grants based on their financial and programmatic signatures, like budget composition by module (from Grant Budgets), absorption trajectory, disbursement cadence, and indicator performance. Discover archetypes such as "high-absorption HIV treatment grants" versus "slow-starting health systems grants."',
    status: "pipeline",
    category: "clustering",
  },
  {
    id: "3.3",
    code: "3.3",
    title: "Supplier Market Segmentation",
    summary: "Segments procurement suppliers by behavior and market position.",
    datasets: ["Procurement data"],
    methodology:
      "Using PQR transaction data, cluster suppliers by product category, pricing behavior, geographic coverage, and transaction volume. Identify supplier concentration risks and opportunities for competitive sourcing.",
    status: "pipeline",
    category: "clustering",
  },
  {
    id: "3.4",
    code: "3.4",
    title: "Anomalous Spending Pattern Detection",
    summary:
      "Unsupervised detection of unusual grant spending patterns over time.",
    datasets: ["Expenditures", "Budgets"],
    methodology:
      "Apply isolation forests or DBSCAN to Grant Expenditures and Disbursements to detect grants with unusual spending patterns, sudden spikes, prolonged inactivity, or cost-category distributions that deviate from peer grants. Flags potential implementation problems or financial irregularities.",
    status: "pipeline",
    category: "clustering",
  },
  // Natural language processing and LLMs
  {
    id: "4.1",
    code: "4.1",
    title: "Automated Grant Narrative Generation",
    summary:
      "Generates structured narrative summaries of grant performance from financial and results data, reducing manual reporting effort.",
    datasets: [
      "Grant financials",
      "Results data",
      "Disbursements",
      "Targets vs actuals",
    ],
    methodology:
      "Fine-tune or prompt-engineer an LLM to generate country-level and grant-level narrative summaries by feeding it structured data from Grant Agreements, Financial Metrics, and Reported Results. Produce standardized grant briefs that combine financial absorption data with programmatic results in plain language for board members, donors, and country teams.",
    status: "implemented",
    category: "nlp",
  },
  {
    id: "4.2",
    code: "4.2",
    title: "Performance Framework Indicator Harmonization",
    summary:
      "Aligns heterogeneous indicator definitions across grants and countries.",
    datasets: ["Results frameworks", "Indicator definitions"],
    methodology:
      "Use NLP and embedding models to identify semantically equivalent indicators across grants that use slightly different wording. The Reported Results dataset contains thousands of indicator names across different grant cycles; a sentence-transformer model can cluster equivalent indicators and create a canonical mapping, improving data quality for cross-grant analysis.",
    status: "pipeline",
    category: "nlp",
  },
  {
    id: "4.3",
    code: "4.3",
    title: "Intelligent Data Exploration Chatbot",
    summary:
      "Conversational interface allowing natural language queries over Global Fund datasets.",
    datasets: ["All datasets"],
    methodology:
      'Build a retrieval-augmented generation (RAG) system over the entire Global Fund data estate. Users ask natural-language questions ("How much was disbursed to Nigeria for malaria in the last grant cycle?") and the system translates queries into data retrieval calls, retrieves data, and generates formatted answers. This dramatically lowers the barrier to accessing the Data Service.',
    status: "pipeline",
    category: "nlp",
  },
  {
    id: "4.4",
    code: "4.4",
    title: "Document Classification for PQR Verification",
    summary: "Classifies uploaded documents for PQR compliance verification.",
    datasets: ["Grant documents"],
    methodology:
      "Apply document understanding models to quality assurance attachments in PQR submissions to auto-classify and validate procurement documentation, reducing manual LFA verification workload.",
    status: "pipeline",
    category: "nlp",
  },
  // Anomaly detection and data quality
  {
    id: "5.1",
    code: "5.1",
    title: "Procurement Price Anomaly Detection",
    summary:
      "Identifies procurement transactions with prices that deviate significantly from market benchmarks, flagging potential inefficiencies or data errors.",
    datasets: ["Procurement data", "Global health price benchmarks"],
    methodology:
      "Using PQR Transaction Summary data, build a statistical or ML model that flags individual transactions with unit prices that significantly deviate from the reference price for the same product/dosage/pack size. This catches potential overpricing, data entry errors, or fraudulent transactions. A straightforward z-score or isolation forest approach works well here.",
    status: "implemented",
    category: "anomaly",
  },
  {
    id: "5.2",
    code: "5.2",
    title: "Financial Data Reconciliation Engine",
    summary:
      "Automatically reconciles financial figures across budget, disbursement, and expenditure reports, surfacing discrepancies.",
    datasets: ["Budgets", "Disbursements", "Expenditures"],
    methodology:
      "Cross-validate Disbursements against Financial Metrics and Grant Budgets to detect inconsistencies (e.g., disbursements exceeding budgets, expenditures exceeding disbursements). Flag data quality issues automatically.",
    status: "implemented",
    category: "anomaly",
  },
  {
    id: "5.3",
    code: "5.3",
    title: "Results Data Outlier Detection",
    summary:
      "Detects result values that are statistically inconsistent with peer countries, prior periods, or stated targets.",
    datasets: ["Annual results", "Targets vs actuals", "Disease indicators"],
    methodology:
      'Apply outlier detection to Reported Results to flag implausible indicator values like sudden 10x jumps in "people tested for HIV" or achievement rates exceeding 500%. These often indicate reporting errors rather than genuine performance.',
    status: "implemented",
    category: "anomaly",
  },
  // Optimization and recommendation systems
  {
    id: "6.1",
    code: "6.1",
    title: "Budget Allocation Optimizer",
    summary: "Recommends optimal budget allocations to maximize health impact.",
    datasets: ["Budgets", "Results data"],
    methodology:
      "Build a constrained optimization model that recommends how to allocate a given funding envelope across countries and components to maximize projected health outcomes. Uses historical relationships between budget amounts (Grant Budgets), absorption rates (Financial Metrics), and programmatic results (Reported Results) to estimate the marginal return on investment per dollar per intervention per country. ",
    status: "pipeline",
    category: "optimization",
  },
  {
    id: "6.2",
    code: "6.2",
    title: "Procurement Timing and Sourcing Optimizer",
    summary: "Optimizes procurement schedules and supplier selection.",
    datasets: ["Procurement data"],
    methodology:
      "Using PQR data on historical prices, lead times, and supplier performance, build a recommendation engine that suggests optimal order timing, quantities, and supplier selection for each product category to minimize cost while ensuring supply continuity.",
    status: "pipeline",
    category: "optimization",
  },
  {
    id: "6.3",
    code: "6.3",
    title: "Grant Portfolio Rebalancing Recommendations",
    summary: "Suggests portfolio-level adjustments based on performance data.",
    datasets: ["Grant financials", "Results"],
    methodology:
      "Develop a portfolio optimization tool that analyzes the current mix of grants across disease components, geographies, and implementation stages, and recommends rebalancing actions (accelerated disbursements, budget reprogramming) based on performance signals.",
    status: "pipeline",
    category: "optimization",
  },
  // Geospatial and network analysis
  {
    id: "7.1",
    code: "7.1",
    title: "Disbursement Flow Network Analysis",
    summary:
      "Maps and analyzes the network of fund flows from the Global Fund through principal recipients to sub-recipients, revealing concentration and bottlenecks.",
    datasets: [
      "Disbursements",
      "Pledges and Contributions",
      "Allocations",
      "Grant Agreements",
    ],
    methodology:
      "Map the flow of funds from donors (Pledges and Contributions) through the Global Fund to countries (Allocations, Disbursements) and visualize as a network graph. Apply network analysis metrics (centrality, clustering coefficient) to understand funding concentration, donor dependency, and systemic risks.",
    status: "implemented",
    category: "geospatial",
  },
  {
    id: "7.2",
    code: "7.2",
    title: "Geospatial Disease-Funding Gap Mapping",
    summary:
      "Overlays disease burden geographies with funding footprint to identify coverage gaps.",
    datasets: ["Allocations", "Disease indicators", "Geographic data"],
    methodology:
      "Join Allocations, Reported Results, and Eligibility with external disease-burden data (WHO Global Health Observatory) at the sub-national or country level to produce interactive maps showing where funding is misaligned with disease burden. This is a powerful advocacy and resource-mobilization tool.",
    status: "pipeline",
    category: "geospatial",
  },
  // Causal inference and impact evaluation
  {
    id: "8.1",
    code: "8.1",
    title: "Grant Design Impact Analysis",
    summary:
      "Evaluates the causal impact of different grant design choices on outcomes.",
    datasets: ["Grant design data", "Results"],
    methodology:
      "Apply causal inference methods (difference-in-differences, synthetic controls) to estimate the incremental impact of specific grant design features, such as community health worker modules, RSSH investments, or specific intervention types, on health outcomes. The combination of Grant Budgets (intervention-level spending) and Reported Results (health indicators) provides the treatment and outcome variables; Eligibility provides natural experiments (countries that just met or missed eligibility thresholds).",
    status: "pipeline",
    category: "causal",
  },
  {
    id: "8.2",
    code: "8.2",
    title: "Absorption Driver Analysis",
    summary: "Identifies causal drivers of low grant fund absorption rates.",
    datasets: ["Expenditures", "Budgets", "Implementation data"],
    methodology:
      "Use SHAP values from a gradient-boosted model trained to predict absorption rates to identify the most important drivers of high vs. low absorption. Features span principal recipient type, country characteristics, component, grant size, and budget composition. Produces actionable insights for the Access to Funding department.",
    status: "pipeline",
    category: "causal",
  },
];

export const HINT_CHIPS = [
  "What datasets are available?",
  "Show me allocation trends",
  "Explain the eligibility model",
  "Which grants have low absorption?",
  "Summarize disbursement flows",
  ...(import.meta.env.DEV ? ["/demo", "/demo main"] : []),
];

export const FUTURE_OUTLOOK_ITEMS: string[] = [
  "Integration of dataset profiler options onto the Data Service Platform.",
  "Ability to input future budget scales (e.g. an 11% reduction) and see the impact across the board.",
  "Ability to scale numeric input data and see the projected impact of that scaling.",
  "Allocation planning for a given cycle: bring in the budget, how it is broken out, and predict where you land.",
  "Look for additional context behind reductions or increases (e.g. 'Djibouti stabilises because it has internally built its system and no longer needs the Global Fund'; 'USAID stopping').",
  "Enhance search functionality beyond filters and free text with contextual, semantic filtering.",
  "AI Translations: translate data labels, narratives, and reports into multiple languages.",
];
