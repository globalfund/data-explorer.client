import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
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

export const tooltipFormatter = (lines: any[]) => {
  const xAxisValue = lines[0].axisValue;
  const items: {
    name: string;
    value: string;
    marker: string;
  }[] = lines
    .filter((line: any) => line.value !== undefined)
    .map((line: any) => {
      return {
        name: line.seriesName,
        value: formatFinancialValue(line.value).replace("US$", "$"),
        marker: line.marker,
      };
    });
  return ReactDOMServer.renderToString(
    <div
      className="chart-tooltip"
      style={{
        gap: "10px",
        width: "300px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="chart-tooltip-title">{xAxisValue}</div>
      <Divider
        style={{ width: "100%", borderColor: "#DFE3E5", margin: "5px 0" }}
      />
      <div
        style={{
          gap: "7px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {items.slice(0, 2).map((item: any) => (
          <div
            key={item.name}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              className="chart-tooltip-text"
              style={{ width: "calc(100% / 2)" }}
            >
              <span
                className="chart-tooltip-marker"
                dangerouslySetInnerHTML={{ __html: item.marker }}
              />
              {item.name}
            </div>
            <div
              className="chart-tooltip-text"
              style={{ width: "calc(100% / 2)", textAlign: "right" }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>,
  );
};

export const tooltipFormatterBar = (params: any) => {
  return ReactDOMServer.renderToString(
    <div
      className="chart-tooltip"
      style={{
        gap: "10px",
        width: "200px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="chart-tooltip-title">{params.name}</div>
      <Divider
        style={{ width: "100%", borderColor: "#DFE3E5", margin: "5px 0" }}
      />
      <div className="chart-tooltip-text">
        <span
          className="chart-tooltip-marker"
          dangerouslySetInnerHTML={{ __html: params.marker }}
        />
        {formatFinancialValue(params.value).replace("US$", "$")} vs budget
      </div>
    </div>,
  );
};
