import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Check from "@mui/icons-material/Check";
import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import { KeyboardArrowDown } from "@mui/icons-material";

export interface SelectFieldOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  sx?: any;
  disabled?: boolean;
}

const filterOptions = createFilterOptions<SelectFieldOption>({ trim: true });

interface SelectFieldProps {
  options: SelectFieldOption[];
  value: string;
  onChange: (value: any) => void;
  width?: number | string;
  label?: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
}

export default function SelectField({
  options,
  value,
  onChange,
  width,
  label,
  disabled,
  placeholder,
}: Readonly<SelectFieldProps>) {
  const id = React.useId();
  const [searchQuery, setSearchQuery] = React.useState<string | null>(null);
  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <Box sx={{ width }}>
      {label ? (
        <Typography
          component="label"
          htmlFor={id}
          sx={{
            display: "block",
            color: "#373D43",
            fontSize: "14px",
            marginBottom: "8px",
          }}
        >
          {label}
        </Typography>
      ) : null}

      <Autocomplete
        id={id}
        options={options}
        value={selectedOption}
        disabled={disabled}
        autoHighlight
        disableClearable={Boolean(selectedOption)}
        openOnFocus
        selectOnFocus
        filterOptions={filterOptions}
        onInputChange={(_event, inputValue, reason) => {
          setSearchQuery(reason === "input" ? inputValue : null);
        }}
        onClose={(_event, reason) => {
          if (
            (reason === "blur" || reason === "toggleInput") &&
            (searchQuery !== null || !selectedOption)
          ) {
            const firstOption = filterOptions(options, {
              inputValue: searchQuery ?? "",
              getOptionLabel: (option) => option.label,
            }).find((option) => !option.disabled);

            if (firstOption && firstOption.value !== value) {
              onChange(firstOption.value);
            }
          }
          setSearchQuery(null);
        }}
        getOptionLabel={(option) => option.label}
        getOptionKey={(option) => option.value}
        getOptionDisabled={(option) => Boolean(option.disabled)}
        isOptionEqualToValue={(option, selected) =>
          option.value === selected.value
        }
        onChange={(_event, option) => {
          if (option && !option.disabled) {
            onChange(option.value);
          }
        }}
        popupIcon={<KeyboardArrowDown />}
        noOptionsText="No options found"
        size="small"
        sx={{
          width: "100%",
          opacity: disabled ? 0.6 : 1,
          "& .MuiOutlinedInput-root": {
            height: "35px",
            padding: "0px 8px",
            fontSize: "14px",
            fontWeight: 400,
            color: "#000",
            bgcolor: "#fff",
            borderRadius: "4px",
            "& fieldset": {
              border: "0.5px solid #98A1AA",
            },
            "&:hover fieldset, &.Mui-focused fieldset": {
              borderColor: "#98A1AA",
              borderWidth: "0.5px",
            },
            "& .MuiAutocomplete-input": {
              padding: 0,
            },
          },
          "& .MuiAutocomplete-popupIndicator": {
            color: "#000",
          },
        }}
        slotProps={{
          paper: {
            className: "rte-keep-open",
            sx: {
              marginTop: "2px",
              borderRadius: "4px",
              border: "1px solid #98A1AA",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.30)",
            },
          },
          listbox: {
            sx: {
              maxHeight: 360,
              padding: 0,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder || "Select..."}
            inputProps={{
              ...params.inputProps,
              title: selectedOption?.label || placeholder || "Select...",
              "aria-label": label ? undefined : placeholder || "Select option",
            }}
          />
        )}
        renderOption={({ key, ...props }, option, { selected }) => (
          <Box
            component="li"
            key={key}
            {...props}
            sx={{
              position: "relative",
              "&.MuiAutocomplete-option": {
                padding: "11px 16px",
                fontWeight: 400,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                "&[aria-selected='true']": {
                  bgcolor: "#F8F9FA",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: "5%",
                  width: "90%",
                  height: "1px",
                  bgcolor: "#E0E0E0",
                },
                "&:last-child::after": {
                  display: "none",
                },
                ...option.sx,
              },
            }}
          >
            {option.icon ?? null}
            <Typography
              title={option.label}
              component="span"
              sx={{
                maxWidth: "calc(100% - 24px)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "14px",
              }}
            >
              {option.label}
            </Typography>
            {selected && <Check fontSize="small" htmlColor="#495057" />}
          </Box>
        )}
      />
    </Box>
  );
}
