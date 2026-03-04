import React from "react";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { getCMSDataField } from "app/utils/getCMSDataField";
import FooterLogo from "app/assets/vectors/FooterLogo.svg?react";
import {
  SM,
  FooterSM,
  FooterHeader,
  FooterContainer,
  FooterExternalLink,
  FooterBottomBgBlock,
  FooterLinkSeparator,
} from "app/components/footer/styles";

export const Footer: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  return (
    <React.Fragment>
      <FooterContainer>
        <Container
          maxWidth="lg"
          disableGutters
          sx={{
            "@media (max-width: 1200px)": {
              padding: "0 16px",
            },
          }}
        >
          <Grid container>
            <Grid item sm={6} md={6} lg={7}>
              <FooterLogo />
              <Box
                gap="15px"
                display="flex"
                marginTop="56px"
                marginBottom="16px"
                sx={{
                  "@media (max-width: 767px)": {
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
              <Typography
                display="block"
                fontSize="14px"
                marginTop="-5px"
                variant="caption"
                color={appColors.COMMON.BLACK}
              >
                © {new Date().getFullYear()}{" "}
                {getCMSDataField(
                  cmsData,
                  "componentsFooter.copyrightText",
                  "The Global Fund to Fight AIDS, Tuberculosis and Malaria",
                )}
              </Typography>
            </Grid>
            <Grid
              item
              container
              sm={6}
              md={6}
              lg={5}
              spacing={2}
              sx={{
                "@media (max-width: 767px)": {
                  display: "none",
                },
              }}
            >
              <Grid item sm={4} md={4}>
                <FooterHeader>
                  {getCMSDataField(
                    cmsData,
                    "componentsFooter.connectTitle",
                    "CONNECT",
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
                  href="https://www.theglobalfund.org/en/careers/"
                >
                  {getCMSDataField(
                    cmsData,
                    "componentsFooter.careersText",
                    "Careers",
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
                <FooterLinkSeparator>-</FooterLinkSeparator>
                <FooterExternalLink
                  target="_blank"
                  href="https://act.unfoundation.org/FJvB3vUCJUepH_5KN75TTQ2"
                >
                  {getCMSDataField(
                    cmsData,
                    "componentsFooter.donateText",
                    "Donate to the Global Fund through United Nations Foundation",
                  )}
                </FooterExternalLink>
              </Grid>
              <Grid item sm={4} md={4}>
                <FooterHeader>
                  {getCMSDataField(
                    cmsData,
                    "componentsFooter.aboutWebsiteTitle",
                    "ABOUT THE WEBSITE",
                  )}
                </FooterHeader>
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
              </Grid>
              <Grid item sm={4} md={4}>
                <FooterHeader>
                  {getCMSDataField(
                    cmsData,
                    "componentsFooter.moreGlobalFundSitesTitle",
                    "MORE GLOBAL FUND SITES",
                  )}
                </FooterHeader>
                <FooterExternalLink
                  target="_blank"
                  href="https://www.theglobalfund.org"
                >
                  {getCMSDataField(
                    cmsData,
                    "componentsFooter.globalFundWebsiteText",
                    "The Global Fund Website",
                  )}
                </FooterExternalLink>
                <FooterExternalLink
                  target="_blank"
                  href="https://data-service.theglobalfund.org"
                >
                  {getCMSDataField(
                    cmsData,
                    "componentsFooter.dataServiceText",
                    "Data Service",
                  )}
                </FooterExternalLink>
                <FooterExternalLink
                  target="_blank"
                  href="https://www.theglobalfund.org/en/newsroom/digital-media"
                >
                  {getCMSDataField(
                    cmsData,
                    "componentsFooter.digitalLibraryText",
                    "Digital Library",
                  )}
                </FooterExternalLink>
                <FooterLinkSeparator>-</FooterLinkSeparator>
                <FooterExternalLink
                  target="_blank"
                  href="https://archive.theglobalfund.org"
                >
                  {getCMSDataField(
                    cmsData,
                    "componentsFooter.archiveText",
                    "Archive",
                  )}
                </FooterExternalLink>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </FooterContainer>
      <Container maxWidth="lg" disableGutters>
        <FooterBottomBgBlock />
      </Container>
    </React.Fragment>
  );
};
