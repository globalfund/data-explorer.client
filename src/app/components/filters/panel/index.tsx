import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { appColors } from "app/theme";
import Tabs from "@mui/material/Tabs";
import findIndex from "lodash/findIndex";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import Close from "@mui/icons-material/Close";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { FilterList } from "app/components/filters/list";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { FiltersApplied } from "app/components/filters/applied";
import { FilterPanelProps } from "app/components/filters/panel/data";
import SearchIcon from "app/assets/vectors/Search_grants.svg?react";
import CollapseIcon from "app/assets/vectors/Collapse_ButtonIcon.svg?react";
import {
  FilterModel,
  SearchInput,
  FilterGroupModel,
} from "app/components/filters/list/data";

export const FilterPanel: React.FC<FilterPanelProps> = (
  props: FilterPanelProps,
) => {
  const cmsData = useCMSData({ returnData: true });
  const [collapseAll, setCollapseAll] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const handleCollapseAll = () => {
    setCollapseAll(!collapseAll);
  };
  const [shownOptions, setShownOptions] = React.useState<FilterModel[]>([]);
  const [tabValue, setTabValue] = React.useState(props.filterGroups[0].id);

  const appliedFiltersContent = React.useMemo(() => {
    if (props.appliedFilters.length === 0) {
      return (
        <Typography fontSize="14px">
          {getCMSDataField(
            cmsData,
            "generic.noFiltersAppliedLabel",
            "No filters applied.",
          )}
        </Typography>
      );
    }
    return (
      <FiltersApplied
        items={props.appliedFilters}
        removeFilter={props.removeFilter}
        filterGroups={props.filterGroups}
        appliedFilterBgColors={props.appliedFilterBgColors}
      />
    );
  }, [props.appliedFilters, cmsData]);

  const filterGroupOptions = React.useMemo(
    () => props.filterGroups.find((group) => group.id === tabValue)?.options,
    [props.filterGroups, tabValue],
  );

  const handleTabChange = (_e: React.SyntheticEvent, newValue: string) => {
    const localFilterGroupOptions = props.filterGroups.find(
      (group) => group.id === newValue,
    )?.options;
    setTabValue(newValue);
    filterOptions(searchValue, localFilterGroupOptions ?? []);
  };

  const filterOptions = (
    localSearchValue: string,
    localFilterGroupOptions?: FilterModel[],
  ) => {
    if (localSearchValue.length === 0) {
      setShownOptions(localFilterGroupOptions ?? []);
    } else {
      const options: FilterModel[] = [];
      (localFilterGroupOptions ?? []).forEach((option: FilterModel) => {
        if (
          option.name.toLowerCase().indexOf(localSearchValue.toLowerCase()) > -1
        ) {
          options.push(option);
        } else if (option.options) {
          option.options.forEach((subOption: FilterModel) => {
            if (
              subOption.name
                .toLowerCase()
                .indexOf(localSearchValue.toLowerCase()) > -1
            ) {
              const fParentIndex = findIndex(options, { name: option.name });
              if (fParentIndex > -1) {
                options[fParentIndex].options?.push(subOption);
              } else {
                options.push({
                  ...option,
                  options: [subOption],
                });
              }
            } else if (subOption.options) {
              subOption.options.forEach((subSubOption: FilterModel) => {
                if (
                  (subSubOption.name || "")
                    .toLowerCase()
                    .indexOf(localSearchValue.toLowerCase()) > -1
                ) {
                  const fGrandParentIndex = findIndex(options, {
                    name: option.name,
                  });
                  if (fGrandParentIndex > -1) {
                    const fParentIndex = findIndex(
                      options[fGrandParentIndex]?.options,
                      { name: subOption.name },
                    );
                    if (fParentIndex > -1) {
                      // @ts-expect-error object possibly undefined
                      options[fGrandParentIndex]?.options[
                        fParentIndex
                      ]?.options.push(subSubOption);
                    } else {
                      // @ts-expect-error object possibly undefined
                      options[fGrandParentIndex]?.options.push({
                        ...subOption,
                        options: [subSubOption],
                      });
                    }
                  } else {
                    options.push({
                      ...option,
                      options: [
                        {
                          ...subOption,
                          options: [subSubOption],
                        },
                      ],
                    });
                  }
                }
              });
            }
          });
        }
      });
      setShownOptions(options);
    }
  };

  const handleSearchFiltersChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchValue(e.target.value);
    filterOptions(e.target.value, filterGroupOptions);
  };

  const FilterGroupsTabs = React.useMemo(() => {
    return (
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        aria-label="secondary tabs example"
        sx={{
          minHeight: "35px",
        }}
        TabIndicatorProps={{
          sx: {
            backgroundColor: "#252C34",
            height: "3px",
          },
        }}
      >
        {props.filterGroups.map((group) => (
          <Tab
            key={group.id}
            value={group.id}
            label={group.name}
            disableTouchRipple
            sx={{
              borderBottom:
                tabValue === group.id ? "none" : "1px solid #ADB5BD",
              transition: "border-bottom 0.3s",
              color: "#373D43",
              fontFamily: "Inter",
              textTransform: "none",
              marginRight: "15px",
              minHeight: "35px",
              padding: "10px",
            }}
          />
        ))}
      </Tabs>
    );
  }, [tabValue, searchValue]);

  React.useEffect(() => {
    filterOptions(searchValue, filterGroupOptions);
  }, [props.filterGroups]);

  return (
    <Box
      gap="7px"
      display="flex"
      bgcolor="#FFFFFF"
      padding="9px 12px"
      borderRadius="4px"
      flexDirection="column"
      border="1px solid #70777E"
      data-cy="filter-panel"
      sx={{
        "@media (min-width: 1280px)": {
          width: "1200px",
        },
        "@media (max-width: 1279px)": {
          width: "calc(100vw - 40px)",
        },
      }}
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        alignItems="center"
        onClick={props.onClose}
        justifyContent="space-between"
      >
        <Box
          gap="8px"
          display="flex"
          flexDirection="row"
          alignItems="center"
          margin="-4px 0 0 -4px"
        >
          <Add fontSize="small" />
          <Typography fontSize="14px">Filters</Typography>
        </Box>
        <IconButton
          sx={{
            padding: 0,
          }}
          onClick={props.onClose}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
      <Box
        gap="5px"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {appliedFiltersContent}
        <Box
          gap="10px"
          display="flex"
          minWidth="192px"
          flexDirection="row"
          sx={{
            "& > button": {
              fontSize: "14px",
              lineHeight: "1.5",
              padding: "5px 12px",
              svg: {
                width: "14px",
                height: "14px",
              },
            },
          }}
        >
          <Box
            sx={{
              gap: "6px",
              width: "219px",
              height: "100%",
              display: "flex",
              padding: "5px 10px",
              borderRadius: "5px",
              alignItems: "center",
              background: appColors.SEARCH.INPUT_BACKGROUND_COLOR,
            }}
          >
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search"
              style={{ height: "24px", padding: 0 }}
              onChange={handleSearchFiltersChange}
              data-cy="filter-panel-search-input"
            />
          </Box>
          <Button
            variant="outlined"
            onClick={handleCollapseAll}
            endIcon={<CollapseIcon fontSize="small" />}
          >
            Collapse All
          </Button>
        </Box>
      </Box>
      <Box>
        {/* tabs */}
        {FilterGroupsTabs}
      </Box>
      {!props.toggleFilter && (
        <Typography fontSize="14px">
          {getCMSDataField(
            cmsData,
            "generic.filterPageWideLabel",
            "Filter the data page-wide.",
          )}
        </Typography>
      )}
      <Box
        sx={{
          overflowY: "auto",
          maxHeight: "450px",
          padding: "5px 20px 20px 20px",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#F5F6F7",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#70777E",
            borderRadius: "3px",
          },
          "@media (max-width: 767px)": {
            padding: "20px 0",
          },
        }}
      >
        <FilterList
          collapseAll={collapseAll}
          groups={props.filterGroups}
          group={
            props.filterGroups.find((group) => group.id === tabValue) ||
            ({} as FilterGroupModel)
          }
          setCollapseAll={setCollapseAll}
          toggleFilter={props.toggleFilter}
          tempAppliedFiltersData={props.tempAppliedFiltersData}
          setPage={props.setPage}
          setPageSearchValue={props.setPageSearchValue}
          shownOptions={shownOptions ?? []}
        />
      </Box>
      <Box
        sx={{
          gap: "10px",
          display: "flex",
          justifyContent: "flex-end",
          "& > button": {
            fontSize: "14px",
            lineHeight: "1.5",
            padding: "7px 12px",
          },
        }}
      >
        <Button
          onClick={props.handleResetFilters}
          variant="outlined"
          endIcon={
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path
                d="M7.99556 13.5H7.99C6.77334 13.4989 5.60056 13.0544 4.68834 12.25L4.11111 11.7368V12.9444C4.11111 13.2517 3.86222 13.5 3.55556 13.5C3.24889 13.5 3 13.2517 3 12.9444V10.1667C3 9.85945 3.24889 9.61111 3.55556 9.61111H6.33333C6.64 9.61111 6.88889 9.85945 6.88889 10.1667C6.88889 10.4739 6.64 10.7222 6.33333 10.7222H4.64188L5.425 11.4183C6.13278 12.0428 7.045 12.3878 7.99111 12.3889H7.99556C10.1378 12.3889 11.8822 10.6472 11.8844 8.50445C11.8867 6.36 10.1439 4.61389 8 4.61111H7.96889C6.00778 4.61111 4.35222 6.06889 4.10722 8.01389C4.06889 8.31833 3.78778 8.52722 3.48667 8.49556C3.18222 8.45722 2.96667 8.17944 3.005 7.875C3.31945 5.37444 5.44834 3.5 7.965 3.5H8.00445C10.7578 3.50278 12.9983 5.74833 12.995 8.50556C12.9917 11.2606 10.7494 13.5 7.99556 13.5Z"
                fill="#373D43"
              />
            </svg>
          }
        >
          {getCMSDataField(
            cmsData,
            "generic.filterPanelResetChanges",
            "Reset Changes",
          )}
        </Button>
        <Button onClick={props.handleCancelFilters} variant="outlined">
          {getCMSDataField(
            cmsData,
            "generic.filterPanelCancelButton",
            "Cancel",
          )}
        </Button>
        <Button
          onClick={props.handleApplyFilters}
          variant="outlined"
          sx={{
            color: "#fff",
            bgcolor: "#3154f4",
            "&:hover": { bgcolor: "#3154f4" },
          }}
        >
          {getCMSDataField(cmsData, "generic.filterPanelApplyButton", "Apply")}
        </Button>
      </Box>
    </Box>
  );
};
