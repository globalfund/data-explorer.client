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
    slug: "allocation_forecasting",
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
    slug: "grant_budgets_forecasting",
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
    slug: "grant_commitments_forecasting",
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
      "Gradient-boosted regression on disbursement trajectories joined with implementation periods, predicting quarterly disbursement amounts per grant.",
    status: "implemented",
    category: "forecasting",
    slug: "grant_disbursements_forecasting",
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
      "Regression model predicting in-country absorption rate using expenditure run-rate, PR type, country, component, and historical absorption for the same recipient.",
    status: "implemented",
    category: "forecasting",
    slug: "absorption_rate_prediction",
  },
  {
    id: "1.3",
    code: "1.3",
    title: "Disease Indicator Trajectory Forecasting",
    summary: "Projects key disease burden indicators into future periods.",
    datasets: ["Reported Results", "Eligibility", "WHO/UNAIDS data"],
    methodology:
      "Ensemble regression on Reported Results time-series features (rolling mean, YoY change, trend slope) to project country-level disease indicators 3–5 years forward.",
    status: "implemented",
    category: "forecasting",
    slug: "disease_indicator_trajectory_forecasting",
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
      "Regression model predicting contribution amounts per donor using donor type, pledge-to-contribution ratio, replenishment cycle, and pledge timing features.",
    status: "implemented",
    category: "forecasting",
    slug: "donor_contribution_forecasting",
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
      "Classification model using eligibility history, income level, disease burden, and country features to predict eligibility status with probability scores.",
    status: "implemented",
    category: "classification",
    slug: "eligibility_prediction",
  },
  {
    id: "2.1",
    code: "2.1",
    title: "Grant Performance Risk Classification",
    summary:
      "Scores grants by implementation risk based on historical performance patterns.",
    datasets: ["Reported Results"],
    methodology:
      "XGBoost/random forest classifier predicting whether a grant will receive a low performance rating (B2/C) based on expenditure patterns, historical ratings, financial metrics, and indicator achievement.",
    status: "implemented",
    category: "classification",
    slug: "grant_performance_risk_classification",
  },
  {
    id: "2.2",
    code: "2.2",
    title: "Principal Recipient Capacity Scoring",
    summary: "Evaluates the organizational capacity of principal recipients.",
    datasets: ["Grant financials", "Implementation data"],
    methodology:
      "Composite classifier scoring PRs as High/Medium/Low capacity using absorption rate, on-time reporting, indicator achievement, portfolio size, and PR type.",
    status: "implemented",
    category: "classification",
    slug: "principal_recipient_capacity_scoring",
  },
  {
    id: "2.4",
    code: "2.4",
    title: "Budget Line-Item Classification",
    summary: "Auto-classifies budget line items into standardized categories.",
    datasets: ["Budget breakdowns"],
    methodology:
      "Text classifier on Grant Budgets module/intervention taxonomy to automatically categorize new budget submissions into standardized cost categories.",
    status: "implemented",
    category: "classification",
    slug: "budget_line-item_classification",
  },
  // Clustering and unsupervised learning
  {
    id: "3.1",
    code: "3.1",
    title: "Country Portfolio Segmentation",
    summary: "Groups countries by portfolio characteristics and risk profile.",
    datasets: ["Allocations", "Results", "Country data"],
    methodology:
      "DBSCAN/k-means clustering on allocation size, absorption rate, indicator achievement, income level, and disease burden to identify natural country groupings.",
    status: "implemented",
    category: "clustering",
    slug: "country_portfolio_segmentation",
  },
  {
    id: "3.2",
    code: "3.2",
    title: "Grant Archetype Discovery",
    summary: "Discovers natural grant archetypes from implementation patterns.",
    datasets: ["Grant financials", "Results"],
    methodology:
      'Clustering on budget composition, absorption trajectory, and indicator performance to discover grant archetypes such as "high-absorption HIV treatment" vs "slow-starting health systems."',
    status: "implemented",
    category: "clustering",
    slug: "grant_archetype_discovery",
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
      "Isolation forest on Grant Expenditures and Disbursements to detect grants with unusual spending patterns, sudden spikes, prolonged inactivity, or deviant cost-category distributions.",
    status: "implemented",
    category: "clustering",
    slug: "anomalous_spending_pattern_detection",
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
      "Z-score and isolation forest on PQR Transaction Summary to flag unit prices that significantly deviate from reference prices for the same product/dosage/pack size.",
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
      "Cross-validates Disbursements against Financial Metrics and Grant Budgets to detect inconsistencies such as disbursements exceeding budgets or expenditures exceeding disbursements.",
    status: "implemented",
    category: "anomaly",
    slug: "financial_data_reconciliation_engine",
  },
  {
    id: "5.3",
    code: "5.3",
    title: "Results Data Outlier Detection",
    summary:
      "Detects result values that are statistically inconsistent with peer countries, prior periods, or stated targets.",
    datasets: ["Annual results", "Targets vs actuals", "Disease indicators"],
    methodology:
      "Outlier detection on Reported Results to flag implausible indicator values, sudden 10× jumps, or achievement rates exceeding 500%.",
    status: "implemented",
    category: "anomaly",
    slug: "results_data_outlier_detection",
  },
  // Optimization and recommendation systems
  {
    id: "6.1",
    code: "6.1",
    title: "Budget Allocation Optimizer",
    summary: "Recommends optimal budget allocations to maximize health impact.",
    datasets: ["Budgets", "Results data"],
    methodology:
      "Constrained optimization over historical budget–absorption–results relationships to recommend how to allocate a funding envelope across countries and components for maximum projected health outcomes.",
    status: "implemented",
    category: "optimization",
    slug: "budget_allocation_optimizer",
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
      "Portfolio optimization analyzing the current grant mix across components, geographies, and implementation stages to recommend rebalancing actions such as accelerated disbursements or budget reprogramming.",
    status: "implemented",
    category: "optimization",
    slug: "grant_portfolio_rebalancing_recommendations",
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
      "Network graph of fund flows from donors through the Global Fund to countries, with centrality and HHI concentration metrics to identify dependency and systemic risk.",
    status: "implemented",
    category: "geospatial",
    slug: "disbursement_flow_network_analysis",
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
      "Difference-in-differences causal inference estimating the incremental impact of grant design features (CHW modules, RSSH investments, intervention types) on health outcomes.",
    status: "implemented",
    category: "causal",
    slug: "grant_design_impact_analysis",
  },
  {
    id: "8.2",
    code: "8.2",
    title: "Absorption Driver Analysis",
    summary: "Identifies causal drivers of low grant fund absorption rates.",
    datasets: ["Expenditures", "Budgets", "Implementation data"],
    methodology:
      "SHAP values from a gradient-boosted absorption-rate model identify the most important drivers of high vs. low absorption across PR type, country, component, grant size, and budget composition.",
    status: "implemented",
    category: "causal",
    slug: "absorption_driver_analysis",
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
  "Upgrades to the chat interface, including follow-up questions, multi-turn conversations, and updates from chat. As well as expanding the RAG capabilities, and especially integrating a general knowledge base for answering questions that require understanding of Global Fund policies, processes, and data definitions.",
  "Integration of dataset profiler options onto the Data Service Platform.",
  "Ability to input future budget scales (e.g. an 11% reduction) and see the impact across the board.",
  "Ability to scale numeric input data and see the projected impact of that scaling.",
  "Allocation planning for a given cycle: bring in the budget, how it is broken out, and predict where you land.",
  "Look for additional context behind reductions or increases (e.g. 'Djibouti stabilises because it has internally built its system and no longer needs the Global Fund'; 'USAID stopping').",
  "Enhance search functionality beyond filters and free text with contextual, semantic filtering.",
  "AI Translations: translate data labels, narratives, and reports into multiple languages.",
];
