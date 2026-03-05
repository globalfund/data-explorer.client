import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

interface SearchboxProps {
  search: string;
  searchInputRef: any;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchIconClick: (showSearch: boolean) => () => void;
}

export default function Searchbox(props: SearchboxProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        height: "31px",
        borderRadius: "4px",
        border: "1px solid #98A1AA",
        width: "100%",
        input: {
          background: "#F8F8F8",
          width: "410px",
          color: "#000",
          outline: "none",
          padding: "0 8px",
          fontSize: "14px",
          height: "100%",
          border: "none",
          borderRadius: "4px",
          "::placeholder": {
            color: "#495057",
          },
        },
        "@media (max-width: 1024px)": {
          input: {
            width: "100%",
          },
        },
      }}
    >
      <input
        type="text"
        value={props.search}
        ref={props.searchInputRef}
        onChange={props.handleSearch}
        placeholder="e.g. Kenya"
        data-cy="grants-search-input"
        aria-label="Search grants"
      />

      <IconButton
        sx={{
          width: "40px",
          height: "100%",
          display: "flex",
          padding: "8px 12px",
          borderRadius: "4px",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          borderColor: "#000",
          svg: {
            color: "#fff",
          },
          ":hover": {
            background: "#000",
            borderColor: "#000",
            svg: {
              color: "#fff",
            },
          },
        }}
        data-cy="grants-search-btn"
        aria-label="Search grants"
      >
        <SearchIcon htmlColor="#000" fontSize="small" />
      </IconButton>
    </Box>
  );
}
