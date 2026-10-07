import get from "lodash/get";
import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";

export const simpleFormatter = (value: number) => {
  const isNegative = value < 0;
  value = Math.abs(value);
  if (value === 0) {
    return "";
  }
  if (value >= 1e9) {
    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e9).toFixed(1)}B`.replace(
      ".0",
      "",
    );
  }
  if (value >= 1e6) {
    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e6).toFixed(1)}M`.replace(
      ".0",
      "",
    );
  }
  if (value >= 1e3) {
    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e3).toFixed(1)}K`.replace(
      ".0",
      "",
    );
  }
  return `${isNegative ? "-" : ""}$${Math.abs(value)}`;
};

export const niceNumber = (value: number, round: boolean): number => {
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction: number;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
};

export const calculateYAxisTicks = (
  data: number[],
  numTicks: number = 5,
): number[] => {
  let minVal = Math.min(...data);
  let maxVal = Math.max(...data);

  if (minVal === maxVal) {
    minVal -= 1;
    maxVal += 1;
  }

  const rangeVal = niceNumber(maxVal - minVal, false);
  const tickSpacing = niceNumber(rangeVal / (numTicks - 1), true);
  const axisMin = Math.floor(minVal / tickSpacing) * tickSpacing;
  const axisMax = Math.ceil(maxVal / tickSpacing) * tickSpacing;

  const ticks: number[] = [];
  for (let val = axisMin; val <= axisMax + 1e-9; val += tickSpacing) {
    ticks.push(Math.round(val * 1e10) / 1e10); // avoid floating point errors
  }

  return ticks;
};

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
        value: `${line.value}¢`,
        marker: line.marker,
      };
    });
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
      <div className="chart-tooltip-title">{xAxisValue}</div>
      <Divider
        style={{ width: "100%", borderColor: "#DFE3E5", margin: "5px 0" }}
      />
      <div className="chart-tooltip-text">
        <span
          className="chart-tooltip-marker"
          dangerouslySetInnerHTML={{ __html: get(items, "[0].marker", "") }}
        />
        {get(items, "[0].value", "")} per 1$ disbursed
      </div>
    </div>,
  );
};
