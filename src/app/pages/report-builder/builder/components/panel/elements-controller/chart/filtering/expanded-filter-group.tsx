import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CheckboxIcon from "app/assets/vectors/Checkbox_notchecked.svg?react";
import CheckboxCheckedIcon from "app/assets/vectors/Checkbox_checked.svg?react";
import { FilterGroupModel } from "app/state/api/action-reducers/report-builder/sync";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { get } from "lodash";
import React from "react";

interface ExpandedFilterGroupProps extends FilterGroupModel {
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
}

const ExpandedFilterGroup = (props: ExpandedFilterGroupProps) => {
  const [expandedNames, setExpandedNames] = React.useState<string[]>([]);

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (checked) {
      props.setSelectedFilters?.([...props.selectedFilters!, name]);
    } else {
      props.setSelectedFilters?.(
        props.selectedFilters!.filter((filter) => filter !== name),
      );
    }
  };
  console.log(props.options, "options", props.name);
  return (
    // TODO: Paginate options if too many
    <Box width="100%" position="relative" marginBottom="5px">
      <Box paddingLeft="20px">
        {props.options.map((option) => (
          <Accordion
            key={option.label}
            expanded={expandedNames.includes(option.label)}
            onChange={(e: React.SyntheticEvent, isExpanded: boolean) => {
              setExpandedNames((prev) => {
                if (isExpanded) {
                  return [...prev, option.label];
                } else {
                  return prev.filter((name) => name !== option.label);
                }
              });
            }}
            sx={{
              borderStyle: "none",
              paddingBottom: "0px !important",
              background: "transparent",
            }}
          >
            <AccordionSummary
              expandIcon={
                get(option, "subOptions.length", 0) > 0 ? (
                  <ExpandMoreIcon />
                ) : undefined
              }
              sx={{
                minHeight: "20px",
                position: "relative",
                justifyContent: "flex-start",
                "&.Mui-expanded": {
                  minHeight: "20px",
                },
                "> .MuiAccordionSummary-content": {
                  flexGrow: 0,
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    name={option.label}
                    icon={<CheckboxIcon />}
                    onChange={onCheckboxChange}
                    checkedIcon={<CheckboxCheckedIcon />}
                    checked={props.selectedFilters.indexOf(option.label) > -1}
                  />
                }
                label={option.label}
                checked={props.selectedFilters.indexOf(option.label) > -1}
                sx={{
                  marginLeft: "0px",
                  marginRight: "0px",
                  alignItems: "center",
                  "& .MuiFormControlLabel-label": {
                    zIndex: option.subOptions ? -1 : 0,
                    fontSize: "14px",
                    marginLeft: "5px",
                  },
                }}
              />
            </AccordionSummary>
            {(option.subOptions?.length ?? 0) > 0 && (
              <AccordionDetails>
                <ExpandedFilterGroup
                  name={option.label}
                  options={option.subOptions || []}
                  selectedFilters={props.selectedFilters}
                  setSelectedFilters={props.setSelectedFilters}
                />
              </AccordionDetails>
            )}
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default ExpandedFilterGroup;
