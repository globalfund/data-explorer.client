import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import { NavLink, useLocation } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { HeaderMenu } from "app/components/header-menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { HeaderSearch } from "app/components/header-search";
import HeaderToolbarLogo from "app/assets/vectors/HeaderToolbarLogo.svg?react";

export const Header: React.FC = () => {
  const mobile = useMediaQuery("(max-width: 767px)");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const location = useLocation();

  const isAuthPage = React.useMemo(() => {
    return location.pathname === "/sign-in" || location.pathname === "/sign-up";
  }, [location.pathname]);

  return (
    <Box sx={{ zIndex: 1000, flexGrow: 1, top: 0, position: "sticky" }}>
      <AppBar position="static" sx={{ background: "#F8F8F8" }}>
        <Container maxWidth="lg" disableGutters sx={{ background: "#F8F8F8" }}>
          <Toolbar
            sx={{
              height: "77px",
              background: "#F8F8F8",
              "@media (max-width: 1279px)": {
                width: "100%",
              },
              "@media (max-width: 767px)": {
                padding: "0 16px",
                position: "relative",
              },
            }}
          >
            {(!mobile || !searchOpen) && (
              <NavLink
                to="/"
                aria-label="App logo link"
                style={{ display: "flex" }}
              >
                <HeaderToolbarLogo />
              </NavLink>
            )}

            {isAuthPage ? null : (
              <HeaderMenu
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
              />
            )}
            <HeaderSearch
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};
