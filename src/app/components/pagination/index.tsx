import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Input } from "app/components/search/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { PaginationProps } from "app/components/pagination/data";
import LastPageSharpIcon from "@mui/icons-material/LastPageSharp";
import FirstPageSharpIcon from "@mui/icons-material/FirstPageSharp";
import usePagination from "@mui/material/usePagination/usePagination";

export default function Pagination(props: PaginationProps) {
  const [showLastButton, setShowLastButton] = React.useState(true);
  const [showFirstButton, setShowFirstButton] = React.useState(true);
  const [siblingCount, setSiblingCount] = React.useState(2);

  const { items } = usePagination({
    count: Math.ceil(props.count / 9),
    showFirstButton,
    showLastButton,
    siblingCount,
    defaultPage: props.page,
    page: props.page,
    onChange: props.handlePageChange,
  });
  const mobile = useMediaQuery("(max-width: 670px)");
  const md = useMediaQuery("(max-width: 697px)");
  const tablet = useMediaQuery("(max-width: 800px)");
  const rangeFrom = (props.page - 1) * 9 + 1;
  const rangeto = props.page * 9 > props.count ? props.count : props.page * 9;

  React.useEffect(() => {
    if (mobile) {
      setSiblingCount(0);
      setShowFirstButton(false);
      setShowLastButton(false);
    } else if (md) {
      setSiblingCount(0);
    } else if (tablet) {
      setSiblingCount(1);
    }
  }, [mobile, tablet]);

  return (
    <Box>
      <Box
        gap="30px"
        display="flex"
        alignItems="center"
        sx={{
          "@media(max-width:1067px)": {
            justifyContent: "space-between",
            flexWrap: "wrap",
          },
        }}
      >
        <Typography fontSize="16px">
          {rangeFrom}-{rangeto} of {props.count}
        </Typography>
        <Box
          gap="10px"
          display="flex"
          alignItems="center"
          sx={{
            "@media(max-width:1067px)": {
              width: "100%",
              order: 3,
            },
            "@media(max-width:697px)": {
              gap: "8px",
            },
          }}
        >
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null;
            if (type === "last" || type === "first") {
              children = (
                <Button
                  startIcon={type === "first" && <FirstPageSharpIcon />}
                  endIcon={type === "last" && <LastPageSharpIcon />}
                  {...item}
                  sx={{
                    borderRadius: "4px",
                    border: "1px solid #98A1AA",
                    display: "flex",
                    padding: "9px 12px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                    flex: "1 0 0",
                    textTransform: "capitalize",
                    background: "none",
                    height: "31px",
                    fontWeight: "normal",
                  }}
                >
                  {type}
                </Button>
              );
            } else if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = "…";
            } else if (type === "page") {
              children = (
                <Button
                  {...item}
                  sx={{
                    borderRadius: "4px",
                    border: "1px solid #98A1AA",
                    display: "flex",
                    padding: "9px 12px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                    flex: "1 0 0",
                    textTransform: "capitalize",
                    background: selected ? "#1C1C1C" : "none",
                    color: selected ? "#fff" : "#1C1C1C",
                    minWidth: "31px",
                    height: "31px",
                    fontWeight: "normal",
                    "@media(max-width:389px)": {
                      padding: "7px 5px",
                    },
                    ":hover": {
                      color: selected ? "#fff" : "#000",
                      background: selected ? "#1C1C1C" : "none",
                    },
                  }}
                >
                  {page}
                </Button>
              );
            } else {
              children = (
                <Button
                  startIcon={type === "previous" && <ChevronLeft />}
                  endIcon={type === "next" && <ChevronRight />}
                  {...item}
                  sx={{
                    borderRadius: "4px",
                    border: "1px solid #98A1AA",
                    display: "flex",
                    padding: "9px 12px",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "normal",
                    flex: "1 0 0",
                    textTransform: "capitalize",
                    background: "none",
                    height: "31px",
                    "@media(max-width:389px)": {
                      padding: "7px 5px",
                      gap: "0px",
                      span: {
                        margin: "0",
                      },
                    },
                  }}
                >
                  {type === "previous" ? "Back" : type}
                </Button>
              );
            }

            return <Box key={index}>{children}</Box>;
          })}
        </Box>
        <Box display="flex" gap="10px" alignItems="center">
          <Typography fontSize="16px">Page</Typography>
          <Box
            sx={{
              input: {
                width: "70px",
                height: "31px",
                borderRadius: "5px",
                background: "#F1F3F5",
                color: "#373D43",
                textAlign: "center",
              },
            }}
          >
            <Input
              type="text"
              value={props.pageSearchValue}
              aria-label="Page pagination input"
              onChange={props.handlePageSearchChange}
            />
          </Box>
          <IconButton
            onClick={props.handlePageSearch}
            sx={{
              height: "31px",
              width: "44px",
              border: "1px solid #98A1AA",
              borderRadius: "4px",
              background: "none",
              fontFamily: "Inter",
              fontSize: "16px",
              fontWeight: "bold",
              padding: "none",
              color: "#000000",
            }}
          >
            Go
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
