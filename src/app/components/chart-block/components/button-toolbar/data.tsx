import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useCMSData } from "app/hooks/useCMSData";
import { exportChart } from "app/utils/exportChart";
import { getCMSDataField } from "app/utils/getCMSDataField";

export type InfoPanelType =
  | "global"
  | "expenditures"
  | "budgets"
  | "pledges_contributions"
  | "financials";

export interface ChartBlockButtonToolbarProps {
  hashId: string;
  blockId: string;
  infoType: InfoPanelType;
  chartType?: string;
  exportName: string;
  chartData: {
    headers: string[];
    data: (string | number)[][];
  };
}

export interface InfoPanelProps {
  close: () => void;
  type: InfoPanelType;
}

export const NOTES_GLOBAL =
  "The geographical designations employed by the Global Fund do not represent or imply any opinion or judgment on the legal status of any country, territory, city or area on its governmental or state authorities, or on the delimitation of its frontiers or boundaries.<br/><br/>Financial amounts in currencies other than USD from 2014 onward were converted to USD using fixed Replenishment exchange rate, also referred to as the Reference Rate. Financial amounts before 2014 were converted using spot exchange rates.";

export const NOTES_EXPENDITURES =
  "Grant expenditures are published from the 2017-2019 grant cycle. For the 2017-2019 cycle, these amount have been cumulated to the end of the cycle.  From the 2020-2023 cycle on-wards, these amounts are available on an annual basis for each year in the cycle.<br /><br />The RSSH category correspond to financial amounts for stand-alone RSSH grants and is not reflective of the full RSSH investment.";

export const NOTES_BUDGETS =
  "Grant budgets are published from the 2017-2019 grant cycle and have been annualized for each grant implementation period.<br /><br />The RSSH category correspond to financial amounts for stand-alone RSSH grants and is not reflective of the full RSSH investment.";

export const NOTES_PLEDGES_CONTRIBUTIONS =
  "Where pledges have been made that are not specific to individual years, the amount shown as pledged for a period is the sum of contributions received in that period.<br/>The donor withholds a portion of its funding to use for technical assistance related to the Global Fund.<br/><br/> · Australia: 2014-2016, 2017-2019, 2020-2022, 2023-2025 <br />· Ecobank: 2014-2016, 2017-2019 <br />· France: 2011-2013, 2014-2016, 2017-2019, 2020-2022, 2023-2025 <br />· Germany: 2017-2019 <br />· Italy: 2017-2019, 2020-2022 <br />· Luxembourg: 2020-2022 <br />· Netherlands: 2014-2016, 2017-2019 <br />· Other Public: 2020-2022              <br />· United Kingdom: 2020-2022 <br />· United States: 2001-2005, 2006-2007, 2008-2010, 2011-2013, 2014-2016, 2017-2019, 2020-2022 , 2023-2025    <br />· Bill & Melinda Gates Foundation: 2023-2025        <br /> <br /> Contribution includes a EUR 5,5 Million contribution from Gen. Catalunya in 2005-2008. <br />· Spain: 2001-2005, 2006-2007, 2008-2010 <br /> <br /> In addition to its contribution, the donor funded JPY 75 Million in technical assistance related to the Global Fund for 2010-2019. <br />· Takeda Pharmaceutical: 2008-2010, 2011-2013, 2014-2016, 2017-2019 <br /> <br /> The U.S. contribution to the Global Fund is subject to legislative restrictions, including that, during 2004-2026, no U.S. government contribution may cause the total share of U.S. government funds contributed to exceed 33 percent of total cumulative contributions from all sources. <br /> · United States: 2001-2005, 2006-2007, 2008-2010, 2011-2013, 2014-2016, 2017-2019, 2020-2022, 2023-2025 <br /> <br /> A portion of this pledge, EUR 100 Million, is reserved for debt cancellations under Debt2Health. · Germany: 2017-2019, 2023-2025              <br /> <br /> The donor withholds a portion of its funding to use for in-kind contributions related to the Global Fund. <br /> · Goodbye Malaria: 2017-2019, 2020-2022, 2023-2025 <br /> <br /> In addition to its contribution, the donor funds JPY 36 Million in technical assistance related to the Global Fund for 2020-2022. <br /> · Takeda Pharmaceutical: 2020-2022";

export const NOTES_FINANCIALS =
  "The geographical designations employed by the Global Fund do not represent or imply any opinion or judgment on the legal status of any country, territory, city or area on its governmental or state authorities, or on the delimitation of its frontiers or boundaries.<br/><br/>Financial amounts in currencies other than USD from 2014 onward were converted to USD using fixed Replenishment exchange rate, also referred to as the Reference Rate. Financial amounts before 2014 were converted using spot exchange rates.<br /><br />The RSSH category correspond to financial amounts for stand-alone RSSH grants and is not reflective of the full RSSH investment.";

export const DownloadPanel: React.FC<ChartBlockButtonToolbarProps> = (
  props: ChartBlockButtonToolbarProps,
) => {
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(
    null,
  );

  const handleButtonClick = (type: "csv" | "pdf" | "png") => () => {
    exportChart(props.blockId || "", type, props.chartData, props.exportName)
      .then(() => {
        setFeedbackMessage(`Asset downloaded as ${type.toUpperCase()}.`);
      })
      .catch(() => {
        setFeedbackMessage("Oops, something went wrong.");
      });
  };

  React.useEffect(() => {
    if (feedbackMessage) {
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);
    }
  }, [feedbackMessage]);

  return (
    <React.Fragment>
      {feedbackMessage && (
        <Box
          sx={{
            lineHeight: 1.2,
          }}
        >
          {feedbackMessage}
        </Box>
      )}
      {!feedbackMessage && (
        <React.Fragment>
          <Button onClick={handleButtonClick("csv")}>CSV.</Button>
          <Button onClick={handleButtonClick("pdf")}>PDF.</Button>
          <Button onClick={handleButtonClick("png")}>PNG.</Button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export const SharePanel: React.FC<ChartBlockButtonToolbarProps> = (
  props: ChartBlockButtonToolbarProps,
) => {
  const cmsData = useCMSData({ returnData: true });

  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(
    null,
  );

  const handleButtonClick = (type: "code" | "link") => () => {
    let url = window.location.href.split("#")[0];
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }
    let chartType = props.chartType;
    if (chartType) {
      chartType = `|${chartType}`;
    }
    navigator.clipboard.writeText(
      type === "code" ? "" : `${url}#${props.hashId}${chartType ?? ""}`,
    );
    setFeedbackMessage(`${type} copied!`);
  };

  React.useEffect(() => {
    if (feedbackMessage) {
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);
    }
  }, [feedbackMessage]);

  return (
    <React.Fragment>
      {feedbackMessage && (
        <Box
          sx={{
            lineHeight: 1.2,
            textTransform: "capitalize",
          }}
        >
          {feedbackMessage}
        </Box>
      )}
      {!feedbackMessage && (
        <React.Fragment>
          {/* <Tooltip title="Not implemented yet">
            <Button
              disableRipple
              sx={{
                opacity: 0.2,
                "&:hover": {
                  cursor: "default",
                  color:
                    appColors.CHART_BLOCK_CYCLES.BUTTON_TEXT_COLOR +
                    " !important",
                  background:
                    appColors.CHART_BLOCK_CYCLES.BUTTON_BACKGROUND_COLOR +
                    " !important",
                },
              }}
            >
              Embed code
            </Button>
          </Tooltip> */}
          <Button onClick={handleButtonClick("link")}>
            {getCMSDataField(
              cmsData,
              "general.chartSectionShareLinkButtonLabel",
              "Share link",
            )}
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export const InfoPanel: React.FC<InfoPanelProps> = (props: InfoPanelProps) => {
  const content = React.useMemo(() => {
    switch (props.type) {
      case "global":
        return NOTES_GLOBAL;
      case "expenditures":
        return [NOTES_GLOBAL, NOTES_EXPENDITURES].join("<br/><br/>");
      case "budgets":
        return [NOTES_GLOBAL, NOTES_BUDGETS].join("<br/><br/>");
      case "pledges_contributions":
        return [NOTES_GLOBAL, NOTES_PLEDGES_CONTRIBUTIONS].join("<br/><br/>");
      case "financials":
        return [NOTES_GLOBAL, NOTES_EXPENDITURES].join("<br/><br/>");
      default:
        return NOTES_GLOBAL;
    }
  }, [props.type]);

  return (
    <Box
      left="5%"
      bottom={100}
      width="90%"
      zIndex={1000}
      padding="16px"
      bgcolor="#F5F5F7"
      borderRadius="5px"
      position="absolute"
      border="1px solid #252C34"
      data-cy="chart-info-dialog"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          color="#495057"
          fontSize="14px"
          fontWeight="700"
          marginBottom="8px"
        >
          Note
        </Typography>
        <IconButton
          onClick={props.close}
          sx={{
            padding: "4px",
            marginTop: "-8px",
            marginRight: "-8px",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <div
        className="scrollbar"
        style={{
          color: "#495057",
          fontSize: "14px",
          overflowY: "auto",
          maxHeight: "270px",
        }}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </Box>
  );
};
