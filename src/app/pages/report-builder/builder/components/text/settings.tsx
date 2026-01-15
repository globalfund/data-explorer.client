import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import { DraggablePopper } from "app/components/draggable-popper";
import PaddingTop from "app/assets/vectors/RBAlignTop.svg?react";
import PaddingLeft from "app/assets/vectors/RBPaddingLeft.svg?react";
import PaddingRight from "app/assets/vectors/RBPaddingRight.svg?react";
import PaddingBottom from "app/assets/vectors/RBAlignBottom.svg?react";

export const ReportBuilderPageTextSettings: React.FC<{
  handleClose: () => void;
  anchorEl: null | HTMLElement;
  setVisualSettings: (newSettings: any) => void;
  textCompSettings: {
    paddingTop: number;
    paddingLeft: number;
    paddingRight: number;
    paddingBottom: number;
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
    backgroundColor: string;
  };
}> = ({ anchorEl, handleClose, textCompSettings, setVisualSettings }) => {
  const handlePaddingLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setVisualSettings({ paddingLeft: "" });
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      setVisualSettings({ paddingLeft: value });
    }
  };

  const handlePaddingLeftBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setVisualSettings({ paddingLeft: "0" });
    }
  };

  const handlePaddingTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setVisualSettings({ paddingTop: "" });
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      setVisualSettings({ paddingTop: value });
    }
  };

  const handlePaddingTopBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setVisualSettings({ paddingTop: "0" });
    }
  };

  const handlePaddingRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setVisualSettings({ paddingRight: "" });
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      setVisualSettings({ paddingRight: value });
    }
  };

  const handlePaddingRightBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setVisualSettings({ paddingRight: "0" });
    }
  };

  const handlePaddingBottomChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value === "") {
      setVisualSettings({ paddingBottom: "" });
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      setVisualSettings({ paddingBottom: value });
    }
  };

  const handlePaddingBottomBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setVisualSettings({ paddingBottom: "0" });
    }
  };

  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setVisualSettings({ borderWidth: "" });
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      setVisualSettings({ stroke: value });
    }
  };

  const handleStrokeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setVisualSettings({ borderWidth: "0" });
    }
  };

  const handleborderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisualSettings({ borderColor: e.target.value });
  };

  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setVisualSettings({ borderRadius: "" });
      return;
    }
    if (!/^\d+$/.test(value)) return;
    const nValue = parseInt(value, 10);
    if (!isNaN(nValue) && nValue >= 0) {
      setVisualSettings({ borderRadius: value });
    }
  };

  const handleBorderRadiusBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setVisualSettings({ borderRadius: "0" });
    }
  };

  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVisualSettings({ backgroundColor: e.target.value });
  };

  const setOpen = () => {
    handleClose();
  };

  return (
    <DraggablePopper
      id="report-builder-text-settings"
      width={260}
      title="Text"
      setOpen={setOpen}
      anchorEl={anchorEl}
      placement="bottom-end"
      open={Boolean(anchorEl)}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography fontSize="14px" fontWeight="700" mb="8px">
          Padding
        </Typography>
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
                gap: "4px",
                display: "flex",
                color: "#525252",
                alignItems: "center",
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
              "> input[type='number'], > input[type='text']": {
                width: "100%",
                height: "40px",
                fontSize: "14px",
                borderStyle: "none",
                borderRadius: "4px",
                padding: "0px 16px",
                background: "#f1f3f5",
                appearance: "none",
                MozAppearance: "none",
                WebkitAppearance: "none",
                borderBottom: "1px solid #868e96",
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
            },
          }}
        >
          <Box>
            <InputLabel id="padding-left-label" htmlFor="padding-left-input">
              <PaddingLeft />
              Left
            </InputLabel>
            <input
              type="text"
              id="padding-left-input"
              onBlur={handlePaddingLeftBlur}
              onChange={handlePaddingLeftChange}
              value={textCompSettings.paddingLeft}
            />
          </Box>
          <Box>
            <InputLabel id="padding-top-label" htmlFor="padding-top-input">
              <PaddingTop />
              Top
            </InputLabel>
            <input
              type="text"
              id="padding-top-input"
              onBlur={handlePaddingTopBlur}
              onChange={handlePaddingTopChange}
              value={textCompSettings.paddingTop}
            />
          </Box>
          <Box>
            <InputLabel id="padding-right-label" htmlFor="padding-right-input">
              <PaddingRight />
              Right
            </InputLabel>
            <input
              type="text"
              id="padding-right-input"
              onBlur={handlePaddingRightBlur}
              onChange={handlePaddingRightChange}
              value={textCompSettings.paddingRight}
            />
          </Box>
          <Box>
            <InputLabel
              id="padding-bottom-label"
              htmlFor="padding-bottom-input"
            >
              <PaddingBottom />
              Bottom
            </InputLabel>
            <input
              type="text"
              id="padding-bottom-input"
              onBlur={handlePaddingBottomBlur}
              onChange={handlePaddingBottomChange}
              value={textCompSettings.paddingBottom}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography fontSize="14px" fontWeight="700" mb="8px">
          Border & Fill
        </Typography>
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
                gap: "4px",
                display: "flex",
                color: "#525252",
                alignItems: "center",
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
              "> input[type='number'], > input[type='text']": {
                width: "100%",
                height: "40px",
                fontSize: "14px",
                borderStyle: "none",
                borderRadius: "4px",
                padding: "0px 16px",
                background: "#f1f3f5",
                appearance: "none",
                MozAppearance: "none",
                WebkitAppearance: "none",
                borderBottom: "1px solid #868e96",
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
            },
          }}
        >
          <Box>
            <InputLabel id="stroke-label" htmlFor="stroke-input">
              Stroke
            </InputLabel>
            <input
              type="text"
              id="stroke-input"
              onBlur={handleStrokeBlur}
              onChange={handleStrokeChange}
              value={textCompSettings.borderWidth}
            />
          </Box>
          <Box>
            <InputLabel id="stroke-color-label" htmlFor="stroke-color-input">
              Stroke Color
            </InputLabel>
            <input
              type="color"
              id="stroke-color-input"
              onChange={handleborderColorChange}
              value={textCompSettings.borderColor}
            />
          </Box>
          <Box>
            <InputLabel id="corner-radius-label" htmlFor="corner-radius-input">
              Corner Radius
            </InputLabel>
            <input
              type="text"
              id="corner-radius-input"
              onBlur={handleBorderRadiusBlur}
              onChange={handleBorderRadiusChange}
              value={textCompSettings.borderRadius}
            />
          </Box>
          <Box>
            <InputLabel
              id="background-color-label"
              htmlFor="background-color-input"
            >
              Background
            </InputLabel>
            <input
              type="color"
              id="background-color-input"
              onChange={handleBackgroundColorChange}
              value={textCompSettings.backgroundColor}
            />
          </Box>
        </Box>
      </Box>
    </DraggablePopper>
  );
};
