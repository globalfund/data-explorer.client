import { Box, Typography, Checkbox } from "@mui/material";
import TextField from "../../common/textField";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import AdvancedOptions, { AdvancedOptionsProps } from "./advancedOptions";

export default function KPITextFormatting() {
  const label = { slotProps: { input: { "aria-label": "Checkbox demo" } } };
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find(
    (i) => i.id === selectedItemController?.id,
  ) as RBReportItem;
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const textFormattingOptions = Object.keys(
    selectedItem.extra?.kpi_box?.field ?? {},
  );

  const handleCheck =
    (option: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      editItem({
        ...selectedItem,
        open: selectedItem?.open || false,
        id: selectedItemController?.id || "",
        type: "kpi_box",
        extra: {
          ...selectedItem.extra,
          kpi_box: {
            ...selectedItem.extra?.kpi_box,
            field: {
              ...selectedItem.extra?.kpi_box?.field,
              [option]: {
                ...selectedItem.extra?.kpi_box?.field?.[
                  option as keyof typeof selectedItem.extra.kpi_box.field
                ],
                enabled: e.target.checked,
              },
            },
          },
        },
      });
    };

  const labelMap = {
    bigNumberText: "Big Number Text",
    topLabel: "Top Label Text",
    bottomLabel: "Bottom Label Text",
    optionalText: "Optional Text",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "16px 8px",
        height: "500px",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {textFormattingOptions.map((option: string) => {
        const checked =
          selectedItem.extra?.kpi_box?.field?.[
            option as keyof typeof selectedItem.extra.kpi_box.field
          ]?.enabled ?? true;
        return (
          <Box
            key={option}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              borderBottom: "1px solid #CFD4DA",
              paddingBottom: "17.5px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Checkbox
                {...label}
                checked={checked}
                onChange={handleCheck(option)}
              />
              <Typography
                sx={{
                  color: checked ? "#373D43" : "#ADB5BD",
                  fontSize: "14px",
                }}
              >
                {labelMap[option as keyof typeof labelMap]}
              </Typography>
            </Box>
            <TextField
              item="kpi_box"
              type={option as keyof typeof labelMap}
              sx={{
                width: "100%",
                padding: "16px 11px",
                borderColor: checked ? "#98A1AA" : "transparent",
              }}
              disabled={checked !== true}
            />
            {checked === true && (
              <AdvancedOptions type={option as AdvancedOptionsProps["type"]} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
