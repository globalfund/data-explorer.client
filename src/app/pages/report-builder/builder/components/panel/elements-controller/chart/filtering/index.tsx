import { Box, Button, Typography } from "@mui/material";
import { useStoreState } from "app/state/store/hooks";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "app/assets/vectors/Search_grants.svg?react";
import CollapseIcon from "app/assets/vectors/Collapse_ButtonIcon.svg?react";
import React from "react";
import { appColors } from "app/theme";
import { SearchInput } from "app/components/filters/list/data";
import { get, isEqual } from "lodash";
import ExpandedFilterGroup from "./expanded-filter-group";
import {
  FilterGroupOptionModel,
  FilterGroupModel,
} from "app/state/api/action-reducers/report-builder/sync";
import { useDebounce } from "react-use";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

export default function Filtering() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const { selectedItem: item, editItem } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const chartExtra = item?.data;

  const renderedChartData = chartExtra?.renderedChartData;

  const [searchValue, setSearchValue] = React.useState("");

  const [optionGroupsToShow, setOptionGroupsToShow] = React.useState<
    FilterGroupModel[]
  >(renderedChartData?.filterOptionGroups || []);

  const [expandedGroupNames, setExpandedGroupNames] = React.useState<string[]>(
    [],
  );

  const [tmpAppliedFilters, setTmpAppliedFilters] = React.useState<
    Record<string, any[]>
  >(chartExtra?.appliedFilters || {});

  React.useEffect(() => {
    if (!isEqual(tmpAppliedFilters, chartExtra?.appliedFilters || {})) {
      setTmpAppliedFilters(chartExtra?.appliedFilters || {});
    }
  }, [chartExtra?.appliedFilters]);

  const handleApply = (reset: boolean = false) => {
    if (!item) return;
    if (
      !reset &&
      isEqual(tmpAppliedFilters, chartExtra?.appliedFilters || {})
    ) {
      return;
    }
    editItem({
      ...item,
      id: selectedController?.id || "",
      type: "chart",
      data: {
        ...item?.data,
        appliedFilters: reset ? {} : tmpAppliedFilters,
      },
    });

    if (reset) {
      setTmpAppliedFilters({});
      setSearchValue("");
    }
  };

  const searchOptions = (options: FilterGroupOptionModel[], value: string) => {
    const results: FilterGroupOptionModel[] = [];
    options.forEach((option) => {
      if (
        option.label.toString().toLowerCase().indexOf(value.toLowerCase()) > -1
      ) {
        results.push(option);
      } else if (option?.subOptions) {
        const searchResponse = searchOptions(option.subOptions, value);

        if (searchResponse.length) {
          results.push({
            ...option,
            subOptions: searchResponse,
          });
        }
      }
    });
    return results;
  };

  const handleSearch = (value: string) => {
    if (value.length === 0) {
      setOptionGroupsToShow(renderedChartData?.filterOptionGroups || []);
      return;
    }

    try {
      setOptionGroupsToShow(
        renderedChartData?.filterOptionGroups?.map((group) => {
          const searchResults = searchOptions(group.options, value);
          return { ...group, options: searchResults };
        }) || [],
      );
    } catch (e) {
      console.error(e);
      setOptionGroupsToShow(renderedChartData?.filterOptionGroups || []);
      return;
    }
  };
  useDebounce(
    () => {
      handleSearch(searchValue);
    },
    500,
    [searchValue, renderedChartData?.filterOptionGroups],
  );

  useDebounce(
    () => {
      if (tmpAppliedFilters) {
        handleApply();
      }
    },
    1000,
    [tmpAppliedFilters],
  );

  return (
    <Box
      sx={{
        padding: "8px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxHeight: "500px",
        position: "relative",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        paddingBottom: 0,
      }}
    >
      <Box
        sx={{
          gap: "6px",
          width: "100%",
          height: "max-content",
          display: "flex",
          padding: "5px 10px",
          borderRadius: "5px",
          alignItems: "center",
          background: appColors.COMMON.WHITE,
          border: `0.5px solid ${appColors.COMMON.SECONDARY_COLOR_5}`,
        }}
      >
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search"
          style={{ height: "24px", padding: 0, background: "transparent" }}
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          width: "max-content",
          marginLeft: "auto",
          cursor: "pointer",
        }}
        onClick={() => setExpandedGroupNames([])}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: "#3154F4",
            textDecoration: "underline",
          }}
        >
          Collapse All
        </Typography>
        <CollapseIcon stroke="#3154F4" strokeWidth={"0.5px"} />
      </Box>

      <Box>
        {optionGroupsToShow?.map((group) => (
          <Accordion
            key={group.name}
            expanded={expandedGroupNames.includes(group.name)}
            onChange={() => {
              if (expandedGroupNames.includes(group.name)) {
                setExpandedGroupNames((prev) =>
                  prev.filter((name) => name !== group.name),
                );
              } else {
                setExpandedGroupNames((prev) => [...prev, group.name]);
              }
            }}
            sx={{
              borderStyle: "none",
              borderBottom: `0.5px solid ${appColors.COMMON.SECONDARY_COLOR_6}`,
              padding: "8px 0px",
              background: "transparent",
            }}
          >
            <AccordionSummary
              expandIcon={
                get(group, "options.length", 0) > 0 ? (
                  <ExpandMoreIcon />
                ) : undefined
              }
              sx={{
                minHeight: "20px",
                justifyContent: "flex-start",
                "&.Mui-expanded": {
                  minHeight: "20px",
                },
                "> .MuiAccordionSummary-content": {
                  flexGrow: 0,
                },
                gap: "8px",
              }}
            >
              <Typography
                fontSize="14px"
                fontWeight={
                  expandedGroupNames.includes(group.name) ? "700" : "400"
                }
              >
                {group.name}
              </Typography>
            </AccordionSummary>
            {group.options && expandedGroupNames.includes(group.name) && (
              <AccordionDetails>
                <ExpandedFilterGroup
                  name={group.name}
                  options={group.options || []}
                  selectedFilters={
                    get(tmpAppliedFilters, group.name, []) as string[]
                  }
                  setSelectedFilters={(filters: string[]) => {
                    setTmpAppliedFilters((prev) => {
                      const tempPrev = structuredClone(prev);
                      if (filters.length === 0) {
                        delete tempPrev[group.name];
                        return tempPrev;
                      }
                      return {
                        ...prev,
                        [group.name]: filters,
                      };
                    });
                  }}
                />
              </AccordionDetails>
            )}
          </Accordion>
        ))}
      </Box>

      <Box
        sx={{
          gap: "10px",
          position: "sticky",
          bottom: 0,
          background: "#F8F9FA",
          display: "flex",
          borderTop: `0.5px solid ${appColors.COMMON.SECONDARY_COLOR_6}`,

          padding: "5px 0",
          "& > button": {
            fontSize: "14px",
            lineHeight: "1.5",
            padding: "9px 12px",
          },
        }}
      >
        <Button
          onClick={() => {
            setExpandedGroupNames([]);
            handleApply(true);
          }}
          variant="outlined"
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <rect
                width="16"
                height="16"
                fill="white"
                fillOpacity="0.01"
                style={{ mixBlendMode: "multiply" }}
              />
              <path
                d="M14 8C14 9.18669 13.6481 10.3467 12.9888 11.3334C12.3295 12.3201 11.3925 13.0892 10.2961 13.5433C9.19975 13.9974 7.99335 14.1162 6.82946 13.8847C5.66558 13.6532 4.59648 13.0818 3.75736 12.2426C2.91825 11.4035 2.3468 10.3344 2.11529 9.17054C1.88378 8.00666 2.0026 6.80026 2.45673 5.7039C2.91085 4.60754 3.67989 3.67047 4.66658 3.01118C5.65328 2.35189 6.81331 2 8 2C9.68 2 11.2867 2.66667 12.4933 3.82667L14 5.33333M14 5.33333L14 2M14 5.33333H10.6667"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          sx={{
            border: "none",
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}
