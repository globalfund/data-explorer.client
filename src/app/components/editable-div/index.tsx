import { Box } from "@mui/material";
import React from "react";

interface EditableDivProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  sx?: any;
  disabled?: boolean;
  setEditing?: (editing: boolean) => void;
}

const EditableDiv: React.FC<EditableDivProps> = ({
  title,
  onTitleChange,
  sx,
  disabled,
  setEditing,
}) => {
  const [currentTitle, setCurrentTitle] = React.useState(title);
  const [isEditing, setIsEditing] = React.useState(false);
  const titleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setEditing?.(isEditing);
    setCurrentTitle(title);
    if (titleRef.current && !isEditing) {
      titleRef.current.textContent = title;
    }
  }, [title, isEditing]);

  const finishEditing = () => {
    const nextValue = titleRef.current?.textContent?.trim() ?? "";
    const finalValue = nextValue || title;

    setCurrentTitle(finalValue);
    setIsEditing(false);

    if (titleRef.current) {
      titleRef.current.textContent = finalValue;
    }

    onTitleChange(finalValue);
  };

  //   const handleInput = (e: React.FormEvent<HTMLHeadingElement>) => {
  //     setCurrentTitle(e.currentTarget.textContent ?? "");
  //   };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEditing();
      titleRef.current?.blur();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setCurrentTitle(title);
      if (titleRef.current) {
        titleRef.current.textContent = title;
        titleRef.current.blur();
      }
      setIsEditing(false);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    finishEditing();
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
          backgroundColor: editing
            ? "#EFF1FE"
            : sx?.backgroundColor || "transparent",
          borderRadius: "4px",
        },
      }}
    >
      <div
        ref={titleRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        role="textbox"
        aria-label="Edit title"
        tabIndex={0}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {currentTitle}
      </div>
    </Box>
  );
};

export default EditableDiv;
