import React from "react";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { getCMSDataField } from "app/utils/getCMSDataField";
import {
  SM,
  FooterSM,
  FooterLink,
  FooterHeader,
  FooterContainer,
  FooterExternalLink,
} from "app/components/footer/styles";

export const Footer: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });

  return (
    <Box sx={{ bgcolor: "#F8F9FA", borderTop: "1px solid #ADB5BD" }}>
      <FooterContainer>
        <Container
          maxWidth="lg"
          disableGutters
          sx={{
            "@media (max-width: 1200px)": {
              padding: "0 32px",
            },
          }}
        >
          <Grid container>
            <Grid item xs={12} sm={4} md={4} lg={3}>
              <FooterHeader>
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.dataResourcesTitle",
                  "Data & Resources",
                )}
              </FooterHeader>
              {/* <FooterLink to="/changelog">
                  {getCMSDataField(
                    cmsData,
                    "componentsFooter.changelogText",
                    "Changelog",
                  )}
                </FooterLink> */}
              <FooterLink to="/glossary">
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.glossaryText",
                  "Glossary",
                )}
              </FooterLink>
              <FooterExternalLink href="https://resources.theglobalfund.org">
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.resourcesText",
                  "Country Resources",
                )}
              </FooterExternalLink>
              <FooterExternalLink href="https://www.theglobalfund.org/en/newsroom/digital-media">
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.digitalLibraryText",
                  "Digital Library",
                )}
              </FooterExternalLink>
              <FooterExternalLink href="https://data-service.theglobalfund.org">
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.dataServiceText",
                  "Data Service",
                )}
              </FooterExternalLink>
              <FooterExternalLink href="https://archive.theglobalfund.org">
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.archiveText",
                  "Archive",
                )}
              </FooterExternalLink>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              lg={3}
              sx={{ marginTop: { xs: "16px", sm: "0px" } }}
            >
              <FooterHeader>
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.aboutTheGlobalFundTitle",
                  "About the Global Fund",
                )}
              </FooterHeader>
              <FooterExternalLink
                target="_blank"
                href="https://www.theglobalfund.org"
              >
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.globalFundWebsiteText",
                  "Main Global Fund Website",
                )}
              </FooterExternalLink>
              <FooterExternalLink
                target="_blank"
                href="https://www.theglobalfund.org/en/careers"
              >
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.careersText",
                  "Careers",
                )}
              </FooterExternalLink>
              <FooterExternalLink
                target="_blank"
                href="https://www.theglobalfund.org/en/site/phishing-and-scam-alert/"
              >
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.phishingAlertText",
                  "Phishing & Scam Alert",
                )}
              </FooterExternalLink>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              lg={3}
              sx={{ marginTop: { xs: "16px", sm: "0px" } }}
            >
              <FooterHeader>
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.connectTitle",
                  "Connect",
                )}
              </FooterHeader>
              <FooterExternalLink
                target="_blank"
                href="https://www.theglobalfund.org/en/contact/"
              >
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.contactUsText",
                  "Contact Us",
                )}
              </FooterExternalLink>
              <FooterExternalLink
                target="_blank"
                href="https://www.theglobalfund.org/en/oig/report-fraud-and-abuse/"
              >
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.reportFraudText",
                  "Report Fraud & Abuse",
                )}
              </FooterExternalLink>
              <FooterExternalLink
                target="_blank"
                href="https://www.theglobalfund.org/en/site/rss"
              >
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.rssFeedsText",
                  "RSS Feeds",
                )}
              </FooterExternalLink>
            </Grid>
            {/* <Grid item xs={12} sm={3} md={4} lg={1}>
              <FooterHeader>
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.languageTitle",
                  "Language",
                )}
              </FooterHeader>
            </Grid> */}
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              lg={2}
              sx={{ a: { marginBottom: "0px" } }}
            >
              <Box
                display="flex"
                marginBottom="28px"
                justifyContent="space-between"
                sx={{
                  "@media (max-width: 1200px)": {
                    marginTop: "16px",
                  },
                }}
              >
                {SM.map((sm) => (
                  <FooterSM
                    key={sm.name}
                    href={sm.link}
                    target="_blank"
                    aria-label={sm.name}
                  >
                    {sm.icon}
                  </FooterSM>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </FooterContainer>
      <Box
        sx={{
          padding: "12px 0",
          bgcolor: "#E9ECEF",
          borderTop: "1px solid #ADB5BD",
          a: {
            marginBottom: "0px",
          },
        }}
      >
        <Container
          maxWidth="lg"
          disableGutters
          sx={{
            gap: "12px",
            display: "flex",
            alignItems: "center",
            color: appColors.COMMON.BLACK,
            justifyContent: "space-between",
            "> *": {
              lineHeight: 1,
            },
            "@media (max-width: 1200px)": {
              flexWrap: "wrap",
              padding: "0 32px",
            },
          }}
        >
          <Typography fontSize="14px">
            © {new Date().getFullYear()}{" "}
            {getCMSDataField(
              cmsData,
              "componentsFooter.copyrightText",
              "The Global Fund to Fight AIDS, Tuberculosis and Malaria",
            )}
          </Typography>
          <Box
            sx={{
              gap: "12px",
              display: "flex",
            }}
          >
            <FooterExternalLink
              target="_blank"
              href="https://www.theglobalfund.org/en/site/cookies/"
            >
              {getCMSDataField(
                cmsData,
                "componentsFooter.cookiesText",
                "Cookies",
              )}
            </FooterExternalLink>
            ·
            <FooterExternalLink
              target="_blank"
              href="https://www.theglobalfund.org/en/site/privacy-statement/"
            >
              {getCMSDataField(
                cmsData,
                "componentsFooter.privacyStatementText",
                "Privacy Statement",
              )}
            </FooterExternalLink>
            ·
            <FooterExternalLink
              target="_blank"
              href="https://www.theglobalfund.org/en/site/terms-of-use/"
            >
              {getCMSDataField(
                cmsData,
                "componentsFooter.termsOfUseText",
                "Terms of Use",
              )}
            </FooterExternalLink>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
