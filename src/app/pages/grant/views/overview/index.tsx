import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { useStoreState } from "app/state/store/hooks";
import { PageLoader } from "app/components/page-loader";
import { AnimateInView } from "app/components/animate-in-view";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { RaceBarChart } from "app/components/charts/race-bar";
import { ChartBlockButtonToolbar } from "app/components/chart-block/components/button-toolbar";

export const GrantOverview: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  const dataGrant = useStoreState(
    (state) =>
      get(state.GrantInfo, "data.data[0]", {
        code: "",
        title: "",
        periods: [],
        countryName: "",
        countryCode: "",
        principalRecipientId: "",
        principalRecipientName: "",
        principalRecipientShortrName: "",
        component: "",
        FPMName: "",
        FPMEmail: "",
      }) as {
        code: string;
        title: string;
        periods: {
          code: string | number;
          name: string;
        }[];
        countryName: string;
        countryCode: string;
        principalRecipientId: string;
        principalRecipientName: string;
        principalRecipientShortrName: string;
        component: string;
        FPMName: string;
        FPMEmail: string;
      },
  );
  const dataOverview = useStoreState((state) =>
    get(state.GrantOverview, "data.data[0]", {
      goals: [],
      status: "",
      objectives: [],
      disbursement: 0,
      commitment: 0,
      signed: 0,
    }),
  );
  const loadingOverview = useStoreState(
    (state) => state.GrantInfo.loading || state.GrantOverview.loading,
  );

  useTitle(`The Data Explorer - ${dataGrant.code}`);

  const statusColor = React.useMemo(() => {
    switch (dataOverview.status) {
      case "Active":
        return "#00A343";
      case "Closed":
        return "#FF0000";
      case "Financially Closed":
        return "#FFA500";
      default:
        return "#000";
    }
  }, [dataOverview.status]);

  const raceBarChartData = React.useMemo(() => {
    const disbursementPercentage =
      (dataOverview.disbursement / dataOverview.commitment) * 100;
    const commitmentPercentage =
      (dataOverview.commitment / dataOverview.signed) * 100;
    return [
      {
        name: "Disbursed",
        value: dataOverview.disbursement,
        color: "#0A2840",
        percentage: disbursementPercentage,
        sizePercentage: (disbursementPercentage * commitmentPercentage) / 100,
      },
      {
        name: "Committed",
        value: dataOverview.commitment,
        color: "#013E77",
        percentage: commitmentPercentage,
      },
      {
        name: "Signed",
        value: dataOverview.signed,
        color: "#00B5AE",
        percentage: 100,
      },
    ];
  }, [dataOverview.disbursement, dataOverview.commitment, dataOverview.signed]);

  const exportChartData = React.useMemo(() => {
    const disbursementPercentage =
      (dataOverview.disbursement / dataOverview.commitment) * 100;
    const commitmentPercentage =
      (dataOverview.commitment / dataOverview.signed) * 100;
    return {
      headers: ["Type", "Amount", "Percentage"],
      data: [
        ["Disbursed", dataOverview.disbursement, disbursementPercentage],
        ["Committed", dataOverview.commitment, commitmentPercentage],
        ["Signed", dataOverview.signed, 100],
      ],
    };
  }, [dataOverview.disbursement, dataOverview.commitment, dataOverview.signed]);

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

  return (
    <Box gap="24px" display="flex" flexDirection="column">
      {loadingOverview && <PageLoader />}
      <Grid
        container
        spacing={2}
        sx={{
          span: {
            lineHeight: 1.2,
          },
          a: {
            color: "#000",
            textDecoration: "none",
          },
          "> div": {
            position: "relative",
            "&:not(:last-of-type):after": {
              right: 0,
              bottom: 0,
              top: "21px",
              width: "1px",
              content: '""',
              height: "38px",
              background: "#000",
              position: "absolute",
              "@media (max-width: 1200px)": {
                display: "none",
              },
            },
            "> div > *": {
              maxWidth: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            },
          },
        }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Box gap="5px" display="flex" flexDirection="column">
            <Typography variant="body2" fontWeight="700" fontSize="16px">
              {getCMSDataField(
                cmsData,
                "pagesGrantOverview.portfolioManager",
                "Fund Portfolio Manager",
              )}
            </Typography>
            <Typography variant="body2">
              {dataGrant.FPMName}
              <br />
              <a href={`mailto:${dataGrant.FPMEmail}`}>{dataGrant.FPMEmail}</a>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Box gap="5px" display="flex" flexDirection="column">
            <Typography variant="body2" fontWeight="700" fontSize="16px">
              {getCMSDataField(
                cmsData,
                "pagesGrantOverview.grantStatus",
                "Grant Status",
              )}
            </Typography>
            <Typography
              gap="4px"
              display="flex"
              variant="body2"
              alignItems="center"
            >
              <Box
                width="8px"
                height="8px"
                borderRadius="50%"
                bgcolor={statusColor}
              />
              {dataOverview.status}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Box gap="5px" display="flex" flexDirection="column">
            <Typography variant="body2" fontWeight="700" fontSize="16px">
              {getCMSDataField(
                cmsData,
                "pagesGrantOverview.countryText",
                "Country",
              )}
            </Typography>
            <Typography variant="body2">{dataGrant.countryName}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Box gap="5px" display="flex" flexDirection="column">
            <Typography variant="body2" fontWeight="700" fontSize="16px">
              {getCMSDataField(
                cmsData,
                "pagesGrantOverview.componentText",
                "Component",
              )}
            </Typography>
            <Typography variant="body2">{dataGrant.component}</Typography>
          </Box>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={2}>
          <Box gap="5px" display="flex" flexDirection="column">
            <Typography variant="body2" fontWeight="700">
              Rating
            </Typography>
            <Typography variant="overline">-</Typography>
          </Box>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Box gap="5px" display="flex" flexDirection="column">
            <Typography variant="body2" fontWeight="700" fontSize="16px">
              {getCMSDataField(
                cmsData,
                "pagesGrantOverview.principalRecipient",
                "Principal Recipient",
              )}
            </Typography>
            <Typography variant="body2">
              {dataGrant.principalRecipientName}{" "}
              {dataGrant.principalRecipientShortrName}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {fullWidthDivider}
      <AnimateInView>
        <Box position="relative">
          <Box id="grant-overview-race-bar-chart">
            <RaceBarChart data={raceBarChartData} />
          </Box>
          <ChartBlockButtonToolbar
            infoType="global"
            chartData={exportChartData}
            exportName="grant-investments"
            hashId="grant-overview-race-bar-chart"
            blockId="grant-overview-race-bar-chart"
          />
        </Box>
      </AnimateInView>
      <Box>
        <Typography variant="body2" fontWeight="700" fontSize="16px">
          {getCMSDataField(cmsData, "pagesGrantOverview.goals", "Goals")}
        </Typography>
        <Typography variant="body2" fontSize="16px">
          {dataOverview.goals.map((goal: string, index: number) => (
            <React.Fragment key={index}>
              {goal}
              <br />
              <br />
            </React.Fragment>
          ))}
        </Typography>
      </Box>
      <Box marginBottom="32px">
        <Typography variant="body2" fontWeight="700" fontSize="16px">
          {getCMSDataField(
            cmsData,
            "pagesGrantOverview.objectives",
            "Objectives",
          )}
        </Typography>
        <Typography variant="body2" fontSize="16px">
          {dataOverview.objectives.map((objective: string, index: number) => (
            <React.Fragment key={index}>
              {objective}
              <br />
              <br />
            </React.Fragment>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};
