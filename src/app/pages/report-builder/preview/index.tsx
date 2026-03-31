import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { Empty } from "app/pages/report-builder/builder/components/empty";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { ReportBuilderPageGrid } from "app/pages/report-builder/builder/components/grid";
import { ReportBuilderPageText } from "app/pages/report-builder/builder/components/text";
import { ReportBuilderPageChart } from "app/pages/report-builder/builder/components/chart";
import { ReportBuilderPageTable } from "app/pages/report-builder/builder/components/table";
import { ReportBuilderPageImage } from "app/pages/report-builder/builder/components/image";

import { useParams } from "react-router-dom";
import { useGetReport } from "app/hooks/queries/report-builder";
import KPIBox from "../builder/components/kpi";
import { CircularProgress, Typography } from "@mui/material";
import SectionDivider from "../builder/components/section-divider";
import ViewModeContainer from "../builder/components/order-container/view";

export const ReportBuilderPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const reportQuery = useGetReport(id);
  const reportData = reportQuery?.data?.data;

  const setActiveReport = useStoreActions(
    (actions) => actions.RBReportItemsState.setReport,
  );

  const resetReport = useStoreActions(
    (actions) => actions.RBReportItemsState.resetReport,
  );

  const reportState = useStoreState((state) => state.RBReportItemsState);

  const items = React.useMemo(() => {
    return reportState.items.filter((item) => {
      switch (item.type) {
        case "text":
          return item.data.rte;
        case "chart":
          return item.data.chartType;
        case "kpi_box":
          return item.open;
        default:
          return true;
      }
    });
  }, [reportState.items]);

  const addedItemRef = React.useRef(items.length > 0);

  useEffect(() => {
    if (reportData) {
      setActiveReport(reportData);
    }
    return () => {
      resetReport();
    };
  }, [reportData]);

  const getItemByType = (item: RBReportItem) => {
    switch (item.type) {
      case "text":
        return (
          <ViewModeContainer>
            <ReportBuilderPageText
              id={item.id}
              focus={item.focus}
              initialKey={item.key}
              viewMode
            />
          </ViewModeContainer>
        );
      case "chart":
        return (
          <ViewModeContainer>
            <ReportBuilderPageChart id={item.id} viewMode />
          </ViewModeContainer>
        );
      case "table":
        return (
          <ViewModeContainer>
            <ReportBuilderPageTable id={item.id} viewMode />
          </ViewModeContainer>
        );
      case "image":
        return (
          <ViewModeContainer>
            <ReportBuilderPageImage id={item.id} viewMode />
          </ViewModeContainer>
        );
      case "grid":
        return (
          <ViewModeContainer>
            <ReportBuilderPageGrid
              columns={item.data.columns}
              rows={item.data.rows}
              id={item.id}
              viewMode
            />
          </ViewModeContainer>
        );
      case "kpi_box":
        return (
          <ViewModeContainer>
            <KPIBox id={item.id} viewMode />
          </ViewModeContainer>
        );
      case "column":
        return (
          <ViewModeContainer>
            <ReportBuilderPageGrid
              rows={1}
              columns={item.data.columns}
              id={item.id}
              viewMode
            />
          </ViewModeContainer>
        );
      case "section_divider":
        return (
          <ViewModeContainer>
            <SectionDivider id={item.id} viewMode />
          </ViewModeContainer>
        );
      default:
        return <React.Fragment />;
    }
  };

  React.useEffect(() => {
    if (items.length === 0) {
      addedItemRef.current = false;
    } else {
      addedItemRef.current = true;
    }
  }, [items.length]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: "30px",
        }}
      >
        <Typography variant="body2" color="white" marginBottom={"6.8px"}>
          Prepared using
        </Typography>
        <svg
          width="229"
          height="38"
          viewBox="0 0 229 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.8944 4.02754H0V0.227539H14.4248V4.02754H9.5152V15.9139H4.8944V4.02754Z"
            fill="white"
          />
          <path
            d="M16.918 0.227539H21.5388V6.01874H26.9044V0.227539H31.5252V15.9139H26.9044V9.62114H21.5388V15.9139H16.918V0.227539Z"
            fill="white"
          />
          <path
            d="M34.4453 0.227539H46.5141V3.87554H38.9141V6.48994H46.0885V9.49954H38.9141V12.2811H46.7269V15.9139H34.4453V0.227539Z"
            fill="white"
          />
          <path
            d="M54.6904 8.132C54.6904 3.2832 58.3992 0 63.5064 0C67.2 0 70.3464 2.0672 71.1064 4.9704L66.8656 5.776C66.5702 5.14316 66.0928 4.61279 65.4945 4.25268C64.8961 3.89257 64.2039 3.71909 63.5064 3.7544C62.9367 3.74276 62.3707 3.84946 61.8443 4.06776C61.3179 4.28606 60.8425 4.61121 60.4483 5.02264C60.054 5.43408 59.7493 5.92286 59.5536 6.45806C59.3579 6.99327 59.2754 7.56326 59.3112 8.132C59.284 8.71507 59.377 9.29751 59.5844 9.84311C59.7918 10.3887 60.1093 10.8858 60.517 11.3035C60.9247 11.7212 61.414 12.0506 61.9544 12.2712C62.4949 12.4917 63.0749 12.5987 63.6584 12.5856C64.5466 12.6741 65.435 12.4196 66.1416 11.8741C66.8481 11.3287 67.3192 10.5337 67.4584 9.652H62.1384V6.9008H71.8816C72.4592 12.464 68.9328 16.3096 63.552 16.3096C58.4448 16.3096 54.736 12.9352 54.736 8.0712L54.6904 8.132Z"
            fill="white"
          />
          <path
            d="M74.5117 0.243164H79.1325V11.9776H85.8965V15.9144H74.5117V0.243164Z"
            fill="white"
          />
          <path
            d="M100.563 8.132C100.598 7.56289 100.515 6.99277 100.321 6.45669C100.127 5.92062 99.8252 5.42993 99.4343 5.01481C99.0435 4.59968 98.5719 4.26889 98.0485 4.04279C97.5251 3.81669 96.961 3.70005 96.3909 3.70005C95.8207 3.70005 95.2566 3.81669 94.7332 4.04279C94.2098 4.26889 93.7382 4.59968 93.3474 5.01481C92.9566 5.42993 92.6548 5.92062 92.4607 6.45669C92.2665 6.99277 92.1841 7.56289 92.2185 8.132C92.1841 8.70111 92.2665 9.27123 92.4607 9.80731C92.6548 10.3434 92.9566 10.8341 93.3474 11.2492C93.7382 11.6643 94.2098 11.9951 94.7332 12.2212C95.2566 12.4473 95.8207 12.564 96.3909 12.564C96.961 12.564 97.5251 12.4473 98.0485 12.2212C98.5719 11.9951 99.0435 11.6643 99.4343 11.2492C99.8252 10.8341 100.127 10.3434 100.321 9.80731C100.515 9.27123 100.598 8.70111 100.563 8.132ZM87.5977 8.132C87.5977 3.1464 91.1393 0 96.3985 0C101.658 0 105.184 3.0856 105.184 8.132C105.184 13.1784 101.627 16.2488 96.3377 16.2488C91.0481 16.2488 87.5977 13.072 87.5977 8.132Z"
            fill="white"
          />
          <path
            d="M115.111 12.5851C116.342 12.5851 117.254 11.9163 117.254 10.9739C117.254 10.0315 116.342 9.36274 115.111 9.36274H112.284V12.5851H115.111ZM114.807 6.50514C115.993 6.50514 116.813 5.89714 116.813 4.98514C116.813 4.07314 115.993 3.46514 114.807 3.46514H112.284V6.41394L114.807 6.50514ZM107.663 0.227539H115.704C119.397 0.227539 121.586 1.92994 121.586 4.55954C121.599 5.26927 121.387 5.96487 120.98 6.54653C120.573 7.12818 119.993 7.566 119.321 7.79714V8.02514C120.117 8.2402 120.817 8.71726 121.308 9.37923C121.799 10.0412 122.052 10.8494 122.027 11.6731C122.027 14.3635 119.777 15.8987 116.114 15.8987H107.663V0.242739V0.227539Z"
            fill="white"
          />
          <path
            d="M133.654 10.2448L131.86 4.16476H131.632L129.838 10.2448H133.654ZM128.349 0.243164H135.143L140.038 15.9144H135.295L134.55 13.528H128.926L128.258 15.9144H123.5L128.425 0.243164H128.349Z"
            fill="white"
          />
          <path
            d="M142.668 0.243164H147.289V11.9776H154.053V15.9144H142.668V0.243164Z"
            fill="white"
          />
          <path
            d="M162.748 0.227539H174.741V4.17954H167.369V6.80914H173.738V10.2595H167.369V15.9139H162.748V0.227539Z"
            fill="white"
          />
          <path
            d="M177.675 9.46957V0.243164H182.235V9.36317C182.176 9.75665 182.203 10.1582 182.314 10.5404C182.424 10.9226 182.616 11.2765 182.876 11.5779C183.135 11.8793 183.457 12.1212 183.819 12.287C184.18 12.4527 184.573 12.5386 184.971 12.5386C185.369 12.5386 185.762 12.4527 186.124 12.287C186.486 12.1212 186.807 11.8793 187.067 11.5779C187.327 11.2765 187.518 10.9226 187.629 10.5404C187.739 10.1582 187.766 9.75665 187.707 9.36317V0.243164H192.267V9.46957C192.267 13.6192 189.227 16.2488 184.911 16.2488C180.594 16.2488 177.554 13.6192 177.554 9.46957H177.675Z"
            fill="white"
          />
          <path
            d="M195.533 0.227539H200.488L205.626 9.95554H205.854V0.227539H210.156V15.9139H205.216L200.063 6.21634H199.85V15.9139H195.533V0.227539Z"
            fill="white"
          />
          <path
            d="M219.746 12.4336C220.324 12.4732 220.904 12.3896 221.447 12.1882C221.99 11.9869 222.484 11.6725 222.897 11.2658C223.309 10.8591 223.631 10.3694 223.84 9.8291C224.048 9.28885 224.14 8.71036 224.109 8.13197C224.147 7.54987 224.06 6.96633 223.854 6.42053C223.648 5.87473 223.328 5.37931 222.915 4.96754C222.502 4.55577 222.005 4.23719 221.459 4.03318C220.912 3.82918 220.328 3.74447 219.746 3.78477H217.831V12.4944L219.746 12.4336ZM213.362 0.273564H219.746C225.142 0.273564 228.73 3.40476 228.73 8.10156C228.73 12.7984 225.142 15.9448 219.746 15.9448H213.377V0.243164L213.362 0.273564Z"
            fill="white"
          />
          <path
            d="M1.62891 37.1615V21.7115H7.30458C9.20439 21.7115 10.7242 22.2412 11.6741 23.1462C12.5053 23.9187 12.9803 25.0222 12.9803 26.3244V26.3686C12.9803 28.8185 11.3417 30.2973 9.03816 30.827L13.5027 37.1615H11.3654L7.18584 31.1581H3.40998V37.1615H1.62891ZM3.40998 29.6572H6.99586C9.70309 29.6572 11.1992 28.3991 11.1992 26.4348V26.3907C11.1992 24.3601 9.67934 23.2345 7.18584 23.2345H3.40998V29.6572Z"
            fill="white"
          />
          <path
            d="M19.7031 37.1615V21.7115H29.8433V23.2345H21.4841V28.6199H28.9884V30.1207H21.4841V35.6385H29.962V37.1615H19.7031Z"
            fill="white"
          />
          <path
            d="M36.4785 37.1615V21.7115H41.4893C45.0276 21.7115 47.3312 23.5655 47.3312 26.6114V26.6555C47.3312 29.9221 44.6714 31.6878 41.2755 31.7098H38.2596V37.1615H36.4785ZM38.2596 30.209H41.323C43.9115 30.209 45.5263 28.8185 45.5263 26.6996V26.6776C45.5263 24.4263 43.9115 23.2345 41.3943 23.2345H38.2596V30.209Z"
            fill="white"
          />
          <path
            d="M60.0159 37.4042C55.7651 37.4042 52.8679 34.0715 52.8679 29.5468V29.3703C52.8679 24.8236 55.8126 21.4688 60.0396 21.4688C64.2667 21.4688 67.1639 24.8015 67.1639 29.3261V29.5027C67.1639 34.0494 64.243 37.4042 60.0159 37.4042ZM60.0396 35.8813C63.1031 35.8813 65.3354 33.2548 65.3354 29.5248V29.3703C65.3354 25.6402 63.0793 22.9917 60.0159 22.9917C56.9525 22.9917 54.7202 25.6182 54.7202 29.3482V29.5027C54.7202 33.2328 56.9762 35.8813 60.0396 35.8813Z"
            fill="white"
          />
          <path
            d="M73.8327 37.1615V21.7115H79.5084C81.4082 21.7115 82.9281 22.2412 83.878 23.1462C84.7091 23.9187 85.1841 25.0222 85.1841 26.3244V26.3686C85.1841 28.8185 83.5455 30.2973 81.242 30.827L85.7065 37.1615H83.5693L79.3897 31.1581H75.6138V37.1615H73.8327ZM75.6138 29.6572H79.1997C81.9069 29.6572 83.403 28.3991 83.403 26.4348V26.3907C83.403 24.3601 81.8832 23.2345 79.3897 23.2345H75.6138V29.6572Z"
            fill="white"
          />
          <path
            d="M95.2835 37.1615V23.2565H90.629V21.7115H101.743V23.2565H97.0646V37.1615H95.2835Z"
            fill="white"
          />
          <path
            d="M117.434 37.1615V21.7115H123.062C124.819 21.7115 126.244 22.175 127.17 23.0358C127.859 23.6759 128.263 24.5367 128.263 25.574V25.6182C128.263 27.6708 126.909 28.7081 125.532 29.2158C127.479 29.7455 128.975 30.827 128.975 32.9238V32.99C128.975 35.6165 126.672 37.1615 123.181 37.1615H117.434ZM126.458 25.8389V25.7947C126.458 24.2056 125.175 23.2124 122.967 23.2124H119.215V28.6419H122.801C125.009 28.6419 126.458 27.6266 126.458 25.8389ZM127.17 32.8355C127.17 31.1139 125.722 30.0986 123.038 30.0986H119.215V35.6606H123.252C125.65 35.6606 127.17 34.6453 127.17 32.8796V32.8355Z"
            fill="white"
          />
          <path
            d="M141.185 37.4042C137.647 37.4042 135.248 35.2854 135.248 31.4008V21.7115H137.029V31.3567C137.029 34.2701 138.62 35.8813 141.233 35.8813C143.774 35.8813 145.389 34.3584 145.389 31.4229V21.7115H147.17V31.3126C147.17 35.2854 144.771 37.4042 141.185 37.4042Z"
            fill="white"
          />
          <path
            d="M154.467 37.1615V21.7115H156.248V37.1615H154.467Z"
            fill="white"
          />
          <path
            d="M163.702 37.1615V21.7115H165.483V35.6385H173.201V37.1615H163.702Z"
            fill="white"
          />
          <path
            d="M179.341 37.1615V21.7115H184.043C188.674 21.7115 191.856 24.8015 191.856 29.3482V29.5027C191.856 34.0273 188.674 37.1615 184.043 37.1615H179.341ZM183.995 23.2345H181.122V35.6385H183.995C187.629 35.6385 190.003 33.1886 190.003 29.5248V29.3703C190.003 25.7064 187.629 23.2345 183.995 23.2345Z"
            fill="white"
          />
          <path
            d="M198.528 37.1615V21.7115H208.668V23.2345H200.309V28.6199H207.813V30.1207H200.309V35.6385H208.787V37.1615H198.528Z"
            fill="white"
          />
          <path
            d="M215.303 37.1615V21.7115H220.979C222.879 21.7115 224.399 22.2412 225.349 23.1462C226.18 23.9187 226.655 25.0222 226.655 26.3244V26.3686C226.655 28.8185 225.016 30.2973 222.713 30.827L227.177 37.1615H225.04L220.86 31.1581H217.085V37.1615H215.303ZM217.085 29.6572H220.67C223.378 29.6572 224.874 28.3991 224.874 26.4348V26.3907C224.874 24.3601 223.354 23.2345 220.86 23.2345H217.085V29.6572Z"
            fill="white"
          />
        </svg>
      </Box>
      {reportQuery.isLoading && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {!reportQuery.isLoading && (
        <Box
          id="items-container"
          className="scrollbar"
          sx={{
            gap: "10px",
            display: "flex",
            maxWidth: "100%",
            overflow: "overlay",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: reportData?.settings.width
              ? `${reportData?.settings.width}px`
              : "100%",
            bgcolor: reportData?.settings?.backgroundColor,
            borderRadius: `${reportData?.settings.borderRadius}px`,
            p: reportData?.settings?.padding
              ?.map((p: string) => `${p}px`)
              .join(" "),
            border: `${reportData?.settings?.stroke}px solid ${reportData?.settings?.strokeColor}`,
            ".top-right-actions": {
              top: 4,
              right: 4,
              position: "absolute",
              ".MuiIconButton-root": {
                width: "38px",
                height: "38px",
                bgcolor: "#fff",
                borderRadius: "4px",
                border: "1px solid #cfd4da",
                "&:hover": {
                  bgcolor: "#f8f8f8",
                  borderColor: "#000000",
                },
              },
            },
          }}
        >
          {items.length === 0 && <Empty />}
          {items.map((item) => (
            <React.Fragment key={item.id}>{getItemByType(item)}</React.Fragment>
          ))}
        </Box>
      )}
      <Typography
        variant="body2"
        color="white"
        marginTop={"30px"}
        textAlign={"center"}
      >
        The content produced using the The Global Fund Report Builder is
        prepared by the user and does not constitute an official output or
        <br />
        approved information from The Global Fund. TGF is not responsible for
        the accuracy or validity of the content generated through this tool.
      </Typography>
    </Box>
  );
};
