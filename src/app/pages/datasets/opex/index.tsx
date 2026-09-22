import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import Divider from "@mui/material/Divider";
import { Helmet } from "react-helmet-async";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { useStoreState } from "app/state/store/hooks";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { DatasetPage } from "app/pages/datasets/common/page";
import { OpexPageBlock1 } from "app/pages/datasets/opex/blocks/block-1";
import { OpexPageBlock2 } from "app/pages/datasets/opex/blocks/block-2";
import { OpexPageBlock3 } from "app/pages/datasets/opex/blocks/block-3";
// import { OpexPageBlock4 } from "app/pages/datasets/opex/blocks/block-4";
import { OpexPageBlock5 } from "app/pages/datasets/opex/blocks/block-5";
import { OpexPageBlock6 } from "app/pages/datasets/opex/blocks/block-6";
import { OpexPageBlock7 } from "app/pages/datasets/opex/blocks/block-7";
import { OpexPageBlock8 } from "app/pages/datasets/opex/blocks/block-8";

export const OpexPage = () => {
  useTitle("The Data Explorer - Financial Insights");
  const cmsData = useCMSData({ returnData: true });

  const years = useStoreState((state) => state.OpexYears.data);
  const startYear = get(years, "startYear", 0);
  const endYear = get(years, "endYear", 0);

  const handleResetFilters = () => {};
  const handleCancelFilters = () => {};
  const handleApplyFilters = () => {};

  const toolbarRightContent = React.useMemo(() => {
    return (
      <Box display="flex" alignItems="center">
        <Typography fontSize="14px">
          {endYear} actuals to <b>30 June {endYear}</b> · forecast thereafter ·
          updated <b>1 July {endYear}</b>
        </Typography>
      </Box>
    );
  }, []);

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${window.location.origin}/opex`} />
      </Helmet>
      <DatasetPage
        hideFilters
        title={getCMSDataField(
          cmsData,
          "pagesDatasetsOpex.title",
          "Operating expenditure, {years}",
        ).replace("{years}", `${startYear}-${endYear}`)}
        filterGroups={[]}
        appliedFilters={[]}
        handleResetFilters={handleResetFilters}
        subtitle={getCMSDataField(
          cmsData,
          "pagesDatasetsOpex.subtitle",
          "Nine years of operating cost actuals against budget across all cost lines: LFA fees, CCM funding, Secretariat and OIG, and non-recurring items. All figures in USD millions.",
        )}
        toolbarRightContent={toolbarRightContent}
        handleApplyFilters={handleApplyFilters}
        handleCancelFilters={handleCancelFilters}
      >
        <Box
          width="100%"
          marginTop="50px"
          sx={{ "> hr": { margin: "60px 0" } }}
        >
          <OpexPageBlock1 />
          <Divider />
          <OpexPageBlock2 />
          <Divider />
          <OpexPageBlock3 />
          <Divider />
          {/* <OpexPageBlock4 />
          <Divider /> */}
          <OpexPageBlock5 />
          <Divider />
          <OpexPageBlock6 />
          <Divider />
          <OpexPageBlock7 />
          <Divider />
          <OpexPageBlock8 />
        </Box>
      </DatasetPage>
    </>
  );
};
