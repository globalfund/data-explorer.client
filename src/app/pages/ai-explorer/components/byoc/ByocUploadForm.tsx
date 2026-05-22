import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  CustomUseCaseCreateResponse,
  UseCaseTaskType,
} from "app/pages/ai-explorer/types";
import {
  useCustomUseCaseCreate,
  ByocCreateResult,
} from "app/pages/ai-explorer/hooks/useModelPipeline";

const ACCEPTED_EXTENSIONS =
  ".csv,.tsv,.json,.xlsx,.xls,.parquet,.feather,.orc,.xml";

type FileExt =
  | "csv"
  | "tsv"
  | "json"
  | "xlsx"
  | "xls"
  | "xml"
  | "parquet"
  | "feather"
  | "orc"
  | null;

function detectExt(filename: string): FileExt {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, FileExt> = {
    csv: "csv",
    tsv: "tsv",
    json: "json",
    xlsx: "xlsx",
    xls: "xls",
    xml: "xml",
    parquet: "parquet",
    feather: "feather",
    orc: "orc",
  };
  return map[ext] ?? null;
}

interface ElapsedTimerProps {
  startMs: number;
}

const ElapsedTimer: React.FC<ElapsedTimerProps> = ({ startMs }) => {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const secs = Math.floor((now - startMs) / 1000);
  return <>{secs}s</>;
};

interface ByocUploadFormProps {
  onCreated: (result: CustomUseCaseCreateResponse) => void;
}

export const ByocUploadForm: React.FC<ByocUploadFormProps> = ({
  onCreated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ext, setExt] = useState<FileExt>(null);

  const [name, setName] = useState("");
  const [targetColumn, setTargetColumn] = useState("");
  const [taskType, setTaskType] = useState<UseCaseTaskType | "">("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [businessQuestion, setBusinessQuestion] = useState("");

  // Loader params
  const [loaderSep, setLoaderSep] = useState("");
  const [loaderEncoding, setLoaderEncoding] = useState("");
  const [loaderSheetName, setLoaderSheetName] = useState("");
  const [loaderOrient, setLoaderOrient] = useState("");
  const [loaderSkiprows, setLoaderSkiprows] = useState("");
  const [loaderXpath, setLoaderXpath] = useState("");

  // Ambiguous target state
  const [candidates, setCandidates] = useState<string[] | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [trainStartMs, setTrainStartMs] = useState<number | null>(null);

  const { loading, create } = useCustomUseCaseCreate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setExt(f ? detectExt(f.name) : null);
    setCandidates(null);
    setError(null);
  };

  const buildFormData = (overrideTarget?: string) => {
    const fd = new FormData();
    if (file) fd.append("file", file);
    fd.append("name", name.trim());
    const target = overrideTarget ?? targetColumn.trim();
    if (target) fd.append("target_column", target);
    if (taskType) fd.append("task_type", taskType);
    if (description.trim()) fd.append("description", description.trim());
    if (audience.trim()) fd.append("audience", audience.trim());
    if (businessQuestion.trim())
      fd.append("business_question", businessQuestion.trim());
    if (loaderSep.trim()) fd.append("loader_sep", loaderSep.trim());
    if (loaderEncoding.trim())
      fd.append("loader_encoding", loaderEncoding.trim());
    if (loaderSheetName.trim())
      fd.append("loader_sheet_name", loaderSheetName.trim());
    if (loaderOrient.trim()) fd.append("loader_orient", loaderOrient.trim());
    if (loaderSkiprows.trim())
      fd.append("loader_skiprows", loaderSkiprows.trim());
    if (loaderXpath.trim()) fd.append("loader_xpath", loaderXpath.trim());
    return fd;
  };

  const handleSubmit = async (overrideTarget?: string) => {
    if (!file || !name.trim()) return;
    setError(null);
    setCandidates(null);
    setTrainStartMs(Date.now());

    const result: ByocCreateResult = await create(
      buildFormData(overrideTarget),
    );
    setTrainStartMs(null);

    if (result.ok) {
      onCreated(result.data);
      setFile(null);
      setName("");
      setTargetColumn("");
      setTaskType("");
      setDescription("");
      setAudience("");
      setBusinessQuestion("");
      setCandidates(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else if (result.ambiguous) {
      setCandidates(result.candidates);
      setSelectedCandidate(result.candidates[0] ?? "");
    } else {
      setError(result.error);
    }
  };

  const showCsvLoaders = ext === "csv" || ext === "tsv";
  const showExcelLoaders = ext === "xlsx" || ext === "xls";
  const showJsonLoaders = ext === "json";
  const showXmlLoaders = ext === "xml";
  const hasLoaderParams =
    showCsvLoaders || showExcelLoaders || showJsonLoaders || showXmlLoaders;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* File picker */}
      <Box>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          style={{ display: "none" }}
          onChange={handleFileChange}
          id="byoc-file-input"
        />
        <label htmlFor="byoc-file-input">
          <Button
            component="span"
            variant="outlined"
            size="small"
            startIcon={<UploadFileIcon />}
            sx={{ borderColor: "#002561", color: "#002561" }}
          >
            Choose file
          </Button>
        </label>
        {file && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {file.name} ({(file.size / 1024).toFixed(0)} KB)
          </Typography>
        )}
      </Box>

      {/* Required fields */}
      <TextField
        label="Use case name *"
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Q4 Budget Forecast"
        sx={{ maxWidth: 400 }}
      />

      {/* Optional fields */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 1.5,
        }}
      >
        <TextField
          label="Target column"
          size="small"
          value={targetColumn}
          onChange={(e) => setTargetColumn(e.target.value)}
          placeholder="Auto-detected if blank"
        />
        <TextField
          select
          label="Task type"
          size="small"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value as UseCaseTaskType | "")}
        >
          <MenuItem value="">Auto-detect</MenuItem>
          <MenuItem value="regression">Regression</MenuItem>
          <MenuItem value="classification">Classification</MenuItem>
          <MenuItem value="clustering">Clustering</MenuItem>
        </TextField>
        <TextField
          label="Description"
          size="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this dataset represent?"
        />
        <TextField
          label="Audience"
          size="small"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. Finance team"
        />
        <TextField
          label="Business question"
          size="small"
          value={businessQuestion}
          onChange={(e) => setBusinessQuestion(e.target.value)}
          placeholder="What question should the model answer?"
          sx={{ gridColumn: "span 2" }}
        />
      </Box>

      {/* Loader params */}
      {hasLoaderParams && (
        <Accordion
          sx={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 1,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              Advanced loader options
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 1.5,
              }}
            >
              {showCsvLoaders && (
                <>
                  <TextField
                    label="Delimiter (loader_sep)"
                    size="small"
                    value={loaderSep}
                    onChange={(e) => setLoaderSep(e.target.value)}
                    placeholder="Default: ,"
                  />
                  <TextField
                    label="Encoding"
                    size="small"
                    value={loaderEncoding}
                    onChange={(e) => setLoaderEncoding(e.target.value)}
                    placeholder="Default: UTF-8"
                  />
                </>
              )}
              {showExcelLoaders && (
                <>
                  <TextField
                    label="Sheet name / index"
                    size="small"
                    value={loaderSheetName}
                    onChange={(e) => setLoaderSheetName(e.target.value)}
                    placeholder="Default: first sheet"
                  />
                  <TextField
                    label="Skip rows"
                    size="small"
                    type="number"
                    value={loaderSkiprows}
                    onChange={(e) => setLoaderSkiprows(e.target.value)}
                    placeholder="Default: 0"
                  />
                </>
              )}
              {showJsonLoaders && (
                <>
                  <TextField
                    label="Orientation"
                    size="small"
                    value={loaderOrient}
                    onChange={(e) => setLoaderOrient(e.target.value)}
                    placeholder="records / split / index …"
                  />
                  <TextField
                    label="Encoding"
                    size="small"
                    value={loaderEncoding}
                    onChange={(e) => setLoaderEncoding(e.target.value)}
                    placeholder="Default: UTF-8"
                  />
                </>
              )}
              {showXmlLoaders && (
                <>
                  <TextField
                    label="XPath"
                    size="small"
                    value={loaderXpath}
                    onChange={(e) => setLoaderXpath(e.target.value)}
                    placeholder="e.g. .//row"
                  />
                  <TextField
                    label="Encoding"
                    size="small"
                    value={loaderEncoding}
                    onChange={(e) => setLoaderEncoding(e.target.value)}
                    placeholder="Default: UTF-8"
                  />
                </>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Ambiguous target resolution */}
      {candidates && (
        <Alert severity="warning" sx={{ alignItems: "flex-start" }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            The pipeline found multiple possible prediction targets. Please
            select one:
          </Typography>
          <TextField
            select
            size="small"
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {candidates.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleSubmit(selectedCandidate)}
            disabled={loading}
            sx={{
              ml: 1,
              bgcolor: "#002561",
              "&:hover": { bgcolor: "#013B82" },
            }}
          >
            Retry with selected target
          </Button>
        </Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {loading && trainStartMs && (
        <Alert severity="info" icon={<CircularProgress size={16} />}>
          Training in progress — this can take a few minutes for larger
          datasets. Elapsed: <ElapsedTimer startMs={trainStartMs} />
        </Alert>
      )}

      <Typography variant="caption" color="text.secondary">
        Supported file types: {ACCEPTED_EXTENSIONS}
        <br />
        Note on the duration of this training process: For small datasets (up to a few thousand rows),
        it typically takes a few seconds to a minute. For larger datasets (tens of thousands of rows or more),
        it can take several minutes. The exact time depends on the size of the dataset,
        the complexity of the features, and the current load on the system.
        We recommend starting with a smaller dataset to get a feel for the process,
        and then scaling up as needed.
      </Typography>

      <Box>
        <Button
          variant="contained"
          size="small"
          disabled={!file || !name.trim() || loading}
          onClick={() => handleSubmit()}
          sx={{ bgcolor: "#002561", "&:hover": { bgcolor: "#013B82" } }}
        >
          {loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            "Train model"
          )}
        </Button>
      </Box>
    </Box>
  );
};
