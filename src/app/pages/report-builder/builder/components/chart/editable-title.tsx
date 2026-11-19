import { Box } from "@mui/material";
import React from "react";

interface EditableTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  sx?: any;
  disabled?: boolean;
  setEditing?: (editing: boolean) => void;
  /**
   * Shown, muted, while the title is blank. A title with a placeholder may be
   * left blank; one without goes back to what it was.
   */
  placeholder?: string;
  ariaLabel?: string;
  "data-cy"?: string;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  title,
  onTitleChange,
  sx,
  disabled,
  setEditing,
  placeholder,
  ariaLabel = "Edit title",
  "data-cy": dataCy,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  // Enter finishes editing and then blurs, which would finish it again.
  const editingRef = React.useRef(false);
  const titleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setEditing?.(isEditing);
  }, [isEditing]);

  // While it's edited the text belongs to the element, so React doesn't render
  // it as a child; it's written here whenever the title isn't being edited.
  React.useLayoutEffect(() => {
    if (titleRef.current && !isEditing) {
      titleRef.current.textContent = title;
    }
  }, [title, isEditing]);

  const finishEditing = () => {
    if (!editingRef.current) return;
    editingRef.current = false;

    const text = titleRef.current?.textContent?.trim() ?? "";
    const finalValue = text || (placeholder === undefined ? title : "");

    setIsEditing(false);
    if (titleRef.current) {
      titleRef.current.textContent = finalValue;
    }
    onTitleChange(finalValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEditing();
      titleRef.current?.blur();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      editingRef.current = false;
      if (titleRef.current) {
        titleRef.current.textContent = title;
        titleRef.current.blur();
      }
      setIsEditing(false);
    }
  };

  const handleFocus = () => {
    editingRef.current = true;
    setIsEditing(true);
  };

  const editing = isEditing && !disabled;

  return (
    <Box
      sx={{
        display: "inline-block",
        div: {
          ...sx,
          display: "inline-block",
          margin: 0,
          outline: "none",
          minWidth: "1ch",
          border: editing ? "1px solid #3154F4" : "1px solid transparent",
          padding: "6px",
          backgroundColor: editing
            ? "#EFF1FE"
            : sx?.backgroundColor || "transparent",
          borderRadius: "4px",
          cursor: disabled ? "default" : "text",
          ...(placeholder !== undefined && {
            "&:empty::before": {
              content: "attr(data-placeholder)",
              color: "#70777E",
              fontStyle: "italic",
              fontWeight: 400,
            },
          }),
          ...(!disabled &&
            !editing && {
              "&:hover": { borderColor: "#CFD4DA" },
            }),
        },
      }}
    >
      <div
        ref={titleRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        role="textbox"
        aria-label={ariaLabel}
        aria-placeholder={placeholder}
        data-placeholder={placeholder}
        data-cy={dataCy}
        tabIndex={disabled ? -1 : 0}
        onFocus={handleFocus}
        onBlur={finishEditing}
        onKeyDown={handleKeyDown}
      />
    </Box>
  );
};

export default EditableTitle;
