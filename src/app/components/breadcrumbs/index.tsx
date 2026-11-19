import React from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { BreadcrumbsProps } from "app/components/breadcrumbs/data";

export const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  return (
    <Box
      sx={{
        gap: "8px",
        display: "flex",
        padding: "20px 0 10px 0",
        "> a": {
          color: "#000",
          fontSize: "14px",
          textDecoration: "none",
        },
      }}
    >
      {props.items.map((item) => (
        <React.Fragment key={item.label}>
          {item.path ? (
            <Link to={item.path}>{item.label}</Link>
          ) : (
            <Typography fontSize="14px">{item.label}</Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};
