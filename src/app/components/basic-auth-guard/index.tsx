import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { isStagingEnv, getBasicAuthCredentials } from "app/utils/environment";

const SESSION_KEY = "ai-explorer-auth";

interface Props {
  children: React.ReactNode;
}

export const BasicAuthGuard: React.FC<Props> = ({ children }) => {
  const isStaging = isStagingEnv();
  const credentials = getBasicAuthCredentials();

  const [authenticated, setAuthenticated] = React.useState(() => {
    if (!isStaging || !credentials) return true;
    return sessionStorage.getItem(SESSION_KEY) === "ok";
  });

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);

  if (authenticated) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials) {
      setAuthenticated(true);
      return;
    }
    if (username === credentials.user && password === credentials.pass) {
      sessionStorage.setItem(SESSION_KEY, "ok");
      setAuthenticated(true);
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box
        component="form"
        data-testid="basic-auth-form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 320,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Access Required
        </Typography>
        <TextField
          label="Username"
          size="small"
          autoComplete="username"
          inputProps={{ "data-testid": "basic-auth-username" }}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(false);
          }}
        />
        <TextField
          label="Password"
          type="password"
          size="small"
          autoComplete="current-password"
          inputProps={{ "data-testid": "basic-auth-password" }}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          error={error}
          helperText={error ? "Invalid credentials" : undefined}
        />
        <Button
          type="submit"
          variant="contained"
          disableElevation
          data-testid="basic-auth-submit"
        >
          Enter
        </Button>
      </Box>
    </Box>
  );
};
