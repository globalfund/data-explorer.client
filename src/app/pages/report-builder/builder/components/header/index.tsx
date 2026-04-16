import React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import { NavLink, useParams, Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import CopyIcon from "app/assets/vectors/Copy.svg?react";
import EmailIcon from "app/assets/vectors/Email.svg?react";
import PNGIcon from "app/assets/vectors/PngIcon.svg?react";
import SVGIcon from "app/assets/vectors/SvgIcon.svg?react";
import PDFIcon from "app/assets/vectors/PdfIcon.svg?react";
import ShareIcon from "app/assets/vectors/Share2.svg?react";
import FolderIcon from "app/assets/vectors/Folder2.svg?react";
import PreviewIcon from "app/assets/vectors/Preview.svg?react";
import LibraryIcon from "app/assets/vectors/Library.svg?react";
import DownloadIcon from "app/assets/vectors/Download.svg?react";
import ChevronRight from "@mui/icons-material/ChevronRightOutlined";
import HeaderToolbarMiniLogo from "app/assets/vectors/HeaderToolbarMiniLogo.svg?react";
import LoaderSpinner from "app/assets/vectors/ReportBuilderAutoSaveSpinner.svg?react";
import ErrorIcon from "app/assets/vectors/ReportBuilderAutoSaveError.svg?react";
import WarningIcon from "app/assets/vectors/ReportBuilderAutoSaveWarning.svg?react";
import CompleteIcon from "app/assets/vectors/ReportBuilderCompleteIcon.svg?react";
import AddComponent from "./add-component";
import { Divider, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import { usePatchReport } from "app/hooks/queries/report-builder";
import { useDebounce } from "react-use";
import { useStoreState } from "app/state/store/hooks";
import { exportReport } from "app/utils/exportReport";
import axios from "axios";

export const menuSx = {
  zIndex: 1400,
  "& .MuiPaper-root": {
    borderRadius: "4px",
    background: "#f8f9fa",
    border: "1px solid #dfe3e5",
    boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.30)",
  },
  "& .MuiList-root": {
    padding: "0px",
  },
  "& .MuiMenuItem-root": {
    gap: "10px",
    display: "flex",
    fontSize: "14px",
    padding: "11px 16px",
    alignItems: "center",
    borderBottom: "1px solid #c6c6c6",
    "&:last-of-type": { borderBottomStyle: "none" },
  },
};

export const ReportBuilderPageHeader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);

  const reportState = useStoreState((state) => state.RBReportItemsState);

  const updateReport = usePatchReport(id);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleCopyUrlLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarMessage("Link Copied!");
    setSnackbarOpen(true);
  };

  const handleSendViaEmail = () => {
    window.open(`mailto:?body=${window.location.href}`, "_blank");
    setSnackbarMessage("Directed to Email!");
    setSnackbarOpen(true);
  };

  const handleDownloadShareableFile =
    (type: "png" | "svg" | "pdf") => async () => {
      await exportReport(
        type,
        reportState.settings.backgroundColor,
        reportState.name,
      );
      setSnackbarMessage(`${type.toUpperCase()} downloaded!`);
      setSnackbarOpen(true);
    };

  const handleSnackbarClose = (
    e: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
    setTimeout(() => {
      setSnackbarMessage("");
    }, 200);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAutoGenerateThumbnail = async () => {
    const fileData = await exportReport(
      "png",
      reportState.settings.backgroundColor,
      reportState.name,
      true,
    );
    const formData = new FormData();
    formData.append(`${id}.png`, fileData as Blob, `${id}.png`);
    await axios
      .post(`${import.meta.env.VITE_API}/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (response) => {
        if (response.status === 200) {
          console.log("REPORT THUMBNAIL: SAVED");
        }
      })
      .catch((error) => {
        console.error("REPORT THUMBNAIL: ", error);
      });
  };

  useDebounce(
    () => {
      updateReport.mutate({
        items: reportState.items,
        description: reportState.description,
        settings: reportState.settings,
        name: reportState.name,
      });

      // handleAutoGenerateThumbnail(); --- DISABLED FOR NOW, AFFECTING USER EXPERIENCE ---
    },
    2000,
    [
      reportState.items,
      reportState.description,
      reportState.settings,
      reportState.name,
    ],
  );

  React.useEffect(() => {
    if (updateReport.isSuccess) {
      setTimeout(() => {
        updateReport.reset();
      }, 5000);
    }
  }, [updateReport.isSuccess]);

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);

  const spin = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

  return (
    <React.Fragment>
      <Box sx={{ zIndex: 1400, flexGrow: 1, top: 0, position: "sticky" }}>
        <AppBar position="static" sx={{ background: "#f8f8f8" }}>
          <Toolbar
            sx={{
              gap: "20px",
              height: "59px",
              padding: "10px 20px !important",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                gap: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  gap: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <NavLink
                  to="/"
                  style={{ display: "flex", marginRight: "10px" }}
                >
                  <HeaderToolbarMiniLogo />
                </NavLink>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: "#98A1AA" }}
                />
              </Box>
              <Box
                sx={{
                  gap: "20px",
                  display: "flex",
                  alignItems: "center",
                  ".MuiButtonBase-root": {
                    fontSize: "16px",
                    fontWeight: "700",
                    padding: "6px 12px",
                    border: "none",
                  },
                }}
              >
                <Button
                  component={Link}
                  variant="outlined"
                  LinkComponent={Link}
                  to="/report-builder"
                  startIcon={<LibraryIcon />}
                >
                  My Reports
                </Button>
                <Button variant="outlined" startIcon={<FolderIcon />}>
                  Assets
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                gap: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                component="span"
                fontSize="14px"
                marginRight={"14px"}
                sx={{
                  span: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  },
                }}
              >
                {updateReport.isPending ? (
                  <Box component={"span"}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        animation: `${spin} 1s linear infinite`,
                      }}
                    >
                      <LoaderSpinner />
                    </Box>
                    Saving...
                  </Box>
                ) : updateReport.isSuccess ? (
                  <Box component="span">
                    <CompleteIcon /> Saved
                  </Box>
                ) : updateReport.isError ? (
                  <Box component={"span"}>
                    <ErrorIcon /> Couldn&apos;t save changes
                  </Box>
                ) : updateReport.isPaused ? (
                  <Box component={"span"}>
                    <WarningIcon />
                    Offline — changes will sync when connection is restored
                  </Box>
                ) : null}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  ".MuiButtonBase-root": {
                    fontSize: "16px",
                    padding: "9px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dfe3e5",
                    "&:hover": {
                      background: "#f1f3f5",
                      borderColor: "#70777e",
                    },
                  },
                  ".MuiIconButton-root": {
                    padding: "6px 12px",
                  },
                }}
              >
                <IconButton
                  component={Link}
                  to={`/report-builder/reports/${id}`}
                >
                  <PreviewIcon />
                </IconButton>
                <Tooltip title="Export" enterDelay={500} leaveDelay={200}>
                  <IconButton
                    onClick={handleClick}
                    sx={
                      open
                        ? {
                            bgcolor: "#f1f3f5",
                            borderColor: "#70777e !important",
                          }
                        : {}
                    }
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <AddComponent />
              <Menu
                open={open}
                keepMounted
                disableScrollLock
                anchorEl={anchorEl}
                onClose={handleClose}
                transformOrigin={{
                  vertical: -5,
                  horizontal: "right",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                sx={menuSx}
              >
                <MenuItem onClick={handleCopyUrlLink}>
                  <CopyIcon />
                  Copy URL Link
                </MenuItem>
                <MenuItem onClick={handleSendViaEmail}>
                  <EmailIcon />
                  Send via Email
                </MenuItem>
                <MenuItem onClick={handleClick2}>
                  <DownloadIcon />
                  Download Shareable File
                  <ChevronRight />
                </MenuItem>
              </Menu>
              <Menu
                keepMounted
                open={open2}
                disableScrollLock
                anchorEl={anchorEl2}
                onClose={handleClose2}
                transformOrigin={{
                  vertical: 5,
                  horizontal: "right",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                sx={menuSx}
              >
                <MenuItem onClick={handleDownloadShareableFile("png")}>
                  <PNGIcon />
                  PNG
                </MenuItem>
                <MenuItem onClick={handleDownloadShareableFile("svg")}>
                  <SVGIcon />
                  SVG
                </MenuItem>
                <MenuItem onClick={handleDownloadShareableFile("pdf")}>
                  <PDFIcon />
                  PDF
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiPaper-root": {
            padding: "0px",
            fontSize: "14px",
            bgcolor: "#000000",
            minWidth: "fit-content",
          },
          "& .MuiSnackbarContent-message": {
            padding: "10px",
          },
        }}
      />
    </React.Fragment>
  );
};
