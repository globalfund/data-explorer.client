import React from "react";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import Grid from "@mui/material/Grid";
import { Search } from "app/components/search";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { Link, useParams } from "react-router-dom";
import { getCMSDataField } from "app/utils/getCMSDataField";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ArrowOutward from "@mui/icons-material/ArrowOutward";
import {
  ADDITIONAL_LINKS,
  NotFoundPageProps,
  EXPLORE_MORE_BUTTONS,
} from "app/pages/not-found/data";

export const NotFoundPage: React.FC<NotFoundPageProps> = (props) => {
  useTitle(
    `The Data Explorer - Page not found${props.code ? ` (${props.code})` : ""}`,
  );

  const params = useParams<{ id: string }>();
  const cmsData = useCMSData({ returnData: true });

  const allExploreMoreButtons = getCMSDataField(
    cmsData,
    "pagesNotFound.exploreMoreButtons",
    EXPLORE_MORE_BUTTONS,
  ) as { label: string; description: string; link: string }[];

  const additionalLinks = getCMSDataField(
    cmsData,
    "pagesNotFound.additionalLinks",
    ADDITIONAL_LINKS,
  ) as { label: string; description: string; link: string }[];

  const title = React.useMemo(() => {
    if (props.variant === "grant") {
      return `${getCMSDataField(
        cmsData,
        "pagesNotFound.grantTitle",
        "No grant matches",
      )} "${params.id}"`;
    } else if (props.variant === "location") {
      return `${getCMSDataField(
        cmsData,
        "pagesNotFound.locationTitle",
        "No country or region uses the code",
      )} "${params.id}"`;
    }
    return getCMSDataField(
      cmsData,
      "pagesNotFound.title",
      "This page isn't here",
    );
  }, [props.variant, cmsData]);

  const subtitle = React.useMemo(() => {
    if (props.variant === "grant") {
      return getCMSDataField(
        cmsData,
        "pagesNotFound.grantSubtitle",
        "Grant codes combine a country code, a component letter, and the principal recipient — for example AFG-Z-UNDP.",
      );
    } else if (props.variant === "location") {
      return getCMSDataField(
        cmsData,
        "pagesNotFound.locationSubtitle",
        "Country codes on the Data Explorer are three letters, following ISO 3166 — Kenya is KEN, Nigeria is NGA.",
      );
    }
    return getCMSDataField(
      cmsData,
      "pagesNotFound.subtitle",
      "The address you followed doesn't match any page on the Data Explorer. It may have been moved, or the link may be incomplete.",
    );
  }, [props.variant, cmsData]);

  const searchCategory = React.useMemo(() => {
    if (props.variant === "grant") {
      return "Grants";
    } else if (props.variant === "location") {
      return "Locations";
    }
    return undefined;
  }, [props.variant]);

  const exploreMoreTitle = React.useMemo(() => {
    if (props.variant === "grant") {
      return getCMSDataField(
        cmsData,
        "pagesNotFound.grantExploreMoreTitle",
        "Explore all grants",
      );
    } else if (props.variant === "location") {
      return getCMSDataField(
        cmsData,
        "pagesNotFound.locationExploreMoreTitle",
        "Explore results by geography",
      );
    }
    return getCMSDataField(
      cmsData,
      "pagesNotFound.exploreMoreTitle",
      "Or start from a page",
    );
  }, [props.variant, cmsData]);

  const exploreMoreButtons = React.useMemo(() => {
    if (props.variant === "grant") {
      return allExploreMoreButtons.filter((btn) => btn.link === "/grants");
    } else if (props.variant === "location") {
      return allExploreMoreButtons.filter((btn) => btn.link === "/geography");
    }
    return allExploreMoreButtons;
  }, [props.variant, allExploreMoreButtons]);

  return (
    <React.Fragment>
      <Box padding="60px 0">
        <Typography variant="h1" marginBottom="5px">
          {title}
        </Typography>
        <Typography
          variant="h4"
          maxWidth="80%"
          sx={{
            "@media (max-width: 1200px)": {
              maxWidth: "100%",
            },
            "@media (max-width: 767px)": {
              fontSize: "20px",
            },
          }}
        >
          {subtitle}
        </Typography>
      </Box>
      <Box padding="50px 0" borderTop="1px solid #E5E5E5">
        <Typography fontSize="20px" marginBottom="64px">
          {getCMSDataField(
            cmsData,
            "pagesNotFound.contactUs",
            <>
              If you reached this page from a link elsewhere,{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.theglobalfund.org/en/contact/"
              >
                contact us
              </a>{" "}
              so we can fix it.
            </>,
          )}
        </Typography>
        <Typography variant="h4" marginBottom="16px">
          {getCMSDataField(
            cmsData,
            "pagesNotFound.searchTitle",
            "Search Data Explorer",
          )}
        </Typography>
        <Box sx={{ maxWidth: "600px", marginBottom: "64px" }}>
          <Search forceCategory={searchCategory} />
        </Box>
        <Typography variant="h4" marginBottom="16px">
          {exploreMoreTitle}
        </Typography>
        <Grid container spacing={4} marginBottom="64px">
          {exploreMoreButtons.map((btn) => (
            <Grid item key={btn.label} xs={12} sm={6} md={6} lg={4} xl={4}>
              <Link
                to={btn.link}
                style={{
                  gap: "4px",
                  width: "100%",
                  display: "flex",
                  padding: "24px",
                  borderRadius: "5px",
                  alignItems: "center",
                  flexDirection: "row",
                  textDecoration: "none",
                  background: "#F8F9FA",
                  border: "1px solid #98A1AA",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    gap: "16px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h5" fontSize="20px">
                    {btn.label}
                  </Typography>
                  <Typography width="90%">{btn.description}</Typography>
                </Box>
                <ChevronRight htmlColor="#000" />
              </Link>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ borderTop: "1px solid #CFD4DA", paddingTop: "64px" }}>
          <Typography variant="h4" marginBottom="16px">
            {getCMSDataField(
              cmsData,
              "pagesNotFound.additionalLinksTitle",
              "Additional links",
            )}
          </Typography>
          <Grid container spacing={4} marginBottom="64px">
            {additionalLinks.map((btn) => (
              <Grid item key={btn.label} xs={12} sm={6} md={6} lg={4} xl={4}>
                <a
                  href={btn.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    gap: "4px",
                    width: "100%",
                    display: "flex",
                    padding: "24px",
                    borderRadius: "5px",
                    flexDirection: "row",
                    textDecoration: "none",
                    background: "#F8F9FA",
                    alignItems: "flex-start",
                    border: "1px solid #98A1AA",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      gap: "16px",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h5" fontSize="20px">
                      {btn.label}
                    </Typography>
                    <Typography width="90%">{btn.description}</Typography>
                  </Box>
                  <ArrowOutward htmlColor="#000" />
                </a>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );
};
