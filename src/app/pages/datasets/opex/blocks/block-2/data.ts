import { LineChartDataItem } from "app/pages/datasets/opex/charts/line/data";

export const VIEWS = ["Total OPEX", "Workforce", "Non-workforce"];

export const operatingCostsData: LineChartDataItem[] = [
  {
    name: "Actuals (to 30 Jun 2026)",
    data: [
      983615984.69, 970692108.34, 984367347.99, 975754608.19, 1002120069.75,
      1081465679.72, 1116631214.08, 1139971863.32, 1099899936.59,
    ],
    itemStyle: {
      color: "#1C2B4A",
      borderType: "solid",
    },
    areaStyle: {
      color: "#ECEEF1",
      opacity: 0.9,
    },
  },
  {
    name: "Budget",
    data: [
      979031983.87, 1016590970.38, 987455480.41, 1007918667.87, 1051351471.09,
      1081590238.4, 1145030151.11, 1149436615.97, 1161984748.14, 1331639284.25,
    ],
    itemStyle: {
      color: "#1A9E8F",
      borderType: "solid",
    },
  },
  {
    name: "Forecast trajectory",
    data: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      1099899936.59,
      1322929437.25,
    ],
    symbol: "diamond",
    itemStyle: {
      color: "#1C2B4A",
      borderType: "dotted",
    },
  },
];
