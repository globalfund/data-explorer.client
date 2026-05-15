export interface SunburstDataItem {
  name: string;
  value: number;
  children?: SunburstDataItem[];
  itemStyle?: Record<string, string | number>;
}

export interface SunburstChartProps {
  centerLabel: string;
  tooltipLabel: string;
  data: SunburstDataItem[];
  selectedItem: {
    dataIndex: number;
    item: SunburstDataItem;
  } | null;
  setSelectedItem: (
    item: {
      dataIndex: number;
      item: SunburstDataItem;
    } | null,
  ) => void;
}

export const STORY_DATA_VARIANT_1: SunburstDataItem[] = [
  {
    name: "Foundation",
    value: 4157886086.67,
    children: [
      {
        name: "Abbott Fund",
        value: 5000000,
      },
      {
        name: "AIDS Healthcare Foundation",
        value: 10000000,
      },
      {
        name: "Bill & Melinda Gates Foundation",
        value: 3928300348,
      },
      {
        name: "Catholic Relief Services",
        value: 11000000,
      },
      {
        name: "Children's Investment Fund Foundation",
        value: 68090668.75,
      },
      {
        name: "Comic Relief",
        value: 58195069.92,
      },
      {
        name: "Communitas Foundation",
        value: 2000000,
      },
      {
        name: "FIFA Foundation",
        value: 1500000,
      },
      {
        name: "Fondation Chanel",
        value: 1550000,
      },
      {
        name: "J.C. Flowers Foundation",
        value: 1000000,
      },
      {
        name: "M∙A∙C AIDS Fund",
        value: 3250000,
      },
      {
        name: "McGovern Foundation",
        value: 1000000,
      },
      {
        name: "Outcomes Fund for Fevers",
        value: 25000000,
      },
      {
        name: "Rockefeller Foundation",
        value: 30000000,
      },
      {
        name: "Skoll Foundation",
        value: 10000000,
      },
      {
        name: "SMJR Foundation",
        value: 1000000,
      },
      {
        name: "Tanoto Foundation",
        value: 1000000,
      },
    ],
  },
  {
    name: "Corporation",
    value: 655304646.01,
    children: [
      {
        name: "Absa Group Ltd",
        value: 150000,
      },
      {
        name: "Anglo American plc",
        value: 18500000,
      },
      {
        name: "BHP Billiton Sustainable Communities",
        value: 10000000,
      },
      {
        name: "Chevron Corporation",
        value: 60004000,
      },
      {
        name: "Duet Group",
        value: 2600000,
      },
      {
        name: "Ecobank",
        value: 6000000,
      },
      {
        name: "Gift from Africa",
        value: 3000000,
      },
      {
        name: "GlaxoSmithKline plc and Viiv Healthcare",
        value: 9408997.36,
      },
      {
        name: "Goodbye Malaria - Sonhos Social Capital / Relate Trust ZA",
        value: 15000000,
      },
      {
        name: "Medtronic LABS",
        value: 100000,
      },
      {
        name: "Munich Re",
        value: 1002000,
      },
      {
        name: "Nationale Postcode Loterij N.V.",
        value: 3397662.5,
      },
      {
        name: "Product (RED)",
        value: 500000000,
      },
      {
        name: "PT. Kalbe Farma Tbk",
        value: 1500000,
      },
      {
        name: "Standard Bank",
        value: 4000000,
      },
      {
        name: "Takeda Pharmaceutical",
        value: 17641986.15,
      },
      {
        name: "Vale",
        value: 3000000,
      },
    ],
  },
  {
    name: "Affordable Medicines Facility - malaria (AMFm)",
    value: 537458185.43,
    children: [
      {
        name: "AMFm Bill & Melinda Gates Foundation",
        value: 24365000,
      },
      {
        name: "AMFm Canada",
        value: 39596763.03,
      },
      {
        name: "AMFm United Kingdom",
        value: 273496422.4,
      },
      {
        name: "AMFm World Health Organization-Unitaid",
        value: 200000000,
      },
    ],
  },
  {
    name: "Public Sector",
    value: 83023804221.21999,
    children: [
      {
        name: "Andorra",
        value: 100000,
      },
      {
        name: "Armenia",
        value: 15000000,
      },
      {
        name: "Australia",
        value: 1061452595.5,
      },
      {
        name: "Austria",
        value: 1075900,
      },
      {
        name: "Azerbaijan",
        value: 20000000,
      },
      {
        name: "Barbados",
        value: 100000,
      },
      {
        name: "Belgium",
        value: 406271977.08,
      },
      {
        name: "Benin",
        value: 3000000,
      },
      {
        name: "Brazil",
        value: 202355.08,
      },
      {
        name: "Brunei Darussalam",
        value: 150000,
      },
      {
        name: "Burkina Faso",
        value: 2075832.15,
      },
      {
        name: "Burundi",
        value: 1000000,
      },
      {
        name: "Cameroon",
        value: 5020005,
      },
      {
        name: "Canada",
        value: 4379254163.97,
      },
      {
        name: "Central African Republic",
        value: 1999001,
      },
      {
        name: "Chad",
        value: 551480.73,
      },
      {
        name: "China",
        value: 81000000,
      },
      {
        name: "Commitments to be personally secured by Bill Gates and Bono with the active support of France for the period 2020-2022",
        value: 96724259.64,
      },
      {
        name: "Congo",
        value: 5500000,
      },
      {
        name: "Congo (Democratic Republic)",
        value: 12000000,
      },
      {
        name: "Côte d'Ivoire",
        value: 4526477.5,
      },
      {
        name: "Cyprus",
        value: 99354.2,
      },
      {
        name: "Denmark",
        value: 499164879.31,
      },
      {
        name: "Equatorial Guinea",
        value: 2205922.9,
      },
      {
        name: "Estonia",
        value: 4077.2,
      },
      {
        name: "Eswatini",
        value: 7000000,
      },
      {
        name: "European Commission",
        value: 4152680240.25,
      },
      {
        name: "Finland",
        value: 33200900,
      },
      {
        name: "France",
        value: 9521557247.41,
      },
      {
        name: "Georgia",
        value: 40000,
      },
      {
        name: "Germany",
        value: 6713397327.33,
      },
      {
        name: "Ghana",
        value: 2000000,
      },
      {
        name: "Greece",
        value: 2205233.07,
      },
      {
        name: "Guinea",
        value: 200000,
      },
      {
        name: "Hungary",
        value: 55000,
      },
      {
        name: "Iceland",
        value: 1170707.23,
      },
      {
        name: "India",
        value: 94500000,
      },
      {
        name: "Indonesia",
        value: 10000000,
      },
      {
        name: "Ireland",
        value: 406349691.8,
      },
      {
        name: "Italy",
        value: 2030558623.96,
      },
      {
        name: "Japan",
        value: 5387195584,
      },
      {
        name: "Kenya",
        value: 23008273,
      },
      {
        name: "Korea (Republic)",
        value: 170622486.94,
      },
      {
        name: "Kuwait",
        value: 25999965,
      },
      {
        name: "Latvia",
        value: 10000,
      },
      {
        name: "Liechtenstein",
        value: 1634623.49,
      },
      {
        name: "Luxembourg",
        value: 81395478.42,
      },
      {
        name: "Madagascar",
        value: 1000000,
      },
      {
        name: "Malawi",
        value: 1500000,
      },
      {
        name: "Malaysia",
        value: 132216.49,
      },
      {
        name: "Mali",
        value: 551480.73,
      },
      {
        name: "Malta",
        value: 479919.74,
      },
      {
        name: "Mexico",
        value: 200000,
      },
      {
        name: "Monaco",
        value: 970601.37,
      },
      {
        name: "Morocco",
        value: 1283940.39,
      },
      {
        name: "Namibia",
        value: 4750000,
      },
      {
        name: "Netherlands",
        value: 1667078517.4,
      },
      {
        name: "New Zealand",
        value: 12063563.09,
      },
      {
        name: "Niger",
        value: 2000000,
      },
      {
        name: "Nigeria",
        value: 94280914,
      },
      {
        name: "Norway",
        value: 1597585463.72,
      },
      {
        name: "Other Public",
        value: 45799538.21,
      },
      {
        name: "Paraguay",
        value: 50000,
      },
      {
        name: "Poland",
        value: 150000,
      },
      {
        name: "Portugal",
        value: 18646007.53,
      },
      {
        name: "Qatar",
        value: 110000000,
      },
      {
        name: "Romania",
        value: 819457.78,
      },
      {
        name: "Russian Federation",
        value: 316999995.61,
      },
      {
        name: "Rwanda",
        value: 6750000,
      },
      {
        name: "Saudi Arabia",
        value: 162000000,
      },
      {
        name: "Senegal",
        value: 2000000,
      },
      {
        name: "Singapore",
        value: 1600000,
      },
      {
        name: "Slovenia",
        value: 253869.34,
      },
      {
        name: "South Africa",
        value: 41301559.09,
      },
      {
        name: "Spain",
        value: 1079015182.39,
      },
      {
        name: "Sweden",
        value: 2088394444.35,
      },
      {
        name: "Switzerland",
        value: 381350853.24,
      },
      {
        name: "Tanzania (United Republic)",
        value: 1000000,
      },
      {
        name: "Thailand",
        value: 26499941,
      },
      {
        name: "Togo",
        value: 3500000,
      },
      {
        name: "Tunisia",
        value: 2000000,
      },
      {
        name: "Uganda",
        value: 8500000,
      },
      {
        name: "Ukraine",
        value: 80000,
      },
      {
        name: "Unitaid",
        value: 38691956,
      },
      {
        name: "United Arab Emirates",
        value: 55148072.57,
      },
      {
        name: "United Kingdom",
        value: 8250967810.82,
      },
      {
        name: "United States",
        value: 31722465791.2,
      },
      {
        name: "Zambia",
        value: 8525000,
      },
      {
        name: "Zimbabwe",
        value: 4158462,
      },
    ],
  },
  {
    name: "Private Sector & Nongovernment",
    value: 231880131.54999998,
    children: [
      {
        name: "Co-Impact",
        value: 8000000,
      },
      {
        name: "Cordaid",
        value: 5000000,
      },
      {
        name: "Hottokenai Campaign (G-CAP Coalition Japan)",
        value: 250000,
      },
      {
        name: "Human Crescent",
        value: 10000000,
      },
      {
        name: "Idol Gives Back",
        value: 16600000,
      },
      {
        name: "KN Cam Ranh Co., Ltd.",
        value: 4000000,
      },
      {
        name: "Other Private Sector",
        value: 160647487.07,
      },
      {
        name: "Plan International and Plan Canada",
        value: 5175551.6,
      },
      {
        name: "Rotary Australia World Community Service and Rotarians Against Malaria",
        value: 12000000,
      },
      {
        name: "United Nations Foundation",
        value: 9707092.88,
      },
      {
        name: "YMCA and Y's Men International",
        value: 500000,
      },
    ],
  },
  {
    name: "Debt2Health",
    value: 232224123,
    children: [
      {
        name: "Debt2Health - Australia-Indonesia",
        value: 35267489.58,
      },
      {
        name: "Debt2Health - Germany - El Salvador",
        value: 11222085.1,
      },
      {
        name: "Debt2Health - Germany-Côte d'Ivoire",
        value: 12540097.19,
      },
      {
        name: "Debt2Health - Germany-Egypt",
        value: 4807118.2,
      },
      {
        name: "Debt2Health - Germany-Indonesia",
        value: 90905435.51,
      },
      {
        name: "Debt2Health - Germany-Pakistan",
        value: 26374033.3,
      },
      {
        name: "Debt2Health - Germany-Sri Lanka",
        value: 22444170.2,
      },
      {
        name: "Debt2Health - Jordan-Germany",
        value: 11222085.1,
      },
      {
        name: "Debt2Health - Spain-Cameroon",
        value: 10456922.94,
      },
      {
        name: "Debt2Health - Spain-Congo (Democratic Republic)",
        value: 3403543.46,
      },
      {
        name: "Debt2Health - Spain-Ethiopia",
        value: 3581142.42,
      },
    ],
  },
  {
    name: "Faith-Based Organization",
    value: 41500000,
    children: [
      {
        name: "LMI (Lutheran Malaria Initiative)",
        value: 13500000,
      },
      {
        name: "United Methodist Church",
        value: 28000000,
      },
    ],
  },
  {
    name: "Individual",
    value: 79215156.01,
    children: [
      {
        name: "Tahir Foundation",
        value: 79215156.01,
      },
    ],
  },
];

export const STORY_DATA_VARIANT_2: SunburstDataItem[] = [
  {
    name: "Caribbean",
    value: 484368832,
    children: [
      {
        name: "Cuba",
        value: 50357511,
      },
      {
        name: "Dominican Republic",
        value: 52586413,
      },
      {
        name: "Haiti",
        value: 335891203,
      },
      {
        name: "Jamaica",
        value: 34942491,
      },
      {
        name: "Multicountry Caribbean MCC",
        value: 10591214,
      },
    ],
  },
  {
    name: "Central America",
    value: 286898324,
    children: [
      {
        name: "Belize",
        value: 7934644,
      },
      {
        name: "Costa Rica",
        value: 6364494,
      },
      {
        name: "El Salvador",
        value: 54585846,
      },
      {
        name: "Guatemala",
        value: 98492699,
      },
      {
        name: "Honduras",
        value: 55030647,
      },
      {
        name: "Nicaragua",
        value: 61804102,
      },
      {
        name: "Panama",
        value: 2685892,
      },
    ],
  },
  {
    name: "Central Asia",
    value: 332832423,
    children: [
      {
        name: "Kazakhstan",
        value: 42639142,
      },
      {
        name: "Kyrgyzstan",
        value: 77307165,
      },
      {
        name: "Tajikistan",
        value: 73773735,
      },
      {
        name: "Turkmenistan",
        value: 15262357,
      },
      {
        name: "Uzbekistan",
        value: 123850024,
      },
    ],
  },
  {
    name: "Eastern Africa",
    value: 13726327535.18,
    children: [
      {
        name: "Burundi",
        value: 315478446,
      },
      {
        name: "Comoros",
        value: 20256266.59,
      },
      {
        name: "Djibouti",
        value: 30872830,
      },
      {
        name: "Eritrea",
        value: 132888653,
      },
      {
        name: "Ethiopia",
        value: 1247733383.59,
      },
      {
        name: "Kenya",
        value: 1163931089,
      },
      {
        name: "Madagascar",
        value: 291319833,
      },
      {
        name: "Malawi",
        value: 1480560562,
      },
      {
        name: "Mauritius",
        value: 7121611,
      },
      {
        name: "Mozambique",
        value: 2024937380,
      },
      {
        name: "Rwanda",
        value: 572354015,
      },
      {
        name: "Somalia",
        value: 236788983,
      },
      {
        name: "South Sudan",
        value: 350502420,
      },
      {
        name: "Tanzania (United Republic)",
        value: 1769743640,
      },
      {
        name: "Uganda",
        value: 1631186508,
      },
      {
        name: "Zambia",
        value: 928410043,
      },
      {
        name: "Zanzibar",
        value: 33026779,
      },
      {
        name: "Zimbabwe",
        value: 1489215093,
      },
    ],
  },
  {
    name: "Eastern Asia",
    value: 108574802,
    children: [
      {
        name: "Korea (Democratic Peoples Republic)",
        value: 70866869,
      },
      {
        name: "Mongolia",
        value: 37707933,
      },
    ],
  },
  {
    name: "Eastern Europe",
    value: 535926998.31,
    children: [
      {
        name: "Belarus",
        value: 59081197,
      },
      {
        name: "Moldova",
        value: 56148337.31,
      },
      {
        name: "Romania",
        value: 4548280,
      },
      {
        name: "Russian Federation",
        value: 20024597,
      },
      {
        name: "Ukraine",
        value: 396124587,
      },
    ],
  },
  {
    name: "Melanesia",
    value: 221584885,
    children: [
      {
        name: "Papua New Guinea",
        value: 198186080,
      },
      {
        name: "Solomon Islands",
        value: 23398805,
      },
    ],
  },
  {
    name: "Middle Africa",
    value: 3789142445.9399996,
    children: [
      {
        name: "Angola",
        value: 266654033,
      },
      {
        name: "Cameroon",
        value: 748328396.22,
      },
      {
        name: "Central African Republic",
        value: 337228425.48,
      },
      {
        name: "Chad",
        value: 351666505.09,
      },
      {
        name: "Congo",
        value: 162673532.53,
      },
      {
        name: "Congo (Democratic Republic)",
        value: 1872576079,
      },
      {
        name: "Equatorial Guinea",
        value: 6161483.5,
      },
      {
        name: "Gabon",
        value: 12392401.12,
      },
      {
        name: "Sao Tome and Principe",
        value: 31461590,
      },
    ],
  },
  {
    name: "Northern Africa",
    value: 517684121.87,
    children: [
      {
        name: "Algeria",
        value: 2312936,
      },
      {
        name: "Egypt",
        value: 16277728,
      },
      {
        name: "Morocco",
        value: 54111423.87,
      },
      {
        name: "Multicountry North Africa",
        value: 9551333,
      },
      {
        name: "Sudan",
        value: 426571661,
      },
      {
        name: "Tunisia",
        value: 8859040,
      },
    ],
  },
  {
    name: "Oceania",
    value: 39995538,
    children: [
      {
        name: "Multicountry Western Pacific",
        value: 39995538,
      },
    ],
  },
  {
    name: "South America",
    value: 300288442,
    children: [
      {
        name: "Bolivia (Plurinational State)",
        value: 59541983,
      },
      {
        name: "Colombia",
        value: 52196986,
      },
      {
        name: "Ecuador",
        value: 18591439,
      },
      {
        name: "Guyana",
        value: 19056398,
      },
      {
        name: "Paraguay",
        value: 21099557,
      },
      {
        name: "Peru",
        value: 58211308,
      },
      {
        name: "Suriname",
        value: 15306486,
      },
      {
        name: "Venezuela",
        value: 56284285,
      },
    ],
  },
  {
    name: "South-Eastern Asia",
    value: 2946389598,
    children: [
      {
        name: "Cambodia",
        value: 171348609,
      },
      {
        name: "Indonesia",
        value: 836647327,
      },
      {
        name: "Lao (Peoples Democratic Republic)",
        value: 45811865,
      },
      {
        name: "Malaysia",
        value: 11557088,
      },
      {
        name: "Multicountry East Asia and Pacific RAI",
        value: 326232824,
      },
      {
        name: "Myanmar",
        value: 594494243,
      },
      {
        name: "Philippines",
        value: 413182416,
      },
      {
        name: "Thailand",
        value: 166510683,
      },
      {
        name: "Timor-Leste",
        value: 47123233,
      },
      {
        name: "Viet Nam",
        value: 333481310,
      },
    ],
  },
  {
    name: "Southern Africa",
    value: 1948051587,
    children: [
      {
        name: "Botswana",
        value: 61692953,
      },
      {
        name: "Eswatini",
        value: 149059610,
      },
      {
        name: "Lesotho",
        value: 203908473,
      },
      {
        name: "Namibia",
        value: 107262307,
      },
      {
        name: "South Africa",
        value: 1426128244,
      },
    ],
  },
  {
    name: "Southern Asia",
    value: 3142030515,
    children: [
      {
        name: "Afghanistan",
        value: 175246789,
      },
      {
        name: "Bangladesh",
        value: 471398369,
      },
      {
        name: "Bhutan",
        value: 10653157,
      },
      {
        name: "India",
        value: 1500000000,
      },
      {
        name: "Iran (Islamic Republic)",
        value: 35893269,
      },
      {
        name: "Nepal",
        value: 153581104,
      },
      {
        name: "Pakistan",
        value: 764007691,
      },
      {
        name: "Sri Lanka",
        value: 31250136,
      },
    ],
  },
  {
    name: "Southern Europe",
    value: 18869861.89,
    children: [
      {
        name: "Albania",
        value: 1638134,
      },
      {
        name: "Kosovo",
        value: 9918718.65,
      },
      {
        name: "Montenegro",
        value: 2174108.81,
      },
      {
        name: "Serbia",
        value: 5138900.43,
      },
    ],
  },
  {
    name: "Western Africa",
    value: 7369674526.490001,
    children: [
      {
        name: "Benin",
        value: 282076309.03,
      },
      {
        name: "Burkina Faso",
        value: 608626968.33,
      },
      {
        name: "Cabo Verde",
        value: 13475607.71,
      },
      {
        name: "Côte d'Ivoire",
        value: 697147462.36,
      },
      {
        name: "Gambia",
        value: 112168816,
      },
      {
        name: "Ghana",
        value: 654724671,
      },
      {
        name: "Guinea",
        value: 385419374,
      },
      {
        name: "Guinea-Bissau",
        value: 146552324.23,
      },
      {
        name: "Liberia",
        value: 230767978,
      },
      {
        name: "Mali",
        value: 471123012.75,
      },
      {
        name: "Mauritania",
        value: 56944094,
      },
      {
        name: "Niger",
        value: 371322825.52,
      },
      {
        name: "Nigeria",
        value: 2484440731,
      },
      {
        name: "Senegal",
        value: 225537983.85,
      },
      {
        name: "Sierra Leone",
        value: 343574347,
      },
      {
        name: "Togo",
        value: 285772021.71,
      },
    ],
  },
  {
    name: "Western Asia",
    value: 265212499,
    children: [
      {
        name: "Armenia",
        value: 27720940,
      },
      {
        name: "Azerbaijan",
        value: 49679283,
      },
      {
        name: "Georgia",
        value: 49367304,
      },
      {
        name: "Multicountry Middle East MER",
        value: 138444972,
      },
    ],
  },
];
