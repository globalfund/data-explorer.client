import React from "react";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InfoIcon from "app/assets/vectors/Info_GreyBG.svg?react";
import ShareIcon from "app/assets/vectors/Share_GreyBG.svg?react";
import DownloadIcon from "app/assets/vectors/Download_GreyBG.svg?react";
// import FavoriteIcon from "app/assets/vectors/Favorite_GreyBG.svg?react";
import {
  InfoPanel,
  SharePanel,
  DownloadPanel,
  ChartBlockButtonToolbarProps,
} from "app/components/chart-block/components/button-toolbar/data";

export const ChartBlockButtonToolbar: React.FC<ChartBlockButtonToolbarProps> = (
  props: ChartBlockButtonToolbarProps,
) => {
  const [active, setActive] = React.useState<
    "download" | "share" | "favorite" | "info" | null
  >(null);

  const handleButtonClick =
    (type: "download" | "share" | "favorite" | "info") => () => {
      if (type === "info" && active === "info") {
        setActive(null);
        return;
      }
      setActive(type);
      if (type === "favorite") {
        setTimeout(() => {
          setActive(null);
        }, 3000);
      }
    };

  const handleClose = () => {
    setActive(null);
  };

  const activePanel = React.useMemo(() => {
    switch (active) {
      case "download":
        return <DownloadPanel {...props} />;
      case "share":
        return <SharePanel {...props} />;
      case "favorite":
        return (
          <Box
            sx={{
              lineHeight: 1.2,
            }}
          >
            Chart added to your library!
          </Box>
        );
      case "info":
        return <InfoPanel close={handleClose} type={props.infoType} />;
      default:
        return null;
    }
  }, [active]);

  return (
    <React.Fragment>
      <ClickAwayListener onClickAway={handleClose}>
        <Box
          gap="8px"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          sx={{
            "& > button": {
              padding: "0",
              width: "40px",
              height: "35px",
              borderRadius: "4px",
              background: "transparent",
              border: "1px solid #98A1AA",
              "&:hover": {
                background: "#000000",
                borderColor: "#000000",
                svg: {
                  filter: "invert(1)",
                },
              },
            },
            "#active": {
              background: "#000000",
              borderColor: "#000000",
              svg: {
                filter: "invert(1)",
              },
            },
          }}
        >
          {active !== "info" && activePanel && (
            <React.Fragment>
              <Box
                gap="8px"
                display="flex"
                flexDirection="row"
                sx={{
                  "& > button": {
                    height: "35px",
                    fontSize: "14px",
                    fontWeight: "400",
                    padding: "9px 12px",
                    borderRadius: "4px",
                    textTransform: "none",
                    color: appColors.CHART_BLOCK_CYCLES.BUTTON_TEXT_COLOR,
                    border: `1px solid ${appColors.CHART_BLOCK_CYCLES.BUTTON_BORDER_COLOR}`,
                    background:
                      appColors.CHART_BLOCK_CYCLES.BUTTON_BACKGROUND_COLOR,
                    "&:hover": {
                      color:
                        appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR,
                      background:
                        appColors.CHART_BLOCK_CYCLES
                          .BUTTON_ACTIVE_BACKGROUND_COLOR,
                    },
                  },
                  "& > div": {
                    height: "35px",
                    fontSize: "14px",
                    fontWeight: "400",
                    padding: "9px 12px",
                    borderRadius: "4px",
                    color: appColors.COMMON.WHITE,
                    background: appColors.COMMON.BLACK,
                  },
                }}
              >
                {activePanel}
              </Box>
              <Divider
                flexItem
                orientation="vertical"
                sx={{ borderColor: appColors.COMMON.BLACK, margin: "0 16px" }}
              />
            </React.Fragment>
          )}
          <Tooltip
            title="Info"
            data-cy="chart-info-button"
            onClick={handleButtonClick("info")}
          >
            <IconButton id={active === "info" ? "active" : ""}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          {active === "info" && (
            <InfoPanel close={handleClose} type={props.infoType} />
          )}
          <Tooltip title="Share">
            <IconButton
              onClick={handleButtonClick("share")}
              id={active === "share" ? "active" : ""}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton
              onClick={handleButtonClick("download")}
              id={active === "info" ? "download" : ""}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Favourite (Not implemented yet)">
            <IconButton
              disableRipple
              sx={{
                opacity: 0.2,
                "&:hover": {
                  cursor: "default",
                  borderColor: "#DFE3E5 !important",
                },
              }}
            >
              <FavoriteIcon />
            </IconButton>
          </Tooltip> */}
        </Box>
      </ClickAwayListener>
    </React.Fragment>
  );
};
