import { AiFeature } from "app/pages/ai-explorer/types";

export const FEATURE_CHECKLIST: AiFeature[] = [
  // Category 1: Forecasting and time-series models
  {
    id: "1.6",
    code: "1.6",
    title: "Allocation Forecasting",
    summary:
      "Predicts future Global Fund allocations to countries and programs based on historical trends, replenishment cycles, and portfolio performance.",
    datasets: ["Allocations", "Replenishment periods", "Country eligibility"],
    methodology:
      "Time-series regression with cyclical replenishment pattern overlays.",
    status: "implemented",
  },
  {
    id: "1.7",
    code: "1.7",
    title: "Grant Budgets Forecasting",
    summary:
      "Projects grant budget requirements across periods, surfacing likely under- or over-utilization before it becomes a problem.",
    datasets: ["Grant budgets", "Expenditures", "Absorption rates"],
    methodology: "ARIMA-based forecasting with budget cycle adjustments.",
    status: "implemented",
  },
  {
    id: "1.8",
    code: "1.8",
    title: "Grant Commitments Forecasting",
    summary:
      "Estimates future commitment levels across active grants, enabling proactive pipeline management.",
    datasets: ["Grant commitments", "Disbursements", "Grant timelines"],
    methodology: "Rolling-window regression on disbursement trajectories.",
    status: "implemented",
  },
  {
    id: "1.1",
    code: "1.1",
    title: "Grant Disbursement Forecasting",
    summary: "Models expected disbursement schedules for active grants.",
    datasets: ["Disbursements"],
    methodology: "Time-series forecasting.",
    status: "pipeline",
  },
  {
    id: "1.2",
    code: "1.2",
    title: "Absorption Rate Prediction",
    summary:
      "Predicts how efficiently grant funds will be absorbed by principal recipients.",
    datasets: ["Expenditures", "Budgets"],
    methodology: "Supervised regression.",
    status: "pipeline",
  },
  {
    id: "1.3",
    code: "1.3",
    title: "Disease Indicator Trajectory Forecasting",
    summary: "Projects key disease burden indicators into future periods.",
    datasets: ["Annual results", "Disease indicators"],
    methodology: "Time-series extrapolation.",
    status: "pipeline",
  },
  {
    id: "1.4",
    code: "1.4",
    title: "Health Product Demand Forecasting",
    summary:
      "Anticipates demand for health commodities financed through grants.",
    datasets: ["Procurement", "Results data"],
    methodology: "Demand forecasting models.",
    status: "pipeline",
  },
  {
    id: "1.5",
    code: "1.5",
    title: "Donor Contribution Forecasting",
    summary: "Estimates donor pledge fulfillment and contribution timing.",
    datasets: ["Pledges", "Contributions"],
    methodology: "Regression on historical pledge-to-contribution patterns.",
    status: "pipeline",
  },
  // Category 2: Classification and supervised learning
  {
    id: "2.3",
    code: "2.3",
    title: "Eligibility Transition Prediction",
    summary:
      "Classifies which countries are likely to gain or lose eligibility in the next allocation cycle, based on income and disease burden thresholds.",
    datasets: ["Country eligibility", "Income classifications", "Disease data"],
    methodology:
      "Binary classification using income trend and disease burden features.",
    status: "implemented",
  },
  {
    id: "2.1",
    code: "2.1",
    title: "Grant Performance Risk Classification",
    summary:
      "Scores grants by implementation risk based on historical performance patterns.",
    datasets: ["Grant results", "Financial data"],
    methodology: "Multi-class classifier.",
    status: "pipeline",
  },
  {
    id: "2.2",
    code: "2.2",
    title: "Principal Recipient Capacity Scoring",
    summary: "Evaluates the organizational capacity of principal recipients.",
    datasets: ["Grant financials", "Implementation data"],
    methodology: "Composite scoring with ML ranking.",
    status: "pipeline",
  },
  {
    id: "2.4",
    code: "2.4",
    title: "Budget Line-Item Classification",
    summary: "Auto-classifies budget line items into standardized categories.",
    datasets: ["Budget breakdowns"],
    methodology: "Text classification / structured regression.",
    status: "pipeline",
  },
  // Category 3: Clustering and unsupervised learning
  {
    id: "3.1",
    code: "3.1",
    title: "Country Portfolio Segmentation",
    summary: "Groups countries by portfolio characteristics and risk profile.",
    datasets: ["Allocations", "Results", "Country data"],
    methodology: "k-means / hierarchical clustering.",
    status: "pipeline",
  },
  {
    id: "3.2",
    code: "3.2",
    title: "Grant Archetype Discovery",
    summary: "Discovers natural grant archetypes from implementation patterns.",
    datasets: ["Grant financials", "Results"],
    methodology: "Unsupervised clustering.",
    status: "pipeline",
  },
  {
    id: "3.3",
    code: "3.3",
    title: "Supplier Market Segmentation",
    summary: "Segments procurement suppliers by behavior and market position.",
    datasets: ["Procurement data"],
    methodology: "Clustering on procurement features.",
    status: "pipeline",
  },
  {
    id: "3.4",
    code: "3.4",
    title: "Anomalous Spending Pattern Detection",
    summary:
      "Unsupervised detection of unusual grant spending patterns over time.",
    datasets: ["Expenditures", "Budgets"],
    methodology: "Isolation forest / autoencoder.",
    status: "pipeline",
  },
  // Category 4: Natural language processing and LLMs
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
      "LLM-based text generation conditioned on structured grant data.",
    status: "implemented",
  },
  {
    id: "4.2",
    code: "4.2",
    title: "Performance Framework Indicator Harmonization",
    summary:
      "Aligns heterogeneous indicator definitions across grants and countries.",
    datasets: ["Results frameworks", "Indicator definitions"],
    methodology: "Semantic similarity and NLP matching.",
    status: "pipeline",
  },
  {
    id: "4.3",
    code: "4.3",
    title: "Intelligent Data Exploration Chatbot",
    summary:
      "Conversational interface allowing natural language queries over Global Fund datasets.",
    datasets: ["All datasets"],
    methodology: "LLM with tool-use and RAG over structured data.",
    status: "pipeline",
  },
  {
    id: "4.4",
    code: "4.4",
    title: "Document Classification for PQR Verification",
    summary: "Classifies uploaded documents for PQR compliance verification.",
    datasets: ["Grant documents"],
    methodology: "Document classification model.",
    status: "pipeline",
  },
  // Category 5: Anomaly detection and data quality
  {
    id: "5.1",
    code: "5.1",
    title: "Procurement Price Anomaly Detection",
    summary:
      "Identifies procurement transactions with prices that deviate significantly from market benchmarks, flagging potential inefficiencies or data errors.",
    datasets: ["Procurement data", "Global health price benchmarks"],
    methodology:
      "Statistical outlier detection (z-score and IQR) with category-level baselines.",
    status: "implemented",
  },
  {
    id: "5.2",
    code: "5.2",
    title: "Financial Data Reconciliation Engine",
    summary:
      "Automatically reconciles financial figures across budget, disbursement, and expenditure reports, surfacing discrepancies.",
    datasets: ["Budgets", "Disbursements", "Expenditures"],
    methodology:
      "Rule-based reconciliation with ML-assisted discrepancy triage.",
    status: "implemented",
  },
  {
    id: "5.3",
    code: "5.3",
    title: "Results Data Outlier Detection",
    summary:
      "Detects result values that are statistically inconsistent with peer countries, prior periods, or stated targets.",
    datasets: ["Annual results", "Targets vs actuals", "Disease indicators"],
    methodology:
      "Multivariate outlier detection with peer-group normalization.",
    status: "implemented",
  },
  // Category 6: Optimization and recommendation systems
  {
    id: "6.1",
    code: "6.1",
    title: "Budget Allocation Optimizer",
    summary: "Recommends optimal budget allocations to maximize health impact.",
    datasets: ["Budgets", "Results data"],
    methodology: "Constrained optimization.",
    status: "pipeline",
  },
  {
    id: "6.2",
    code: "6.2",
    title: "Procurement Timing and Sourcing Optimizer",
    summary: "Optimizes procurement schedules and supplier selection.",
    datasets: ["Procurement data"],
    methodology: "Mixed-integer programming.",
    status: "pipeline",
  },
  {
    id: "6.3",
    code: "6.3",
    title: "Grant Portfolio Rebalancing Recommendations",
    summary: "Suggests portfolio-level adjustments based on performance data.",
    datasets: ["Grant financials", "Results"],
    methodology: "Recommendation engine.",
    status: "pipeline",
  },
  // Category 7: Geospatial and network analysis
  {
    id: "7.1",
    code: "7.1",
    title: "Disbursement Flow Network Analysis",
    summary:
      "Maps and analyzes the network of fund flows from the Global Fund through principal recipients to sub-recipients, revealing concentration and bottlenecks.",
    datasets: [
      "Disbursements",
      "Principal recipient data",
      "Sub-recipient data",
    ],
    methodology: "Graph network analysis with centrality and flow metrics.",
    status: "implemented",
  },
  {
    id: "7.2",
    code: "7.2",
    title: "Geospatial Disease-Funding Gap Mapping",
    summary:
      "Overlays disease burden geographies with funding footprint to identify coverage gaps.",
    datasets: ["Allocations", "Disease indicators", "Geographic data"],
    methodology: "Geospatial analysis and gap scoring.",
    status: "pipeline",
  },
  // Category 8: Causal inference and impact evaluation
  {
    id: "8.1",
    code: "8.1",
    title: "Grant Design Impact Analysis",
    summary:
      "Evaluates the causal impact of different grant design choices on outcomes.",
    datasets: ["Grant design data", "Results"],
    methodology: "Difference-in-differences / synthetic control.",
    status: "pipeline",
  },
  {
    id: "8.2",
    code: "8.2",
    title: "Absorption Driver Analysis",
    summary: "Identifies causal drivers of low grant fund absorption rates.",
    datasets: ["Expenditures", "Budgets", "Implementation data"],
    methodology: "Causal inference with feature attribution.",
    status: "pipeline",
  },
];

export const HINT_CHIPS = [
  "What datasets are available?",
  "Show me allocation trends",
  "Explain the eligibility model",
  "Which grants have low absorption?",
  "Summarize disbursement flows",
];

export const AVAILABLE_DATASETS = [
  "Pledges & Contributions",
  "Allocations",
  "Grant Financials (Budgets, Disbursements, Expenditures)",
  "Annual Results & Targets",
  "Country Eligibility",
  "Procurement Data",
  "Grant Implementation Data",
  "Geographic & Location Data",
];
