import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  weightOptions,
  fontFamilyOptions,
  fontSizeOptions,
} from "app/components/rich-text-editor/data";
import ParagraphAdd from "app/assets/vectors/RBParagraphAdd.svg?react";
import ParagraphRemove from "app/assets/vectors/RBParagraphRemove.svg?react";
import ListBulleted from "app/assets/vectors/RBListBulleted.svg?react";
import ListNumbered from "app/assets/vectors/RBListNumbered.svg?react";
import Strikethrough from "app/assets/vectors/RBStrikethrough.svg?react";
import Underline from "app/assets/vectors/RBUnderline.svg?react";
import Blockquotes from "app/assets/vectors/RBBlockquotes.svg?react";
import LinkIcon from "app/assets/vectors/RBLink.svg?react";

import { Editor, useEditorState } from "@tiptap/react";
import {
  FormatAlignLeft,
  KeyboardArrowUp,
  FormatAlignRight,
  FormatAlignCenter,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { ColorPicker } from "app/components/color-picker/example";
import { ColorService } from "app/components/color-picker/utils/color";
import StyledMenu from "../../common/menu-popup";
import AlignButtons from "./align-buttons";
import TextField from "../../common/textField";

export const RTEToolbar: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [fontFamilyAnchorEl, setFontFamilyAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [fontWeightAnchorEl, setFontWeightAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [fontSizeAnchorEl, setFontSizeAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isFontFamilyMenuActive = Boolean(fontFamilyAnchorEl);
  const isFontWeightMenuActive = Boolean(fontWeightAnchorEl);
  const isFontSizeMenuActive = Boolean(fontSizeAnchorEl);
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isUnderlined: ctx.editor.isActive("underline"),
        color: ctx.editor.getAttributes("textStyle").color ?? "#000000",
        bgColor:
          ctx.editor.getAttributes("textStyle").backgroundColor ?? "#ffffff",
        fontSize: ctx.editor.getAttributes("textStyle").fontSize ?? "16px",
        isNormalText: ctx.editor.isActive("paragraph"),
        isTitle: ctx.editor.isActive("heading", { level: 10 }),
        isSubtitle: ctx.editor.isActive("heading", { level: 11 }),
        isH1: ctx.editor.isActive("heading", { level: 1 }),
        isH2: ctx.editor.isActive("heading", { level: 2 }),
        isH3: ctx.editor.isActive("heading", { level: 3 }),
        isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
        isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
        isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
        isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        isStrikethrough: ctx.editor.isActive("strike") ?? false,
        isLink: ctx.editor.isActive("link") ?? false,
        isFontFamilyInter: ctx.editor.isActive("textStyle", {
          fontFamily: "Inter",
        }),
        isFontFamilyArial: ctx.editor.isActive("textStyle", {
          fontFamily: "Arial",
        }),
        isFontFamilyTimesNewRoman: ctx.editor.isActive("textStyle", {
          fontFamily: "Times New Roman",
        }),
        isFontFamilyCourierNew: ctx.editor.isActive("textStyle", {
          fontFamily: "Courier New",
        }),
        fontFamily: ctx.editor.getAttributes("textStyle").fontFamily ?? "Inter",
        fontWeight: ctx.editor.getAttributes("textStyle").fontWeight ?? "400",
        letterSpacing:
          ctx.editor.getAttributes("textStyle").letterSpacing ?? "0px",
        lineHeight: ctx.editor.getAttributes("textStyle").lineHeight ?? "Auto",
      };
    },
  });
  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    menuType: string,
  ) => {
    switch (menuType) {
      case "fontFamily":
        setFontFamilyAnchorEl(event.currentTarget);
        break;
      case "fontWeight":
        setFontWeightAnchorEl(event.currentTarget);
        break;
      case "fontSize":
        setFontSizeAnchorEl(event.currentTarget);
        break;
    }
  };

  const handleClose = (menuType: string) => {
    switch (menuType) {
      case "fontFamily":
        setFontFamilyAnchorEl(null);
        break;
      case "fontWeight":
        setFontWeightAnchorEl(null);
        break;
      case "fontSize":
        setFontSizeAnchorEl(null);
        break;
    }
  };

  const onWeightChange = (value: string) => {
    const weight = weightOptions.find((option) => option.value === value);
    if (!weight) return;
    if (weight?.value.includes("italic")) {
      editor
        .chain()
        .focus()
        .setItalic()
        .setFontWeight(weight.value.split("+")[0])
        .run();
    } else {
      editor.chain().focus().unsetItalic().setFontWeight(weight.value).run();
    }
  };

  const onFontSizeChange = (value: string) => {
    const valueNumber = Number(value.replace("px", ""));
    if (valueNumber < 1) return;
    editor
      .chain()
      .focus()
      .setFontSize(valueNumber.toString() + "px")
      .run();
  };

  const onLetterSpacingChange = (value: string) => {
    editor.chain().setLetterSpacing(value).run();
  };
  const onLineHeightChange = (value: string) => {
    editor.chain().setLineHeight(value).run();
  };

  const onFontFamilyChange = (value: string) => {
    editor.chain().focus().setFontFamily(value).run();
  };
  const addIndent = () => {};

  const removeIndent = () => {};

  const setLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const fontWeightValue = React.useMemo(() => {
    const selected = weightOptions.find(
      (option) =>
        option.value ===
        editorState.fontWeight + (editorState.isItalic ? "+italic" : ""),
    );
    return selected ? selected.value : "";
  }, [editorState.fontWeight]);
  const fontWeightLabel = weightOptions.find(
    (option) => option.value === fontWeightValue,
  )?.label;

  const fontFamilyValue = React.useMemo(() => {
    return (
      fontFamilyOptions.find(
        (option) => option.value === editorState.fontFamily,
      )?.value ?? "Inter"
    );
  }, [editorState.fontFamily]);

  return (
    <Box
      sx={{
        gap: "16px",
        width: "100%",
        display: "flex",
        borderRadius: "8px",
        padding: "16px 8px 16px 8px",
        flexDirection: "column",
        bgcolor: "#f8f9fa",

        ".icon-button": {
          padding: "0 5.143px",
          borderRadius: "3.6px",
          border: "0.5px solid #98A1AA",
          width: "36px",
          height: "36px",
          background: "#fff",
          ":hover": { background: "#f1f3f5" },
        },
        ".active-icon-button": {
          background: "#3154F4",
          borderRadius: "3.6px",
          width: "36px",
          height: "36px",
          svg: {
            path: {
              fill: "#fff",
              stroke: "#fff",
            },
          },
        },
      }}
    >
      <Box>
        <Typography
          sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
        >
          Font
        </Typography>
        {/* Font family */}
        <Button
          variant="text"
          onClick={(event) => handleClick(event, "fontFamily")}
          endIcon={
            isFontWeightMenuActive ? <KeyboardArrowUp /> : <KeyboardArrowDown />
          }
          sx={{
            fontWeight: "400",
            textTransform: "none",
            color: "#000",
            bgcolor: "#fff",
            width: "100%",
            justifyContent: "space-between",
            borderRadius: "4px",
            border: "0.5px solid #98A1AA",
          }}
        >
          {fontFamilyValue}
        </Button>

        <StyledMenu
          open={isFontFamilyMenuActive}
          anchorEl={fontFamilyAnchorEl}
          onClose={() => handleClose("fontFamily")}
          options={fontFamilyOptions}
          activeValue={fontFamilyValue}
          onSelect={onFontFamilyChange}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          {/* Paragraph / Headings */}
          <Typography
            sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
          >
            Weight
          </Typography>
          <Button
            variant="text"
            onClick={(event) => handleClick(event, "fontWeight")}
            endIcon={
              isFontWeightMenuActive ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown />
              )
            }
            sx={{
              fontWeight: "400",
              textTransform: "none",
              color: "#000",
              bgcolor: "#fff",
              width: "134px",
              justifyContent: "space-between",
              borderRadius: "4px",
              border: "0.5px solid #98A1AA",
            }}
          >
            <Typography
              title={fontWeightLabel}
              sx={{
                maxWidth: "calc(100% - 24px)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fontWeightLabel}
            </Typography>
          </Button>

          <StyledMenu
            open={isFontWeightMenuActive}
            anchorEl={fontWeightAnchorEl}
            onClose={() => handleClose("fontWeight")}
            options={weightOptions}
            activeValue={fontWeightValue}
            onSelect={onWeightChange}
          />
        </Box>

        <Box>
          <Typography
            sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
          >
            Size
          </Typography>
          <Button
            variant="text"
            onClick={(event) => handleClick(event, "fontSize")}
            endIcon={
              isFontSizeMenuActive ? <KeyboardArrowUp /> : <KeyboardArrowDown />
            }
            sx={{
              fontWeight: "400",
              textTransform: "none",
              color: "#000",
              bgcolor: "#fff",
              width: "134px",
              justifyContent: "space-between",
              borderRadius: "4px",
              border: "0.5px solid #98A1AA",
            }}
          >
            {editorState.fontSize}
          </Button>

          <StyledMenu
            open={isFontSizeMenuActive}
            anchorEl={fontSizeAnchorEl}
            onClose={() => handleClose("fontSize")}
            options={fontSizeOptions}
            activeValue={editorState.fontSize.replace("px", "")}
            onSelect={onFontSizeChange}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
          >
            Line Height
          </Typography>

          <TextField
            type="letterSpacing"
            value={editorState.lineHeight}
            onChange={onLineHeightChange}
            width="134px"
            item="text"
          />
        </Box>
        <Box>
          <Typography
            sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
          >
            Letter Spacing
          </Typography>

          <TextField
            type="letterSpacing"
            value={editorState.letterSpacing}
            onChange={onLetterSpacingChange}
            width="134px"
            item="text"
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "13px" }}>
          {/* Alignment */}
          <IconButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={
              editorState.isAlignLeft ? "active-icon-button" : "icon-button"
            }
          >
            <FormatAlignLeft fontSize="small" htmlColor="#495057" />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={
              editorState.isAlignCenter ? "active-icon-button" : "icon-button"
            }
          >
            <FormatAlignCenter fontSize="small" htmlColor="#495057" />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={
              editorState.isAlignRight ? "active-icon-button" : "icon-button"
            }
          >
            <FormatAlignRight fontSize="small" htmlColor="#495057" />
          </IconButton>
        </Box>
        <AlignButtons />
      </Box>

      <Divider orientation="vertical" flexItem />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography
            sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
          >
            Text Color
          </Typography>

          <ColorPicker
            color={ColorService.convert("hex", editorState.color)}
            onChange={(color) => {
              editor.chain().setColor(color.hex).run();
            }}
            disabled={false}
            onResetColor={() => {
              editor.chain().setColor("#000000").run();
            }}
            onChangeComplete={() => {}}
          />
        </Box>
        <Box>
          <Typography
            sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
          >
            Highlight Color
          </Typography>

          <ColorPicker
            color={ColorService.convert("hex", editorState.bgColor)}
            onChange={(color) => {
              editor.chain().setBackgroundColor(color.hex).run();
            }}
            disabled={false}
            onResetColor={() => {
              editor.chain().setBackgroundColor("#ffffff").run();
            }}
            onChangeComplete={() => {}}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "13px" }}>
          {/* Bold / Italic / Underline / Text Color / Highlight */}
          <IconButton
            onClick={() => addIndent()}
            className={
              editorState.isBold ? "active-icon-button" : "icon-button"
            }
          >
            <ParagraphAdd />
          </IconButton>
          <IconButton
            onClick={() => removeIndent()}
            className={
              editorState.isItalic ? "active-icon-button" : "icon-button"
            }
          >
            <ParagraphRemove />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editorState.isBulletList ? "active-icon-button" : "icon-button"
            }
          >
            <ListBulleted />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "13px" }}>
          {/* Lists */}

          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editorState.isOrderedList ? "active-icon-button" : "icon-button"
            }
          >
            <ListNumbered />
          </IconButton>

          {/* Strikethrough */}
          <IconButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={
              editorState.isStrikethrough ? "active-icon-button" : "icon-button"
            }
          >
            <Strikethrough />
          </IconButton>
          {/* Underline */}

          <IconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={
              editorState.isUnderlined ? "active-icon-button" : "icon-button"
            }
          >
            <Underline />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "13px" }}>
        {/* Link */}
        <IconButton
          onClick={setLink}
          className={editorState.isLink ? "active-icon-button" : "icon-button"}
        >
          <LinkIcon />
        </IconButton>
        {/* Blockquote */}
        <IconButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editorState.isBlockquote ? "active-icon-button" : "icon-button"
          }
        >
          <Blockquotes />
        </IconButton>
      </Box>
    </Box>
  );
};
