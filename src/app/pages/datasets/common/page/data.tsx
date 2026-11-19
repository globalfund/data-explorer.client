import React from "react";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { FilterGroupModel } from "app/components/filters/list/data";

export interface DatasetPageProps {
  title: string;
  subtitle: string;
  hideFilters?: boolean;
  appliedFilters: string[];
  children: React.ReactNode;
  handleResetFilters: () => void;
  filterGroups: FilterGroupModel[];
  toolbarRightContent?: React.ReactNode;
  handleApplyFilters: () => void;
  handleCancelFilters: () => void;
}

export const TooltipTitle = () => {
  const cmsData = useCMSData({ returnData: true });

  return (
    <React.Fragment>
      <Typography fontSize="12px" fontWeight="700">
        {getCMSDataField(
          cmsData,
          "pagesDatasets.filtersTooltipTitle",
          "Global Filtering",
        )}
      </Typography>
      <Typography
        fontSize="12px"
        marginTop="8px"
        dangerouslySetInnerHTML={{
          __html: getCMSDataField(
            cmsData,
            "pagesDatasets.filtersTooltipContent",
            `This filter will be affecting the datasets and indicators throughout the
              page and will be shown in <span style="color: #FF9800">orange</span>. 
              Whereas, showcased datasets have their local filtering that is
            represented in <span style="color: #2196F3">light blue</span>.`,
          ),
        }}
      />
    </React.Fragment>
  );
};
