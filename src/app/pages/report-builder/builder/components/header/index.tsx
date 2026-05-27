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
import { useStoreState } from "app/state/store/hooks";
import CopyIcon from "app/assets/vectors/Copy.svg?react";
import EmailIcon from "app/assets/vectors/Email.svg?react";
import PNGIcon from "app/assets/vectors/PngIcon.svg?react";
import SVGIcon from "app/assets/vectors/SvgIcon.svg?react";
import PDFIcon from "app/assets/vectors/PdfIcon.svg?react";
import ShareIcon from "app/assets/vectors/Share.svg?react";
import PreviewIcon from "app/assets/vectors/Preview.svg?react";
import LibraryIcon from "app/assets/vectors/Library.svg?react";
import { exportReportFromServer } from "app/utils/exportReport";
import { useParams, Link, useNavigate } from "react-router-dom";
import DownloadIcon from "app/assets/vectors/Download.svg?react";
import { useGetReport, usePatchReport } from "app/hooks/queries/report-builder";
import ErrorIcon from "app/assets/vectors/ReportBuilderAutoSaveError.svg?react";
import CompleteIcon from "app/assets/vectors/ReportBuilderCompleteIcon.svg?react";
import WarningIcon from "app/assets/vectors/ReportBuilderAutoSaveWarning.svg?react";
import LoaderSpinner from "app/assets/vectors/ReportBuilderAutoSaveSpinner.svg?react";
import AddComponent from "app/pages/report-builder/builder/components/header/add-component";
import {
  InfoIcon,
  BackArrowIcon,
} from "app/pages/report-builder/builder/components/header/data";

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

  const reportState = useStoreState((state) => state.RBReportItemsState);

  const reportData = useGetReport(id);
  const updateReport = usePatchReport(id);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [name, setName] = React.useState(reportData?.data?.data.name ?? "");
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);
  const [signedIn] = React.useState(true); // Replace with actual authentication state

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
      await exportReportFromServer(id!, type);
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

  const handlePencilButtonClick = () => {
    nameInputRef.current?.focus();
  };

  const handleNameOnInputEvent = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.size = e.currentTarget.value.length ?? 1;
  };

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

  useDebounce(
    () => {
      if (!previewMode) {
        updateReport.mutate({
          name,
          items: reportState.items,
          settings: reportState.settings,
        });
      }
    },
    2000,
    [name, reportState.items, reportState.settings, previewMode],
  );

  React.useEffect(() => {
    if (updateReport.isSuccess) {
      setTimeout(() => {
        updateReport.reset();
      }, 5000);
    }
  }, [updateReport.isSuccess]);

  React.useEffect(() => {
    setName(reportData.data?.data.name ?? "");
  }, [reportData.data?.data.name]);

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
                <Link to="/report-builder">Reports</Link>
                <Typography>/</Typography>
                <input
                  type="text"
                  value={name}
                  ref={nameInputRef}
                  disabled={previewMode}
                  size={name.length ?? 1}
                  onInput={handleNameOnInputEvent}
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
                          Offline — changes will sync when connection is
                          restored
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
                      <Button startIcon={<LibraryIcon />}>Assets</Button>
                      <Button
                        component={Link}
                        startIcon={<PreviewIcon />}
                        to={`/report-builder/reports/${id}`}
                      >
                        Preview
                      </Button>
                    </Box>
                    <AddComponent />
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
                        startIcon={<DownloadIcon />}
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
                        }}
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
                        Copy URL Link
                      </MenuItem>
                      <MenuItem onClick={handleSendViaEmail}>
                        <EmailIcon />
                        Send via Email
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
