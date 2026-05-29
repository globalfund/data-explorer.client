import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import { useLocation } from "react-router-dom";
import { Search } from "app/components/search";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import useMediaQuery from "@mui/material/useMediaQuery";
// import UserIcon from "app/assets/vectors/UserIcon.svg?react";
import HeaderMenuIcon from "app/assets/vectors/HeaderMenu.svg?react";
import { HeaderSearchProps } from "app/components/header-search/data";
import HeaderCloseIcon from "app/assets/vectors/HeaderClose.svg?react";
import HeaderSearchIcon from "app/assets/vectors/HeaderSearch.svg?react";

export const HeaderSearch: React.FC<HeaderSearchProps> = (props) => {
  const { pathname, hash } = useLocation();
  const mobile = useMediaQuery("(max-width: 767px)");

  const isAuthPage = React.useMemo(() => {
    return pathname === "/sign-in" || pathname === "/sign-up";
  }, [pathname]);

  const onSearchBtnClick = () => {
    props.setSearchOpen(!props.searchOpen);
    if (!props.searchOpen)
      setTimeout(() => {
        const input = document.getElementById("general-search");
        if (input) input.focus();
      }, 100);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "/") {
      e.preventDefault();
      props.setSearchOpen(true);
      setTimeout(() => {
        const input = document.getElementById("general-search");
        if (input) input.focus();
      }, 100);
    }
  };

  const onMobileMenuToggle = React.useCallback(
    () => props.setMobileMenuOpen(!props.mobileMenuOpen),
    [props.mobileMenuOpen],
  );

  React.useEffect(() => {
    setTimeout(() => {
      if (!hash) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (props.searchOpen) props.setSearchOpen(false);
        if (props.mobileMenuOpen) props.setMobileMenuOpen(false);
      }
    }, 100);
  }, [pathname]);

  React.useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);

    return () => document.removeEventListener("keypress", handleKeyPress);
  }, []);

  if (mobile) {
    return (
      <React.Fragment>
        <Box
          sx={{
            gap: "10px",
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {props.searchOpen && (
            <React.Fragment>
              <IconButton onClick={onSearchBtnClick} sx={{ padding: 0 }}>
                <ArrowBack fontSize="large" htmlColor={colors.primary.black} />
              </IconButton>
              <Box
                sx={{
                  width: "100%",
                  borderRadius: "4px",
                  "#search-container": {
                    width: "100%",
                    height: "43px",
                    borderRadius: "4px",
                    input: {
                      fontSize: "14px",
                      borderRadius: "4px",
                      background: colors.primary.white,
                    },
                  },
                  "#search-icon": {
                    display: "none",
                  },
                  "#search-category-dropdown": {
                    display: "none",
                  },
                  "#search-results-container": {
                    top: "70px",
                    left: "16px",
                    boxShadow: "none",
                    width: "calc(100vw - 32px)",
                    bgcolor: colors.primary.gray,
                  },
                  "#search-results-progress": {
                    top: "0px",
                  },
                  "#search-results-component": {
                    height: "calc(100vh - 90px)",
                    minHeight: "calc(100vh - 90px)",
                    maxHeight: "calc(100vh - 90px)",
                  },
                  "> div": {
                    width: "100%",
                    "> div": {
                      position: "unset",
                    },
                  },
                }}
              >
                <Search hocClose={() => props.setSearchOpen(false)} />
              </Box>
            </React.Fragment>
          )}
          {!props.searchOpen && (
            <React.Fragment>
              {isAuthPage ? null : (
                <IconButton onClick={onSearchBtnClick} sx={{ padding: 0 }}>
                  <HeaderSearchIcon />
                </IconButton>
              )}
              <IconButton
                onClick={onMobileMenuToggle}
                sx={{
                  padding: 0,
                  path: {
                    stroke: props.mobileMenuOpen
                      ? "#3154f4"
                      : colors.primary.black,
                  },
                }}
              >
                <HeaderMenuIcon />
              </IconButton>
            </React.Fragment>
          )}
        </Box>
        <Collapse
          sx={{
            left: 0,
            top: "58px",
            width: "100vw",
            position: "absolute",
          }}
          in={props.searchOpen}
        >
          <Box
            sx={{
              width: "100vw",
              padding: "0 16px",
              height: "calc(100vh - 58px)",
              bgcolor: colors.primary.gray,
            }}
          >
            <Typography
              fontSize="14px"
              color="#adb5bd"
              paddingTop="16px"
              borderTop="1px solid #cfd4da"
            >
              Start typing to search...
            </Typography>
          </Box>
        </Collapse>
      </React.Fragment>
    );
  }

  return (
    <Box
      sx={{
        right: "0px",
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        alignItems: "center",
        justifyContent: "flex-end",
        "@media (max-width: 1216px)": {
          right: "16px",
        },
      }}
    >
      {props.searchOpen && (
        <Box
          sx={{
            width: "171px",
            borderRadius: "23px",
            "#search-container": {
              width: "100%",
              height: "38px",
              borderRadius: "4px",
              input: {
                fontSize: "14px",
                borderRadius: "4px",
                background: colors.primary.white,
              },
            },
            "#search-icon": {
              display: "none",
            },
            "#search-category-dropdown": {
              display: "none",
            },
            "#search-results-container": {
              top: "49px",
              width: "500px",
            },
            "> div": {
              width: "100%",
            },
          }}
          data-cy="header-search-container"
        >
          <Search hocClose={() => props.setSearchOpen(false)} />
        </Box>
      )}

      {isAuthPage ? null : (
        <Tooltip title={!props.searchOpen ? "Search" : "Close"}>
          <IconButton
            data-cy="header-search-btn"
            onClick={onSearchBtnClick}
            sx={{ padding: "6px" }}
          >
            {!props.searchOpen ? <HeaderSearchIcon /> : <HeaderCloseIcon />}
          </IconButton>
        </Tooltip>
      )}
      {/* <IconButton
        sx={{
          marginLeft: "12px",
          path: {
            stroke: pathname.startsWith("/sign-")
              ? "#3154f4"
              : colors.primary.black,
          },
        }}
        component={Link}
        to="/sign-in"
      >
        <UserIcon />
      </IconButton> */}
    </Box>
  );
};
