export interface ExpandableHorizontalBarChartDataItem {
  name: string;
  value: number;
  value1?: number;
  items?: ExpandableHorizontalBarChartDataItem[];
  itemStyle?: {
    color: string;
  };
}

export interface ExpandableHorizontalBarProps {
  data: ExpandableHorizontalBarChartDataItem[];
  yAxisLabel: string;
  xAxisLabel: string;
  valueLabels: {
    value: string;
    value1?: string;
  };
  itemStyle?: {
    color: (params: any) => string;
  };
}

export const STORY_DATA_VARIANT_1: ExpandableHorizontalBarChartDataItem[] = [
  {
    name: "Affordable Medicines Facility - malaria (AMFm)",
    value: 537458185.43,
    value1: 537458185.43,
    items: [
      {
        name: "AMFm Bill & Melinda Gates Foundation",
        value: 24365000,
        value1: 24365000,
      },
      {
        name: "AMFm Canada",
        value: 39596763.03,
        value1: 39596763.03,
      },
      {
        name: "AMFm United Kingdom",
        value: 273496422.4,
        value1: 273496422.4,
      },
      {
        name: "AMFm World Health Organization-Unitaid",
        value: 200000000,
        value1: 200000000,
      },
    ],
  },
  {
    name: "Corporation",
    value: 655304646.01,
    value1: 695475765.3599999,
    items: [
      {
        name: "Absa Group Ltd",
        value: 150000,
        value1: 150000,
      },
      {
        name: "Anglo American plc",
        value: 18500000,
        value1: 7125000,
      },
      {
        name: "BHP Billiton Sustainable Communities",
        value: 10000000,
        value1: 10000000,
      },
      {
        name: "Chevron Corporation",
        value: 60004000,
        value1: 60004000,
      },
      {
        name: "Ecobank",
        value: 6000000,
        value1: 1500000,
      },
      {
        name: "Gift from Africa",
        value: 3000000,
        value1: 1495856.61,
      },
      {
        name: "GlaxoSmithKline plc and Viiv Healthcare",
        value: 9408997.36,
        value1: 5880623.35,
      },
      {
        name: "Goodbye Malaria - Sonhos Social Capital / Relate Trust ZA",
        value: 15000000,
        value1: 6719279.34,
      },
      {
        name: "Munich Re",
        value: 1002000,
        value1: 1002000,
      },
      {
        name: "Nationale Postcode Loterij N.V.",
        value: 3397662.5,
        value1: 3397662.5,
      },
      {
        name: "Product (RED)",
        value: 500000000,
        value1: 575059357.4,
      },
      {
        name: "PT. Kalbe Farma Tbk",
        value: 1500000,
        value1: 500000,
      },
      {
        name: "Standard Bank",
        value: 4000000,
        value1: 2000000,
      },
      {
        name: "Takeda Pharmaceutical",
        value: 17641986.15,
        value1: 17641986.16,
      },
      {
        name: "Vale",
        value: 3000000,
        value1: 3000000,
      },
      {
        name: "Duet Group",
        value: 2600000,
        value1: 0,
      },
      {
        name: "Medtronic LABS",
        value: 100000,
        value1: 0,
      },
    ],
  },
  {
    name: "Debt2Health",
    value: 232224123,
    value1: 225894765.36,
    items: [
      {
        name: "Debt2Health - Australia-Indonesia",
        value: 35267489.58,
        value1: 35267489.57,
      },
      {
        name: "Debt2Health - Germany - El Salvador",
        value: 11222085.1,
        value1: 11222085.1,
      },
      {
        name: "Debt2Health - Germany-Côte d'Ivoire",
        value: 12540097.19,
        value1: 12540096.89,
      },
      {
        name: "Debt2Health - Germany-Egypt",
        value: 4807118.2,
        value1: 4807118.2,
      },
      {
        name: "Debt2Health - Germany-Indonesia",
        value: 90905435.51,
        value1: 90905435.51,
      },
      {
        name: "Debt2Health - Germany-Pakistan",
        value: 26374033.3,
        value1: 26374033.3,
      },
      {
        name: "Debt2Health - Germany-Sri Lanka",
        value: 22444170.2,
        value1: 16114812.87,
      },
      {
        name: "Debt2Health - Jordan-Germany",
        value: 11222085.1,
        value1: 11222085.1,
      },
      {
        name: "Debt2Health - Spain-Cameroon",
        value: 10456922.94,
        value1: 10456922.94,
      },
      {
        name: "Debt2Health - Spain-Congo (Democratic Republic)",
        value: 3403543.46,
        value1: 3403543.46,
      },
      {
        name: "Debt2Health - Spain-Ethiopia",
        value: 3581142.42,
        value1: 3581142.42,
      },
    ],
  },
  {
    name: "Faith-Based Organization",
    value: 41500000,
    value1: 25510854.39,
    items: [
      {
        name: "LMI (Lutheran Malaria Initiative)",
        value: 13500000,
        value1: 1654957.39,
      },
      {
        name: "United Methodist Church",
        value: 28000000,
        value1: 23855897,
      },
    ],
  },
  {
    name: "Foundation",
    value: 4157886086.67,
    value1: 3455554123.85,
    items: [
      {
        name: "Abbott Fund",
        value: 5000000,
        value1: 1667000,
      },
      {
        name: "AIDS Healthcare Foundation",
        value: 10000000,
        value1: 2000000,
      },
      {
        name: "Bill & Melinda Gates Foundation",
        value: 3928300348,
        value1: 3305259289,
      },
      {
        name: "Catholic Relief Services",
        value: 11000000,
        value1: 8000000,
      },
      {
        name: "Children's Investment Fund Foundation",
        value: 68090668.75,
        value1: 48995232.75,
      },
      {
        name: "Comic Relief",
        value: 58195069.92,
        value1: 51032602.1,
      },
      {
        name: "Communitas Foundation",
        value: 2000000,
        value1: 2000000,
      },
      {
        name: "Fondation Chanel",
        value: 1550000,
        value1: 1550000,
      },
      {
        name: "J.C. Flowers Foundation",
        value: 1000000,
        value1: 1000000,
      },
      {
        name: "Johnson & Johnson Foundation",
        value: 0,
        value1: 4500000,
      },
      {
        name: "M∙A∙C AIDS Fund",
        value: 3250000,
        value1: 3250000,
      },
      {
        name: "McGovern Foundation",
        value: 1000000,
        value1: 1000000,
      },
      {
        name: "Rockefeller Foundation",
        value: 30000000,
        value1: 21000000,
      },
      {
        name: "Skoll Foundation",
        value: 10000000,
        value1: 4000000,
      },
      {
        name: "Tanoto Foundation",
        value: 1000000,
        value1: 300000,
      },
      {
        name: "FIFA Foundation",
        value: 1500000,
        value1: 0,
      },
      {
        name: "Outcomes Fund for Fevers",
        value: 25000000,
        value1: 0,
      },
      {
        name: "SMJR Foundation",
        value: 1000000,
        value1: 0,
      },
    ],
  },
  {
    name: "Individual",
    value: 79215156.01,
    value1: 23340405.44,
    items: [
      {
        name: "Tahir Foundation",
        value: 79215156.01,
        value1: 23340405.44,
      },
    ],
  },
  {
    name: "Private Sector & Nongovernment",
    value: 231880131.54999998,
    value1: 65813531.28,
    items: [
      {
        name: "Co-Impact",
        value: 8000000,
        value1: 6650000,
      },
      {
        name: "Hottokenai Campaign (G-CAP Coalition Japan)",
        value: 250000,
        value1: 250000,
      },
      {
        name: "Idol Gives Back",
        value: 16600000,
        value1: 16600000,
      },
      {
        name: "KN Cam Ranh Co., Ltd.",
        value: 4000000,
        value1: 1000000,
      },
      {
        name: "Other Private Sector",
        value: 160647487.07,
        value1: 29502198.44,
      },
      {
        name: "Plan International and Plan Canada",
        value: 5175551.6,
        value1: 1804239.96,
      },
      {
        name: "United Nations Foundation",
        value: 9707092.88,
        value1: 9707092.88,
      },
      {
        name: "YMCA and Y's Men International",
        value: 500000,
        value1: 300000,
      },
      {
        name: "Cordaid",
        value: 5000000,
        value1: 0,
      },
      {
        name: "Human Crescent",
        value: 10000000,
        value1: 0,
      },
      {
        name: "Rotary Australia World Community Service and Rotarians Against Malaria",
        value: 12000000,
        value1: 0,
      },
    ],
  },
  {
    name: "Public Sector",
    value: 83023804221.21999,
    value1: 68674070397.42001,
    items: [
      {
        name: "Andorra",
        value: 100000,
        value1: 100000,
      },
      {
        name: "Australia",
        value: 1061452595.5,
        value1: 857868607.82,
      },
      {
        name: "Austria",
        value: 1075900,
        value1: 1075900,
      },
      {
        name: "Azerbaijan",
        value: 20000000,
        value1: 5800000,
      },
      {
        name: "Barbados",
        value: 100000,
        value1: 100000,
      },
      {
        name: "Belgium",
        value: 406271977.08,
        value1: 391368847.43,
      },
      {
        name: "Benin",
        value: 3000000,
        value1: 2000000,
      },
      {
        name: "Brazil",
        value: 202355.08,
        value1: 202355.08,
      },
      {
        name: "Brunei Darussalam",
        value: 150000,
        value1: 150000,
      },
      {
        name: "Burkina Faso",
        value: 2075832.15,
        value1: 1075832.15,
      },
      {
        name: "Burundi",
        value: 1000000,
        value1: 596080.38,
      },
      {
        name: "Canada",
        value: 4379254163.97,
        value1: 3776157910.87,
      },
      {
        name: "Central African Republic",
        value: 1999001,
        value1: 423016.73,
      },
      {
        name: "Chad",
        value: 551480.73,
        value1: 551480.73,
      },
      {
        name: "China",
        value: 81000000,
        value1: 81000000,
      },
      {
        name: "Congo (Democratic Republic)",
        value: 12000000,
        value1: 4000000,
      },
      {
        name: "Côte d'Ivoire",
        value: 4526477.5,
        value1: 2445500.45,
      },
      {
        name: "Cyprus",
        value: 99354.2,
        value1: 99354.2,
      },
      {
        name: "Denmark",
        value: 499164879.31,
        value1: 449066686.85,
      },
      {
        name: "Estonia",
        value: 4077.2,
        value1: 4077.2,
      },
      {
        name: "Eswatini",
        value: 7000000,
        value1: 6000000,
      },
      {
        name: "European Commission",
        value: 4152680240.25,
        value1: 3966197215.12,
      },
      {
        name: "Finland",
        value: 33200900,
        value1: 33200900,
      },
      {
        name: "France",
        value: 9521557247.41,
        value1: 8017719950.15,
      },
      {
        name: "Georgia",
        value: 40000,
        value1: 40000,
      },
      {
        name: "Germany",
        value: 6713397327.33,
        value1: 5794835379.71,
      },
      {
        name: "Greece",
        value: 2205233.07,
        value1: 2205233.07,
      },
      {
        name: "Hungary",
        value: 55000,
        value1: 55000,
      },
      {
        name: "Iceland",
        value: 1170707.23,
        value1: 1170707.23,
      },
      {
        name: "India",
        value: 94500000,
        value1: 76500000,
      },
      {
        name: "Indonesia",
        value: 10000000,
        value1: 1500000,
      },
      {
        name: "Ireland",
        value: 406349691.8,
        value1: 362633844.82,
      },
      {
        name: "Italy",
        value: 2030558623.96,
        value1: 1521147534.93,
      },
      {
        name: "Japan",
        value: 5387195584,
        value1: 4622979225,
      },
      {
        name: "Kenya",
        value: 23008273,
        value1: 13008273,
      },
      {
        name: "Korea (Republic)",
        value: 170622486.94,
        value1: 120622486.94,
      },
      {
        name: "Kuwait",
        value: 25999965,
        value1: 17999965,
      },
      {
        name: "Latvia",
        value: 10000,
        value1: 10000,
      },
      {
        name: "Liechtenstein",
        value: 1634623.49,
        value1: 1634623.49,
      },
      {
        name: "Luxembourg",
        value: 81395478.42,
        value1: 72602631.95,
      },
      {
        name: "Malaysia",
        value: 132216.49,
        value1: 132216.49,
      },
      {
        name: "Malta",
        value: 479919.74,
        value1: 380565.55,
      },
      {
        name: "Mexico",
        value: 200000,
        value1: 200000,
      },
      {
        name: "Monaco",
        value: 970601.37,
        value1: 672538.78,
      },
      {
        name: "Namibia",
        value: 4750000,
        value1: 4050000,
      },
      {
        name: "Netherlands",
        value: 1667078517.4,
        value1: 1515473488.79,
      },
      {
        name: "New Zealand",
        value: 12063563.09,
        value1: 11062090.32,
      },
      {
        name: "Niger",
        value: 2000000,
        value1: 1238712.85,
      },
      {
        name: "Nigeria",
        value: 94280914,
        value1: 38791305.11,
      },
      {
        name: "Norway",
        value: 1597585463.72,
        value1: 1445550033.87,
      },
      {
        name: "Poland",
        value: 150000,
        value1: 150000,
      },
      {
        name: "Portugal",
        value: 18646007.53,
        value1: 17856141.65,
      },
      {
        name: "Qatar",
        value: 110000000,
        value1: 70000000,
      },
      {
        name: "Romania",
        value: 819457.78,
        value1: 819457.78,
      },
      {
        name: "Russian Federation",
        value: 316999995.61,
        value1: 316999995.61,
      },
      {
        name: "Rwanda",
        value: 6750000,
        value1: 3500000,
      },
      {
        name: "Saudi Arabia",
        value: 162000000,
        value1: 136000000,
      },
      {
        name: "Senegal",
        value: 2000000,
        value1: 1914594.06,
      },
      {
        name: "Singapore",
        value: 1600000,
        value1: 1200000,
      },
      {
        name: "Slovenia",
        value: 253869.34,
        value1: 253869.34,
      },
      {
        name: "South Africa",
        value: 41301559.09,
        value1: 32601559.09,
      },
      {
        name: "Spain",
        value: 1079015182.39,
        value1: 879228916.98,
      },
      {
        name: "Sweden",
        value: 2088394444.35,
        value1: 1861339250.78,
      },
      {
        name: "Switzerland",
        value: 381350853.24,
        value1: 336703360.76,
      },
      {
        name: "Tanzania (United Republic)",
        value: 1000000,
        value1: 997809.1,
      },
      {
        name: "Thailand",
        value: 26499941,
        value1: 24880356.91,
      },
      {
        name: "Togo",
        value: 3500000,
        value1: 2000000,
      },
      {
        name: "Tunisia",
        value: 2000000,
        value1: 2000000,
      },
      {
        name: "Uganda",
        value: 8500000,
        value1: 4214817.98,
      },
      {
        name: "Ukraine",
        value: 80000,
        value1: 80000,
      },
      {
        name: "Unitaid",
        value: 38691956,
        value1: 38691956,
      },
      {
        name: "United Arab Emirates",
        value: 55148072.57,
        value1: 55148072.57,
      },
      {
        name: "United Kingdom",
        value: 8250967810.82,
        value1: 7674536242.55,
      },
      {
        name: "United States",
        value: 31722465791.2,
        value1: 23985370962.2,
      },
      {
        name: "Zambia",
        value: 8525000,
        value1: 775000,
      },
      {
        name: "Zimbabwe",
        value: 4158462,
        value1: 3108462,
      },
      {
        name: "Armenia",
        value: 15000000,
        value1: 0,
      },
      {
        name: "Cameroon",
        value: 5020005,
        value1: 0,
      },
      {
        name: "Commitments to be personally secured by Bill Gates and Bono with the active support of France for the period 2020-2022",
        value: 96724259.64,
        value1: 0,
      },
      {
        name: "Congo",
        value: 5500000,
        value1: 0,
      },
      {
        name: "Equatorial Guinea",
        value: 2205922.9,
        value1: 0,
      },
      {
        name: "Ghana",
        value: 2000000,
        value1: 0,
      },
      {
        name: "Guinea",
        value: 200000,
        value1: 0,
      },
      {
        name: "Madagascar",
        value: 1000000,
        value1: 0,
      },
      {
        name: "Malawi",
        value: 1500000,
        value1: 0,
      },
      {
        name: "Mali",
        value: 551480.73,
        value1: 0,
      },
      {
        name: "Morocco",
        value: 1283940.39,
        value1: 0,
      },
      {
        name: "Other Public",
        value: 45799538.21,
        value1: 0,
      },
      {
        name: "Paraguay",
        value: 50000,
        value1: 0,
      },
    ],
  },
];

export const STORY_DATA_VARIANT_2: ExpandableHorizontalBarChartDataItem[] = [
  {
    name: "HIV",
    value: 6507650968.13,
    items: [
      {
        name: "Comprehensive prevention programs for MSM",
        value: 104951271.79,
      },
      {
        name: "Comprehensive prevention programs for people who inject drugs (PWID) and their partners",
        value: 124653010.87,
      },
      {
        name: "Comprehensive prevention programs for sex workers and their clients",
        value: 129591746.86,
      },
      {
        name: "Comprehensive prevention programs for TGs",
        value: 11422198.65,
      },
      {
        name: "Comprehensive programs for people in prisons and other closed settings",
        value: 9761187.64,
      },
      {
        name: "Differentiated HIV Testing Services",
        value: 468169158.73,
      },
      {
        name: "PMTCT",
        value: 163804046.97,
      },
      {
        name: "Prevention",
        value: 390694260.87,
      },
      {
        name: "Prevention package for adolescent girls and young women (AGYW) and male sexual partners in high HIV incidence settings",
        value: 4175173.75,
      },
      {
        name: "Prevention package for men who have sex with men (MSM) and their sexual partners",
        value: 7904916.84,
      },
      {
        name: "Prevention package for sex workers, their clients and other sexual partners",
        value: 8453813.99,
      },
      {
        name: "Prevention package for transgender people and their sexual partners",
        value: 868195.7,
      },
      {
        name: "Prevention programs for adolescents and youth, in and out of school",
        value: 162657316.14,
      },
      {
        name: "Prevention programs for general population",
        value: 124795311.63,
      },
      {
        name: "Prevention programs for other vulnerable populations",
        value: 51397820.99,
      },
      {
        name: "Reducing human rights-related barriers to TB/HIV services",
        value: 110293032.98,
      },
      {
        name: "Treatment, care and support",
        value: 4634058503.73,
      },
    ],
  },
  {
    name: "Malaria",
    value: 4691504230.91,
    items: [
      {
        name: "Case management",
        value: 1446824819.11,
      },
      {
        name: "Specific prevention interventions (SPI)",
        value: 353183640.88,
      },
      {
        name: "Vector control",
        value: 2891495770.92,
      },
    ],
  },
  {
    name: "Multicomponent",
    value: 4929393204.469999,
    items: [
      {
        name: "COVID-19",
        value: 2057307680.09,
      },
      {
        name: "Payment for results",
        value: 228306691.42,
      },
      {
        name: "Program management",
        value: 2643778832.96,
      },
    ],
  },
  {
    name: "RSSH",
    value: 1724136777.71,
    items: [
      {
        name: "RSSH: Community systems strengthening",
        value: 135267519.12,
      },
      {
        name: "RSSH: Financial management systems",
        value: 57462392.76,
      },
      {
        name: "RSSH: Health management information systems and M&E",
        value: 287142221.18,
      },
      {
        name: "RSSH: Health products management systems",
        value: 301525332.77,
      },
      {
        name: "RSSH: Health sector governance and planning",
        value: 53602859.18,
      },
      {
        name: "RSSH: Human resources for health, including community health workers",
        value: 316340982.58,
      },
      {
        name: "RSSH: Integrated service delivery and quality improvement",
        value: 183240141.16,
      },
      {
        name: "RSSH: Laboratory systems",
        value: 38541776.18,
      },
      {
        name: "RSSH: Monitoring and evaluation systems",
        value: 351013552.78,
      },
    ],
  },
  {
    name: "Tuberculosis",
    value: 2635910621.08,
    items: [
      {
        name: "MDR-TB",
        value: 951422631.83,
      },
      {
        name: "Removing human rights and gender related barriers to TB services",
        value: 5603168.07,
      },
      {
        name: "TB care and prevention",
        value: 1549500562.04,
      },
      {
        name: "TB/HIV",
        value: 129384259.14,
      },
    ],
  },
  {
    name: "Ungrouped Components",
    value: 220719.97,
    items: [
      {
        name: "Malaria",
        value: 0,
      },
      {
        name: "Multicomponent",
        value: 193997.94,
      },
      {
        name: "RSSH",
        value: 26722.03,
      },
      {
        name: "Tuberculosis",
        value: 0,
      },
    ],
  },
];

export function findDeep(
  data: ExpandableHorizontalBarChartDataItem[],
  name: string,
): ExpandableHorizontalBarChartDataItem | undefined {
  for (const item of data) {
    if (item.name === name) {
      return item;
    }
    if (item.items) {
      const found = findDeep(item.items, name);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}
