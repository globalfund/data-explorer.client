import React from "react";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import { appColors } from "app/theme";
import { Helmet } from "react-helmet-async";
import Divider from "@mui/material/Divider";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { ALPHABET } from "app/pages/glossary/data";
import SearchIcon from "@mui/icons-material/Search";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { useCMSCollections } from "app/hooks/useCMSCollections";
import { Container, Input } from "app/components/search/styles";

const fullWidthDivider = (
  <Divider
    sx={{
      left: "-50vw",
      width: "200vw",
      position: "relative",
      borderTopColor: "#868E96",
      "@media (max-width: 767px)": {
        display: "none",
      },
    }}
  />
);

export const GlossaryPage: React.FC = () => {
  useTitle("The Data Explorer - Glossary");
  const cmsData = useCMSData({ returnData: true });
  const cmsCollections = useCMSCollections({ returnData: true });

  const [searchValue, setSearchValue] = React.useState("");
  const [items, setItems] = React.useState<
    { keyword: string; content: string }[]
  >([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const alphabetItems = React.useMemo(() => {
    const itemsWLetter: {
      letter: string;
      items: { keyword: string; content: string }[];
    }[] = [];
    ALPHABET.forEach((letter) => {
      const itemsWithLetter = items.filter((item) =>
        item.keyword.toUpperCase().startsWith(letter),
      );
      if (itemsWithLetter.length > 0) {
        itemsWLetter.push({ letter, items: itemsWithLetter });
      }
    });
    return itemsWLetter.filter((item) => item.items.length > 0);
  }, [items]);

  React.useEffect(() => {
    const newItems = cmsCollections?.glossary?.filter(
      (item) =>
        item.Keyword.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.Content.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setItems(
      newItems?.map((item) => ({
        keyword: item.Keyword,
        content: item.Content,
      })) || [],
    );
  }, [searchValue, cmsCollections?.glossary]);

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${window.location.origin}/glossary`} />
      </Helmet>
      <Box
        padding="50px 0"
        sx={{
          "@media (max-width: 767px)": {
            padding: "32px 0",
          },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            "@media (max-width: 767px)": {
              wordBreak: "break-word",
            },
          }}
        >
          {getCMSDataField(cmsData, "pagesGlossary.title", "Glossary")}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            "@media (max-width: 767px)": {
              wordBreak: "break-word",
            },
          }}
        >
          {getCMSDataField(
            cmsData,
            "pagesGlossary.description",
            "Key terminology to help interpret the charts and datasets.",
          )}
        </Typography>
        <Box
          height="60px"
          sx={{
            "@media (max-width: 767px)": {
              display: "none",
            },
          }}
        />
        {fullWidthDivider}
        <Box
          gap="8px"
          display="flex"
          flexDirection="row"
          margin="60px 0 30px 0"
          justifyContent="flex-end"
        >
          <Box
            width="35%"
            sx={{
              "> div": {
                width: "100%",
              },
            }}
          >
            <Container>
              <Input
                type="text"
                tabIndex={0}
                value={searchValue}
                aria-label="Search input"
                placeholder={getCMSDataField(
                  cmsData,
                  "pagesGlossary.searchPlaceholder",
                  "Search",
                )}
                onChange={handleSearchChange}
              />
              <Box
                id="search-icon"
                sx={{
                  width: "40px",
                  height: "36px",
                  display: "flex",
                  minWidth: "40px",
                  borderRadius: "4px",
                  alignItems: "center",
                  justifyContent: "center",
                  background: appColors.COMMON.BLACK,
                  "@media (max-width: 767px)": {
                    height: "35px",
                  },
                }}
              >
                <SearchIcon htmlColor={appColors.COMMON.WHITE} />
              </Box>
            </Container>
          </Box>
        </Box>
        <Box
          sx={{
            gap: "30px",
            width: "100%",
            display: "flex",
            maxWidth: "1000px",
            flexDirection: "column",
          }}
        >
          {alphabetItems.map((item) => (
            <Box
              key={item.letter}
              sx={{
                gap: "30px",
                width: "100%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Typography variant="h4" color="#144BC0">
                {item.letter}
              </Typography>
              <Divider
                flexItem
                orientation="vertical"
                sx={{ borderColor: "#cfd4da" }}
              />
              <Box
                sx={{
                  gap: "30px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {item.items.map((item2) => (
                  <Box key={item2.keyword} sx={{ pb: "24px" }}>
                    <Typography variant="h4">{item2.keyword}</Typography>
                    <Typography fontSize="16px">{item2.content}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
