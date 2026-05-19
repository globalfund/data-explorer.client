import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { appColors } from "app/theme";
import EyeOpenIcon from "app/assets/vectors/EyeOpen.svg?react";
import EyeCloseIcon from "app/assets/vectors/EyeClose.svg?react";

interface AuthInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label: string;
}

interface AuthPasswordInputProps extends Omit<
  AuthInputProps,
  "type" | "autoComplete"
> {
  autoComplete?: "current-password" | "new-password";
}

const inputGroupSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const labelSx = {
  color: "#373D43",
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "normal",
  marginBottom: "8px",
};

const inputBoxSx = {
  width: "100%",
  height: "48px",
  display: "flex",
  alignItems: "center",
  border: "0.5px solid #98A1AA",
  borderRadius: "4px",
  background: appColors.COMMON.WHITE,
  padding: "0 16px",
  "&:focus-within": {
    borderColor: "#3154F4",
    borderWidth: "1px",
  },
};

const inputSx = {
  width: "100%",
  minWidth: 0,
  border: 0,
  outline: "none",
  padding: 0,
  color: appColors.COMMON.BLACK,
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  lineHeight: "18px",
  background: "transparent",
  "&::placeholder": {
    color: "#A8A8A8",
    opacity: 1,
  },
};

export const AuthInput: React.FC<AuthInputProps> = (props) => {
  const { label, id, ...inputProps } = props;

  return (
    <Box sx={inputGroupSx}>
      <Typography component="label" htmlFor={id} sx={labelSx}>
        {label}
      </Typography>
      <Box sx={inputBoxSx}>
        <Box id={id} component="input" sx={inputSx} {...inputProps} />
      </Box>
    </Box>
  );
};

export const AuthPasswordInput: React.FC<AuthPasswordInputProps> = (props) => {
  const { label, id, autoComplete = "current-password", ...inputProps } = props;
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Box sx={inputGroupSx}>
      <Typography component="label" htmlFor={id} sx={labelSx}>
        {label}
      </Typography>
      <Box sx={inputBoxSx}>
        <Box
          id={id}
          component="input"
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          sx={inputSx}
          {...inputProps}
        />
        <IconButton
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((current) => !current)}
          disableRipple
          sx={{
            width: "32px",
            height: "32px",
            minWidth: "32px",
            padding: 0,
            marginLeft: "16px",
            color: "#373D43",
            flexShrink: 0,
          }}
        >
          {showPassword ? (
            <EyeOpenIcon width={32} height={32} />
          ) : (
            <EyeCloseIcon width={32} height={32} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};
