import React from "react";
import Box from "@mui/material/Box";
import uniqueId from "lodash/uniqueId";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { OpexPageChartBlockData } from "app/pages/datasets/opex/blocks/common/data";
import { ChartBlockButtonToolbar } from "app/components/chart-block/components/button-toolbar";

export const OpexPageChartBlock: React.FC<OpexPageChartBlockData> = (props) => {
  const id = React.useMemo(() => uniqueId("chart-block-"), []);

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

  return (
    <Box id={props.id} data-cy="opex-chart-block" position="relative">
      <Box
        id={`anchor-${props.id}`}
        sx={{
          left: 0,
          zIndex: -1,
          top: "-58px",
          position: "absolute",
        }}
      />
      <Typography variant="h2" lineHeight={1.2} mb="8px">
        {props.title}
      </Typography>
      <Typography variant="h3" fontSize="36px" mb="8px">
        {props.subtitle}
      </Typography>
      <Box
        sx={{
          gap: "24px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        {!props.loading ? (
          <Typography color="#373D43" fontSize="20px" lineHeight="normal">
            {props.text}
          </Typography>
        ) : (
          <Skeleton
            variant="text"
            sx={{ width: "300px", lineHeight: 1.4, fontSize: "20px" }}
          />
        )}
        {props.views && props.onViewChange && props.viewSelected && (
          <Box
            sx={{
              gap: "4px",
              padding: "4px",
              display: "flex",
              borderRadius: "4px",
              flexDirection: "row",
              bgcolor: "#F8F9FA",
              border: "1px solid #CFD4DA",
              "> button": {
                cursor: "pointer",
                color: "#252C34",
                textWrap: "nowrap",
                padding: "8px 24px",
                borderRadius: "4px",
                bgcolor: "transparent",
                border: "1px solid transparent",
              },
            }}
          >
            {props.views.map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => props.onViewChange && props.onViewChange(view)}
                style={
                  props.viewSelected === view
                    ? {
                        color: "#3154F4",
                        background: "#EFF1FE",
                        borderColor: "#3154F4",
                        boxShadow:
                          "0 0.723px 1.447px 0 rgba(97, 97, 97, 0.20), 0 1.447px 2.894px 0 rgba(97, 97, 97, 0.20)",
                      }
                    : {}
                }
              >
                {view}
              </button>
            ))}
          </Box>
        )}
      </Box>
      <Divider
        sx={{
          margin: "20px 0",
          "@media (max-width: 767px)": {
            margin: "10px 0",
            borderColor: "#fff",
          },
        }}
      />
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
          justifyContent="flex-end"
        >
          <ChartBlockButtonToolbar
            blockId={id}
            hashId={props.id}
            chartData={props.data}
            infoType={props.infoType}
            exportName={props.exportName}
            chartType={props.viewSelected}
          />
        </Box>
      </Box>
    </Box>
  );
};
