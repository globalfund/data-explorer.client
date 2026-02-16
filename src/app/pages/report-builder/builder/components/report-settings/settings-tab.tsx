import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Close from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { useGFDeleteReport } from "app/hooks/queries/report-builder";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import {
  RenamePanel,
  BorderFillPanel,
  SizePaddingPanel,
} from "app/pages/report-builder/builder/components/report-settings/panels";
import {
  Copy,
  Pencil,
  Backspace,
  SizePadding,
  PaintBucket,
} from "app/pages/report-builder/builder/components/report-settings/icons";

export const SettingsTabView: React.FC = () => {
  const navigate = useNavigate();
  const deleteReport = useGFDeleteReport();
  const { id } = useParams<{ id: string }>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedOption, setSelectedOption] = React.useState<
    "rename" | "size" | "paint" | null
  >(null);

  const handleOptionSelect =
    (option: "rename" | "size" | "paint" | null) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(option === null ? null : e.currentTarget);
      setSelectedOption(option);
    };

  const closePanel = () => {
    setAnchorEl(null);
    setSelectedOption(null);
  };

  const handleDeleteReportClick = () => {
    if (id) {
      deleteReport.mutate(id, {
        onSuccess: () => navigate("/report-builder", { replace: true }),
      });
    }
  };

  const title = React.useMemo(() => {
    switch (selectedOption) {
      case "rename":
        return "Rename";
      case "size":
        return "Size and Padding";
      case "paint":
        return "Border and Fill";
      default:
        return "";
    }
  }, [selectedOption]);

  const view = React.useMemo(() => {
    switch (selectedOption) {
      case "rename":
        return <RenamePanel closePanel={closePanel} />;
      case "size":
        return <SizePaddingPanel closePanel={closePanel} />;
      case "paint":
        return <BorderFillPanel closePanel={closePanel} />;
      default:
        return <React.Fragment />;
    }
  }, [selectedOption]);

  return (
    <React.Fragment>
      <Popper
        anchorEl={anchorEl}
        sx={{ zIndex: 1400 }}
        placement="right-start"
        open={Boolean(anchorEl)}
      >
        <Box
          sx={{
            width: "300px",
            borderRadius: "4px",
            bgcolor: colors.primary.white,
            boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "40px",
              display: "flex",
              padding: "0 10px",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid #CFD4DA`,
            }}
          >
            <Typography fontSize="16px" fontWeight="700">
              {title}
            </Typography>
            <IconButton
              aria-label="close"
              sx={{ padding: 0 }}
              onClick={handleOptionSelect(null)}
            >
              <Close />
            </IconButton>
          </Box>
          {view}
        </Box>
      </Popper>
      <Box
        sx={{
          button: {
            gap: "8px",
            borderRadius: 0,
            fontWeight: "400",
            padding: "7px 16px",
            textTransform: "none",
            justifyContent: "space-between",
            ".MuiButton-startIcon": { ml: 0 },
            div: { width: "100%", textAlign: "start" },
          },
          hr: {
            margin: "0 16px",
            borderColor: "#98A1AA",
          },
        }}
      >
        <Button
          fullWidth
          startIcon={<Pencil />}
          endIcon={<ChevronRightOutlined />}
          onClick={handleOptionSelect("rename")}
          sx={{
            bgcolor: selectedOption === "rename" ? "#F1F3F5" : "transparent",
          }}
        >
          <div>Rename</div>
        </Button>
        <Divider />
        <Button
          fullWidth
          startIcon={<SizePadding />}
          endIcon={<ChevronRightOutlined />}
          onClick={handleOptionSelect("size")}
          sx={{
            bgcolor: selectedOption === "size" ? "#F1F3F5" : "transparent",
          }}
        >
          <div>Size and Padding</div>
        </Button>
        <Divider />
        <Button
          fullWidth
          startIcon={<PaintBucket />}
          endIcon={<ChevronRightOutlined />}
          onClick={handleOptionSelect("paint")}
          sx={{
            bgcolor: selectedOption === "paint" ? "#F1F3F5" : "transparent",
          }}
        >
          <div>Border and Fill</div>
        </Button>
        <Divider />
        <Button
          fullWidth
          startIcon={<Copy />}
          onClick={handleOptionSelect(null)}
        >
          <div>Duplicate Report</div>
        </Button>
        <Divider />
        <Button
          fullWidth
          startIcon={<Backspace />}
          onClick={handleDeleteReportClick}
        >
          <div>Delete Report</div>
        </Button>
      </Box>
    </React.Fragment>
  );
};
