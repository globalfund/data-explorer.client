import React from "react";
import Box from "@mui/material/Box";
import Draggable from "react-draggable";
import Dialog from "@mui/material/Dialog";
import Close from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DragIndicator from "@mui/icons-material/DragIndicator";

const PaperComponent = React.forwardRef<HTMLDivElement, PaperProps>(
  (props, ref) => {
    const { id, ...restProps } = props;
    const nodeRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => nodeRef.current as HTMLDivElement, []);

    return (
      <Draggable nodeRef={nodeRef} handle={`#${id}`}>
        <Paper {...restProps} ref={nodeRef} />
      </Draggable>
    );
  },
);

PaperComponent.displayName = "PaperComponent";

export const DraggableModal: React.FC<{
  id: string;
  width: number;
  open: boolean;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  setOpen: (value: boolean) => void;
}> = ({ id, width, open, setOpen, title, children, actions }) => {
  return (
    <Dialog
      open={open}
      hideBackdrop
      disableScrollLock
      disableEscapeKeyDown
      PaperComponent={PaperComponent}
      PaperProps={{
        id,
        sx: {
          width,
          padding: 0,
          maxWidth: "600px",
          minHeight: "300px",
          borderRadius: "8px",
          boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
        },
      }}
      sx={{
        zIndex: 1400,
      }}
    >
      <DialogTitle
        sx={{
          width: "100%",
          display: "flex",
          padding: "10px",
          fontSize: "16px",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #cfd4da",
        }}
      >
        {title}
        <Box
          sx={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <DragIndicator
            id={id}
            fontSize="medium"
            htmlColor="#373d43"
            sx={{ cursor: "move", transform: "rotate(90deg)" }}
          />
          <IconButton onClick={() => setOpen(false)} sx={{ padding: 0 }}>
            <Close fontSize="medium" htmlColor="#373d43" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ padding: "10px !important" }}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions
          sx={{
            padding: "0 10px 10px 10px",
            justifyContent: "space-between",
            button: {
              padding: "4px 12px",
              textTransform: "none",
            },
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};
