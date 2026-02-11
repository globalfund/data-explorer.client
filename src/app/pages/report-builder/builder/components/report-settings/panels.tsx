import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  TopPadding,
  LeftPadding,
  RightPadding,
  BottomPadding,
} from "app/pages/report-builder/builder/components/report-settings/icons";

const panelSx = {
  gap: "8px",
  padding: "8px",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  "> div": {
    "> label": {
      display: "flex",
      fontSize: "14px",
      color: "#525252",
      marginBottom: "8px",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    "> input[type='color']": {
      margin: 0,
      width: "100%",
      height: "40px",
      padding: "6px 0",
      cursor: "pointer",
      borderRadius: "4px",
      border: "1px solid #868e96",
    },
    "> input[type='number'], > input[type='text'], > textarea": {
      width: "100%",
      height: "40px",
      padding: "16px",
      fontSize: "14px",
      appearance: "none",
      resize: "vertical",
      borderRadius: "4px",
      MozAppearance: "none",
      WebkitAppearance: "none",
      border: `1px solid #98A1AA`,
      "::-webkit-inner-spin-button": {
        margin: 0,
        appearance: "none",
        WebkitAppearance: "none",
      },
      "::-webkit-outer-spin-button": {
        margin: 0,
        appearance: "none",
        WebkitAppearance: "none",
      },
    },
    "> textarea": {
      minHeight: "100px",
    },
  },
};

export const RenamePanel: React.FC<{ closePanel: () => void }> = (props) => {
  const handleApply = () => {};

  return (
    <React.Fragment>
      <Box sx={panelSx}>
        <Box width="100%">
          <InputLabel id="report-name-label" htmlFor="report-name-input">
            <span>Report Name</span>
            <span>0/100</span>
          </InputLabel>
          <input
            type="text"
            maxLength={100}
            autoFocus={true}
            id="report-name-input"
          />
        </Box>
        <Box width="100%">
          <InputLabel
            id="report-description-label"
            htmlFor="report-description-input"
          >
            <span>Report Description</span>
            <span>0/250</span>
          </InputLabel>
          <textarea id="report-description-input" maxLength={250} />
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          padding: "4px 8px 8px 8px",
          justifyContent: "space-between",
          button: {
            textTransform: "none",
          },
        }}
      >
        <Button variant="outlined" onClick={props.closePanel}>
          Back
        </Button>
        <Button
          sx={{
            fontWeight: "400",
            background: "#3154F4",
            color: colors.primary.white,
          }}
          onClick={handleApply}
        >
          Apply
        </Button>
      </Box>
    </React.Fragment>
  );
};

export const SizePaddingPanel: React.FC<{ closePanel: () => void }> = (
  props,
) => {
  const reportSettings = useStoreState((state) => state.RBReportSettingsState);
  const reportSettingsActions = useStoreActions(
    (actions) => actions.RBReportSettingsState,
  );

  const [widthError, setWidthError] = React.useState("");
  const [heightError, setHeightError] = React.useState("");
  const [width, setWidth] = React.useState(reportSettings.width);
  const [height, setHeight] = React.useState(reportSettings.height);
  const [padding, setPadding] = React.useState(reportSettings.padding);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setWidth("");
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      setWidth(nValue.toString());
    }
  };

  const handleWidthBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setWidth("300");
      setWidthError("Minimum report width is 300px");
      setTimeout(() => {
        setWidthError("");
      }, 3000);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setHeight("");
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      setHeight(nValue.toString());
    }
  };

  const handleHeightBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setHeight("300");
      setHeightError("Minimum report height is 300px");
      setTimeout(() => {
        setHeightError("");
      }, 3000);
    }
  };

  const setPaddingNewValueChange = (i: number, value: string) => {
    const newValue = [...reportSettings.padding];
    if (value === "") {
      newValue[i] = "0";
      setPadding(newValue);
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      newValue[i] = nValue.toString();
      setPadding(newValue);
    }
  };

  const setPaddingBlur = (i: number, value: string) => {
    if (value === "") {
      const newValue = [...reportSettings.padding];
      newValue[i] = "0";
      setPadding(newValue);
    }
  };

  const handleLeftPaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaddingNewValueChange(3, e.target.value);
  };

  const handleLeftPaddingBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setPaddingBlur(3, e.target.value);
  };

  const handleTopPaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaddingNewValueChange(0, e.target.value);
  };

  const handleTopPaddingBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setPaddingBlur(0, e.target.value);
  };

  const handleRightPaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaddingNewValueChange(1, e.target.value);
  };

  const handleRightPaddingBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setPaddingBlur(1, e.target.value);
  };

  const handleBottomPaddingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPaddingNewValueChange(2, e.target.value);
  };

  const handleBottomPaddingBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setPaddingBlur(2, e.target.value);
  };

  const handleApply = () => {
    reportSettingsActions.setWidth(width);
    reportSettingsActions.setHeight(height);
    reportSettingsActions.setPadding(padding);
    props.closePanel();
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          ...panelSx,
          "> div > label": {
            justifyContent: "flex-start",
            "> svg": { marginRight: "8px" },
          },
        }}
      >
        <Box width="100%">
          <Typography fontSize="14px" fontWeight="700">
            Size
          </Typography>
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="width-label" htmlFor="width-input">
            Width
          </InputLabel>
          <input
            type="text"
            id="width-input"
            value={width}
            onBlur={handleWidthBlur}
            onChange={handleWidthChange}
          />
          {widthError && <FormHelperText error>{widthError}</FormHelperText>}
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="height-label" htmlFor="height-input">
            Height
          </InputLabel>
          <input
            type="text"
            id="height-input"
            value={height}
            onBlur={handleHeightBlur}
            onChange={handleHeightChange}
          />
          {heightError && <FormHelperText error>{heightError}</FormHelperText>}
        </Box>
        <Box width="100%">
          <Typography fontSize="14px" fontWeight="700">
            Padding
          </Typography>
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="l-padding-label" htmlFor="l-padding-input">
            <LeftPadding /> Left
          </InputLabel>
          <input
            type="text"
            id="l-padding-input"
            value={padding[3]}
            onBlur={handleLeftPaddingBlur}
            onChange={handleLeftPaddingChange}
          />
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="t-padding-label" htmlFor="t-padding-input">
            <TopPadding /> Top
          </InputLabel>
          <input
            type="text"
            id="t-padding-input"
            value={padding[0]}
            onBlur={handleTopPaddingBlur}
            onChange={handleTopPaddingChange}
          />
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="r-padding-label" htmlFor="r-padding-input">
            <RightPadding /> Right
          </InputLabel>
          <input
            type="text"
            id="r-padding-input"
            value={padding[1]}
            onBlur={handleRightPaddingBlur}
            onChange={handleRightPaddingChange}
          />
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="b-padding-label" htmlFor="b-padding-input">
            <BottomPadding /> Bottom
          </InputLabel>
          <input
            type="text"
            id="b-padding-input"
            value={padding[2]}
            onBlur={handleBottomPaddingBlur}
            onChange={handleBottomPaddingChange}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          padding: "4px 8px 8px 8px",
          justifyContent: "space-between",
          button: {
            textTransform: "none",
          },
        }}
      >
        <Button variant="outlined" onClick={props.closePanel}>
          Back
        </Button>
        <Button
          sx={{
            fontWeight: "400",
            background: "#3154F4",
            color: colors.primary.white,
          }}
          onClick={handleApply}
        >
          Apply
        </Button>
      </Box>
    </React.Fragment>
  );
};

export const BorderFillPanel: React.FC<{ closePanel: () => void }> = (
  props,
) => {
  const reportSettings = useStoreState((state) => state.RBReportSettingsState);
  const reportSettingsActions = useStoreActions(
    (actions) => actions.RBReportSettingsState,
  );

  const [stroke, setStroke] = React.useState(reportSettings.stroke);
  const [strokeColor, setStrokeColor] = React.useState(
    reportSettings.strokeColor,
  );
  const [borderRadius, setBorderRadius] = React.useState(
    reportSettings.borderRadius,
  );
  const [backgroundColor, setBackgroundColor] = React.useState(
    reportSettings.backgroundColor,
  );

  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setStroke("");
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      setStroke(nValue.toString());
    }
  };

  const handleStrokeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setStroke("0");
    }
  };

  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setBorderRadius("");
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      setBorderRadius(nValue.toString());
    }
  };

  const handleBorderRadiusBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setBorderRadius("0");
    }
  };

  const handleStrokeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(e.target.value);
  };

  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBackgroundColor(e.target.value);
  };

  const handleApply = () => {
    reportSettingsActions.setStroke(stroke);
    reportSettingsActions.setStrokeColor(strokeColor);
    reportSettingsActions.setBorderRadius(borderRadius);
    reportSettingsActions.setBackgroundColor(backgroundColor);
    props.closePanel();
  };

  return (
    <React.Fragment>
      <Box sx={panelSx}>
        <Box width="calc(50% - 4px)">
          <InputLabel id="stroke-label" htmlFor="stroke-input">
            Stroke
          </InputLabel>
          <input
            type="text"
            id="stroke-input"
            value={stroke}
            onBlur={handleStrokeBlur}
            onChange={handleStrokeChange}
          />
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="stroke-color-label" htmlFor="stroke-color-input">
            Stroke Color
          </InputLabel>
          <input
            type="color"
            id="stroke-color-input"
            value={strokeColor}
            onChange={handleStrokeColorChange}
          />
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="border-radius-label" htmlFor="border-radius-input">
            Corner Radius
          </InputLabel>
          <input
            type="text"
            id="border-radius-input"
            value={borderRadius}
            onBlur={handleBorderRadiusBlur}
            onChange={handleBorderRadiusChange}
          />
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel
            id="background-color-label"
            htmlFor="background-color-input"
          >
            Background
          </InputLabel>
          <input
            type="color"
            id="background-color-input"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          padding: "4px 8px 8px 8px",
          justifyContent: "space-between",
          button: {
            textTransform: "none",
          },
        }}
      >
        <Button variant="outlined" onClick={props.closePanel}>
          Back
        </Button>
        <Button
          sx={{
            fontWeight: "400",
            background: "#3154F4",
            color: colors.primary.white,
          }}
          onClick={handleApply}
        >
          Apply
        </Button>
      </Box>
    </React.Fragment>
  );
};
