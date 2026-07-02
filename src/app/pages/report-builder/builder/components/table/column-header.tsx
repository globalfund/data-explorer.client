import { Box, SxProps } from "@mui/system";
import React from "react";
import { TableColumn, TableOptions } from "./options";
import { Tooltip, Typography } from "@mui/material";

const headerTooltip = "Click on headers to edit the text.";

interface ColumnHeaderProps {
  column: TableColumn;
  index: number;
  columns: TableColumn[];
  palette: {
    headerBg: string;
    headerText: string;
  };
  tableOptions: TableOptions;
  viewMode?: boolean;
  handleColumnNameChange: (
    column: TableColumn,
    index: number,
    nextName: string,
  ) => void;
  sx?: SxProps<any>;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  index,
  columns,
  palette,
  tableOptions,
  viewMode,
  handleColumnNameChange,
  sx,
}) => {
  const [nameInputValue, setNameInputValue] = React.useState(column.name);
  const [editing, setEditing] = React.useState(false);
  const handleNameOnInputEvent = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.size = e.currentTarget.value.length ?? 1;
  };

  return (
    <Box
      key={`${column.id}-${index}`}
      component="th"
      sx={{
        ...sx,
        top: 0,
        zIndex: 2,
        position: "sticky",
        color: palette.headerText,
        fontWeight: 700,
        textAlign: "left",
        bgcolor: palette.headerBg,
        ...(!tableOptions.showRowNumbers && index === 0
          ? { borderTopLeftRadius: "4px" }
          : {}),
        ...(index === columns.length - 1
          ? { borderTopRightRadius: "4px" }
          : {}),
        p: editing ? 0 : ((sx as any)?.p ?? 1),
        input: {
          fontSize: "14px",
          lineHeight: "normal",
          fontWeight: 700,
          textAlign: "left",
          width: "100%",
          height: "100%",
          color: palette.headerText,
          textTransform: "none",
          whiteSpace: "nowrap",
          border: "2px solid #3154F4",
          px: `calc(${(sx as any)?.p} - 2px)`,
          outline: "none",
          bgcolor: "transparent",
        },
      }}
      onClick={() => {
        if (!viewMode) setEditing(true);
      }}
    >
      {editing && !viewMode ? (
        <input
          type="text"
          value={nameInputValue}
          size={nameInputValue.length ?? 1}
          onInput={handleNameOnInputEvent}
          onChange={(e) => {
            setNameInputValue(e.currentTarget.value);
          }}
          onBlur={() => {
            setEditing(false);
            handleColumnNameChange(column, index, nameInputValue);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleColumnNameChange(column, index, nameInputValue);
              setEditing(false);
            }
          }}
        />
      ) : (
        <Tooltip title={headerTooltip} arrow>
          <Typography
            variant="h6"
            fontSize="14px"
            lineHeight="normal"
            sx={{
              color: palette.headerText,
              cursor: "pointer",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: 700,
              textAlign: "left",
              width: "100%",
              textTransform: "none",
              whiteSpace: "nowrap",
              lineHeight: "normal",
            }}
          >
            {column.name}
          </Typography>
        </Tooltip>
      )}
    </Box>
  );
};

export default ColumnHeader;
