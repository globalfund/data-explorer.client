import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import LocationIcon from "@mui/icons-material/LocationOn";
import { GrantCardProps } from "app/components/grant-card/data";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { getMonthFromNumber } from "app/utils/getMonthFromNumber";
// import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";

export const GrantCard: React.FC<GrantCardProps> = (props: GrantCardProps) => {
  const dates = React.useMemo(() => {
    const res: string[] = [];
    if (props.startDate) {
      const date = new Date(props.startDate);
      res.push(
        `${date.getDate()} ${getMonthFromNumber(
          date.getMonth() + 1,
        )} ${date.getFullYear()}`,
      );
    } else {
      res.push("-");
    }
    if (props.endDate) {
      const date = new Date(props.endDate);
      res.push(
        `${date.getDate()} ${getMonthFromNumber(
          date.getMonth() + 1,
        )} ${date.getFullYear()}`,
      );
    } else {
      res.push("-");
    }
    return res;
  }, [props.startDate, props.endDate]);

  return (
    <Box
      display="flex"
      padding="16px"
      borderRadius="20px"
      letterSpacing="0.5px"
      bgcolor="transparent"
      flexDirection="column"
      border="1px solid #B1B1B1"
      data-cy="grant-card"
      sx={{
        "*": {
          lineHeight: "1.4",
        },
        hr: {
          borderColor: "#DFE3E5",
        },
      }}
    >
      <Box
        width="100%"
        display="flex"
        marginBottom="12px"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Typography fontSize="14px" fontWeight="700">
          {props.status}
        </Typography>
        <Typography fontSize="14px" fontWeight="700">
          {props.component}
        </Typography>
      </Box>
      <Box
        width="100%"
        display="flex"
        marginBottom="12px"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box gap="4px" display="flex" alignItems="center" marginLeft="-4px">
          <LocationIcon fontSize="small" />
          <Typography fontSize="14px" fontWeight="700">
            {props.location}
          </Typography>
        </Box>
        {/* <Box gap="4px" display="flex" alignItems="center">
            <SignalCellularAltIcon fontSize="small" />
            <Typography fontSize="12px" fontWeight="700">
              {props.rating}
            </Typography>
          </Box> */}
      </Box>
      <Typography variant="body1" fontWeight="700" fontSize="16px">
        {props.number}
      </Typography>
      <Divider
        sx={{
          margin: "8px 0",
        }}
      />
      <Box gap="6px" display="flex" flexDirection="column">
        <Box width="100%" display="flex" justifyContent="space-between">
          <Typography width="140px" fontSize="14px" fontWeight="700">
            Principal recipient:
          </Typography>
          <Typography
            fontSize="14px"
            overflow="hidden"
            whiteSpace="nowrap"
            letterSpacing="normal"
            textOverflow="ellipsis"
            maxWidth="calc(100% - 160px)"
          >
            {props.principalRecipient}
          </Typography>
        </Box>
        <Box width="100%" display="flex" justifyContent="space-between">
          <Typography fontSize="14px" fontWeight="700">
            Start / end date:
          </Typography>
          <Typography fontSize="14px" letterSpacing="normal">
            {dates.join(" / ")}
          </Typography>
        </Box>
      </Box>
      <Divider
        sx={{
          margin: "8px 0 16px 0",
        }}
      />
      <Box gap="6px" display="flex" flexDirection="column">
        <Box width="100%" display="flex" justifyContent="space-between">
          <Typography fontSize="14px" fontWeight="700">
            Signed
          </Typography>
          <Typography fontSize="14px" letterSpacing="normal">
            {formatFinancialValue(props.signed)}
          </Typography>
        </Box>
        <Box width="100%" display="flex" justifyContent="space-between">
          <Typography fontSize="14px" fontWeight="700">
            Disbursed · {props.percentage}%
          </Typography>
          <Typography fontSize="14px" letterSpacing="normal">
            {formatFinancialValue(props.disbursed)}
          </Typography>
        </Box>
        <Box
          width="100%"
          height="4px"
          display="flex"
          bgcolor="#C7CDD1"
          borderRadius="20px"
        >
          <Box
            bgcolor="#373D43"
            borderRadius="20px"
            width={`${props.percentage}%`}
          />
        </Box>
      </Box>
    </Box>
  );
};
