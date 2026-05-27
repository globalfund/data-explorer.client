import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import TrendingUp from "@mui/icons-material/TrendingUp";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import ChartModalChartIcon from "app/assets/vectors/ChartModalChartIcon.svg?react";
import GitCompare from "app/assets/vectors/GitCompare.svg?react";
import Puzzle from "app/assets/vectors/Puzzle.svg?react";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { chartTypes } from "app/pages/report-builder/builder/components/chart/data";
import { getDefaultVisualOptions } from "app/pages/report-builder/builder/components/panel/elements-controller/chart/utils";
import { ChartType } from "app/state/api/action-reducers/report-builder/sync";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import WarningIcon from "app/assets/vectors/WarningIcon.svg?react";
import { ArrowForward } from "@mui/icons-material";
import { TableOptionIcon } from "app/pages/report-builder/builder/components/header/data";

type IntentId = "all" | "trend" | "compare" | "part" | "geographic" | "table";

type ChartSelectItem = (typeof chartTypes)[number] & {
  intent: IntentId[];
  tag: string;
  modalDescription: string;
  bestFor: string;
  technical: string;
};

const chartSelectItems: ChartSelectItem[] = chartTypes.map((item) => {
  const details: Record<
    string,
    Pick<
      ChartSelectItem,
      "intent" | "tag" | "modalDescription" | "bestFor" | "technical"
    >
  > = {
    bar: {
      intent: ["compare"],
      tag: "Compare",
      modalDescription:
        "Compare values across categories - switch to Grouped or Stacked for multi-series data.",
      bestFor:
        "Comparing disbursements by country, component, or grant period. Use Grouped to show Budget vs. Disbursement side by side. Use Stacked to show how components add up to a total.",
      technical:
        "Needs 1 category column + 1 numeric column. Grouped needs 2+ numeric columns. Stacked works best with 3-6 categories to avoid visual noise.",
    },
    line: {
      intent: ["trend"],
      tag: "Trend",
      modalDescription:
        "Show how values change over time - useful for cycles, periods, and year-on-year movement.",
      bestFor:
        "Tracking progress, disbursements, commitments, or results over time where direction matters more than individual category comparison.",
      technical:
        "Needs 1 time or ordered category column + 1 numeric column. Multi-series lines need a grouping dimension or multiple numeric columns.",
    },
    pie: {
      intent: ["part"],
      tag: "Proportion",
      modalDescription:
        "Show how parts make up a whole - best when you have fewer than 6 categories.",
      bestFor:
        "Showing simple shares, such as disease split, funding source mix, or allocation proportions.",
      technical:
        "Needs 1 category column + 1 numeric column. Keep categories limited so labels remain readable.",
    },
    scatter: {
      intent: ["compare"],
      tag: "Correlation",
      modalDescription:
        "Reveal relationships between two measures - does more funding lead to better outcomes?",
      bestFor:
        "Comparing two numeric measures across countries, grants, or periods to spot clusters and outliers.",
      technical:
        "Needs 2 numeric columns. Optional category or size fields can add grouping and emphasis.",
    },
    geomap: {
      intent: ["geographic"],
      tag: "Geographic",
      modalDescription:
        "Map values by country or location - best for geographic distribution and regional patterns.",
      bestFor:
        "Showing where funding, eligibility, grant activity, or result values are concentrated geographically.",
      technical:
        "Needs 1 geographic column + 1 numeric column. Location names must map cleanly to supported geographies.",
    },
    sankey: {
      intent: ["part"],
      tag: "Flow",
      modalDescription:
        "Show how values move from sources to destinations - ideal for funding allocation flows.",
      bestFor:
        "Explaining flows between source and target fields, such as funding movement across components or grant structures.",
      technical:
        "Needs source, target, and numeric value columns. Works best when the number of nodes is constrained.",
    },
    treemap: {
      intent: ["part"],
      tag: "Hierarchy",
      modalDescription:
        "Show proportions within a hierarchy - size reveals scale at a glance.",
      bestFor:
        "Comparing nested totals where hierarchy matters, such as portfolio, region, country, and disease breakdowns.",
      technical:
        "Needs 1 or more hierarchy columns + 1 numeric column. Keep hierarchy depth moderate for readability.",
    },
    heatmap: {
      intent: ["compare"],
      tag: "Intensity",
      modalDescription:
        "Spot patterns across two dimensions - where are the hotspots and gaps?",
      bestFor:
        "Comparing intensity across two categorical dimensions, such as countries by year or component by period.",
      technical:
        "Needs 2 category columns + 1 numeric column. Works best with a bounded matrix size.",
    },
    radar: {
      intent: ["compare"],
      tag: "Multivariate",
      modalDescription:
        "Compare multiple metrics for one or more subjects on a single view.",
      bestFor:
        "Showing profile-like comparisons across several measures for a small number of subjects.",
      technical:
        "Needs multiple numeric measures and a small subject set. Avoid using it for many categories.",
    },
  };

  return {
    ...item,
    ...(details[item.id] ?? {
      intent: ["all"],
      tag: "Chart",
      modalDescription: item.description,
      bestFor: item.description,
      technical:
        "Configure the required dimensions after selecting this chart.",
    }),
  };
});

const intentOptions: {
  id: IntentId;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "all", label: "All Charts", icon: <FolderOutlined /> },
  { id: "trend", label: "Show a Trend", icon: <TrendingUp /> },
  { id: "compare", label: "Compare Values", icon: <GitCompare /> },
  { id: "part", label: "Part-to-Whole", icon: <Puzzle /> },
  { id: "geographic", label: "Geographic", icon: <PlaceOutlined /> },
  { id: "table", label: "Table / Raw", icon: <TableOptionIcon /> },
];

const ChartSelectModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [search, setSearch] = React.useState("");
  const [selectedIntent, setSelectedIntent] = React.useState<IntentId>("all");
  const [selectedChartType, setSelectedChartType] = React.useState<string>("");

  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const { selectedItem: item, editItem } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const selectedType = selectedChartType || item?.data?.chartType || "";
  const selectedChart =
    chartSelectItems.find((chart) => chart.id === selectedType) ??
    chartSelectItems[0];

  const filteredCharts = React.useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return chartSelectItems.filter((chart) => {
      const matchesIntent =
        selectedIntent === "all" || chart.intent.includes(selectedIntent);
      const matchesSearch =
        searchTerm.length === 0 ||
        [chart.chartType, chart.description, chart.modalDescription, chart.tag]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);
      return matchesIntent && matchesSearch;
    });
  }, [search, selectedIntent]);

  React.useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedIntent("all");
      setSelectedChartType(item?.data?.chartType ?? "");
    }
  }, [item?.data?.chartType, open]);

  const handleConnectDataset = () => {
    if (!selectedController) return;
    setSelectedController({
      ...selectedController,
      extra: {
        ...selectedController.extra,
        chart: {
          ...selectedController.extra?.chart,
          listToDisplay: "dataset",
        },
      },
    });
  };

  const handleApply = () => {
    if (!item || !selectedType) return;
    const chartTypeUnchanged = item.data?.chartType === selectedType;
    const defaultOptions = getDefaultVisualOptions(selectedType);

    editItem({
      ...item,
      id: selectedController?.id || "",
      type: "chart",
      data: {
        ...item.data,
        mapping: chartTypeUnchanged ? item.data?.mapping : {},
        chartType: selectedType as ChartType,
        appliedFilters: chartTypeUnchanged ? item.data?.appliedFilters : {},
      },
      options: chartTypeUnchanged
        ? item.options
        : {
            ...defaultOptions,
            width: item.options?.width || defaultOptions.width,
            height: item.options?.height || defaultOptions.height,
          },
    });

    onClose();
  };

  return (
    <Modal disableScrollLock open={open} onClose={onClose}>
      <Box
        id="chart-controller"
        sx={{
          position: "absolute",
          top: "107px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 96px)",
          maxWidth: "1344px",
          maxHeight: "calc(100vh - 107px - 48px)",
          background: "#ffffff",
          border: "0.5px solid #98A1AA",
          borderRadius: "4px",
          boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          "@media (max-width: 900px)": {
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 32px)",
            maxHeight: "calc(100vh - 32px)",
          },
          "@media (max-width: 767px)": {
            top: 0,
            left: 0,
            width: "100%",
            height: "100dvh",
            maxHeight: "100dvh",
            borderRadius: 0,
            transform: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            padding: "20px",
            justifyContent: "space-between",
            borderBottom: "0.5px solid #CFD4DA",
            flexShrink: 0,
            "@media (max-width: 767px)": {
              padding: "14px 16px",
              alignItems: "flex-start",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              minWidth: 0,
              svg: {
                flexShrink: 0,
              },
            }}
          >
            <ChartModalChartIcon />
            <Box>
              <Typography
                variant="h2"
                fontSize={"20px"}
                lineHeight={"100%"}
                sx={{
                  marginBottom: "4px",
                  "@media (max-width: 767px)": {
                    fontSize: "18px",
                    lineHeight: 1.15,
                  },
                }}
              >
                Choose a Chart Type
              </Typography>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  "@media (max-width: 767px)": {
                    fontSize: "13px",
                  },
                }}
              >
                Select how you want to visualise your data
              </Typography>
            </Box>
          </Box>
          <IconButton
            sx={{
              width: "34px",
              height: "34px",
              borderRadius: "4px",
              border: `0.5px solid #CFD4DA`,
              flexShrink: 0,
            }}
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        {!item?.data?.dataset ? (
          <Box
            sx={{
              gap: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "0.5px solid #CFD4DA",
              background: "#F7F2DF",
              padding: "4px 16px",
              flexShrink: 0,
              "@media (max-width: 767px)": {
                gap: "8px",
                padding: "8px 16px",
                alignItems: "flex-start",
                flexDirection: "column",
              },
            }}
          >
            <Box
              sx={{
                gap: "16px",
                display: "flex",
                alignItems: "center",
                minWidth: 0,
                "@media (max-width: 767px)": {
                  gap: "8px",
                  alignItems: "flex-start",
                },
              }}
            >
              <WarningIcon />
              <Typography
                variant="body2"
                color="#000"
                fontSize={"16px"}
                sx={{
                  "@media (max-width: 767px)": {
                    fontSize: "13px",
                  },
                }}
              >
                No dataset connected yet. Chart recommendations will appear once
                you connect a dataset.
              </Typography>
            </Box>
            <Button
              onClick={handleConnectDataset}
              endIcon={
                <ArrowForward
                  sx={{
                    width: "16px",
                    height: "16px",
                    fill: "#3154F4",
                  }}
                />
              }
              sx={{
                fontSize: "14px",
                textTransform: "none",
                fontWeight: "400",
                color: "#252C34",
                whiteSpace: "nowrap",
                "@media (max-width: 767px)": {
                  padding: 0,
                },
              }}
            >
              Connect Dataset
            </Button>
          </Box>
        ) : null}
        <Box
          sx={{
            minHeight: 0,
            flex: 1,
            display: "grid",
            gridTemplateColumns: "188px minmax(420px, 1fr) 343px",
            overflow: "hidden",
            "@media (max-width: 1100px)": {
              gridTemplateColumns: "188px minmax(360px, 1fr)",
              "#chart-select-preview": {
                display: "none",
              },
            },
            "@media (max-width: 900px)": {
              gridTemplateColumns: "164px minmax(0, 1fr)",
            },
            "@media (max-width: 767px)": {
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              gap: "8px",
              display: "flex",
              padding: "16px 10px",
              flexDirection: "column",
              bgcolor: "#F8F9FA",
              borderRight: "0.5px solid #CFD4DA",
              minWidth: 0,
              overflow: "hidden",
              svg: {
                flexShrink: 0,
              },
              "@media (max-width: 767px)": {
                gap: "8px",
                padding: "8px 12px",
                borderRight: 0,
                borderBottom: "0.5px solid #CFD4DA",
                overflowX: "auto",
                flexShrink: 0,
                flexDirection: "row",
                alignItems: "center",
                "&::-webkit-scrollbar": {
                  height: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#98A1AA",
                },
              },
            }}
          >
            <Typography
              fontSize="16px"
              fontWeight={700}
              color="#000"
              sx={{
                flexShrink: 0,
                "@media (max-width: 767px)": {
                  fontSize: "14px",
                },
              }}
            >
              Intent
            </Typography>
            {intentOptions.map((intent) => {
              const active = intent.id === selectedIntent;
              return (
                <Button
                  key={intent.id}
                  onClick={() => setSelectedIntent(intent.id)}
                  startIcon={intent.icon}
                  sx={{
                    gap: "8px",
                    height: "32px",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: "400",
                    color: active ? "#3154F4" : "#000",
                    bgcolor: active ? "#EFF1FE" : "transparent",
                    border: active
                      ? "0.5px solid #3154F4"
                      : "0.5px solid transparent",
                    "&:hover": {
                      bgcolor: active ? "#EFF1FE" : "#F1F3F5",
                    },
                    ".MuiButton-startIcon": {
                      marginRight: 0,
                      marginLeft: 0,
                    },
                    svg: {
                      width: "16px",
                      height: "16px",
                    },
                    "@media (max-width: 900px)": {
                      padding: "6px 8px",
                    },
                    "@media (max-width: 767px)": {
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  {intent.label}
                </Button>
              );
            })}
          </Box>
          <Box
            sx={{
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              borderRight: "0.5px solid #CFD4DA",
              overflow: "hidden",
              "@media (max-width: 1100px)": {
                borderRight: 0,
              },
              "@media (max-width: 767px)": {
                flex: 1,
              },
            }}
          >
            <Box
              sx={{
                height: "50px",
                display: "flex",
                padding: "15px 16px",
                alignItems: "center",
                borderBottom: "0.5px solid #CFD4DA",
                flexShrink: 0,
                "@media (max-width: 767px)": {
                  height: "44px",
                  padding: "10px 12px",
                },
              }}
            >
              <Typography fontSize="16px" fontWeight={700} color="#252C34">
                {selectedIntent === "all"
                  ? "All Chart Types"
                  : intentOptions.find((intent) => intent.id === selectedIntent)
                      ?.label}
              </Typography>
            </Box>
            <Box
              sx={{
                padding: "8px 12px",
                borderBottom: "0.5px solid #CFD4DA",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "4px",
                  border: "0.5px solid #CFD4DA",
                  bgcolor: "#FFFFFF",
                  padding: "0 8px",
                }}
              >
                <SearchIcon sx={{ width: 16, height: 16, color: "#252C34" }} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search chart types..."
                  aria-label="Search chart types"
                  style={{
                    border: 0,
                    outline: 0,
                    width: "100%",
                    height: "100%",
                    fontSize: "14px",
                    marginLeft: "8px",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                gap: "8px",
                minHeight: 0,
                display: "grid",
                padding: "16px 12px",
                overflowY: "auto",
                gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
                alignContent: "start",
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#000",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#D9D9D9",
                },
                "@media (max-width: 900px)": {
                  gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
                },
                "@media (max-width: 767px)": {
                  padding: "12px",
                  gridTemplateColumns: "1fr",
                },
              }}
            >
              {filteredCharts.map((chart) => {
                const active = chart.id === selectedType;
                return (
                  <Box
                    key={chart.id}
                    onClick={() => setSelectedChartType(chart.id)}
                    sx={{
                      gap: "8px",
                      padding: "16px",
                      display: "flex",
                      cursor: "pointer",
                      minHeight: "226px",
                      minWidth: 0,
                      borderRadius: "4px",
                      position: "relative",
                      flexDirection: "column",
                      bgcolor: "#FFFFFF",
                      border: active
                        ? "1px solid #3154F4"
                        : "0.5px solid #98A1AA",
                      "&:hover": {
                        borderColor: "#3154F4",
                      },
                      justifyContent: "space-between",
                      "@media (max-width: 900px)": {
                        minHeight: "204px",
                        padding: "12px",
                      },
                      "@media (max-width: 767px)": {
                        minHeight: "auto",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        borderRadius: "4px",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: active ? "#EFF1FE" : "#F8F9FA",
                        svg: {
                          width: "80px",
                          height: "80px",
                        },
                        "svg path, svg rect": {
                          stroke: active ? "#3154F4" : "#ADB5BD",
                        },
                        padding: "7px",
                        "@media (max-width: 900px)": {
                          svg: {
                            width: "64px",
                            height: "64px",
                          },
                        },
                      }}
                    >
                      {chart.icon}
                    </Box>

                    <Box>
                      <Typography
                        fontSize="14px"
                        lineHeight="normal"
                        fontWeight={700}
                        color={active ? "#3154F4" : "#000000"}
                      >
                        {chart.chartType}
                      </Typography>
                      <Typography
                        mt="4px"
                        fontSize="14px"
                        lineHeight="normal"
                        color="#373D43"
                        sx={{
                          overflowWrap: "anywhere",
                        }}
                      >
                        {chart.modalDescription}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "fit-content",
                        borderRadius: "14px",
                        padding: "4px 8px",
                        bgcolor: active ? "#3154F4" : "#D6DDFD",
                      }}
                    >
                      <Typography
                        fontSize="14px"
                        lineHeight="normal"
                        color={active ? "#FFFFFF" : "#000000"}
                      >
                        {chart.tag}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
              {filteredCharts.length === 0 && (
                <Box
                  sx={{
                    padding: "32px",
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    color: "#373D43",
                  }}
                >
                  <Typography fontSize="14px">
                    No chart types match your search.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Box
            id="chart-select-preview"
            sx={{
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "50px",
                display: "flex",
                padding: "0 12px",
                alignItems: "center",
                borderBottom: "0.5px solid #CFD4DA",
                flexShrink: 0,
              }}
            >
              <Typography fontSize="16px" fontWeight={700} color="#252C34">
                Preview
              </Typography>
            </Box>
            <Box
              sx={{
                gap: "16px",
                padding: "16px",
                display: "flex",
                overflowY: "auto",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <Box
                sx={{
                  height: "128px",
                  display: "flex",
                  borderRadius: "4px",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#EFF1FE",
                  svg: {
                    width: "96px",
                    height: "96px",
                  },
                  "svg path, svg rect": {
                    stroke: "#3154F4",
                  },
                }}
              >
                {selectedChart.icon}
              </Box>
              {[
                ["Chart Type", selectedChart.chartType],
                ["Best for", selectedChart.bestFor],
                ["Technical", selectedChart.technical],
              ].map(([label, value]) => (
                <Box
                  key={label}
                  sx={{
                    paddingBottom: "16px",
                    borderBottom: "0.5px solid #CFD4DA",
                    "&:last-of-type": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <Typography fontSize="14px" fontWeight={700} color="#252C34">
                    {label}
                  </Typography>
                  <Typography mt="8px" fontSize="14px" color="#373D43">
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            gap: "16px",
            display: "flex",
            padding: "10px 16px",
            alignItems: "center",
            justifyContent: "flex-end",
            bgcolor: "#F8F9FA",
            borderTop: "0.5px solid #CFD4DA",
            flexShrink: 0,
            "@media (max-width: 767px)": {
              gap: "8px",
              padding: "10px 12px",
            },
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              height: "35px",
              padding: "6px 14px",
              borderRadius: "4px",
              border: "0.5px solid #98A1AA",
              bgcolor: "#FFFFFF",
              color: "#000000",
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "none",
              "@media (max-width: 767px)": {
                flex: 1,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedType}
            onClick={handleApply}
            endIcon={<ArrowForward sx={{ width: "18px", height: "18px" }} />}
            sx={{
              height: "35px",
              padding: "6px 14px",
              borderRadius: "4px",
              bgcolor: "#3154F4",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#2444D8",
              },
              "&.Mui-disabled": {
                color: "#FFFFFF",
                bgcolor: "#ADB5BD",
              },
              "@media (max-width: 767px)": {
                flex: 1,
              },
            }}
          >
            Use this Chart
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChartSelectModal;
