import React from "react";
import axios from "axios";
import get from "lodash/get";
import remove from "lodash/remove";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Helmet } from "react-helmet-async";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { PageLoader } from "app/components/page-loader";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrantTargetsResults } from "./views/targets-results";
import { GrantOverview } from "app/pages/grant/views/overview";
import { DetailPageTabs } from "app/components/detail-page-tabs";
import { GrantDocuments } from "app/pages/grant/views/documents";
import { getGrantTabs } from "app/components/detail-page-tabs/data";
import { BarChartDataItem } from "app/components/charts/bar/data";
import { splitStringInMiddle } from "app/utils/splitStringInMiddle";
import { SankeyChartData } from "app/components/charts/sankey/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { GrantImplementation } from "app/pages/grant/views/grant-implementation";

export const Grant: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  const GRANT_TABS = React.useMemo(() => {
    return getGrantTabs(cmsData);
  }, [cmsData]);
  const navigate = useNavigate();
  const [notFound, setNotFound] = React.useState(false);
  const smallScreen = useMediaQuery("(max-width: 920px)");
  const params = useParams<{ id: string; ip: string; tab: string }>();

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
          title: string;
        }[];
        countryName: string;
        countryCode: string;
        principalRecipientId: string;
        principalRecipientName: string;
        principalRecipientShortrName: string;
        component: string;
        FPMName: string;
      },
  );
  const clearGrant = useStoreActions((actions) => actions.GrantInfo.clear);
  const fetchOverview = useStoreActions(
    (actions) => actions.GrantOverview.fetch,
  );
  const clearOverview = useStoreActions(
    (actions) => actions.GrantOverview.clear,
  );
  const dataDisbursementsBarChart = useStoreState(
    (state) =>
      get(
        state.GrantDisbursementsBarChart,
        "data.data",
        [],
      ) as BarChartDataItem[],
  );
  const fetchDisbursementsBarChart = useStoreActions(
    (actions) => actions.GrantDisbursementsBarChart.fetch,
  );
  const clearDisbursementsBarChart = useStoreActions(
    (actions) => actions.GrantDisbursementsBarChart.clear,
  );
  const dataBudgetSankeyChart = useStoreState(
    (state) =>
      get(state.GrantBudgetSankeyChart, "data.data[0]", {
        nodes: [],
        links: [],
      }) as SankeyChartData,
  );
  const fetchBudgetSankeyChart = useStoreActions(
    (actions) => actions.GrantBudgetSankeyChart.fetch,
  );
  const clearBudgetSankeyChart = useStoreActions(
    (actions) => actions.GrantBudgetSankeyChart.clear,
  );
  const clearExpendituresHeatmap = useStoreActions(
    (actions) => actions.FinancialInsightsExpendituresHeatmap.clear,
  );
  const fetchExpendituresHeatmap = useStoreActions(
    (actions) => actions.GrantExpendituresHeatmap.fetch,
  );
  const dataHasExpenditures = useStoreState(
    (state) =>
      get(
        state.GrantHasExpenditures,
        "data.data.hasExpenditures",
        false,
      ) as boolean,
  );
  const fetchHasExpenditures = useStoreActions(
    (actions) => actions.GrantHasExpenditures.fetch,
  );
  const dataTargetsResultsTable = useStoreState((state) =>
    get(state.GrantTargetsResultsTable, "data.data", []),
  );
  const fetchTargetsResults = useStoreActions(
    (actions) => actions.GrantTargetsResultsTable.fetch,
  );
  const fetchGrant = useStoreActions((actions) => actions.GrantInfo.fetch);

  const [dropdownSelected, setDropdownSelected] = React.useState<{
    code: string | number;
    name: string;
    title: string;
  } | null>(
    get(
      dataGrant.periods,
      `[${params.ip !== undefined ? parseInt(params.ip) - 1 : 0}]`,
      null,
    ),
  );

  const handleDropdownChange = (value: string) => {
    const selected = dataGrant.periods.find((p) => p.name === value);
    if (selected) {
      navigate(`/grant/${params.id}/${selected.code}/${params.tab}`, {
        replace: true,
      });
    }
  };

  const titleSplits = React.useMemo(() => {
    return splitStringInMiddle(dropdownSelected?.title || "");
  }, [dropdownSelected?.title]);

  const view = React.useMemo(() => {
    switch (params.tab) {
      case "overview":
        return <GrantOverview />;
      case "financial-insights":
        return <GrantImplementation />;
      case "targets-results":
        return <GrantTargetsResults />;
      case "documents":
        return <GrantDocuments />;
      default:
        return <div />;
    }
  }, [params.tab]);

  React.useEffect(() => {
    setDropdownSelected(
      get(
        dataGrant.periods,
        `[${params.ip !== undefined ? parseInt(params.ip) - 1 : 0}]`,
        null,
      ),
    );
  }, [params.ip]);

  React.useEffect(() => {
    if (!dropdownSelected && dataGrant.periods.length > 0) {
      setDropdownSelected(
        get(
          dataGrant.periods,
          `[${params.ip !== undefined ? parseInt(params.ip) - 1 : 0}]`,
          null,
        ),
      );
    }
  }, [dataGrant.periods]);

  React.useEffect(() => {
    if (params.id && dropdownSelected) {
      fetchOverview({
        routeParams: {
          code: params.id,
          ip: dropdownSelected.code.toString(),
        },
      });
      fetchDisbursementsBarChart({
        routeParams: {
          code: params.id,
          ip: dropdownSelected.code.toString(),
        },
      });
      fetchBudgetSankeyChart({
        routeParams: {
          code: params.id,
          ip: dropdownSelected.code.toString(),
          variant: "2",
        },
      });
      fetchHasExpenditures({
        filterString: `grantIP=${params.id}P0${dropdownSelected.code}`,
      });
      fetchExpendituresHeatmap({
        routeParams: {
          row: "module,intervention",
          column: "component",
          componentField: "activityAreaGroup",
          geographyGrouping: "Standard View",
        },
        filterString: `grantIP=${params.id}P0${dropdownSelected.code}`,
      });
      fetchTargetsResults({
        routeParams: {
          code: params.id,
          ip: dropdownSelected.code.toString(),
        },
      });
    }
  }, [params.id, dropdownSelected]);

  React.useEffect(() => {
    if (params.id && dataGrant.periods.length === 0) {
      fetchGrant({
        routeParams: {
          code: params.id,
        },
      });
    }
  }, [params.id, dataGrant.periods]);

  const tabs = React.useMemo(() => {
    const newTabs = [...GRANT_TABS];
    if (
      dataDisbursementsBarChart.length === 0 &&
      dataBudgetSankeyChart.nodes.length === 0 &&
      dataBudgetSankeyChart.links.length === 0 &&
      !dataHasExpenditures
    ) {
      remove(newTabs, (t) => t.label === GRANT_TABS[1].label);
    }
    // if (dataTargetsResultsTable.length === 0) {
    //   remove(newTabs, (t) => t.label === GRANT_TABS[2].label);
    // }
    return newTabs;
  }, [
    dataHasExpenditures,
    dataBudgetSankeyChart,
    dataTargetsResultsTable,
    dataDisbursementsBarChart,
    GRANT_TABS,
  ]);

  const checkIfGrantExists = async (id: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/grant/${id}`,
      );
      setNotFound(get(response, "data.data[0].code", "") === "");
    } catch {
      setNotFound(true);
    }
  };

  React.useEffect(() => {
    if (params.id) {
      checkIfGrantExists(params.id);
    }
    return () => {
      clearGrant();
      clearOverview();
      clearDisbursementsBarChart();
      clearBudgetSankeyChart();
      clearExpendituresHeatmap();
    };
  }, []);

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

  if (notFound) {
    return (
      <Box
        sx={{
          gap: "2px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 91px - 256px - 150px)",
        }}
      >
        Grant page with code "{params.id}" not found.
        <Link to="/grants">Go to grants page</Link>
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <link
          rel="canonical"
          href={`${window.location.origin}/grant/${params.id}/${params.ip}/${params.tab}`}
        />
      </Helmet>
      <Box padding="50px 0">
        <Typography variant="h1" lineHeight={1.2}>
          {params.id}
        </Typography>
        <Typography
          variant="h4"
          lineHeight={1}
          marginBottom="50px"
          sx={{
            "@media (max-width: 767px)": {
              marginBottom: 0,
            },
          }}
        >
          {smallScreen && dropdownSelected?.title}
          {!smallScreen &&
            titleSplits.map((s) => (
              <React.Fragment key={s}>
                {s}
                <br />
              </React.Fragment>
            ))}
        </Typography>
        {fullWidthDivider}
        <DetailPageTabs
          baseRoute={`/grant`}
          activeTab={`${params.ip}/${params.tab}`}
          tabs={tabs.map((t) => ({
            ...t,
            link: `/${params.ip}${t.link}`,
          }))}
          dropdown={{
            width: 280,
            handleDropdownChange,
            dropdownSelected: dropdownSelected?.name || "",
            dropdownItems: dataGrant.periods.map((p) => ({
              label: p.name,
              value: p.code.toString(),
            })),
          }}
        />
        {fullWidthDivider}
        <Box marginTop="40px">{view}</Box>
      </Box>
    </>
  );
};

export const PreGrant: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

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
  const fetchGrant = useStoreActions((actions) => actions.GrantInfo.fetch);

  React.useEffect(() => {
    if (params.id) {
      fetchGrant({
        routeParams: {
          code: params.id,
        },
      });
    }
  }, [params.id]);

  React.useEffect(() => {
    if (dataGrant.periods.length > 0) {
      navigate(
        `/grant/${params.id}/${
          dataGrant.periods[dataGrant.periods.length - 1].code
        }/overview`,
        { replace: true },
      );
    }
  }, [dataGrant.periods]);

  return (
    <Box>
      <PageLoader />
    </Box>
  );
};
