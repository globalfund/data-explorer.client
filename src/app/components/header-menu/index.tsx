import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import useMediaQuery from "@mui/material/useMediaQuery";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getPages,
  HEADER_HEIGHT,
  HeaderMenuPage,
  HeaderMenuProps,
  isNavButtonActive,
  activeButtonStateStyle,
} from "app/components/header-menu/data";

const HeaderMenuButton = styled(Button)({
  height: "38px",
  fontSize: "18px",
  padding: "6px 15px",
  borderRadius: "4px",
  textTransform: "none",
  color: colors.primary.black,
  "&:hover": {
    background: "#F8F9FA",
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

  const handleClick =
    (isSubPage: boolean, page: HeaderMenuPage) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isSubPage) {
        setAnchorEl(e.currentTarget);
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
    setSelectedPage(null);
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
          width: "100vw",
          top: HEADER_HEIGHT,
          position: "absolute",
        }}
        in={props.mobileMenuOpen}
      >
        <Box
          sx={{
            width: "100vw",
            padding: "0 16px",
            bgcolor: colors.primary.white,
            borderBottom: "1px solid #cfd4da",
            height: `calc(100vh - ${HEADER_HEIGHT})`,
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
        gap: "50px",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        "@media (max-width: 920px)": {
          gap: "10px",
        },
      }}
    >
      {PAGES.map((page) => (
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
            (page.subPages && Boolean(anchorEl) && selectedPage === page.id)
              ? activeButtonStateStyle
              : { "&:hover": activeButtonStateStyle }
          }
          data-cy="header-menu-button"
        >
          {page.label}
        </HeaderMenuButton>
      ))}
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
            borderRadius: "4px",
            boxShadow: "0 0 8px 0 rgba(152, 161, 170, 0.30)",
            top: `${parseInt(HEADER_HEIGHT.replace("px", ""), 10) + 1}px !important`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {PAGES.find((page) => page.id === selectedPage)?.subPages?.map(
            (subPage) => (
              <HeaderMenuButton
                disableRipple
                key={subPage.id}
                data-cy="header-menu-button"
                onClick={handleClick(true, subPage)}
                sx={{
                  height: "60px",
                  borderRadius: 0,
                  paddingBottom: "10px",
                  alignItems: "flex-start",
                  "&:not(:last-of-type)": {
                    borderBottom: "1px solid #CFD4DA",
                  },
                  "&:hover": activeButtonStateStyle,
                  ...(isNavButtonActive(subPage.id, location.pathname)
                    ? activeButtonStateStyle
                    : {}),
                }}
              >
                <Box
                  gap="2px"
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
                  <Typography fontSize="14px">{subPage.description}</Typography>
                </Box>
              </HeaderMenuButton>
            ),
          )}
        </Box>
      </Popover>
    </Box>
  );
};
