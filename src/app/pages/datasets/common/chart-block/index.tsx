import React from "react";
import Box from "@mui/material/Box";
import uniqueId from "lodash/uniqueId";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Dropdown } from "app/components/dropdown";
import { FilterPanel } from "app/components/filters/panel";
// import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import CircularProgress from "@mui/material/CircularProgress";
import { DatasetChartBlockProps } from "app/pages/datasets/common/chart-block/data";
// import CollapseIcon from "app/assets/vectors/Collapse_ButtonIcon.svg?react";
// import SettingsIcon from "app/assets/vectors/Settings_ButtonIcon.svg?react";
import { ChartBlockButtonToolbar } from "app/components/chart-block/components/button-toolbar";

export const DatasetChartBlock: React.FC<DatasetChartBlockProps> = (
  props: DatasetChartBlockProps,
) => {
  // const [collapsed, setCollapsed] = React.useState(false);
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
  // const handleCollapse = () => {
  //   setCollapsed(!collapsed);
  // };

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

  const content = React.useMemo(() => {
    if (props.loading) {
      return (
        <Box
          width="100%"
          height="300px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      );
    }
    if (props.empty) {
      return (
        <Box
          width="100%"
          height="100%"
          display="flex"
          minHeight="250px"
          alignItems="center"
          justifyContent="center"
        >
          <Typography>No data available</Typography>
        </Box>
      );
    }
    return props.children;
  }, [props.children, props.loading, props.empty]);

  const id = React.useMemo(() => uniqueId("chart-block-"), []);

  const filterPopoverContent = React.useMemo(() => {
    return (
      <FilterPanel
        onClose={handleFilterPanelClose}
        filterGroups={props.filterGroups}
        toggleFilter={props.toggleFilter}
        removeFilter={props.removeFilter}
        appliedFilters={props.appliedFilters}
        handleResetFilters={props.handleResetFilters}
        tempAppliedFiltersData={props.tempAppliedFiltersData}
        setPage={() => 0}
        setPageSearchValue={() => 0}
        appliedFilterBgColors={{
          hover: "#2196F3",
          normal: "rgba(33, 150, 243, 0.2)",
        }}
        page={0}
        search=""
        handleCancelFilters={handleCancelFilters}
        handleApplyFilters={handleApplyFilters}
      />
    );
  }, [
    props.appliedFilters,
    props.filterGroups,
    props.tempAppliedFiltersData,
    props.toggleFilter,
    props.removeFilter,
    props.handleResetFilters,
  ]);

  return (
    <Box id={props.id} data-cy="dataset-chart-block" position="relative">
      <Box
        id={`anchor-${props.id}`}
        sx={{
          left: 0,
          zIndex: -1,
          top: "-58px",
          position: "absolute",
        }}
      />
      <Typography variant={props.titleVariant ?? "h2"} lineHeight={1.2}>
        {props.title}
      </Typography>
      <Typography variant={props.subtitleVariant ?? "body2"} fontSize="20px">
        {props.subtitle}
      </Typography>
      <Divider
        sx={{
          margin: "10px 0",
          "@media (max-width: 767px)": {
            margin: "10px 0",
            borderColor: "#fff",
          },
        }}
      />
      <Box
        display="flex"
        marginBottom="40px"
        flexDirection="row"
        justifyContent="space-between"
        sx={{
          "@media (max-width: 767px)":
            props.extraDropdown && props.dropdownItems.length > 0
              ? {
                  gap: "16px",
                  marginBottom: 0,
                  flexDirection: "column",
                }
              : {},
        }}
      >
        <Box gap="10px" display="flex" flexDirection="row">
          {props.filterGroups.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<Add fontSize="small" />}
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
                        background: "#2196F3",
                      },
                    }
                  : {}
              }
            >
              Filters
            </Button>
          )}
          <Popover
            disableScrollLock
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            id={`filter-popover-${id}`}
            onClose={handleFilterPanelClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {filterPopoverContent}
          </Popover>
          {/* <Button variant="outlined" startIcon={<SettingsIcon />}>
            Settings
          </Button> */}
          {/* <Button
            variant="outlined"
            onClick={handleCollapse}
            startIcon={collapsed ? <UnfoldMoreIcon /> : <CollapseIcon />}
            sx={
              props.disableCollapse
                ? { pointerEvents: "none", opacity: 0.4 }
                : {}
            }
          >
            {collapsed ? "Expand" : "Collapse"}
          </Button> */}
        </Box>
        <Box gap="10px" display="flex" flexDirection="row">
          {props.extraDropdown}
          {props.dropdownItems &&
            props.dropdownSelected &&
            props.handleDropdownChange && (
              <Dropdown
                width={props.dropdownWidth}
                dropdownItems={props.dropdownItems}
                dropdownSelected={props.dropdownSelected}
                handleDropdownChange={props.handleDropdownChange}
              />
            )}
          {props.unitButtons}
        </Box>
      </Box>
      <Box>
        <Box
          id={id}
          width="100%"
          position="relative"
          sx={
            props.loading
              ? {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }
              : {}
          }
        >
          {content}
        </Box>
        <Box
          width="100%"
          display="flex"
          marginTop="40px"
          alignItems="center"
          position="relative"
          justifyContent={props.latestUpdate ? "space-between" : "flex-end"}
        >
          {props.latestUpdate && (
            <Typography variant="overline" fontSize="14px">
              Latest Update: <b>{props.latestUpdate}</b>
            </Typography>
          )}
          <ChartBlockButtonToolbar
            blockId={id}
            hashId={props.id}
            chartData={props.data}
            infoType={props.infoType}
            exportName={props.exportName}
            chartType={props.dropdownSelected}
          />
        </Box>
      </Box>
    </Box>
  );
};
