import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CircularProgress from "@mui/material/CircularProgress";
import { capitalize } from "lodash";
import { useDeleteAsset, useGetAssets } from "app/hooks/queries/report-builder";
import { RBAssetModelResponse } from "app/state/api/action-reducers/report-builder/sync";
import {
  AssetViewType,
  ReportBuilderAssetsToolbar,
} from "app/pages/report-builder/main/components/all-assets-view/toolbar";
import ChartIcon from "app/assets/vectors/RBChart.svg?react";
import ColumnIcon from "app/assets/vectors/RBColumn.svg?react";
import LetterTextIcon from "app/assets/vectors/Letter_Text.svg?react";
import GridIcon from "app/assets/vectors/RBGrid.svg?react";
import ImageIcon from "app/assets/vectors/RBImage.svg?react";
import SearchIcon from "app/assets/vectors/Search_grants.svg?react";
import AssetLibraryFileIcon from "app/assets/vectors/AssetLibraryFile.svg?react";
import AssetLibraryFilesIcon from "app/assets/vectors/AssetLibraryFiles.svg?react";
import AssetLibraryCloseIcon from "app/assets/vectors/AssetLibraryClose.svg?react";
import AssetLibraryFolderIcon from "app/assets/vectors/AssetLibraryFolder.svg?react";
import AssetLibraryArrowRightIcon from "app/assets/vectors/AssetLibraryArrowRight.svg?react";
import { useStoreActions } from "app/state/store/hooks";
import { uniqueId } from "app/utils/uniqueId";
import { format } from "date-fns";

const sortOptions = [
  { label: "Updated", value: "updatedDate DESC" },
  { label: "Created", value: "createdDate DESC" },
  { label: "Name", value: "name ASC" },
];

const typeOptions: { label: string; value: AssetViewType }[] = [
  { label: "Type", value: "all" },
  { label: "Text", value: "text" },
  { label: "Chart", value: "chart" },
  { label: "Image", value: "image" },
  { label: "Column", value: "column" },
  { label: "Grid", value: "grid" },
];

const iconMap: Partial<Record<string, React.ReactNode>> = {
  chart: <ChartIcon />,
  column: <ColumnIcon />,
  text: <LetterTextIcon />,
  grid: <GridIcon />,
  image: <ImageIcon />,
};

const vectorIconSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const assetTypeLabel = (type: string) => {
  if (type === "kpi_box") return "Key Metrics";
  if (type === "section_divider") return "Section Divider";
  return capitalize(type);
};

const AssetCard: React.FC<{
  asset: RBAssetModelResponse;
  selected: boolean;
  onClick: () => void;
}> = ({ asset, selected, onClick }) => (
  <Box
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick();
      }
    }}
    sx={{
      gap: "12px",
      width: "100%",
      height: "fit-content",
      display: "flex",
      cursor: "pointer",
      padding: "16px",
      borderRadius: "4px",
      flexDirection: "column",
      border: selected ? "1px solid #3154f4" : "0.5px solid #cfd4da",
      outline: selected ? "1px solid #3154f4" : "none",
      "&:hover": {
        borderColor: "#3154f4",
      },
    }}
  >
    <Box
      sx={{
        height: "160px",
        display: "flex",
        overflow: "hidden",
        borderRadius: "2px",
        alignItems: "flex-start",
        justifyContent: "center",
        bgcolor: "#ffffff",
      }}
    >
      <Box
        sx={{
          mt: "8px",
          width: "183px",
          height: "218px",
          display: "flex",

          justifyContent: "center",
          div: {
            width: "calc(100% - 10px)",
            backgroundImage: `url(${import.meta.env.VITE_API}/asset-thumbnail/${asset.id}.png?v=${uniqueId()})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
          },
        }}
      >
        <div />
      </Box>
    </Box>
    <Box
      sx={{
        gap: "4px",
        display: "flex",
        width: "fit-content",
        borderRadius: "4px",
        alignItems: "center",
        padding: "3px 5px",
        bgcolor: "#d6ddfd",
        fontSize: "16px",
        color: "#252c34",
        svg: {
          width: "20px",
          height: "20px",
        },
      }}
    >
      {iconMap[asset.type] ?? <AssetLibraryFileIcon />}
      {assetTypeLabel(asset.type)}
    </Box>
    <Box>
      <Typography
        fontSize="16px"
        fontWeight={700}
        lineHeight="normal"
        color="#231d2c"
      >
        {asset.name}
      </Typography>
      <Typography fontSize="14px" lineHeight="normal" color="#373d43">
        Saved on {format(new Date(asset.createdDate), "dd-MM-yyyy")}
      </Typography>
    </Box>
  </Box>
);

const EmptyAssetsModalContent: React.FC = () => (
  <Box
    sx={{
      gap: "32px",
      width: "100%",
      height: "100%",
      display: "flex",
      padding: "32px",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        gap: "16px",
        width: "500px",
        display: "flex",
        maxWidth: "100%",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <AssetLibraryFolderIcon />
      <Box sx={{ textAlign: "center" }}>
        <Typography fontSize="20px" fontWeight={700} lineHeight="normal">
          No assets saved yet
        </Typography>
        <Typography fontSize="16px" lineHeight="normal" whiteSpace="pre-line">
          Save charts, text blocks, images, and layouts{"\n"}from any report to
          reuse them here instantly.
        </Typography>
      </Box>
    </Box>
    <Box
      component="section"
      sx={{
        gap: "8px",
        width: "100%",
        display: "flex",
        padding: "24px",
        borderRadius: "4px",
        flexDirection: "column",
        bgcolor: "#f8f9fa",
      }}
    >
      <Typography fontSize="16px" fontWeight={700} lineHeight="normal">
        How to save an asset
      </Typography>
      <Typography
        component="ol"
        fontSize="16px"
        lineHeight="normal"
        m={0}
        pl="24px"
      >
        <li>Select any element on your canvas</li>
        <li>Click ... -&gt; Save as Asset in the element menu</li>
        <li>It appears here, ready to drop into any report</li>
      </Typography>
    </Box>
  </Box>
);

export const AssetLibraryModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [search, setSearch] = React.useState("");
  const [selectedSort, setSelectedSort] = React.useState("updatedDate DESC");
  const [selectedView, setSelectedView] = React.useState<AssetViewType>("all");
  const [selectedAssetId, setSelectedAssetId] = React.useState<string | null>(
    null,
  );
  const addItem = useStoreActions(
    (actions) => actions.RBReportItemsState.addItem,
  );

  const assets = useGetAssets({
    search,
    sort: selectedSort,
    type: selectedView,
  });
  const deleteAsset = useDeleteAsset();

  const assetData = get(assets, "data.data", []) as RBAssetModelResponse[];
  const hasAssets = assetData.length > 0;
  const selectedAsset = assetData.find((asset) => asset.id === selectedAssetId);

  React.useEffect(() => {
    setSelectedAssetId(null);
  }, [selectedView, search]);

  const handleRemove = () => {
    if (!selectedAssetId) return;
    deleteAsset.mutate(selectedAssetId, {
      onSuccess: () => {
        setSelectedAssetId(null);
        assets.refetch();
      },
    });
  };
  const handleAddItem = () => {
    if (!selectedAsset) return;
    addItem({
      ...selectedAsset,
      open: true,
      id: uniqueId(),
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: "1060px",
            height: "80vh",
            maxWidth: "calc(100vw - 96px)",
            maxHeight: "calc(100vh - 155px)",
            borderRadius: "4px",
            border: "0.5px solid #98a1aa",
            boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
          },
        },
      }}
      sx={{
        zIndex: 1300,
        top: "59px",
        "& .MuiBackdrop-root": {
          top: "59px",
          bgcolor: "rgba(0, 0, 0, 0.20)",
        },
        "& .MuiDialog-container": {
          alignItems: "flex-start",
          paddingTop: "48px",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            p: "20px",
            display: "flex",
            alignItems: "center",
            borderBottom: "0.5px solid #cfd4da",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ gap: "8px", display: "flex", alignItems: "center" }}>
            <Box sx={{ ...vectorIconSx, width: 39, height: 39 }}>
              <AssetLibraryFilesIcon />
            </Box>
            <Box>
              <Typography fontSize="20px" fontWeight={700} lineHeight="normal">
                Asset Library
              </Typography>
              <Typography fontSize="16px" lineHeight="normal">
                {hasAssets
                  ? `${assetData.length} Assets saved`
                  : "Reusable charts, text blocks, images"}
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="Close asset library"
            onClick={onClose}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "4px",
              border: "0.5px solid #cfd4da",
            }}
          >
            <AssetLibraryCloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            gap: "16px",
            p: "8px 16px",
            display: "flex",
            bgcolor: "#f8f9fa",
            alignItems: "stretch",
            borderBottom: "0.5px solid #cfd4da",
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={search}
            placeholder="Search"
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              ".MuiInputBase-root": {
                height: "34px",
                fontSize: "14px",
                borderRadius: "4px",
                bgcolor: "#ffffff",
              },

              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "0.5px solid #98A1AA",
              },
            }}
          />
          <Select
            size="small"
            value={selectedSort}
            onChange={(event) => setSelectedSort(event.target.value)}
            sx={{
              height: "34px",
              minWidth: "103px",
              bgcolor: "#ffffff",
              flexShrink: 0,
            }}
            IconComponent={KeyboardArrowDownIcon}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={selectedView}
            onChange={(event) =>
              setSelectedView(event.target.value as AssetViewType)
            }
            sx={{
              height: "34px",
              minWidth: "76px",
              bgcolor: "#ffffff",
              flexShrink: 0,
            }}
            IconComponent={KeyboardArrowDownIcon}
          >
            {typeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ px: "16px", py: "8px" }}>
          <ReportBuilderAssetsToolbar
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            // overflow: "hidden",
          }}
        >
          {assets.isFetching ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : hasAssets ? (
            <Box
              className="scrollbar"
              sx={{
                px: "16px",
                gap: "16px",
                height: "100%",
                display: "grid",
                overflowY: "auto",
                paddingBottom: "16px",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                pt: "1px",
              }}
            >
              {assetData.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  selected={asset.id === selectedAssetId}
                  onClick={() => setSelectedAssetId(asset.id)}
                />
              ))}
            </Box>
          ) : (
            <EmptyAssetsModalContent />
          )}
        </Box>
        <Box
          sx={{
            gap: "16px",
            p: "16px",
            display: "flex",
            bgcolor: "#f8f9fa",
            alignItems: "center",
            justifyContent: "flex-end",
            borderTop: "0.5px solid #cfd4da",
          }}
        >
          {hasAssets ? (
            <Button
              variant="outlined"
              disabled={!selectedAsset}
              onClick={handleRemove}
              sx={{ textTransform: "none", fontSize: "16px" }}
            >
              Remove from Library
            </Button>
          ) : null}
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: "none", fontSize: "16px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={hasAssets && !selectedAsset}
            endIcon={<AssetLibraryArrowRightIcon />}
            onClick={hasAssets ? handleAddItem : onClose}
            sx={{
              color: "#ffffff",
              fontSize: "16px",
              borderRadius: "4px",
              textTransform: "none",
              bgcolor: hasAssets && !selectedAsset ? "#dfe3e5" : "#3154f4",
              "&:hover": {
                bgcolor: hasAssets && !selectedAsset ? "#dfe3e5" : "#2542c7",
              },
            }}
          >
            {hasAssets ? "Place on Canvas" : "Go Back to Report"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
