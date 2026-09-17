import { CellComponent, ColumnDefinition, Tabulator } from "tabulator-tables";
import { TableDataItem } from "app/components/table/data";

export const VIEWS = ["Actual", "Budget", "Variance"];

export const simpleFormatter = (value: number) => {
  const isNegative = value < 0;
  value = Math.abs(value);
  if (value === 0) {
    return "";
  }
  return `${isNegative ? "-" : ""}${(Math.abs(value) / 1e6).toFixed(1)}`.replace(
    ".0",
    "",
  );
};

const yearCellFormatter = (cell: CellComponent) => {
  return simpleFormatter(cell.getValue());
  // use this if we decide to show all values in a cell sub-table
  const tableEl = document.createElement("div");
  tableEl.style.width = "100%";
  tableEl.style.height = "100%";
  cell.getElement().appendChild(tableEl);
  const data = cell.getValue();

  if (!cell.getValue()) {
    return "";
  }

  new Tabulator(tableEl, {
    data: [data],
    layout: "fitDataTable",
    height: "fit-content",
    columns: [
      {
        title: "Actual",
        field: "actual",
        headerSort: false,
        formatter: (v) => simpleFormatter(v.getValue()),
      },
      {
        title: "Budget",
        field: "budget",
        headerSort: false,
        formatter: (v) => simpleFormatter(v.getValue()),
      },
      {
        title: "Variance",
        field: "variance",
        headerSort: false,
        formatter: (v) => simpleFormatter(v.getValue()),
      },
    ],
  });

  cell.getElement().style.padding = "0";
  cell.getElement().style.background = "#fff !important";

  return tableEl;
};

export const tableColumns: ColumnDefinition[] = [
  {
    title: "Line item ($M)",
    field: "name",
    width: "28%",
    headerSort: false,
  },
  {
    title: "2017",
    field: "2017.actual",
    width: "8%",
    headerSort: false,
    variableHeight: true,
    formatter: yearCellFormatter,
  },
  {
    title: "2018",
    field: "2018.actual",
    width: "8%",
    headerSort: false,
    variableHeight: true,
    formatter: yearCellFormatter,
  },
  {
    title: "2019",
    field: "2019.actual",
    width: "8%",
    headerSort: false,
    variableHeight: true,
    formatter: yearCellFormatter,
  },
  {
    title: "2020",
    field: "2020.actual",
    width: "8%",
    headerSort: false,
    variableHeight: true,
    formatter: yearCellFormatter,
  },
  {
    title: "2021",
    field: "2021.actual",
    width: "8%",
    headerSort: false,
    variableHeight: true,
    formatter: yearCellFormatter,
  },
  {
    title: "2022",
    field: "2022.actual",
    width: "8%",
    headerSort: false,
    variableHeight: true,
    formatter: yearCellFormatter,
  },
  {
    title: "2023",
    field: "2023.actual",
    width: "8%",
    headerSort: false,
    variableHeight: true,
    formatter: yearCellFormatter,
  },
  {
    title: "2024",
    field: "2024.actual",
    width: "8%",
    headerSort: false,
    variableHeight: true,
    formatter: yearCellFormatter,
  },
  {
    title: "2025",
    field: "2025.actual",
    width: "8%",
    headerSort: false,
    variableHeight: true,
    formatter: yearCellFormatter,
  },
];

export const years = [
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
];

export const tableData: {
  [key: string]: TableDataItem;
}[] = [
  {
    "2017": {
      actual: 235616703.92,
      budget: 233835886.28,
      variance: -1780817.6399999857,
    },
    "2018": {
      actual: 232623195.79,
      budget: 247064243.55,
      variance: 14441047.76000002,
    },
    "2019": {
      actual: 237696832.19,
      budget: 236389136.74,
      variance: -1307695.449999988,
    },
    "2020": {
      actual: 229948809.61,
      budget: 243153252.84,
      variance: 13204443.22999999,
    },
    "2021": {
      actual: 236603822.97,
      budget: 252803333.91,
      variance: 16199510.939999998,
    },
    "2022": {
      actual: 262881126.11,
      budget: 260723053.46,
      variance: -2158072.650000006,
    },
    "2023": {
      actual: 266806758.54,
      budget: 277809185.86,
      variance: 11002427.320000023,
    },
    "2024": {
      actual: 274811173.21,
      budget: 278910291.75,
      variance: 4099118.5400000215,
    },
    "2025": {
      actual: 254550598.99,
      budget: 278983047.42,
      variance: 24432448.430000007,
    },
    name: "Costs Secretariat and OIG",
    _children: [
      {
        "2017": {
          actual: 27115955.52,
          budget: 27080328.79,
          variance: -35626.73000000045,
        },
        "2018": {
          actual: 24695207.3,
          budget: 35251858.32,
          variance: 10556651.02,
        },
        "2019": {
          actual: 22880429.94,
          budget: 23222240.79,
          variance: 341810.84999999776,
        },
        "2020": {
          actual: 22770281.87,
          budget: 21528001.49,
          variance: -1242280.3800000027,
        },
        "2021": {
          actual: 23436840.4,
          budget: 21457436.97,
          variance: -1979403.4299999997,
        },
        "2022": {
          actual: 24962689.8,
          budget: 23239649.61,
          variance: -1723040.1900000013,
        },
        "2023": {
          actual: 20798909.56,
          budget: 21243871.49,
          variance: 444961.9299999997,
        },
        "2024": {
          actual: 19795223.33,
          budget: 21081215.64,
          variance: 1285992.3100000024,
        },
        "2025": {
          actual: 18522779.9,
          budget: 21049409.44,
          variance: 2526629.540000003,
        },
        name: "Office Infrastructure",
      },
      {
        "2017": {
          actual: 155034200.72,
          budget: 150463508.08,
          variance: -4570692.639999986,
        },
        "2018": {
          actual: 152651630.28,
          budget: 152958881.04,
          variance: 307250.75999999046,
        },
        "2019": {
          actual: 157033471.49,
          budget: 154572257.66,
          variance: -2461213.830000013,
        },
        "2020": {
          actual: 160436620.66,
          budget: 158812173.61,
          variance: -1624447.0499999821,
        },
        "2021": {
          actual: 171516396.06,
          budget: 172944803.37,
          variance: 1428407.3100000024,
        },
        "2022": {
          actual: 176615932.53,
          budget: 179494071.55,
          variance: 2878139.0200000107,
        },
        "2023": {
          actual: 188147350.77,
          budget: 192828312.98,
          variance: 4680962.209999979,
        },
        "2024": {
          actual: 197012437.37,
          budget: 195094120.24,
          variance: -1918317.1299999952,
        },
        "2025": {
          actual: 194893501.49,
          budget: 203940274.79,
          variance: 9046773.299999982,
        },
        name: "Workforce",
        _children: [
          {
            "2017": {
              actual: 7753991.8,
              budget: 0,
              variance: -7753991.8,
            },
            "2018": {
              actual: 7489997.3,
              budget: 866400,
              variance: -6623597.3,
            },
            "2019": {
              actual: 9720805.94,
              budget: 98016.55,
              variance: -9622789.389999999,
            },
            "2020": {
              actual: 9920580.54,
              budget: 0,
              variance: -9920580.54,
            },
            "2021": {
              actual: 12818382.74,
              budget: 9868687.5,
              variance: -2949695.24,
            },
            "2022": {
              actual: 11469537.28,
              budget: 7978642.68,
              variance: -3490894.5999999996,
            },
            "2023": {
              actual: 10879599.78,
              budget: 4831383.39,
              variance: -6048216.39,
            },
            "2024": {
              actual: 9058873.3,
              budget: 5414235.56,
              variance: -3644637.740000001,
            },
            "2025": {
              actual: 6788122.93,
              budget: 4864718.79,
              variance: -1923404.1399999997,
            },
            name: "Individual / Temp Consultants",
          },
          {
            "2017": {
              actual: 147280208.92,
              budget: 150463508.08,
              variance: 3183299.160000026,
            },
            "2018": {
              actual: 145161632.98,
              budget: 152092481.04,
              variance: 6930848.060000002,
            },
            "2019": {
              actual: 147312665.55,
              budget: 154474241.11,
              variance: 7161575.560000002,
            },
            "2020": {
              actual: 150516040.12,
              budget: 158812173.61,
              variance: 8296133.49000001,
            },
            "2021": {
              actual: 158698013.32,
              budget: 163076115.87,
              variance: 4378102.550000012,
            },
            "2022": {
              actual: 165146395.25,
              budget: 171515428.87,
              variance: 6369033.620000005,
            },
            "2023": {
              actual: 177267750.99,
              budget: 187996929.59,
              variance: 10729178.599999994,
            },
            "2024": {
              actual: 187953564.06,
              budget: 189679884.68,
              variance: 1726320.6200000048,
            },
            "2025": {
              actual: 188105378.56,
              budget: 199075556,
              variance: 10970177.439999998,
            },
            name: "Staff",
          },
        ],
      },
      {
        "2017": {
          actual: 1120680,
          budget: 1100000,
          variance: -20680,
        },
        "2018": {
          actual: 1181050,
          budget: 1100000,
          variance: -81050,
        },
        "2019": {
          actual: 1074497.5,
          budget: 1100000,
          variance: 25502.5,
        },
        "2020": {
          actual: 1247012,
          budget: 1600000,
          variance: 352988,
        },
        "2021": {
          actual: 386767.17,
          budget: 1600000,
          variance: 1213232.83,
        },
        "2022": {
          actual: 1056939.69,
          budget: 1600000,
          variance: 543060.31,
        },
        "2023": {
          actual: 1119681.91,
          budget: 1500000,
          variance: 380318.0900000001,
        },
        "2024": {
          actual: 1230740.17,
          budget: 1440000,
          variance: 209259.83000000007,
        },
        "2025": {
          actual: 1085202.6,
          budget: 1440000,
          variance: 354797.3999999999,
        },
        name: "Board Constituency",
      },
      {
        "2017": {
          actual: 2523853.09,
          budget: 3256388.96,
          variance: 732535.8700000001,
        },
        "2018": {
          actual: 2591838.22,
          budget: 3047850.29,
          variance: 456012.06999999983,
        },
        "2019": {
          actual: 3584051.68,
          budget: 3122143.53,
          variance: -461908.1500000004,
        },
        "2020": {
          actual: 661813.08,
          budget: 3677174,
          variance: 3015360.92,
        },
        "2021": {
          actual: 762580.9,
          budget: 2649530.54,
          variance: 1886949.6400000001,
        },
        "2022": {
          actual: 4960704.24,
          budget: 3241044.74,
          variance: -1719659.5,
        },
        "2023": {
          actual: 2252995.3,
          budget: 2020194.87,
          variance: -232800.4299999997,
        },
        "2024": {
          actual: 2284927.72,
          budget: 2446410.56,
          variance: 161482.83999999985,
        },
        "2025": {
          actual: 1816052.07,
          budget: 3676709.37,
          variance: 1860657.3,
        },
        name: "Meetings",
      },
      {
        "2017": {
          actual: 16154461.01,
          budget: 16627589.98,
          variance: 473128.97000000067,
        },
        "2018": {
          actual: 15432963.23,
          budget: 16661717.37,
          variance: 1228754.1399999987,
        },
        "2019": {
          actual: 16429974.12,
          budget: 16823770.46,
          variance: 393796.3400000017,
        },
        "2020": {
          actual: 3113640.83,
          budget: 16865745.34,
          variance: 13752104.51,
        },
        "2021": {
          actual: 768882.36,
          budget: 13483592,
          variance: 12714709.64,
        },
        "2022": {
          actual: 10944530.86,
          budget: 11057421.67,
          variance: 112890.81000000052,
        },
        "2023": {
          actual: 14012676.76,
          budget: 15144998.93,
          variance: 1132322.17,
        },
        "2024": {
          actual: 14778376.92,
          budget: 15006729.07,
          variance: 228352.15000000037,
        },
        "2025": {
          actual: 8433727.06,
          budget: 13960279.69,
          variance: 5526552.629999999,
        },
        name: "Travel",
      },
      {
        "2017": {
          actual: 30789601.75,
          budget: 33362260.77,
          variance: 2572659.0199999996,
        },
        "2018": {
          actual: 29343318.16,
          budget: 28754195.89,
          variance: -589122.2699999996,
        },
        "2019": {
          actual: 31367964.3,
          budget: 29180606.38,
          variance: -2187357.920000002,
        },
        "2020": {
          actual: 34076243.7,
          budget: 33028078.88,
          variance: -1048164.820000004,
        },
        "2021": {
          actual: 32713558.47,
          budget: 33519558.02,
          variance: 805999.5500000007,
        },
        "2022": {
          actual: 37789127.8,
          budget: 35009253.04,
          variance: -2779874.759999998,
        },
        "2023": {
          actual: 36104366.37,
          budget: 38915311.89,
          variance: 2810945.5200000033,
        },
        "2024": {
          actual: 35962030.29,
          budget: 39302051.62,
          variance: 3340021.329999998,
        },
        "2025": {
          actual: 27431348.27,
          budget: 30356011.09,
          variance: 2924662.8200000003,
        },
        name: "Professional fees",
      },
      {
        "2017": {
          actual: 4390237.44,
          budget: 6653153.74,
          variance: 2262916.3,
        },
        "2018": {
          actual: 6591095.78,
          budget: 9998087.31,
          variance: 3406991.5300000003,
        },
        "2019": {
          actual: 5967926.26,
          budget: 7418181.91,
          variance: 1450255.6500000004,
        },
        "2020": {
          actual: 5384874.79,
          budget: 6336427.69,
          variance: 951552.9000000004,
        },
        "2021": {
          actual: 5394846.84,
          budget: 5619761.7,
          variance: 224914.86000000034,
        },
        "2022": {
          actual: 4915224.8,
          budget: 5619761.56,
          variance: 704536.7599999998,
        },
        "2023": {
          actual: 2710760.73,
          budget: 4028201.56,
          variance: 1317440.83,
        },
        "2024": {
          actual: 2085040.03,
          budget: 2544457.3,
          variance: 459417.2699999998,
        },
        "2025": {
          actual: 1888511.51,
          budget: 2616957.53,
          variance: 728446.0199999998,
        },
        name: "Depreciation",
      },
      {
        "2017": {
          actual: 1449176.6,
          budget: 1718595.96,
          variance: 269419.35999999987,
        },
        "2018": {
          actual: 1773823.77,
          budget: 1368442,
          variance: -405381.77,
        },
        "2019": {
          actual: 1597353.59,
          budget: 1351598.55,
          variance: -245755.04000000004,
        },
        "2020": {
          actual: 2408322.67,
          budget: 1305651.83,
          variance: -1102670.8399999999,
        },
        "2021": {
          actual: 1666277.59,
          budget: 1528651.3,
          variance: -137626.29000000004,
        },
        "2022": {
          actual: 1783745.54,
          budget: 1461851.3,
          variance: -321894.24,
        },
        "2023": {
          actual: 1660017.14,
          budget: 2128294.14,
          variance: 468277.00000000023,
        },
        "2024": {
          actual: 1662397.4,
          budget: 1995307.32,
          variance: 332909.92000000016,
        },
        "2025": {
          actual: 998632.98,
          budget: 1943405.52,
          variance: 944772.54,
        },
        name: "Communications",
      },
      {
        "2017": {
          actual: -2961462.21,
          budget: -6425940,
          variance: -3464477.79,
        },
        "2018": {
          actual: -1637730.95,
          budget: -2076788.68,
          variance: -439057.73,
        },
        "2019": {
          actual: -2238836.7,
          budget: -401662.55,
          variance: 1837174.1500000001,
        },
        "2020": {
          actual: -150000,
          budget: 0,
          variance: 150000,
        },
        "2021": {
          actual: -42326.82,
          budget: 0,
          variance: 42326.82,
        },
        "2022": {
          actual: -147769.16,
          budget: 0,
          variance: 147769.16,
        },
        "2023": {
          actual: 0,
          budget: 0,
          variance: 0,
        },
        "2024": {
          actual: 0,
          budget: 0,
          variance: 0,
        },
        "2025": {
          actual: -519156.89,
          budget: 0,
          variance: 519156.89,
        },
        name: "External Co-Funding",
      },
    ],
  },
  {
    "2017": {
      actual: 295394996.86,
      budget: 294735886.28,
      variance: -659110.5800000429,
    },
    "2018": {
      actual: 286981624.88,
      budget: 304864243.55,
      variance: 17882618.670000017,
    },
    "2019": {
      actual: 293709328,
      budget: 294189136.74,
      variance: 479808.74000000954,
    },
    "2020": {
      actual: 286569497.35,
      budget: 300953252.84,
      variance: 14383755.48999995,
    },
    "2021": {
      actual: 290219029.47,
      budget: 310603333.91,
      variance: 20384304.439999998,
    },
    "2022": {
      actual: 315272350.29,
      budget: 319223053.46,
      variance: 3950703.169999957,
    },
    "2023": {
      actual: 324782829.06,
      budget: 334341258.16,
      variance: 9558429.100000024,
    },
    "2024": {
      actual: 327538287.31,
      budget: 333184263.86,
      variance: 5645976.550000012,
    },
    "2025": {
      actual: 304421805.67,
      budget: 333062019.42,
      variance: 28640213.75,
    },
    name: "Opex before non-recurring costs",
  },
  {
    "2017": {
      actual: 155034200.72,
      budget: 150463508.08,
      variance: -4570692.639999986,
    },
    "2018": {
      actual: 152651630.28,
      budget: 152958881.04,
      variance: 307250.75999999046,
    },
    "2019": {
      actual: 157033471.49,
      budget: 154572257.66,
      variance: -2461213.830000013,
    },
    "2020": {
      actual: 160436620.66,
      budget: 158812173.61,
      variance: -1624447.0499999821,
    },
    "2021": {
      actual: 171516396.06,
      budget: 172944803.37,
      variance: 1428407.3100000024,
    },
    "2022": {
      actual: 176615932.53,
      budget: 179494071.55,
      variance: 2878139.0200000107,
    },
    "2023": {
      actual: 188147350.77,
      budget: 192828312.98,
      variance: 4680962.209999979,
    },
    "2024": {
      actual: 197012437.37,
      budget: 195094120.24,
      variance: -1918317.1299999952,
    },
    "2025": {
      actual: 194893501.49,
      budget: 203940274.79,
      variance: 9046773.299999982,
    },
    name: "Workforce",
    _children: [
      {
        "2017": {
          actual: 147280208.92,
          budget: 150463508.08,
          variance: 3183299.160000026,
        },
        "2018": {
          actual: 145161632.98,
          budget: 152092481.04,
          variance: 6930848.060000002,
        },
        "2019": {
          actual: 147312665.55,
          budget: 154474241.11,
          variance: 7161575.560000002,
        },
        "2020": {
          actual: 150516040.12,
          budget: 158812173.61,
          variance: 8296133.49000001,
        },
        "2021": {
          actual: 158698013.32,
          budget: 163076115.87,
          variance: 4378102.550000012,
        },
        "2022": {
          actual: 165146395.25,
          budget: 171515428.87,
          variance: 6369033.620000005,
        },
        "2023": {
          actual: 177267750.99,
          budget: 187996929.59,
          variance: 10729178.599999994,
        },
        "2024": {
          actual: 187953564.06,
          budget: 189679884.68,
          variance: 1726320.6200000048,
        },
        "2025": {
          actual: 188105378.56,
          budget: 199075556,
          variance: 10970177.439999998,
        },
        name: "Staff",
      },
      {
        "2017": {
          actual: 7753991.8,
          budget: 0,
          variance: -7753991.8,
        },
        "2018": {
          actual: 7489997.3,
          budget: 866400,
          variance: -6623597.3,
        },
        "2019": {
          actual: 9720805.94,
          budget: 98016.55,
          variance: -9622789.389999999,
        },
        "2020": {
          actual: 9920580.54,
          budget: 0,
          variance: -9920580.54,
        },
        "2021": {
          actual: 12818382.74,
          budget: 9868687.5,
          variance: -2949695.24,
        },
        "2022": {
          actual: 11469537.28,
          budget: 7978642.68,
          variance: -3490894.5999999996,
        },
        "2023": {
          actual: 10879599.78,
          budget: 4831383.39,
          variance: -6048216.39,
        },
        "2024": {
          actual: 9058873.3,
          budget: 5414235.56,
          variance: -3644637.740000001,
        },
        "2025": {
          actual: 6788122.93,
          budget: 4864718.79,
          variance: -1923404.1399999997,
        },
        name: "Individual / Temp Consultants",
      },
    ],
  },
  {
    "2017": {
      actual: 2175086.33,
      budget: 5260816.95,
      variance: 3085730.62,
    },
    "2018": {
      actual: 11454032.51,
      budget: 6839358.7,
      variance: -4614673.81,
    },
    "2019": {
      actual: 2218388.33,
      budget: 8115812.54,
      variance: 5897424.21,
    },
    "2020": {
      actual: 12230183.24,
      budget: 4046735.74,
      variance: -8183447.5,
    },
    "2021": {
      actual: 13561791.79,
      budget: 4396666,
      variance: -9165125.79,
    },
    "2022": {
      actual: 10717920.51,
      budget: 2927006.46,
      variance: -7790914.05,
    },
    "2023": {
      actual: 12111446.65,
      budget: 5710135.95,
      variance: -6401310.7,
    },
    "2024": {
      actual: 13071678.12,
      budget: 9063676.26,
      variance: -4008001.8599999994,
    },
    "2025": {
      actual: 41612224.77,
      budget: 12937387.08,
      variance: -28674837.690000005,
    },
    name: "Total Non-recurring costs",
  },
  {
    "2017": {
      actual: 48987819.56,
      budget: 52000000,
      variance: 3012180.4399999976,
    },
    "2018": {
      actual: 44961781.26,
      budget: 48300000,
      variance: 3338218.740000002,
    },
    "2019": {
      actual: 46974822.89,
      budget: 48300000,
      variance: 1325177.1099999994,
    },
    "2020": {
      actual: 48395742.38,
      budget: 48300000,
      variance: -95742.38000000268,
    },
    "2021": {
      actual: 46046828.28,
      budget: 48300000,
      variance: 2253171.719999999,
    },
    "2022": {
      actual: 44826515.62,
      budget: 48700000,
      variance: 3873484.3800000027,
    },
    "2023": {
      actual: 47224950.24,
      budget: 45932072.3,
      variance: -1292877.940000005,
    },
    "2024": {
      actual: 41940628.87,
      budget: 43212472.11,
      variance: 1271843.240000002,
    },
    "2025": {
      actual: 39384265.04,
      budget: 43212472,
      variance: 3828206.960000001,
    },
    name: "LFA Fees",
  },
  {
    "2017": {
      actual: 0,
      budget: 0,
      variance: 0,
    },
    "2018": {
      actual: 0,
      budget: 0,
      variance: 0,
    },
    "2019": {
      actual: 0,
      budget: 0,
      variance: 0,
    },
    "2020": {
      actual: 0,
      budget: 0,
      variance: 0,
    },
    "2021": {
      actual: 0,
      budget: 0,
      variance: 0,
    },
    "2022": {
      actual: 706000,
      budget: 0,
      variance: -706000,
    },
    "2023": {
      actual: 0,
      budget: 0,
      variance: 0,
    },
    "2024": {
      actual: 0,
      budget: 0,
      variance: 0,
    },
    "2025": {
      actual: 0,
      budget: 0,
      variance: 0,
    },
    name: "Extraordinary Costs",
  },
  {
    "2017": {
      actual: 10790473.38,
      budget: 8900000,
      variance: -1890473.3800000008,
    },
    "2018": {
      actual: 9396647.83,
      budget: 9500000,
      variance: 103352.16999999993,
    },
    "2019": {
      actual: 9037672.91,
      budget: 9500000,
      variance: 462327.08999999985,
    },
    "2020": {
      actual: 8224945.35,
      budget: 9500000,
      variance: 1275054.6500000004,
    },
    "2021": {
      actual: 7568378.21,
      budget: 9500000,
      variance: 1931621.79,
    },
    "2022": {
      actual: 7564708.56,
      budget: 9800000,
      variance: 2235291.4400000004,
    },
    "2023": {
      actual: 10751120.28,
      budget: 10600000,
      variance: -151120.27999999933,
    },
    "2024": {
      actual: 10786485.22,
      budget: 11061500,
      variance: 275014.77999999933,
    },
    "2025": {
      actual: 10486941.64,
      budget: 10866500,
      variance: 379558.3599999994,
    },
    name: "CCM Funding",
  },
  {
    "2017": {
      actual: 297570083.19,
      budget: 299996703.23,
      variance: 2426620.0400000215,
    },
    "2018": {
      actual: 298435657.4,
      budget: 311703602.24,
      variance: 13267944.840000033,
    },
    "2019": {
      actual: 295927716.33,
      budget: 302304949.28,
      variance: 6377232.949999988,
    },
    "2020": {
      actual: 298799680.58,
      budget: 304999988.58,
      variance: 6200308,
    },
    "2021": {
      actual: 303780821.26,
      budget: 314999999.91,
      variance: 11219178.650000036,
    },
    "2022": {
      actual: 325990270.81,
      budget: 322150059.92,
      variance: -3840210.8899999857,
    },
    "2023": {
      actual: 336894275.71,
      budget: 340051394.11,
      variance: 3157118.4000000358,
    },
    "2024": {
      actual: 340609965.43,
      budget: 342247940.11,
      variance: 1637974.6800000072,
    },
    "2025": {
      actual: 346034030.45,
      budget: 345999406.5,
      variance: -34623.94999998808,
    },
    name: "Total operating costs",
  },
];
