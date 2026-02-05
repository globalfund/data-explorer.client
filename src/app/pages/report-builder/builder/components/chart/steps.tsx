import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Search from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import { useStoreState } from "app/state/store/hooks";
import SortIcon from "app/assets/vectors/Sort.svg?react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SettingsIcon from "app/assets/vectors/Settings_ButtonIcon.svg?react";
import FullscreenIcon from "app/assets/vectors/TableToolbarFullscreen.svg?react";
import { datasetItems } from "app/pages/report-builder/builder/components/chart/data";

export const SelectDatasetStep: React.FC = () => {
  const datasetsLatestUpdate = useStoreState(
    (state) =>
      get(state.datasetsLatestUpdate, "data.data", []) as {
        name: string;
        date: string;
      }[],
  );

  const useGetDatasetLatestUpdate = (id: string) => {
    let key = "";
    switch (id) {
      case "gf_results":
        key = "results";
        break;
      case "gf_pledges_contributions":
        key = "pledges-contributions";
        break;
      case "gf_eligibility":
        key = "eligibility";
        break;
      case "gf_allocations":
        key = "allocations";
        break;
      case "gf_grant_implementation":
        key = "grants";
        break;
      case "gf_grant_commitments":
        key = "commitments";
        break;
      case "gf_grant_disbursements":
        key = "disbursements";
        break;
    }
    if (!key) {
      return "";
    }
    return get(
      datasetsLatestUpdate.find((dataset) => dataset.name === key),
      "date",
      "",
    );
  };

  return (
    <Box
      sx={{
        gap: "10px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          gap: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          ".MuiIconButton-root": {
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #adb5bd",
          },
        }}
      >
        <Input
          disableUnderline
          placeholder="Add or search for database"
          startAdornment={<Search fontSize="small" />}
          sx={{
            flexGrow: 1,
            padding: "6px 12px",
            borderRadius: "5px",
            border: "1px solid #adb5bd",
            input: { padding: "0 0 0 8px" },
          }}
        />
        <IconButton>
          <SettingsIcon />
        </IconButton>
        <IconButton>
          <SortIcon />
        </IconButton>
      </Box>
      {datasetItems.map((item) => (
        <Box
          key={item.id}
          sx={{
            gap: "8px",
            width: "100%",
            padding: "8px",
            display: "flex",
            borderRadius: "5px",
            flexDirection: "row",
            border: "1px solid #adb5bd",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              gap: "8px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontSize="16px" fontWeight="700">
              {item.name}
            </Typography>
            <Typography fontSize="16px">{item.description}</Typography>
            <Box
              sx={{
                gap: "8px",
                display: "flex",
                alignItems: "center",
                button: {
                  fontSize: "16px",
                  padding: "2px 8px",
                  textTransform: "none",
                },
              }}
            >
              <Button variant="outlined">Source</Button>
              <Typography fontSize="16px">
                {useGetDatasetLatestUpdate(item.id)}
              </Typography>
            </Box>
          </Box>
          <IconButton
            sx={{
              width: "40px",
              height: "40px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #adb5bd",
            }}
          >
            <FullscreenIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export const CustomiseChartStep: React.FC = () => {
  const [orientation, setOrientation] = React.useState("horizontal");
  const [stacking, setStacking] = React.useState("-");
  const [xAxis, setXAxis] = React.useState("revenue");
  const [yAxis, setYAxis] = React.useState("years");

  const handleChangeOrientation = (event: SelectChangeEvent) => {
    setOrientation(event.target.value);
  };

  const handleChangeStacking = (event: SelectChangeEvent) => {
    setStacking(event.target.value);
  };

  const handleChangeXAxis = (event: SelectChangeEvent) => {
    setXAxis(event.target.value);
  };

  const handleChangeYAxis = (event: SelectChangeEvent) => {
    setYAxis(event.target.value);
  };

  return (
    <Box
      sx={{
        gap: "10px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Button
        variant="text"
        startIcon={<FullscreenIcon />}
        sx={{
          fontSize: "16px",
          fontWeight: "400",
          width: "fit-content",
          textTransform: "none",
        }}
      >
        See the Datasource
      </Button>
      <Typography fontSize="16px" color="#525252">
        Select Chart Type
      </Typography>
      <Box
        sx={{
          gap: "10px",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: "80px",
              height: "80px",
              display: "flex",
              borderRadius: "8px",
              alignItems: "center",
              bgcolor: "#f1f1f1",
              justifyContent: "center",
              border: "1px solid #adb5bd",
            }}
          >
            <Box
              sx={{
                width: "60px",
                height: "60px",
                bgcolor: "#fff",
                borderRadius: "8px",
              }}
            />
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          gap: "8px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          "> div": {
            gap: "6px",
            display: "flex",
            flexDirection: "column",
            width: "calc(50% - 5px)",
            "> label": {
              color: "#525252",
            },
          },
        }}
      >
        <Box>
          <InputLabel id="orientation-label">Orientation</InputLabel>
          <Select
            variant="filled"
            value={orientation}
            labelId="orientation-label"
            onChange={handleChangeOrientation}
            sx={{
              width: "100%",
              ".MuiSelect-select": {
                paddingTop: "11px",
                paddingBottom: "11px",
              },
            }}
          >
            <MenuItem value="vertical">Vertical</MenuItem>
            <MenuItem value="horizontal">Horizontal</MenuItem>
          </Select>
        </Box>
        <Box>
          <InputLabel id="stacking-label">Stacking</InputLabel>
          <Select
            variant="filled"
            value={stacking}
            labelId="stacking-label"
            onChange={handleChangeStacking}
            sx={{
              width: "100%",
              ".MuiSelect-select": {
                paddingTop: "11px",
                paddingBottom: "11px",
              },
            }}
          >
            <MenuItem value="-">None</MenuItem>
            <MenuItem value="stack">Stack</MenuItem>
          </Select>
        </Box>
        <Box>
          <InputLabel id="x-axis-label">X-Axis</InputLabel>
          <Select
            variant="filled"
            value={xAxis}
            labelId="x-axis-label"
            onChange={handleChangeXAxis}
            sx={{
              width: "100%",
              ".MuiSelect-select": {
                paddingTop: "11px",
                paddingBottom: "11px",
              },
            }}
          >
            <MenuItem value="revenue">Revenue</MenuItem>
            <MenuItem value="years">Years</MenuItem>
          </Select>
        </Box>
        <Box>
          <InputLabel id="y-axis-label">Y-Axis</InputLabel>
          <Select
            variant="filled"
            value={yAxis}
            labelId="y-axis-label"
            onChange={handleChangeYAxis}
            sx={{
              width: "100%",
              ".MuiSelect-select": {
                paddingTop: "11px",
                paddingBottom: "11px",
              },
            }}
          >
            <MenuItem value="revenue">Revenue</MenuItem>
            <MenuItem value="years">Years</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
};
