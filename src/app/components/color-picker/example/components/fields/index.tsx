import ClickAwayListener from "@mui/material/ClickAwayListener";
import React, { useCallback, useEffect, useState } from "react";
import ExpandSelectIcon from "../../assets/expand-select";
import { IColor } from "app/components/color-picker/types";
import { Box, TextField } from "@mui/material";
import { ColorService } from "app/components/color-picker/utils/color";
import NullColor from "app/assets/vectors/RBNullColor.svg?react";

interface ISelectColorTypeProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}
export const SelectColorType = ({
  value,
  options,
  onChange,
}: ISelectColorTypeProps) => {
  const [open, setOpen] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box
        className="rcp-input"
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "74px",
          fontSize: "12px",
          fontWeight: 325,
          fontFamily: "GothamNarrow-Book, sans-serif",
          color: "#374151",
          cursor: "pointer",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        {value.toUpperCase()} <ExpandSelectIcon />
        {open ? (
          <Box
            sx={{
              position: "absolute",
              borderRadius: "10px",
              boxShadow: "0px 2px 6px 0px rgba(0, 0, 0, 0.3)",
              width: "100%",
              left: 0,
              top: "calc(100% + 2px)",
              display: "flex",
              flexDirection: "column",
              gap: "7px",
              padding: "7px 16px",
              background: "#f1f3f5",
            }}
          >
            {options.map((option) => (
              <Box
                key={option}
                sx={{
                  borderBottom: "1px solid #cfd4da",
                  paddingBottom: "7px",
                  ":last-of-type": {
                    borderBottom: "none",
                  },
                  fontSize: "12px",
                  fontWeight: 325,
                  fontFamily: "GothamNarrow-Book, sans-serif",
                  cursor: "pointer",
                  color: value === option ? "#ADB5BD" : "#374151",
                }}
                onClick={() => {
                  setOpen(false);
                  onChange(option);
                }}
              >
                {option.toUpperCase()}
              </Box>
            ))}
          </Box>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
};

interface IColorInputProps {
  color: IColor;
  onChange: (color: IColor) => void;
  disabled?: boolean;
}

export const ColorInput = ({ color, onChange, disabled }: IColorInputProps) => {
  const [fields, setFields] = useState({
    hex: {
      value: color?.hex,
      inputted: false,
    },
    rgb: {
      value: color?.rgb,
      inputted: false,
    },
  });

  useEffect(() => {
    if (!color) {
      return;
    }
    if (!fields.hex.inputted) {
      setFields((oldFields) => ({
        ...oldFields,
        hex: { ...fields.hex, value: color.hex },
      }));
    }
  }, [fields.hex.inputted, color?.hex]);

  useEffect(() => {
    if (!color) {
      return;
    }
    if (!fields.rgb.inputted) {
      setFields((oldFields) => ({
        ...oldFields,
        rgb: { ...fields.rgb, value: color.rgb },
      }));
    }
  }, [fields.rgb.inputted, color?.rgb]);

  const onInputFocus = useCallback(
    <T extends keyof typeof fields>(field: T) =>
      () => {
        setFields((oldFields) => ({
          ...oldFields,
          [field]: { ...fields[field], inputted: true },
        }));
      },
    [],
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!color) {
      return;
    }
    const value = event.target.value;
    const newColor = ColorService.convert("hex", value);

    setFields((oldFields) => ({
      ...oldFields,
      hex: { ...fields["hex"], value },
    }));
    onChange(newColor);
  };

  return (
    <Box
      className="rcp-input"
      sx={{
        display: "flex",
        alignItems: "center",
        width: "120px",
        height: "28px",
        padding: "4px 6px",
      }}
    >
      {
        <TextField
          value={`#${fields.hex.value?.slice(1, 7)}`}
          variant="standard"
          slotProps={{
            input: {
              disableUnderline: true,
              sx: {
                fontSize: "12px",
              },
            },
          }}
          sx={{
            textTransform: "uppercase",
            height: "100%",
            outline: "none",
            border: "none",
            background: "transparent",
            width: "100%",
            color: "#374151",
          }}
          disabled={disabled}
          onChange={handleChange}
          onFocus={onInputFocus("hex")}
        />
      }
    </Box>
  );
};

interface OpacityInputProps {
  color: IColor;
  onChange: (color: IColor) => void;
  disabled?: boolean;
}

export const OpacityInput = ({
  color,
  onChange,
  disabled,
}: OpacityInputProps) => {
  if (!color) {
    return null;
  }
  const opacityPercent = Math.round(color?.rgb?.a * 100);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    if (value.endsWith("%")) {
      value = value?.slice(0, -1);
      const newOpacity = Number(value) / 100;
      const newColor = {
        ...color,
        rgb: {
          ...color.rgb,
          a: newOpacity,
        },
        hex: ColorService.rgb2hex({
          ...color.rgb,
          a: newOpacity,
        }),
        hsv: ColorService.rgb2hsv({
          ...color.rgb,
          a: newOpacity,
        }),
      };
      onChange(newColor);
    }
  };
  return (
    <Box
      className="rcp-input"
      sx={{
        display: "flex",
        alignItems: "center",
        width: "48px",
        height: "28px",
        padding: "4px 6px",
      }}
    >
      <TextField
        value={`${opacityPercent}%`}
        variant="standard"
        slotProps={{
          input: {
            disableUnderline: true,
            sx: {
              fontSize: "12px",
            },
          },
        }}
        sx={{
          width: "100%",
          border: "none",
          background: "transparent",
          outline: "none",
          height: "100%",
          padding: 0,
          color: "#374151",
        }}
        disabled={disabled}
        onChange={handleChange}
        // maxLength={4}
        // minLength={1}
      />
    </Box>
  );
};

export const ColorPreview = ({ color }: { color: IColor }) => {
  const opacityPercent = Math.round(color?.rgb?.a * 100);

  return (
    <React.Fragment>
      {opacityPercent === 0 ? (
        <NullColor width={28} height={28} />
      ) : (
        <Box
          className="rcp-sample-circle"
          sx={{
            backgroundColor: color?.hex,
          }}
        />
      )}
    </React.Fragment>
  );
};
