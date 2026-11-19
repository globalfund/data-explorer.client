import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { Dropdown } from "app/components/dropdown";
import { FilterPanel } from "app/components/filters/panel";
import { getCMSDataField } from "app/utils/getCMSDataField";
import Searchbox from "app/pages/grants/component/Searchbox";
import CircularProgress from "@mui/material/CircularProgress";
import { GrantsLayoutProps, DROPDOWN_ITEMS } from "app/pages/grants/data";

export const GrantsLayout: React.FC<GrantsLayoutProps> = (
  props: GrantsLayoutProps,
) => {
  const cmsData = useCMSData({ returnData: true });
  const {
    view,
    viewResult,
    pagination,
    handleViewChange,
    search,
    handleSearch,
    handleSearchIconClick,
    handleFilterButtonClick,
    handleFilterPanelClose,
    handleCancelFilters,
    filterGroups,
    pageAppliedFilters,
    handleResetFilters,
    anchorEl,
    loading,
    searchInputRef,
    handleApplyFilters,
  } = props;

  const fullWidthDivider = (
    <Divider
      sx={{
        left: "-50vw",
        width: "200vw",
        position: "relative",
        borderTopColor: "#868E96",
        "@media (max-width: 767px)": {
          display: "none",
        },
      }}
    />
  );

  const filterPopoverContent = React.useMemo(() => {
    return (
      <FilterPanel
        onClose={handleFilterPanelClose}
        filterGroups={filterGroups}
        appliedFilters={pageAppliedFilters}
        handleResetFilters={handleResetFilters}
        appliedFilterBgColors={{
          hover: "#FF9800",
          normal: "rgba(255, 152, 0, 0.2)",
        }}
        setPage={props.setPage}
        setPageSearchValue={props.setPageSearchValue}
        page={props.page}
        search={search}
        handleCancelFilters={handleCancelFilters}
        handleApplyFilters={handleApplyFilters}
      />
    );
  }, [
    filterGroups,
    pageAppliedFilters,
    handleResetFilters,
    handleFilterPanelClose,
  ]);

  return (
    <Box padding="50px 0">
      <Typography variant="h1">
        {getCMSDataField(cmsData, "pagesGrants.title", "Grants")}
      </Typography>
      <Box
        height="50px"
        sx={{
          "@media (max-width: 767px)": {
            display: "none",
          },
        }}
      />
      {fullWidthDivider}
      <Box
        gap="16px"
        display="flex"
        padding="20px 0"
        position="relative"
        flexDirection="column"
      >
        <Box
          display="flex"
          paddingBottom="4px"
          alignItems="center"
          justifyContent="space-between"
          gap={"8px"}
          sx={{
            "@media(max-width:744px)": {
              flexWrap: "wrap",
            },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleFilterButtonClick}
            sx={
              pageAppliedFilters.length > 0
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
            data-cy="grants-filter-btn"
          >
            Filters
          </Button>
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
          <Box
            sx={{
              width: "432px",
              "@media(max-width:744px)": { width: "100%", order: 3 },
            }}
          >
            <Searchbox
              handleSearch={handleSearch}
              search={search}
              searchInputRef={searchInputRef}
              handleSearchIconClick={handleSearchIconClick}
            />
          </Box>
          <Box gap="8px" display="flex" flexBasis={"auto"}>
            <Dropdown
              width={150}
              dropdownSelected={view}
              dropdownItems={DROPDOWN_ITEMS}
              handleDropdownChange={handleViewChange}
            />
          </Box>
        </Box>
        {fullWidthDivider}
        <Box
          height="18px"
          sx={{
            "@media (max-width: 767px)": {
              display: "none",
            },
          }}
        />
        {loading && (
          <Box
            top="0"
            zIndex="1"
            width="100%"
            height="100%"
            display="flex"
            position="absolute"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(255, 255, 255, 0.5)"
          >
            <CircularProgress />
          </Box>
        )}
        {viewResult}
        <Box height={"8px"} />
        {pagination}
      </Box>
      <Box>
        <Typography variant="overline" fontSize="14px">
          Latest Update: <b>{props.latestUpdateDate}</b>
        </Typography>
      </Box>
    </Box>
  );
};
