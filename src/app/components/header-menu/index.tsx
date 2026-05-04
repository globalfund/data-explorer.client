import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import useMediaQuery from "@mui/material/useMediaQuery";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getPages,
  HeaderMenuPage,
  HeaderMenuProps,
  isNavButtonActive,
  activeButtonStateStyle,
} from "app/components/header-menu/data";

const HeaderMenuButton = styled(Button)({
  height: "100%",
  borderRadius: 0,
  fontSize: "18px",
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
      setSelectedPage(page.id === selectedPage ? null : page.id);
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

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (mobile) {
    return (
      <Collapse
        sx={{
          left: 0,
          top: "77px",
          width: "100vw",
          position: "absolute",
        }}
        in={props.mobileMenuOpen}
      >
        <Box
          sx={{
            width: "100vw",
            padding: "0 16px",
            height: "calc(100vh - 77px)",
            bgcolor: colors.primary.gray,
            borderBottom: "1px solid #cfd4da",
            "> button": {
              width: "100%",
              padding: "10px",
              fontSize: "18px",
              fontWeight: "700",
              textTransform: "none",
              color: colors.primary.black,
              justifyContent: "flex-start",
              ":not(:last-child)": {
                borderBottom: "1px solid #cfd4da",
              },
            },
          }}
        >
          {PAGES.map((page) => {
            return (
              <React.Fragment key={page.id}>
                <Button
                  onClick={handleClick(false, page)}
                  sx={
                    page.id === selectedPage
                      ? {
                          color: "#3154f4 !important",
                          borderStyle: "none !important",
                        }
                      : {}
                  }
                >
                  {page.label}
                  {page.subPages && page.subPages.length > 0 && (
                    <ChevronRight
                      sx={{
                        ml: "8px",
                        transform: `rotate(${selectedPage === page.id ? -90 : 90}deg)`,
                      }}
                    />
                  )}
                </Button>
                {page.subPages && page.subPages.length > 0 && (
                  <Collapse in={page.id === selectedPage}>
                    <Box
                      sx={{
                        paddingBottom: "10px",
                        borderBottom: "1px solid #cfd4da",
                      }}
                    >
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
                              padding: "10px 6px",
                              textTransform: "none",
                              color: colors.primary.black,
                              justifyContent: "flex-start",
                              fontWeight:
                                subPage.link === location.pathname
                                  ? "700"
                                  : "400",
                            }}
                          >
                            <Box
                              gap="4px"
                              width="100%"
                              display="flex"
                              flexDirection="column"
                              alignItems="flex-start"
                              sx={{ p: { textAlign: "start" } }}
                            >
                              <Typography fontSize="16px" fontWeight="700">
                                {subPage.label}
                              </Typography>
                              <Typography fontSize="14px" lineHeight={1.4}>
                                {subPage.description}
                              </Typography>
                            </Box>
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </Collapse>
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
            top: "77px !important",
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
