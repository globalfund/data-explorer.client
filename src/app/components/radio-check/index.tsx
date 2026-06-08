import RadioCheckOn from "app/assets/vectors/RadioCheckOn.svg?react";
import RadioCheckOff from "app/assets/vectors/RadioCheckOff.svg?react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import type { ChangeEvent } from "react";

interface RadioCheckProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
}

const RadioCheck: React.FC<RadioCheckProps> = ({
  checked,
  onChange,
  label,
  ariaLabel,
  disabled = false,
  id,
  name,
  value,
}) => {
  return (
    <Box
      component="label"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        gap: "6px",
        opacity: disabled ? 0.6 : 1,
        "& .RadioCheck-input:focus-visible + .RadioCheck-icon": {
          borderRadius: "50%",
          outline: "2px solid #1976d2",
          outlineOffset: "2px",
        },
      }}
    >
      <Box
        component="input"
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.checked)
        }
        aria-label={label ? undefined : (ariaLabel ?? "Toggle selection")}
        className="RadioCheck-input"
        sx={{
          border: 0,
          clip: "rect(0 0 0 0)",
          height: 1,
          margin: -1,
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          whiteSpace: "nowrap",
          width: 1,
        }}
      />
      <Box
        component="span"
        aria-hidden="true"
        className="RadioCheck-icon"
        sx={{
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        {checked ? (
          <RadioCheckOn aria-hidden="true" focusable="false" />
        ) : (
          <RadioCheckOff aria-hidden="true" focusable="false" />
        )}
      </Box>
      {label && (
        <Typography
          component="span"
          variant="body2"
          fontSize="14px"
          color="#000000"
          lineHeight="normal"
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};

RadioCheck.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
};

export default RadioCheck;
