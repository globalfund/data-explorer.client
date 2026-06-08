import { Box, SxProps } from "@mui/system";
import React from "react";
import { useDrag } from "react-dnd";

interface DragWrapperProps {
  data: any;
  children: React.ReactNode;
  setIsDragging?: (dragging: boolean) => void;
  type: string;
  sx?: SxProps<any>;
  disabled?: boolean;
}

const DragWrapper: React.FC<DragWrapperProps> = ({
  data,
  children,
  setIsDragging,
  type,
  sx,
  disabled,
}) => {
  const dragRef = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => {
      return data;
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  React.useEffect(() => {
    if (setIsDragging) {
      setIsDragging(isDragging);
    }
  }, [isDragging, setIsDragging]);

  drag(dragRef);

  return (
    <Box
      ref={dragRef}
      sx={{
        cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.5 : 1,
        transform: "translate(0, 0)", // Fixes a potential issue where the dragged had a background shadow
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default DragWrapper;
