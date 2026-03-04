import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import { Divider, styled } from "@mui/material";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Popover from "@mui/material/Popover";
import Accordion from "@mui/material/Accordion";
import Container from "@mui/material/Container";
import IconClose from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useLocation, useNavigate } from "react-router-dom";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import {
  getPages,
  HeaderMenuPage,
  HeaderMenuProps,
  isNavButtonActive,
  activeButtonStateStyle,
} from "app/components/header-menu/data";
import { useCMSData } from "app/hooks/useCMSData";

const HeaderMenuButton = styled(Button)({
  height: "100%",
  borderRadius: 0,
  fontSize: "16px",
  padding: "6px 15px",
  textTransform: "none",
  color: colors.primary.black,
  border: "1px solid transparent",
  borderBottom: "4px solid transparent",
  "&:hover": {
    background: "transparent",
  },
  "@media (max-width: 920px)": {
    minWidth: "120px",
  },
});

export const HeaderMenu: React.FC<HeaderMenuProps> = (
  props: HeaderMenuProps,
) => {
  const cmsData = useCMSData({ returnData: true });
  const PAGES = React.useMemo(() => getPages(cmsData), [cmsData]);
  const navigate = useNavigate();
  const location = useLocation();

  const mobile = useMediaQuery("(max-width: 767px)");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedPage, setSelectedPage] = React.useState<string | null>(null);

  const handleClick = (isSubPage: boolean, page: HeaderMenuPage) => () => {
    if (!isSubPage) {
      const container = document.getElementById("header-menu-tabs-container");
      setAnchorEl(container);
      setSelectedPage(page.id);
    }
    if (page.link) {
      navigate(page.link);
      handleClose();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedPage(null);
  };

  const onScroll = () => {
    setAnchorEl(null);
  };

  const handleCloseMobileMenu = () => {
    props.setMobileMenuOpen(false);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (mobile) {
    return (
      <Drawer
        anchor="right"
        open={props.mobileMenuOpen}
        onClose={handleCloseMobileMenu}
      >
        <IconButton
          sx={{
            top: "10px",
            zIndex: 1000,
            right: "10px",
            position: "absolute",
          }}
          onClick={handleCloseMobileMenu}
        >
          <IconClose htmlColor="#000" />
        </IconButton>
        <Box width="100vw" padding="16px">
          {PAGES.map((page) => {
            if (page.subPages) {
              return (
                <Accordion
                  expanded
                  key={page.id}
                  onChange={handleClick(false, page)}
                >
                  <AccordionSummary
                    sx={{
                      marginBottom: "8px",
                    }}
                  >
                    <Typography fontSize="20px" fontWeight="700">
                      {page.label}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {page.subPages.map((subPage) => (
                        <Button
                          key={subPage.id}
                          onClick={handleClick(false, subPage)}
                          sx={{
                            width: "100%",
                            padding: "6px 16px",
                            textTransform: "none",
                            color: colors.primary.black,
                            justifyContent: "flex-start",
                            fontWeight:
                              subPage.link === location.pathname
                                ? "700"
                                : "400",
                          }}
                        >
                          {subPage.label}
                        </Button>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            }
            return (
              <Button
                key={page.id}
                onClick={handleClick(false, page)}
                sx={{
                  width: "100%",
                  fontSize: "20px",
                  padding: "6px 0",
                  fontWeight: "700",
                  textTransform: "none",
                  color: colors.primary.black,
                  justifyContent: "flex-start",
                }}
              >
                {page.label}
              </Button>
            );
          })}
        </Box>
      </Drawer>
    );
  }

  return (
    <Box
      id="header-menu-tabs-container"
      sx={{
        gap: "15px",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {PAGES.slice(0, 3).map((page) => (
        <HeaderMenuButton
          id={page.id}
          key={page.id}
          disableRipple
          onClick={handleClick(false, page)}
          endIcon={
            page.subPages ? (
              <ChevronRight
                sx={{
                  scale: "1.5",
                  rotate: `${selectedPage === page.id ? -90 : 90}deg`,
                }}
              />
            ) : null
          }
          sx={
            isNavButtonActive(page.id, location.pathname) ||
            (page.subPages && Boolean(anchorEl))
              ? (page.activeButtonStateStyle ?? activeButtonStateStyle)
              : {
                  "&:hover":
                    page.activeButtonStateStyle ?? activeButtonStateStyle,
                }
          }
          data-cy="header-menu-button"
          style={page.style}
        >
          {page.label}
        </HeaderMenuButton>
      ))}
      <Divider
        orientation="vertical"
        sx={{ borderColor: "#98A1AA", height: "30px", mt: "15px" }}
      />
      <HeaderMenuButton
        id={PAGES[3].id}
        key={PAGES[3].id}
        disableRipple
        onClick={handleClick(false, PAGES[3])}
        sx={
          isNavButtonActive(PAGES[3].id, location.pathname)
            ? (PAGES[3].activeButtonStateStyle ?? activeButtonStateStyle)
            : {
                "&:hover":
                  PAGES[3].activeButtonStateStyle ?? activeButtonStateStyle,
              }
        }
        data-cy="header-menu-button"
        style={PAGES[3].style}
      >
        {PAGES[3].label}
      </HeaderMenuButton>
      <Popover
        disableScrollLock
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPopover-paper": {
            maxWidth: "100vw",
            left: "0 !important",
            top: "57px !important",
          },
        }}
      >
        <Box
          sx={{
            width: "100vw",
            height: "100%",
            padding: "10px 0 1px 0",
            background: "#F8F8F8",
          }}
        >
          <Container maxWidth="lg" sx={{ padding: "0px !important" }}>
            <Box
              sx={{
                gap: "40px",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              {PAGES.find((page) => page.id === selectedPage)?.subPages?.map(
                (subPage) => (
                  <Box
                    key={subPage.id}
                    sx={{
                      height: "92px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      width: `calc(100% / ${PAGES.length})`,
                    }}
                  >
                    <HeaderMenuButton
                      disableRipple
                      key={subPage.id}
                      data-cy="header-menu-button"
                      onClick={handleClick(true, subPage)}
                      sx={{
                        width: "100%",
                        height: "100%",
                        paddingBottom: "10px",
                        alignItems: "flex-start",
                        "&:hover": activeButtonStateStyle,
                        ...(isNavButtonActive(subPage.id, location.pathname)
                          ? activeButtonStateStyle
                          : {}),
                      }}
                    >
                      <Box
                        gap="5px"
                        width="100%"
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        sx={{
                          p: {
                            textAlign: "start",
                          },
                        }}
                      >
                        <Typography fontSize="16px" fontWeight="700">
                          {subPage.label}
                        </Typography>
                        <Typography fontSize="14px">
                          {subPage.description}
                        </Typography>
                      </Box>
                    </HeaderMenuButton>
                  </Box>
                ),
              )}
            </Box>
          </Container>
        </Box>
      </Popover>
    </Box>
  );
};
