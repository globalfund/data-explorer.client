import React, { useCallback, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  DatasetProfile,
  DatasetProfileHeader,
  HealthOverviewCards,
  ColumnTypePills,
  ColumnDetailCard,
  DataDictionaryPanel,
} from "app/pages/ai-explorer/components/dataset-profile";

const ACCEPTED_EXTENSIONS = [
  ".csv",
  ".tsv",
  ".json",
  ".xlsx",
  ".xls",
  ".parquet",
  ".feather",
  ".orc",
  ".xml",
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 2 }}>
    {value === index && children}
  </Box>
);

interface ProfileDatasetModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileDatasetModal: React.FC<ProfileDatasetModalProps> = ({
  open,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [datasetName, setDatasetName] = useState<string>("");
  const [datasetDescription, setDatasetDescription] = useState<string>("");
  const [tabValue, setTabValue] = useState(0);

  const resetState = () => {
    setSelectedFile(null);
    setIsDragging(false);
    setLoading(false);
    setError(null);
    setProfile(null);
    setDatasetName("");
    setDatasetDescription("");
    setTabValue(0);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFile = (file: File) => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError(
        `Unsupported file format. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`,
      );
      return;
    }
    setError(null);
    setProfile(null);
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const apiUrl = import.meta.env.VITE_API;
      const response = await fetch(`${apiUrl}/profile-dataset`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? `Request failed: ${response.statusText}`);
      }

      setDatasetName(data.dataset ?? selectedFile.name);
      setDatasetDescription(data.description ?? "");
      setProfile(data.profile);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to profile dataset",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Profile your dataset
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {!profile && (
          <>
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: "2px dashed",
                borderColor: isDragging ? "primary.main" : "grey.300",
                borderRadius: 2,
                p: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                bgcolor: isDragging ? "primary.50" : "grey.50",
                transition: "all 0.15s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "grey.100",
                },
              }}
            >
              <CloudUploadIcon
                sx={{ fontSize: 48, color: "text.secondary", opacity: 0.6 }}
              />
              <Typography variant="body1" fontWeight={500}>
                {selectedFile
                  ? "Click or drag to replace file"
                  : "Drag and drop a file here, or click to select"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported: {ACCEPTED_EXTENSIONS.join(", ")}
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS.join(",")}
                onChange={handleInputChange}
                style={{ display: "none" }}
              />
            </Box>

            {selectedFile && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <InsertDriveFileIcon
                  sx={{ color: "primary.main", fontSize: 20 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={14} color="inherit" />
                    ) : undefined
                  }
                >
                  {loading ? "Profiling…" : "Run Profile"}
                </Button>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </>
        )}

        {profile && (
          <Box>
            <DatasetProfileHeader datasetName={datasetName} datasetDescription={datasetDescription} profile={profile} />

            <HealthOverviewCards profile={profile} />

            <ColumnTypePills profile={profile} />

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                aria-label="profile tabs"
              >
                <Tab label="Column Details" />
                <Tab label="Data Dictionary" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  ...profile.text_columns,
                  ...profile.numeric_columns,
                  ...profile.datetime_columns,
                  ...profile.boolean_columns,
                  ...profile.categorical_columns,
                ]
                  .filter((col) => profile.cols[col])
                  .map((col) => {
                    const type = profile.text_columns.includes(col)
                      ? "text"
                      : profile.numeric_columns.includes(col)
                        ? "numeric"
                        : profile.datetime_columns.includes(col)
                          ? "datetime"
                          : profile.boolean_columns.includes(col)
                            ? "boolean"
                            : "categorical";
                    return (
                      <ColumnDetailCard
                        key={col}
                        columnName={col}
                        column={profile.cols[col]}
                        type={type}
                      />
                    );
                  })}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <DataDictionaryPanel profile={profile} />
            </TabPanel>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="outlined" size="small" onClick={resetState}>
                Profile another file
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
