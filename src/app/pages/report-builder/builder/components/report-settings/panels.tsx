import React from "react";
import get from "lodash/get";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import { useGetReport, usePatchReport } from "app/hooks/queries/report-builder";
import {
  TopPadding,
  LeftPadding,
  RightPadding,
  BottomPadding,
} from "app/pages/report-builder/builder/components/report-settings/icons";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

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
  const { id } = useParams<{ id: string }>();
  const cmsData = useCMSData({ returnData: true });

  const reportData = useGetReport(id);
  const updateReport = usePatchReport(id);

  const [name, setName] = React.useState(reportData?.data?.data.name ?? "");
  const [description, setDescription] = React.useState(
    reportData?.data?.data.description ?? "",
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(e.target.value);

  const handleApply = () => {
    if (id) {
      updateReport.mutate(
        { name, description },
        {
          onSuccess: () => {
            console.log("Report updated successfully");
            props.closePanel();
          },
        },
      );
    }
  };

  React.useEffect(() => {
    setName(reportData.data?.data.name ?? "");
    setDescription(reportData.data?.data.description ?? "");
  }, [reportData.data?.data.name, reportData.data?.data.description]);

  return (
    <React.Fragment>
      <Box sx={panelSx}>
        <Box width="100%">
          <InputLabel id="report-name-label" htmlFor="report-name-input">
            <span>
              {getCMSDataField(
                cmsData,
                "pagesReportBuilderBuilder.reportNameLabel",
                "Report Name",
              )}
            </span>
            <span>{name.length}/100</span>
          </InputLabel>
          <input
            type="text"
            value={name}
            maxLength={100}
            autoFocus={true}
            id="report-name-input"
            onChange={handleNameChange}
          />
        </Box>
        <Box width="100%">
          <InputLabel
            id="report-description-label"
            htmlFor="report-description-input"
          >
            <span>
              {getCMSDataField(
                cmsData,
                "pagesReportBuilderBuilder.reportDescriptionLabel",
                "Report Description",
              )}
            </span>
            <span>{description.length}/250</span>
          </InputLabel>
          <textarea
            maxLength={250}
            value={description}
            id="report-description-input"
            onChange={handleDescriptionChange}
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
          {getCMSDataField(
            cmsData,
            "pagesReportBuilderBuilder.backButton",
            "Back",
          )}
        </Button>
        <Button
          sx={{
            fontWeight: "400",
            background: "#3154F4",
            color: colors.primary.white,
          }}
          onClick={handleApply}
        >
          {getCMSDataField(
            cmsData,
            "pagesReportBuilderBuilder.applyButton",
            "Apply",
          )}
        </Button>
      </Box>
    </React.Fragment>
  );
};

export const SizePaddingPanel: React.FC<{ closePanel: () => void }> = (
  props,
) => {
  const { id } = useParams<{ id: string }>();
  const cmsData = useCMSData({ returnData: true });

  const reportData = useGetReport(id);
  const updateReport = usePatchReport(id);

  const [widthError, setWidthError] = React.useState("");
  const [width, setWidth] = React.useState(
    reportData?.data?.data.settings.width,
  );
  const [height, setHeight] = React.useState(
    reportData?.data?.data.settings.height,
  );
  const [padding, setPadding] = React.useState(
    reportData?.data?.data.settings.padding,
  );

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
      setWidthError(
        getCMSDataField(
          cmsData,
          "pagesReportBuilderBuilder.minimumReportWidthError",
          "Minimum report width is 300px",
        ),
      );
      setTimeout(() => {
        setWidthError("");
      }, 3000);
    }
  };

  const setPaddingNewValueChange = (i: number, value: string) => {
    const newValue = [...get(reportData, "data.data.settings.padding", [])];
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
      const newValue = [...get(reportData, "data.data.settings.padding", [])];
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
    if (id) {
      updateReport.mutate(
        {
          settings: {
            width,
            height,
            padding,
            stroke: reportData.data?.data.settings.stroke,
            strokeColor: reportData.data?.data.settings.strokeColor,
            borderRadius: reportData.data?.data.settings.borderRadius,
            backgroundColor: reportData.data?.data.settings.backgroundColor,
          },
        },
        {
          onSuccess: () => {
            console.log("Report updated successfully");
            props.closePanel();
          },
        },
      );
    }
  };

  React.useEffect(() => {
    setWidth(reportData.data?.data.settings.width);
    setHeight(reportData.data?.data.settings.height);
    setPadding(reportData.data?.data.settings.padding);
  }, [
    reportData.data?.data.settings.width,
    reportData.data?.data.settings.height,
    reportData.data?.data.settings.padding,
  ]);

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
          <InputLabel id="width-label" htmlFor="width-input">
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.widthLabel",
              "Width",
            )}
          </InputLabel>
          <input
            type="text"
            id="width-input"
            value={width}
            onBlur={handleWidthBlur}
            onChange={handleWidthChange}
          />
          {widthError ? (
            <FormHelperText error>{widthError}</FormHelperText>
          ) : (
            <FormHelperText
              sx={{
                lineHeight: "normal",
              }}
            >
              {getCMSDataField(
                cmsData,
                "pagesReportBuilderBuilder.canvasHeightHint",
                "The canvas height is fluid and expands automatically as content is added.",
              )}
            </FormHelperText>
          )}
        </Box>
        <Box width="100%">
          <Typography fontSize="14px" fontWeight="700">
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.paddingLabel",
              "Padding",
            )}
          </Typography>
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="l-padding-label" htmlFor="l-padding-input">
            <LeftPadding />{" "}
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.leftPaddingLabel",
              "Left",
            )}
          </InputLabel>
          <input
            type="text"
            id="l-padding-input"
            value={padding?.[3]}
            onBlur={handleLeftPaddingBlur}
            onChange={handleLeftPaddingChange}
          />
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="t-padding-label" htmlFor="t-padding-input">
            <TopPadding />{" "}
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.topPaddingLabel",
              "Top",
            )}
          </InputLabel>
          <input
            type="text"
            id="t-padding-input"
            value={padding?.[0]}
            onBlur={handleTopPaddingBlur}
            onChange={handleTopPaddingChange}
          />
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="r-padding-label" htmlFor="r-padding-input">
            <RightPadding />{" "}
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.rightPaddingLabel",
              "Right",
            )}
          </InputLabel>
          <input
            type="text"
            id="r-padding-input"
            value={padding?.[1]}
            onBlur={handleRightPaddingBlur}
            onChange={handleRightPaddingChange}
          />
        </Box>
        <Box width="calc(50% - 4px)">
          <InputLabel id="b-padding-label" htmlFor="b-padding-input">
            <BottomPadding />{" "}
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.bottomPaddingLabel",
              "Bottom",
            )}
          </InputLabel>
          <input
            type="text"
            id="b-padding-input"
            value={padding?.[2]}
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
          {getCMSDataField(
            cmsData,
            "pagesReportBuilderBuilder.backButton",
            "Back",
          )}
        </Button>
        <Button
          sx={{
            fontWeight: "400",
            background: "#3154F4",
            color: colors.primary.white,
          }}
          onClick={handleApply}
        >
          {getCMSDataField(
            cmsData,
            "pagesReportBuilderBuilder.applyButton",
            "Apply",
          )}
        </Button>
      </Box>
    </React.Fragment>
  );
};

export const BorderFillPanel: React.FC<{ closePanel: () => void }> = (
  props,
) => {
  const { id } = useParams<{ id: string }>();
  const cmsData = useCMSData({ returnData: true });

  const reportData = useGetReport(id);
  const updateReport = usePatchReport(id);

  const [stroke, setStroke] = React.useState(
    reportData?.data?.data.settings.stroke,
  );
  const [strokeColor, setStrokeColor] = React.useState(
    reportData?.data?.data.settings.strokeColor,
  );
  const [borderRadius, setBorderRadius] = React.useState(
    reportData?.data?.data.settings.borderRadius,
  );
  const [backgroundColor, setBackgroundColor] = React.useState(
    reportData?.data?.data.settings.backgroundColor,
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
    if (id) {
      updateReport.mutate(
        {
          settings: {
            stroke,
            strokeColor,
            borderRadius,
            backgroundColor,
            width: reportData.data?.data.settings.width,
            height: reportData.data?.data.settings.height,
            padding: reportData.data?.data.settings.padding,
          },
        },
        {
          onSuccess: () => {
            console.log("Report updated successfully");
            props.closePanel();
          },
        },
      );
    }
  };

  React.useEffect(() => {
    setStroke(reportData.data?.data.settings.stroke);
    setStrokeColor(reportData.data?.data.settings.strokeColor);
    setBorderRadius(reportData.data?.data.settings.borderRadius);
    setBackgroundColor(reportData.data?.data.settings.backgroundColor);
  }, [
    reportData.data?.data.settings.stroke,
    reportData.data?.data.settings.strokeColor,
    reportData.data?.data.settings.borderRadius,
    reportData.data?.data.settings.backgroundColor,
  ]);

  return (
    <React.Fragment>
      <Box sx={panelSx}>
        <Box width="calc(50% - 4px)">
          <InputLabel id="stroke-label" htmlFor="stroke-input">
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.strokeLabel",
              "Stroke",
            )}
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
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.strokeColorLabel",
              "Stroke Color",
            )}
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
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.cornerRadiusLabel",
              "Corner Radius",
            )}
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
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.backgroundLabel",
              "Background",
            )}
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
          {getCMSDataField(
            cmsData,
            "pagesReportBuilderBuilder.backButton",
            "Back",
          )}
        </Button>
        <Button
          sx={{
            fontWeight: "400",
            background: "#3154F4",
            color: colors.primary.white,
          }}
          onClick={handleApply}
        >
          {getCMSDataField(
            cmsData,
            "pagesReportBuilderBuilder.applyButton",
            "Apply",
          )}
        </Button>
      </Box>
    </React.Fragment>
  );
};
