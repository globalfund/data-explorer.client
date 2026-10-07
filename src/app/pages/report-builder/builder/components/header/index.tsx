import React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import { useDebounce } from "react-use";
import { keyframes } from "@mui/system";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Pencil } from "../report-settings/icons";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import CopyIcon from "app/assets/vectors/Copy.svg?react";
import EmailIcon from "app/assets/vectors/Email.svg?react";
import PNGIcon from "app/assets/vectors/PngIcon.svg?react";
import SVGIcon from "app/assets/vectors/SvgIcon.svg?react";
import PDFIcon from "app/assets/vectors/PdfIcon.svg?react";
import ShareIcon from "app/assets/vectors/Share.svg?react";
import PreviewIcon from "app/assets/vectors/Preview.svg?react";
import LibraryIcon from "app/assets/vectors/Library.svg?react";
import { exportReportFromServer } from "app/utils/exportReport";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { useParams, Link, useNavigate } from "react-router-dom";
import UploadIcon from "app/assets/vectors/Upload.svg?react";
import { useGetAsset, usePatchReport } from "app/hooks/queries/report-builder";
import ErrorIcon from "app/assets/vectors/ReportBuilderAutoSaveError.svg?react";
import CompleteIcon from "app/assets/vectors/ReportBuilderCompleteIcon.svg?react";
import WarningIcon from "app/assets/vectors/ReportBuilderAutoSaveWarning.svg?react";
import LoaderSpinner from "app/assets/vectors/ReportBuilderAutoSaveSpinner.svg?react";
import AddComponent from "app/pages/report-builder/builder/components/header/add-component";
import {
  InfoIcon,
  BackArrowIcon,
} from "app/pages/report-builder/builder/components/header/data";
import { AssetLibraryModal } from "app/pages/report-builder/builder/components/asset-library-modal";
import { Add } from "@mui/icons-material";
import { ReportBuilderUseAssetModal } from "app/pages/report-builder/main/components/use-asset-modal";
import { ReportBuilderNewReportModal } from "app/pages/report-builder/main/components/new-report-modal";
import { isReportItemComplete } from "app/pages/report-builder/component-registry/model";
import { ReportBuilderReportIssueModal } from "app/pages/report-builder/main/components/report-issue-modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { prepareReportItemsForSave } from "app/utils/reportBuilderState";

export const menuSx = {
  zIndex: 1400,
  "& .MuiPaper-root": {
    borderRadius: "4px",
    background: "#fff",
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

const spin = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

export const ReportBuilderPageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const cmsData = useCMSData({ returnData: true });
  const isMobile = useMediaQuery("(max-width: 600px)");
  const reportState = useStoreState((state) => state.RBReportItemsState);
  const setName = useStoreActions((state) => state.RBReportItemsState.setName);
  const markClean = useStoreActions(
    (state) => state.RBReportItemsState.markClean,
  );

  const updateReport = usePatchReport(id);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);
  const [signedIn] = React.useState(true); // Replace with actual authentication state
  const [assetLibraryOpen, setAssetLibraryOpen] = React.useState(false);

  const [reportIssueModalOpen, setReportIssueModalOpen] = React.useState(false);

  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);

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

  const handleOpenAssetLibrary = () => {
    setAssetLibraryOpen(true);
  };

  const handleCloseAssetLibrary = () => {
    setAssetLibraryOpen(false);
  };

  const handleCopyUrlLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarMessage(
      getCMSDataField(
        cmsData,
        "pagesReportBuilderBuilder.linkCopiedMessage",
        "Link Copied!",
      ),
    );
    setSnackbarOpen(true);
  };

  const handleSendViaEmail = () => {
    window.open(`mailto:?body=${window.location.href}`, "_blank");
    setSnackbarMessage(
      getCMSDataField(
        cmsData,
        "pagesReportBuilderBuilder.directedToEmailMessage",
        "Directed to Email!",
      ),
    );
    setSnackbarOpen(true);
  };

  const handleDownloadShareableFile =
    (type: "png" | "svg" | "pdf") => async () => {
      await exportReportFromServer(id!, type);
      setSnackbarMessage(
        `${type.toUpperCase()} ${getCMSDataField(
          cmsData,
          "pagesReportBuilderBuilder.downloadedMessageSuffix",
          "downloaded!",
        )}`,
      );
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

  const handlePencilButtonClick = () => {
    nameInputRef.current?.focus();
  };

  React.useLayoutEffect(() => {
    const input = nameInputRef.current;

    if (!input) return;

    input.style.width = "1px";
    input.style.width = `${input.scrollWidth}px`;
  }, [reportState.name]);

  const handleNameOnChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleBackToEditClick = () => {
    navigate(`/report-builder/reports/${id}/edit`);
  };

  const previewMode = React.useMemo(() => {
    return (
      location.pathname.includes("/reports/") &&
      !location.pathname.includes("edit")
    );
  }, [location.pathname]);

  const items = React.useMemo(() => {
    return reportState.items.filter((item) => {
      return isReportItemComplete(item);
    });
  }, [reportState.items]);

  const toolbar = React.useMemo(() => {
    if (isMobile) {
      return (
        <Toolbar
          sx={{
            gap: "20px",
            height: "auto",
            padding: "10px 20px !important",
            justifyContent: "space-between",
            bgcolor: signedIn ? "#f8f9fa" : "#fff6d8",
          }}
        >
          {signedIn && (
            <Box
              sx={{
                gap: "5px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  gap: "5px",
                  display: "flex",
                  alignItems: "center",
                  "> *": { fontSize: "16px", color: "#000" },
                  "> input": {
                    fontWeight: "700",
                    borderStyle: "none",
                    bgcolor: "transparent",
                    minWidth: "1ch",
                  },
                }}
              >
                <Link to="/report-builder">
                  {getCMSDataField(
                    cmsData,
                    "pagesReportBuilderBuilder.myReportsButton",
                    "My Reports",
                  )}
                </Link>
                <Typography>/</Typography>
                <input
                  type="text"
                  value={reportState.name}
                  ref={nameInputRef}
                  disabled={previewMode}
                  onChange={handleNameOnChangeEvent}
                />
                {!previewMode && (
                  <IconButton onClick={handlePencilButtonClick}>
                    <Pencil />
                  </IconButton>
                )}
                {previewMode && (
                  <Typography
                    sx={{
                      fontSize: "14px",
                      padding: "5px 8px",
                      borderRadius: "4px",
                      bgcolor: "#d6ddfd",
                    }}
                  >
                    Preview
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  gap: "10px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {!previewMode && (
                  <React.Fragment>
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
                          {getCMSDataField(
                            cmsData,
                            "pagesReportBuilderBuilder.savingStatus",
                            "Saving...",
                          )}
                        </Box>
                      ) : updateReport.isSuccess ? (
                        <Box component="span">
                          <CompleteIcon />{" "}
                          {getCMSDataField(
                            cmsData,
                            "pagesReportBuilderBuilder.savedStatus",
                            "Saved",
                          )}
                        </Box>
                      ) : updateReport.isError ? (
                        <Box component={"span"}>
                          <ErrorIcon />{" "}
                          {getCMSDataField(
                            cmsData,
                            "pagesReportBuilderBuilder.saveErrorStatus",
                            "Couldn't save changes",
                          )}
                          ,
                          <Box
                            component="button"
                            sx={{
                              textDecoration: "underline",
                              padding: "0px",
                              margin: "0px",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                            onClick={() => setReportIssueModalOpen(true)}
                          >
                            report this issue
                          </Box>
                        </Box>
                      ) : updateReport.isPaused ? (
                        <Box component={"span"}>
                          <WarningIcon />
                          {getCMSDataField(
                            cmsData,
                            "pagesReportBuilderBuilder.offlineStatus",
                            "Offline — changes will sync when connection is restored",
                          )}
                        </Box>
                      ) : null}
                    </Typography>
                    <Box
                      sx={{
                        gap: "10px",
                        display: "flex",
                        alignItems: "center",
                        ".MuiButtonBase-root": {
                          height: "35px",
                          fontSize: "14px",
                          bgcolor: "#fff",
                          fontWeight: "400",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          textTransform: "none",
                          border: "1px solid #dfe3e5",
                          "&:hover": {
                            bgcolor: "#f1f3f5",
                            borderColor: "#70777e",
                          },
                        },
                      }}
                    >
                      <Button
                        startIcon={<LibraryIcon />}
                        onClick={handleOpenAssetLibrary}
                      >
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.assetsButton",
                          "Assets",
                        )}
                      </Button>
                      <Button
                        component={Link}
                        startIcon={<PreviewIcon />}
                        to={`/report-builder/reports/${id}`}
                      >
                        Preview
                      </Button>
                    </Box>
                    <AddComponent onOpenAssets={handleOpenAssetLibrary} />
                  </React.Fragment>
                )}
                {previewMode && (
                  <React.Fragment>
                    <Box
                      sx={{
                        gap: "10px",
                        display: "flex",
                        alignItems: "center",
                        ".MuiButtonBase-root": {
                          height: "35px",
                          fontSize: "14px",
                          bgcolor: "#fff",
                          fontWeight: "400",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          textTransform: "none",
                          border: "1px solid #dfe3e5",
                          "&:hover": {
                            bgcolor: "#f1f3f5",
                            borderColor: "#70777e",
                          },
                        },
                      }}
                    >
                      <Button
                        startIcon={<BackArrowIcon />}
                        onClick={handleBackToEditClick}
                      >
                        Back to Edit
                      </Button>
                      <Button
                        onClick={handleClick2}
                        startIcon={
                          <UploadIcon width="10.667px" height="13.333px" />
                        }
                        disabled={items.length === 0}
                        sx={{
                          ":disabled": {
                            svg: { path: { stroke: "#70777e !important" } },
                          },
                        }}
                      >
                        Export
                      </Button>
                      <Button
                        onClick={handleClick}
                        startIcon={<ShareIcon />}
                        sx={{
                          color: "#fff !important",
                          bgcolor: "#3154f4 !important",
                          svg: { path: { fill: "#fff !important" } },

                          ":disabled": {
                            bgcolor: "#dfe3e5 !important",
                            color: "#70777e !important",
                            svg: { path: { fill: "#70777e !important" } },
                          },
                        }}
                        disabled={items.length === 0}
                      >
                        Share
                      </Button>
                    </Box>
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
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.copyUrlLinkMenuItem",
                          "Copy URL Link",
                        )}
                      </MenuItem>
                      <MenuItem onClick={handleSendViaEmail}>
                        <EmailIcon />
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.sendViaEmailMenuItem",
                          "Send via Email",
                        )}
                      </MenuItem>
                    </Menu>
                    <Menu
                      keepMounted
                      open={open2}
                      disableScrollLock
                      anchorEl={anchorEl2}
                      onClose={handleClose2}
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
                      <MenuItem onClick={handleDownloadShareableFile("png")}>
                        <PNGIcon />
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.pngFileMenuItem",
                          "PNG",
                        )}
                      </MenuItem>
                      <MenuItem onClick={handleDownloadShareableFile("svg")}>
                        <SVGIcon />
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.svgFileMenuItem",
                          "SVG",
                        )}
                      </MenuItem>
                      <MenuItem onClick={handleDownloadShareableFile("pdf")}>
                        <PDFIcon />
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.pdfFileMenuItem",
                          "PDF",
                        )}
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                )}
              </Box>
            </Box>
          )}
          {!signedIn && (
            <Container maxWidth="lg" disableGutters>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    gap: "12px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon />
                  <Box>
                    <Typography
                      fontSize="16px"
                      fontWeight="700"
                      color="#684e00"
                    >
                      This report was created by a user with the Global Fund
                      Report Builder.
                    </Typography>
                    <Typography fontSize="16px" color="#684e00">
                      It is not an official Global Fund publication.
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: "6px 8px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    bgcolor: "#fff1bf",
                    height: "fit-content",
                    border: "1px solid #be8e00",
                  }}
                >
                  User-generated Report
                </Box>
              </Box>
            </Container>
          )}
        </Toolbar>
      );
    } else {
      return (
        <Toolbar
          sx={{
            gap: "20px",
            height: "59px",
            padding: "10px 20px !important",
            justifyContent: "space-between",
            bgcolor: signedIn ? "#f8f9fa" : "#fff6d8",
          }}
        >
          {signedIn && (
            <React.Fragment>
              <Box
                sx={{
                  gap: "5px",
                  display: "flex",
                  alignItems: "center",
                  "> *": { fontSize: "16px", color: "#000" },
                  "> input": {
                    fontWeight: "700",
                    borderStyle: "none",
                    bgcolor: "transparent",
                  },
                }}
              >
                <Link to="/report-builder">
                  {getCMSDataField(
                    cmsData,
                    "pagesReportBuilderBuilder.myReportsButton",
                    "My Reports",
                  )}
                </Link>
                <Typography>/</Typography>
                <input
                  type="text"
                  value={reportState.name}
                  ref={nameInputRef}
                  disabled={previewMode}
                  onChange={handleNameOnChangeEvent}
                />
                {!previewMode && (
                  <IconButton onClick={handlePencilButtonClick}>
                    <Pencil />
                  </IconButton>
                )}
                {previewMode && (
                  <Typography
                    sx={{
                      fontSize: "14px",
                      padding: "5px 8px",
                      borderRadius: "4px",
                      bgcolor: "#d6ddfd",
                    }}
                  >
                    Preview
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  gap: "10px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {!previewMode && (
                  <React.Fragment>
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
                          {getCMSDataField(
                            cmsData,
                            "pagesReportBuilderBuilder.savingStatus",
                            "Saving...",
                          )}
                        </Box>
                      ) : updateReport.isSuccess ? (
                        <Box component="span">
                          <CompleteIcon />{" "}
                          {getCMSDataField(
                            cmsData,
                            "pagesReportBuilderBuilder.savedStatus",
                            "Saved",
                          )}
                        </Box>
                      ) : updateReport.isError ? (
                        <Box component={"span"}>
                          <ErrorIcon />{" "}
                          {getCMSDataField(
                            cmsData,
                            "pagesReportBuilderBuilder.saveErrorStatus",
                            "Couldn't save changes",
                          )}
                          ,
                          <Box
                            component="button"
                            sx={{
                              textDecoration: "underline",
                              padding: "0px",
                              margin: "0px",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                            onClick={() => setReportIssueModalOpen(true)}
                          >
                            report this issue
                          </Box>
                        </Box>
                      ) : updateReport.isPaused ? (
                        <Box component={"span"}>
                          <WarningIcon />
                          {getCMSDataField(
                            cmsData,
                            "pagesReportBuilderBuilder.offlineStatus",
                            "Offline — changes will sync when connection is restored",
                          )}
                        </Box>
                      ) : null}
                    </Typography>
                    <Box
                      sx={{
                        gap: "10px",
                        display: "flex",
                        alignItems: "center",
                        ".MuiButtonBase-root": {
                          height: "35px",
                          fontSize: "14px",
                          bgcolor: "#fff",
                          fontWeight: "400",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          textTransform: "none",
                          border: "1px solid #dfe3e5",
                          "&:hover": {
                            bgcolor: "#f1f3f5",
                            borderColor: "#70777e",
                          },
                        },
                      }}
                    >
                      <Button
                        startIcon={<LibraryIcon />}
                        onClick={handleOpenAssetLibrary}
                      >
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.assetsButton",
                          "Assets",
                        )}
                      </Button>
                      <Button
                        component={Link}
                        startIcon={<PreviewIcon />}
                        to={`/report-builder/reports/${id}`}
                      >
                        Preview
                      </Button>
                    </Box>
                    <AddComponent onOpenAssets={handleOpenAssetLibrary} />
                  </React.Fragment>
                )}
                {previewMode && (
                  <React.Fragment>
                    <Box
                      sx={{
                        gap: "10px",
                        display: "flex",
                        alignItems: "center",
                        ".MuiButtonBase-root": {
                          height: "35px",
                          fontSize: "14px",
                          bgcolor: "#fff",
                          fontWeight: "400",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          textTransform: "none",
                          border: "1px solid #dfe3e5",
                          "&:hover": {
                            bgcolor: "#f1f3f5",
                            borderColor: "#70777e",
                          },
                        },
                      }}
                    >
                      <Button
                        startIcon={<BackArrowIcon />}
                        onClick={handleBackToEditClick}
                      >
                        Back to Edit
                      </Button>
                      <Button
                        onClick={handleClick2}
                        startIcon={
                          <UploadIcon width="10.667px" height="13.333px" />
                        }
                        disabled={items.length === 0}
                        sx={{
                          ":disabled": {
                            svg: { path: { stroke: "#70777e !important" } },
                          },
                        }}
                      >
                        Export
                      </Button>
                      <Button
                        onClick={handleClick}
                        startIcon={<ShareIcon />}
                        sx={{
                          color: "#fff !important",
                          bgcolor: "#3154f4 !important",
                          svg: { path: { fill: "#fff !important" } },

                          ":disabled": {
                            bgcolor: "#dfe3e5 !important",
                            color: "#70777e !important",
                            svg: { path: { fill: "#70777e !important" } },
                          },
                        }}
                        disabled={items.length === 0}
                      >
                        Share
                      </Button>
                    </Box>
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
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.copyUrlLinkMenuItem",
                          "Copy URL Link",
                        )}
                      </MenuItem>
                      <MenuItem onClick={handleSendViaEmail}>
                        <EmailIcon />
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.sendViaEmailMenuItem",
                          "Send via Email",
                        )}
                      </MenuItem>
                    </Menu>
                    <Menu
                      keepMounted
                      open={open2}
                      disableScrollLock
                      anchorEl={anchorEl2}
                      onClose={handleClose2}
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
                      <MenuItem onClick={handleDownloadShareableFile("png")}>
                        <PNGIcon />
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.pngFileMenuItem",
                          "PNG",
                        )}
                      </MenuItem>
                      <MenuItem onClick={handleDownloadShareableFile("svg")}>
                        <SVGIcon />
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.svgFileMenuItem",
                          "SVG",
                        )}
                      </MenuItem>
                      <MenuItem onClick={handleDownloadShareableFile("pdf")}>
                        <PDFIcon />
                        {getCMSDataField(
                          cmsData,
                          "pagesReportBuilderBuilder.pdfFileMenuItem",
                          "PDF",
                        )}
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                )}
              </Box>
            </React.Fragment>
          )}
          {!signedIn && (
            <Container maxWidth="lg" disableGutters>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    gap: "12px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon />
                  <Box>
                    <Typography
                      fontSize="16px"
                      fontWeight="700"
                      color="#684e00"
                    >
                      This report was created by a user with the Global Fund
                      Report Builder.
                    </Typography>
                    <Typography fontSize="16px" color="#684e00">
                      It is not an official Global Fund publication.
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: "6px 8px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    bgcolor: "#fff1bf",
                    height: "fit-content",
                    border: "1px solid #be8e00",
                  }}
                >
                  User-generated Report
                </Box>
              </Box>
            </Container>
          )}
        </Toolbar>
      );
    }
  }, [
    reportState.items,
    reportState.settings,
    reportState.name,
    previewMode,
    isMobile,
    signedIn,
    anchorEl,
    anchorEl2,
    cmsData,
    id,
    nameInputRef,
    updateReport.isPending,
    updateReport.isSuccess,
    updateReport.isError,
    updateReport.isPaused,
    assetLibraryOpen,
  ]);

  const reportPayload = React.useMemo(
    () => ({
      name: reportState.name,
      description: reportState.description,
      items: prepareReportItemsForSave(reportState.items),
      settings: reportState.settings,
    }),
    [
      reportState.name,
      reportState.description,
      reportState.items,
      reportState.settings,
    ],
  );

  const reportPayloadFingerprint = React.useMemo(
    () => JSON.stringify(reportPayload),
    [reportPayload],
  );
  const latestPayloadFingerprint = React.useRef(reportPayloadFingerprint);
  latestPayloadFingerprint.current = reportPayloadFingerprint;

  useDebounce(
    () => {
      if (
        !previewMode &&
        !updateReport.isPending &&
        reportState.id === id &&
        reportState.dirty
      ) {
        const savedFingerprint = reportPayloadFingerprint;

        updateReport.mutate(reportPayload, {
          onSuccess: () => {
            if (latestPayloadFingerprint.current === savedFingerprint) {
              markClean();
            }
          },
        });
      }
    },
    2000,
    [
      reportState.id,
      reportState.dirty,
      reportPayloadFingerprint,
      previewMode,
      updateReport.isPending,
    ],
  );

  React.useEffect(() => {
    if (updateReport.isSuccess) {
      setTimeout(() => {
        updateReport.reset();
      }, 5000);
    }
  }, [updateReport.isSuccess]);

  return (
    <React.Fragment>
      <Box
        sx={{
          top: 59,
          zIndex: 999,
          flexGrow: 1,
          position: "sticky",
          borderBottom: "1px solid #cfd4da",
        }}
      >
        {toolbar}
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
      <AssetLibraryModal
        open={assetLibraryOpen}
        onClose={handleCloseAssetLibrary}
      />
      <ReportBuilderReportIssueModal
        open={reportIssueModalOpen}
        onClose={() => setReportIssueModalOpen(false)}
        reportId={id}
        reportName={reportState.name}
        error={updateReport.error}
        onSubmitted={() => {
          setSnackbarMessage(
            "Thank you for reporting the issue. We will look into it.",
          );
          setSnackbarOpen(true);
          setReportIssueModalOpen(false);
        }}
      />
    </React.Fragment>
  );
};

export const ReportBuilderAssetPageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const cmsData = useCMSData({ returnData: true });
  const assetQuery = useGetAsset(id);
  const assetData = assetQuery.data?.data;

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);
  const [signedIn] = React.useState(true); // Replace with actual authentication state

  const [useAssetModalOpen, setUseAssetModalOpen] = React.useState(false);
  const [newReportModalOpen, setNewReportModalOpen] = React.useState(false);

  const handleNewReportModalClose = () => {
    setNewReportModalOpen(false);
  };

  const handleUseAssetModalClose = () => {
    setUseAssetModalOpen(false);
  };

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
    setSnackbarMessage(
      getCMSDataField(
        cmsData,
        "pagesReportBuilderBuilder.linkCopiedMessage",
        "Link Copied!",
      ),
    );
    setSnackbarOpen(true);
  };

  const handleSendViaEmail = () => {
    window.open(`mailto:?body=${window.location.href}`, "_blank");
    setSnackbarMessage(
      getCMSDataField(
        cmsData,
        "pagesReportBuilderBuilder.directedToEmailMessage",
        "Directed to Email!",
      ),
    );
    setSnackbarOpen(true);
  };

  const handleDownloadShareableFile =
    (type: "png" | "svg" | "pdf") => async () => {
      await exportReportFromServer(id!, type, true);
      setSnackbarMessage(
        `${type.toUpperCase()} ${getCMSDataField(
          cmsData,
          "pagesReportBuilderBuilder.downloadedMessageSuffix",
          "downloaded!",
        )}`,
      );
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

  const handleBackToEditClick = () => {
    navigate(`/report-builder`);
  };

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);

  const nameInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <React.Fragment>
      <Box
        sx={{
          top: 59,
          zIndex: 999,
          flexGrow: 1,
          position: "sticky",
          borderBottom: "1px solid #cfd4da",
        }}
      >
        <Toolbar
          sx={{
            gap: "20px",
            height: "59px",
            padding: "10px 20px !important",
            justifyContent: "space-between",
            bgcolor: signedIn ? "#f8f9fa" : "#fff6d8",
          }}
        >
          {signedIn && (
            <React.Fragment>
              <Box
                sx={{
                  gap: "5px",
                  display: "flex",
                  alignItems: "center",
                  "> *": { fontSize: "16px", color: "#000" },
                  "> input": {
                    fontWeight: "700",
                    borderStyle: "none",
                    bgcolor: "transparent",
                  },
                }}
              >
                <Link to="/report-builder">
                  {getCMSDataField(
                    cmsData,
                    "pagesReportBuilderBuilder.myReportsButton",
                    "My Reports",
                  )}
                </Link>
                <Typography>/</Typography>
                <input
                  type="text"
                  value={assetData?.name ?? ""}
                  ref={nameInputRef}
                  disabled
                  size={assetData?.name.length ?? 1}
                />

                <Typography
                  sx={{
                    fontSize: "14px",
                    padding: "5px 8px",
                    borderRadius: "4px",
                    bgcolor: "#d6ddfd",
                  }}
                >
                  Previewing
                </Typography>
              </Box>
              <Box
                sx={{
                  gap: "10px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <React.Fragment>
                  <Box
                    sx={{
                      gap: "10px",
                      display: "flex",
                      alignItems: "center",
                      ".MuiButtonBase-root": {
                        height: "35px",
                        fontSize: "14px",
                        bgcolor: "#fff",
                        fontWeight: "400",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        textTransform: "none",
                        border: "1px solid #dfe3e5",
                        "&:hover": {
                          bgcolor: "#f1f3f5",
                          borderColor: "#70777e",
                        },
                      },
                    }}
                  >
                    <Button
                      startIcon={<BackArrowIcon />}
                      onClick={handleBackToEditClick}
                    >
                      Back to Assets
                    </Button>
                    <Button
                      onClick={handleClick2}
                      startIcon={
                        <UploadIcon width="10.667px" height="13.333px" />
                      }
                    >
                      Export
                    </Button>
                    <Button onClick={handleClick} startIcon={<ShareIcon />}>
                      Share
                    </Button>
                    <Button
                      onClick={() => setUseAssetModalOpen(true)}
                      startIcon={<Add />}
                      sx={{
                        color: "#fff !important",
                        bgcolor: "#3154f4 !important",
                        svg: { path: { fill: "#fff !important" } },
                      }}
                    >
                      Use Asset
                    </Button>
                  </Box>
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
                      {getCMSDataField(
                        cmsData,
                        "pagesReportBuilderBuilder.copyUrlLinkMenuItem",
                        "Copy URL Link",
                      )}
                    </MenuItem>
                    <MenuItem onClick={handleSendViaEmail}>
                      <EmailIcon />
                      {getCMSDataField(
                        cmsData,
                        "pagesReportBuilderBuilder.sendViaEmailMenuItem",
                        "Send via Email",
                      )}
                    </MenuItem>
                  </Menu>
                  <Menu
                    keepMounted
                    open={open2}
                    disableScrollLock
                    anchorEl={anchorEl2}
                    onClose={handleClose2}
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
                    <MenuItem onClick={handleDownloadShareableFile("png")}>
                      <PNGIcon />
                      {getCMSDataField(
                        cmsData,
                        "pagesReportBuilderBuilder.pngFileMenuItem",
                        "PNG",
                      )}
                    </MenuItem>
                    <MenuItem onClick={handleDownloadShareableFile("svg")}>
                      <SVGIcon />
                      {getCMSDataField(
                        cmsData,
                        "pagesReportBuilderBuilder.svgFileMenuItem",
                        "SVG",
                      )}
                    </MenuItem>
                    <MenuItem onClick={handleDownloadShareableFile("pdf")}>
                      <PDFIcon />
                      {getCMSDataField(
                        cmsData,
                        "pagesReportBuilderBuilder.pdfFileMenuItem",
                        "PDF",
                      )}
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              </Box>
            </React.Fragment>
          )}
          {!signedIn && (
            <Container maxWidth="lg" disableGutters>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    gap: "12px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon />
                  <Box>
                    <Typography
                      fontSize="16px"
                      fontWeight="700"
                      color="#684e00"
                    >
                      This report was created by a user with the Global Fund
                      Report Builder.
                    </Typography>
                    <Typography fontSize="16px" color="#684e00">
                      It is not an official Global Fund publication.
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: "6px 8px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    bgcolor: "#fff1bf",
                    height: "fit-content",
                    border: "1px solid #be8e00",
                  }}
                >
                  User-generated Report
                </Box>
              </Box>
            </Container>
          )}
        </Toolbar>
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
      <ReportBuilderUseAssetModal
        open={useAssetModalOpen}
        onClose={handleUseAssetModalClose}
        assetId={id ?? ""}
        setNewReportModalOpen={setNewReportModalOpen}
      />
      <ReportBuilderNewReportModal
        open={newReportModalOpen}
        onClose={handleNewReportModalClose}
      />
    </React.Fragment>
  );
};
