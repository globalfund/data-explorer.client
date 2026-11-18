import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import { useStoreState } from "app/state/store/hooks";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import {
  CHART_TITLE_PLACEHOLDER,
  getChartTitle,
  isChartTitleAuto,
  resetChartTitle,
  setChartTitle,
} from "app/pages/report-builder/builder/components/chart/title/chart-title";
import { getSuggestedChartTitle } from "app/pages/report-builder/builder/components/chart/title/suggested-title";

const helperSx = { fontSize: "12px", lineHeight: "16px", color: "#59616A" };

/**
 * The selected chart's title, the same one that's edited on the chart. It
 * follows the chart's data until the author writes their own.
 */
export default function ChartTitleField() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem: item, editItem } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const options = item?.options;
  const suggestedTitle = getSuggestedChartTitle(item?.data);
  const title = getChartTitle(options, suggestedTitle);
  const auto = isChartTitleAuto(options);

  const [draft, setDraft] = React.useState(title);
  const [focused, setFocused] = React.useState(false);

  // The title also changes on the chart and with the data; show that unless
  // the author is typing here.
  React.useEffect(() => {
    if (!focused) setDraft(title);
  }, [title, focused]);

  const saveOptions = (newOptions: Record<string, any>) => {
    if (!item) return;
    editItem({
      ...item,
      id: selectedController?.id || "",
      type: "chart",
      options: newOptions,
    });
  };

  const commit = () => {
    if (draft.trim() === title) {
      setDraft(title);
      return;
    }
    saveOptions(setChartTitle(options, draft, suggestedTitle));
  };

  const suggestion =
    !auto && suggestedTitle && suggestedTitle !== title ? (
      <>
        {" "}
        Suggested: {suggestedTitle}.{" "}
        <Button
          data-cy="rb-chart-title-use-suggested"
          onClick={() => saveOptions(resetChartTitle(options))}
          sx={{
            p: 0,
            minWidth: 0,
            color: "#3154F4",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
            textTransform: "none",
            verticalAlign: "baseline",
            textDecoration: "underline",
            "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
          }}
        >
          Use it
        </Button>
      </>
    ) : null;

  let helper: React.ReactNode = suggestion;
  if (auto) {
    helper = suggestedTitle
      ? "Suggested from the chart's data. It updates as the mapping and filters change."
      : "Map the chart's data to get a suggested title, or write your own.";
  } else if (!title) {
    helper = (
      <>
        A chart title is required before sharing the report.
        {suggestion}
      </>
    );
  }

  return (
    <Box
      sx={{ p: "8px", display: "flex", flexDirection: "column", gap: "6px" }}
    >
      <Typography
        component="label"
        htmlFor="rb-chart-title-input"
        sx={{ color: "#373D43", fontSize: "14px" }}
      >
        Chart title
      </Typography>
      <InputBase
        id="rb-chart-title-input"
        value={draft}
        placeholder={CHART_TITLE_PLACEHOLDER}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "Escape") {
            setDraft(title);
            // Blurring would save the draft before it's reset.
            setFocused(false);
            e.preventDefault();
          }
        }}
        inputProps={{ "data-cy": "rb-chart-title-input" }}
        sx={{
          width: "100%",
          height: "35px",
          px: "8px",
          fontSize: "14px",
          bgcolor: "#fff",
          borderRadius: "4px",
          border: "0.5px solid #98A1AA",
          "&.Mui-focused": { borderColor: "#3154F4" },
          "& input::placeholder": {
            color: "#70777E",
            opacity: 1,
            fontStyle: "italic",
          },
        }}
      />
      {helper ? (
        <Typography sx={helperSx} data-cy="rb-chart-title-helper">
          {helper}
        </Typography>
      ) : null}
    </Box>
  );
}
