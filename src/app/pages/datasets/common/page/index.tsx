import React from "react";
import Box from "@mui/material/Box";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { FilterPanel } from "app/components/filters/panel";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {
  TooltipTitle,
  DatasetPageProps,
} from "app/pages/datasets/common/page/data";

export const DatasetPage: React.FC<DatasetPageProps> = (
  props: DatasetPageProps,
) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleFilterButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterPanelClose = () => {
    props.handleCancelFilters();
    setAnchorEl(null);
  };

  const handleCancelFilters = () => {
    props.handleCancelFilters();
    setAnchorEl(null);
  };
  const handleApplyFilters = () => {
    props.handleApplyFilters();
    setAnchorEl(null);
  };
  const onScroll = React.useCallback(() => {
    props.handleCancelFilters();
    setAnchorEl(null);
  }, [props.handleCancelFilters]);

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  const filterPopoverContent = React.useMemo(() => {
    return (
      <FilterPanel
        onClose={handleFilterPanelClose}
        filterGroups={props.filterGroups}
        appliedFilters={props.appliedFilters}
        page={0}
        search=""
        handleResetFilters={props.handleResetFilters}
        appliedFilterBgColors={{
          hover: "#FF9800",
          normal: "rgba(255, 152, 0, 0.2)",
        }}
        setPage={() => 0}
        setPageSearchValue={() => 0}
        handleCancelFilters={handleCancelFilters}
        handleApplyFilters={handleApplyFilters}
      />
    );
  }, [props.filterGroups, props.appliedFilters, props.handleResetFilters]);

  return (
    <Box padding="50px 0">
      <Typography
        variant="h1"
        sx={{
          "@media (max-width: 767px)": {
            marginBottom: "32px",
            letterSpacing: "-4px",
            wordBreak: "break-word",
          },
        }}
      >
        {props.title}
      </Typography>
      {props.subtitle.length > 0 && (
        <Typography
          variant="h4"
          sx={
            props.subtitle.length > 0
              ? {}
              : {
                  height: "28.8px",
                }
          }
        >
          {props.subtitle}
        </Typography>
      )}
      <Divider
        sx={{
          left: 0,
          width: "100vw",
          margin: "50px 0",
          position: "absolute",
          borderColor: "#CFD4DA",
          "@media (max-width: 767px)": {
            display: "none",
          },
        }}
      />
      <Box
        width="100%"
        height="82px"
        display="flex"
        marginTop="50px"
        flexDirection="row"
        justifyContent={!props.hideFilters ? "space-between" : "flex-end"}
        sx={{
          "@media (max-width: 767px)": {
            gap: "16px",
            height: "auto",
            flexDirection: "column",
          },
        }}
      >
        {!props.hideFilters && (
          <Box
            gap="20px"
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleFilterButtonClick}
              sx={
                props.appliedFilters.length > 0
                  ? {
                      "&:after": {
                        top: "-3px",
                        right: "8px",
                        width: "6px",
                        height: "6px",
                        content: "''",
                        borderRadius: "50%",
                        position: "absolute",
                        background: "#FF9800",
                      },
                    }
                  : {}
              }
              data-cy="datasets-filter-btn"
            >
              Filters
            </Button>
            <Tooltip title={<TooltipTitle />} arrow>
              <InfoOutlined fontSize="small" />
            </Tooltip>
            <Popover
              disableScrollLock
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleFilterPanelClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {filterPopoverContent}
            </Popover>
          </Box>
        )}
        {props.toolbarRightContent}
      </Box>
      <Divider
        sx={{
          left: 0,
          width: "100vw",
          position: "absolute",
          borderColor: "#CFD4DA",
          "@media (max-width: 767px)": {
            display: "none",
          },
        }}
      />
      {props.children}
    </Box>
  );
};
