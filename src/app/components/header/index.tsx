import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { Search } from "app/components/search";
import Container from "@mui/material/Container";
import IconMenu from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import IconClose from "@mui/icons-material/Close";
import IconSearch from "@mui/icons-material/Search";
import { HeaderMenu } from "app/components/header-menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { NavLink, useLocation } from "react-router-dom";
import HeaderSearchIcon from "app/assets/vectors/HeaderSearch.svg?react";
import HeaderToolbarLogo from "app/assets/vectors/HeaderToolbarLogo.svg?react";

export const Header: React.FC = () => {
  const { pathname, hash } = useLocation();
  const mobile = useMediaQuery("(max-width: 767px)");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const onSearchBtnClick = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen)
      setTimeout(() => {
        const input = document.getElementById("general-search");
        if (input) input.focus();
      }, 100);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "/") {
      e.preventDefault();
      setSearchOpen(true);
      setTimeout(() => {
        const input = document.getElementById("general-search");
        if (input) input.focus();
      }, 100);
    }
  };

  const searchContent = React.useMemo(() => {
    if (mobile) {
      return (
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
          {searchOpen && (
            <Box
              sx={{
                maxWidth: "500px",
                borderRadius: "23px",
                width: "calc(100% - 48px)",
                "#search-container": {
                  width: "100%",
                  height: "24px",
                  borderRadius: "23px",
                  input: {
                    fontSize: "14px",
                    borderRadius: "23px",
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
                  top: "35px",
                  width: "500px",
                },
                "> div": {
                  width: "100%",
                },
              }}
            >
              <Search hocClose={() => setSearchOpen(false)} />
            </Box>
          )}
          <IconButton
            onClick={onSearchBtnClick}
            sx={{
              padding: 0,
              marginLeft: "-24px",
              background: colors.primary.black,
              "> svg": {
                transform: "scale(0.7)",
                color: colors.primary.white,
              },
              "&:hover": {
                opacity: 0.8,
                background: colors.primary.black,
                "> svg": {
                  color: colors.primary.white,
                },
              },
            }}
          >
            {!searchOpen ? <IconSearch /> : <IconClose />}
          </IconButton>
          <IconButton
            onClick={() => setMobileMenuOpen(true)}
            sx={{
              padding: 0,
            }}
          >
            <IconMenu htmlColor="#000" />
          </IconButton>
        </Box>
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
        {searchOpen && (
          <Box
            sx={{
              width: "171px",
              marginRight: "12px",
              borderRadius: "4px",
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
            <Search hocClose={() => setSearchOpen(false)} />
          </Box>
        )}
        <Tooltip title={!searchOpen ? "Search" : "Close"}>
          <IconButton
            data-cy="header-search-btn"
            onClick={onSearchBtnClick}
            sx={{ padding: "6px" }}
          >
            {!searchOpen ? (
              <HeaderSearchIcon />
            ) : (
              <IconClose htmlColor="#000" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    );
  }, [mobile, searchOpen]);

  React.useEffect(() => {
    setTimeout(() => {
      if (!hash) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (searchOpen) setSearchOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    }, 100);
  }, [pathname]);

  React.useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);

    return () => document.removeEventListener("keypress", handleKeyPress);
  }, []);

  return (
    <Box sx={{ zIndex: 1000, flexGrow: 1, top: 0, position: "sticky" }}>
      <AppBar position="static" sx={{ background: "#F8F8F8" }}>
        <Container maxWidth="lg" disableGutters sx={{ background: "#F8F8F8" }}>
          <Toolbar
            sx={{
              background: "#F8F8F8",
              "@media (max-width: 1279px)": {
                width: "100%",
              },
              "@media (max-width: 767px)": {
                padding: "0 16px",
              },
            }}
          >
            <NavLink
              to="/"
              aria-label="App logo link"
              style={{ display: "flex" }}
            >
              <HeaderToolbarLogo />
            </NavLink>
            <HeaderMenu
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
            {searchContent}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};
