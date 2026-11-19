import { Box } from "@mui/material";

import EditableTitle from "../editable-title";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { CHART_TITLE_PLACEHOLDER } from "./chart-title";
import { getTitleJustifyContent, getTitleTextSx } from "./title-style";

interface TitleStaticAreaProps {
  visualOptions: Record<string, any>;
  title: string;
  /** Makes the title editable; without it the title is read-only. */
  onTitleChange?: (value: string) => void;
}

/** A chart title that can't be dragged: read-only, or editable on its own. */
export const TitleStaticArea = (props: TitleStaticAreaProps) => {
  const { chartTitleOptions } = props.visualOptions;
  const editable = !!props.onTitleChange;

  return (
    <Box
      sx={{
        textAlign: chartTitleOptions?.align,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            cursor: "grab",
            visibility: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <DragIndicator />
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: getTitleJustifyContent(chartTitleOptions?.align),
          }}
        >
          <EditableTitle
            title={props.title}
            onTitleChange={props.onTitleChange ?? (() => {})}
            sx={getTitleTextSx(chartTitleOptions)}
            disabled={!editable}
            placeholder={editable ? CHART_TITLE_PLACEHOLDER : undefined}
            ariaLabel={editable ? "Chart title" : "Edit title"}
            data-cy="rb-chart-title"
          />
        </Box>
      </Box>
    </Box>
  );
};
