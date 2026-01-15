import React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { useDropzone } from "react-dropzone";
import Search from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import UploadIcon from "app/assets/vectors/RBUpload.svg?react";

export const TabPanel = (props: {
  index: number;
  value: number;
  children: React.ReactNode;
}) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: "10px 0" }}>{children}</Box>}
    </div>
  );
};

export const UnsplashTab: React.FC<{
  setApplyEnabled: (enabled: boolean) => void;
}> = ({ setApplyEnabled }) => {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<string | null>(null);

  const handleSelect = (value: string) => () => {
    const actualValue = value === selected ? null : value;
    setSelected(actualValue);
    setApplyEnabled(!!actualValue);
  };

  return (
    <Box
      sx={{
        gap: "10px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          gap: "8px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          "> div": { flex: 1 },
        }}
      >
        <Input
          value={search}
          startAdornment={<Search htmlColor="#525252" sx={{ mr: "8px" }} />}
          placeholder="Search professional photos"
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            bgcolor: "#f5f5f5",
            padding: "8px 8px 8px 16px",
          }}
        />
        <Button
          variant="contained"
          sx={{
            color: "#fff",
            fontWeight: "400",
            bgcolor: "#3154f4",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#2548c4",
            },
          }}
        >
          Search
        </Button>
      </Box>
      <Box
        sx={{
          gap: "10px",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <Box
            key={i}
            onClick={handleSelect(i.toString())}
            sx={{
              width: "80px",
              height: "80px",
              display: "flex",
              cursor: "pointer",
              border: "1px solid",
              borderRadius: "8px",
              alignItems: "center",
              bgcolor: "#f1f1f1",
              justifyContent: "center",
              borderColor: selected === i.toString() ? "#3154f4" : "#adb5bd",
            }}
          >
            <Box
              sx={{
                width: "60px",
                height: "60px",
                bgcolor: "#fff",
                borderRadius: "8px",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const UploadTab: React.FC<{
  setApplyEnabled: (enabled: boolean) => void;
}> = ({ setApplyEnabled }) => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      maxSize: 10485760,
      accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".svg"] },
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          setApplyEnabled(true);
        }
      },
    });

  return (
    <Box
      sx={{
        gap: "10px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          gap: "10px",
          width: "100%",
          height: "150px",
          padding: "10px",
          display: "flex",
          cursor: "pointer",
          borderRadius: "4px",
          textAlign: "center",
          border: "1px dashed",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          transition: "all 0.2s ease",
          bgcolor: isDragActive ? "#e9ecef" : "#f1f3f5",
          borderColor: isDragActive ? "#3154f4" : "#252c34",
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon />
        <Typography fontSize="16px" color="#525252">
          Drag and drop images here,
          <br />
          or click to browse
        </Typography>
      </Box>
      <Typography fontSize="16px" color="#525252">
        Supported formats are JPG, PNG, WEBP, SVG.
      </Typography>
      <Typography fontSize="16px" color="#525252">
        Maximum file size: 10MB per image.
      </Typography>
      {acceptedFiles.length > 0 && (
        <Typography fontSize="16px" color="#525252">
          {acceptedFiles.length} file(s) selected
        </Typography>
      )}
    </Box>
  );
};

export const MyAssetsTab: React.FC<{
  setApplyEnabled: (enabled: boolean) => void;
}> = ({ setApplyEnabled }) => {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<string | null>(null);

  const handleSelect = (value: string) => () => {
    const actualValue = value === selected ? null : value;
    setSelected(actualValue);
    setApplyEnabled(!!actualValue);
  };

  return (
    <Box
      sx={{
        gap: "10px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography fontSize="16px" color="#525252">
        You have 11 image assets in total
      </Typography>
      <Box
        sx={{
          gap: "8px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          "> div": { flex: 1 },
        }}
      >
        <Input
          value={search}
          startAdornment={<Search htmlColor="#525252" sx={{ mr: "8px" }} />}
          placeholder="Search professional photos"
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            bgcolor: "#f5f5f5",
            padding: "8px 8px 8px 16px",
          }}
        />
        <Button
          variant="contained"
          sx={{
            color: "#fff",
            fontWeight: "400",
            bgcolor: "#3154f4",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#2548c4",
            },
          }}
        >
          Search
        </Button>
      </Box>
      <Box
        sx={{
          gap: "10px",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <Box
            key={i}
            onClick={handleSelect(i.toString())}
            sx={{
              width: "80px",
              height: "80px",
              display: "flex",
              cursor: "pointer",
              border: "1px solid",
              borderRadius: "8px",
              alignItems: "center",
              bgcolor: "#f1f1f1",
              justifyContent: "center",
              borderColor: selected === i.toString() ? "#3154f4" : "#adb5bd",
            }}
          >
            <Box
              sx={{
                width: "60px",
                height: "60px",
                bgcolor: "#fff",
                borderRadius: "8px",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
