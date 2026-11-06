import React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { useCMSData } from "app/hooks/useCMSData";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputAdornment from "@mui/material/InputAdornment";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { RBDropdown } from "app/pages/report-builder/components/dropdown";
import PlusIcon from "app/assets/vectors/report-builder-responsive/plus.svg?react";
import CardIcon from "app/assets/vectors/report-builder-responsive/card.svg?react";
import ListIcon from "app/assets/vectors/report-builder-responsive/list.svg?react";
import SortIcon from "app/assets/vectors/report-builder-responsive/sort.svg?react";
import SearchIcon from "app/assets/vectors/report-builder-responsive/search.svg?react";
import NewFolderIcon from "app/assets/vectors/report-builder-responsive/new-folder.svg?react";

export const ReportBuilderToolbar: React.FC<{
  section: string;
  search: string;
  selectedSort: string;
  onNewFolderClick: () => void;
  onNewReportClick: () => void;
  selectedView: "cards" | "list";
  setSearch: (search: string) => void;
  setSelectedSort: (sort: string) => void;
  setSelectedView: (view: "cards" | "list") => void;
}> = ({
  section,
  search,
  setSearch,
  selectedView,
  setSelectedView,
  selectedSort,
  setSelectedSort,
  onNewFolderClick,
  onNewReportClick,
}) => {
  const cmsData = useCMSData({ returnData: true });
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  const templatesView = section === "templatesAndLayouts";
  const dropdownItems = React.useMemo(
    () => [
      {
        label: getCMSDataField(
          cmsData,
          "pagesReportBuilderMain.sortDateCreatedDesc",
          "Date Created DESC",
        ),
        value: "createdDate DESC",
      },
      {
        label: getCMSDataField(
          cmsData,
          "pagesReportBuilderMain.sortDateCreatedAsc",
          "Date Created ASC",
        ),
        value: "createdDate ASC",
      },
      {
        label: getCMSDataField(
          cmsData,
          "pagesReportBuilderMain.sortTitleAsc",
          "Title ASC",
        ),
        value: "name ASC",
      },
      {
        label: getCMSDataField(
          cmsData,
          "pagesReportBuilderMain.sortTitleDesc",
          "Title DESC",
        ),
        value: "name DESC",
      },
    ],
    [cmsData],
  );

  return (
    <Box
      sx={{
        zIndex: 1,
        gap: "20px",
        width: "100%",
        display: "flex",
        position: "relative",
        justifyContent: "space-between",
        button: {
          fontSize: "16px",
          textTransform: "none",
        },
      }}
    >
      {!isTabletOrMobile && (
        <Input
          value={search}
          disableUnderline
          inputProps={{ "data-cy": "rb-search" }}
          placeholder={getCMSDataField(
            cmsData,
            "pagesReportBuilderMain.searchPlaceholder",
            "Search",
          )}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon width={16} height={16} />
            </InputAdornment>
          }
          sx={{
            flexGrow: 1,
            fontSize: "14px",
            padding: "5px 8px",
            borderRadius: "4px",
            background: "#f1f3f5",
            border: "1px solid #98a1aa",
          }}
        />
      )}
      <Box
        sx={{
          gap: "1px",
          display: "flex",
          button: {
            borderRadius: 0,
            fontWeight: "400",
            padding: "8px 12px",
          },
          ...(templatesView &&
            isMobile && {
              width: "100%",
              "> button": {
                flex: 1,
                justifyContent: "center",
              },
            }),
        }}
      >
        <Button
          endIcon={<CardIcon width={16} height={16} />}
          onClick={() => setSelectedView("cards")}
          sx={{
            borderBottom: `2px solid ${selectedView === "cards" ? "#0f62fe" : "#cfd4da"}`,
          }}
        >
          {!isMobile || templatesView
            ? getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.cardViewButton",
                templatesView ? "Cards" : "Card",
              )
            : null}
        </Button>
        <Button
          endIcon={<ListIcon width={16} height={16} />}
          onClick={() => setSelectedView("list")}
          sx={{
            borderBottom: `2px solid ${selectedView === "list" ? "#0f62fe" : "#cfd4da"}`,
          }}
        >
          {!isMobile || templatesView
            ? getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.listViewButton",
                "List",
              )
            : null}
        </Button>
      </Box>
      {!templatesView && (
        <Box
          sx={{
            gap: "20px",
            display: "flex",
            "@media (max-width: 1024px)": {
              gap: "10px",
              alignItems: "flex-end",
            },
          }}
        >
          <RBDropdown
            height={45}
            width={220}
            fontSize="16px"
            fixedIcon={<SortIcon width={18} height={18} />}
            dropdownItems={dropdownItems}
            dropdownSelected={selectedSort}
            handleDropdownChange={(value) => setSelectedSort(value)}
          />
          <IconButton
            sx={{
              borderRadius: "4px",
              padding: "12px 14px",
              border: "1px solid #dfe3e5",
              "&:hover": {
                borderColor: "#3154f4",
                background: "transparent",
              },
            }}
            onClick={onNewFolderClick}
          >
            <NewFolderIcon width={18} height={18} />
          </IconButton>
          {!isTabletOrMobile && (
            <Button
              data-cy="rb-new-report"
              variant="contained"
              startIcon={<PlusIcon width={16} height={16} />}
              sx={{
                fontWeight: "400",
                color: "#ffffff",
                background: "#3154f4",
              }}
              onClick={onNewReportClick}
            >
              {getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.newReportButton",
                "New Report",
              )}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};
