import { Box, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import SelectField from "../../components/selectfield";
import TextField from "../../components/textfield";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import { useStoreState } from "app/state/store/hooks";
import {
  getTableOptions,
  TableOptions,
} from "app/pages/report-builder/builder/components/table/options";
import Checkfield from "../../components/checkfield";

const rowsPerPageOptions = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "25", value: "25" },
  { label: "50", value: "50" },
];

const directionRotation = {
  left: "90deg",
  top: "180deg",
  right: "270deg",
  bottom: "0deg",
};

const DirectionLabel = ({
  label,
  direction,
}: {
  label: string;
  direction: keyof typeof directionRotation;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <Direction
      style={{ transform: `rotate(${directionRotation[direction]})` }}
    />
    <Typography sx={{ color: "#373D43", fontSize: "14px" }}>{label}</Typography>
  </Box>
);

export default function LayoutTab() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem, editItem } = useGetReportItemState<"table">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const tableOptions = getTableOptions(selectedItem?.options);

  const updateOptions = (options: Partial<TableOptions>) => {
    if (!selectedItem) return;
    editItem({
      ...selectedItem,
      id: selectedController?.id || "",
      type: "table",
      open: selectedItem.open || false,
      options: {
        ...tableOptions,
        ...options,
      },
    });
  };

  const renderPaddingField = (
    key: "paddingLeft" | "paddingTop" | "paddingRight" | "paddingBottom",
    label: string,
    direction: keyof typeof directionRotation,
  ) => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <TextField
        width="100%"
        label={<DirectionLabel label={label} direction={direction} />}
        value={tableOptions[key]}
        onChange={(value) => updateOptions({ [key]: value })}
      />
    </Box>
  );

  const renderSizeField = (key: "width" | "height", label: string) => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <TextField
        width="100%"
        label={label}
        value={tableOptions[key]}
        onChange={(value) => updateOptions({ [key]: value })}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        gap: "16px",
        p: "8px",
        display: "flex",
        maxHeight: "500px",
        overflowY: "auto",
        flexDirection: "column",
        bgcolor: "#F8F9FA",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        ".MuiInputBase-root:before": {
          borderBottom: "none",
        },
      }}
    >
      <SelectField
        label="Rows per Page"
        value={tableOptions.rowsPerPage}
        options={rowsPerPageOptions}
        onChange={(value) => updateOptions({ rowsPerPage: value })}
        width="100%"
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Checkfield
          checked={tableOptions.showRowNumbers}
          onChange={(event) =>
            updateOptions({ showRowNumbers: event.target.checked })
          }
          label="Show row numbers"
        />
      </Box>

      <Box>
        <Typography fontSize="14px" fontWeight={700} color="#000" mb="8px">
          Padding
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Box sx={{ display: "flex", gap: "16px" }}>
            {renderPaddingField("paddingLeft", "Left", "left")}
            {renderPaddingField("paddingTop", "Top", "top")}
          </Box>
          <Box sx={{ display: "flex", gap: "16px" }}>
            {renderPaddingField("paddingRight", "Right", "right")}
            {renderPaddingField("paddingBottom", "Bottom", "bottom")}
          </Box>
        </Box>
      </Box>

      <Box>
        <Typography fontSize="14px" fontWeight={700} color="#000" mb="8px">
          Size
        </Typography>
        <Box sx={{ display: "flex", gap: "16px" }}>
          {renderSizeField("width", "Width")}
          {renderSizeField("height", "Height")}
        </Box>
      </Box>
    </Box>
  );
}
