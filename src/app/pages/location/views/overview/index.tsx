import React from "react";
import get from "lodash/get";
import uniqBy from "lodash/uniqBy";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import Grid from "@mui/material/Grid";
// import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
// import { Link as RouteLink } from "react-router-dom";
import { useStoreState } from "app/state/store/hooks";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { NarrativePanel } from "app/components/narrative-section";
import { useCountryNarratives } from "app/hooks/useCountryNarratives";

export const LocationOverview: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  const dataOverview = useStoreState((state) =>
    get(state.GeographyOverview, "data.data[0]", {
      name: "",
      region: "",
      description: "",
      FPMName: "",
      FPMEmail: "",
      currentPrincipalRecipients: [],
      formerPrincipalRecipients: [],
    }),
  );
  const dataCCMContacts = useStoreState((state) =>
    get(state.GeographyOverviewCoordinatingMechanismsContacts, "data.data", []),
  );
  const narratives = useCountryNarratives();

  useTitle(`The Data Explorer - ${dataOverview.name}`);

  return (
    <Box gap="24px" display="flex" flexDirection="column">
      <NarrativePanel state={narratives} overview />
      {/* <Box>
        <Typography fontSize="18px" fontWeight="700">
          {getCMSDataField(
            cmsData,
            "pagesLocationOverview.descriptionTitle",
            "Description"
          )}
        </Typography>
        <Box
          sx={{
            columnCount: 2,
            fontSize: "14px",
            columnGap: "32px",
            columnSpan: "all",
            columnWidth: "50%",
          }}
          dangerouslySetInnerHTML={{
            __html: dataOverview.description,
          }}
        />
      </Box>
      <Divider sx={{ borderColor: "#000" }} /> */}
      <Grid
        container
        spacing={4}
        sx={{
          a: {
            color: "#000",
            textDecoration: "none",
          },
        }}
      >
        <Grid item md={12} lg={6}>
          <Box
            sx={{
              gap: "24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              minHeight={110}
              sx={{
                "@media (max-width: 920px)": {
                  minHeight: "auto",
                },
              }}
            >
              <Typography variant="body2" fontWeight="700" marginBottom="10px">
                {getCMSDataField(
                  cmsData,
                  "pagesLocationOverview.portfolioManagerTitle",
                  "Fund Portfolio Manager",
                )}
              </Typography>
              <Typography fontSize="12px">
                {dataOverview.FPMName}
                <br />
                <a href={`mailto:${dataOverview.FPMEmail}`}>
                  {dataOverview.FPMEmail}
                </a>
              </Typography>
            </Box>
            <Divider sx={{ borderColor: "#000" }} />
            <Box>
              <Typography variant="body2" fontWeight="700" marginBottom="10px">
                {getCMSDataField(
                  cmsData,
                  "pagesLocationOverview.coordinatingMechanismContactsTitle",
                  "Coordinating Mechanism Contacts",
                )}
              </Typography>
              <Box>
                {dataCCMContacts.map((ccm: any) => (
                  <Box key={ccm.name}>
                    <Typography
                      variant="body2"
                      color="#ADB5BD"
                      fontWeight="700"
                      marginBottom="10px"
                    >
                      {ccm.name}
                    </Typography>
                    <Grid container spacing={1}>
                      {uniqBy(ccm.items, "fullname").map((item: any) => (
                        <Grid key={item.fullname} item xs={6}>
                          <Typography
                            fontSize="12px"
                            fontWeight="700"
                            marginBottom="10px"
                          >
                            {item.role}
                          </Typography>
                          <Typography fontSize="12px">
                            {item.fullname}
                            <br />
                            {item.title}
                            <br />
                            {item.email}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item md={12} lg={6}>
          <Box
            sx={{
              gap: "24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              minHeight={110}
              sx={{
                "@media (max-width: 920px)": {
                  minHeight: "auto",
                },
              }}
            >
              <Typography variant="body2" fontWeight="700" marginBottom="10px">
                {getCMSDataField(
                  cmsData,
                  "pagesLocationOverview.currentPrincipalRecipientsText",
                  "Current Principal Recipients in",
                )}{" "}
                {dataOverview.name}
              </Typography>
              <Grid
                container
                spacing={1}
                sx={{
                  // a: {
                  span: {
                    display: "block",
                    fontSize: "12px",
                    lineHeight: 1.8,
                  },
                }}
              >
                {dataOverview.currentPrincipalRecipients.map((item: any) => (
                  <Grid key={item.name} item xs={6}>
                    {/* <Link component={RouteLink} to=""> */}
                    <span>{item.name}</span>
                    {/* </Link> */}
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Divider sx={{ borderColor: "#000" }} />
            <Box>
              <Typography variant="body2" fontWeight="700" marginBottom="10px">
                {getCMSDataField(
                  cmsData,
                  "pagesLocationOverview.formerPrincipalRecipientsText",
                  "Former Principal Recipients in",
                )}{" "}
                {dataOverview.name}
              </Typography>
              <Grid
                container
                spacing={1}
                sx={{
                  // a: {
                  span: {
                    display: "block",
                    fontSize: "12px",
                    lineHeight: 1.8,
                  },
                }}
              >
                {dataOverview.formerPrincipalRecipients.map((item: any) => (
                  <Grid key={item.name} item xs={6}>
                    {/* <Link component={RouteLink} to=""> */}
                    <span>{item.name}</span>
                    {/* </Link> */}
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* <Divider sx={{ borderColor: "#000" }} />
            <Box>
              <Typography variant="body2" fontWeight="700" marginBottom="10px">
                Multicountries with Kenya
              </Typography>
              <Grid
                container
                spacing={2}
                sx={{
                  a: {
                    display: "block",
                    fontSize: "12px",
                    lineHeight: 1.8,
                  },
                }}
              >
                <Grid item xs={6}>
                  <Link component={RouteLink} to="">
                    Multicountry Africa ECSA-HC
                  </Link>
                  <Link component={RouteLink} to="">
                    Multicountry Eastern Africa IGAD
                  </Link>
                  <Link component={RouteLink} to="">
                    Multicountry Eastern Africa KANCO
                  </Link>
                </Grid>
                <Grid item xs={6}>
                  <Link component={RouteLink} to="">
                    Multicountry Southern Africa ARASA`
                  </Link>
                  <Link component={RouteLink} to="">
                    Multicountry TB WC Africa NTP/SRL
                  </Link>
                  <Link component={RouteLink} to="">
                    Multicountry Eastern Africa KANCO
                  </Link>
                </Grid>
              </Grid>
            </Box> */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
