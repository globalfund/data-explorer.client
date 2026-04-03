import React from "react";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import orderBy from "lodash/orderBy";
import { appColors } from "app/theme";
import { Helmet } from "react-helmet-async";
import Divider from "@mui/material/Divider";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
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

const ChangelogItem: React.FC<{
  date: Date;
  title: string;
  notes: string[];
  version: string;
}> = (props) => {
  return (
    <Box
      sx={{
        gap: "24px",
        display: "flex",
        position: "relative",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          top: "6px",
          left: "-58px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          position: "absolute",
          bgcolor: "#144bc0",
        }}
      />
      <Box
        sx={{
          gap: "8px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "16px",
            fontWeight: "700",
            padding: "2px 8px",
            borderRadius: "4px",
            bgcolor: "#f1f3f5",
          }}
        >
          {props.version}
        </Typography>
        <Typography fontSize="14px">
          {props.date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>
      </Box>
      <Typography variant="h4">{props.title}</Typography>
      <Box
        sx={{
          pl: "20px",
          gap: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {props.notes.map((note) => (
          <Typography key={note} fontSize="16px">
            {note}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export const ChangelogPage: React.FC = () => {
  useTitle("The Data Explorer - Changelog");
  const cmsData = useCMSData({ returnData: true });
  const cmsCollections = useCMSCollections({ returnData: true });

  const [searchValue, setSearchValue] = React.useState("");
  const [items, setItems] = React.useState<
    { notes: string[]; title: string; version: string; date: Date }[]
  >([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  React.useEffect(() => {
    const newItems = cmsCollections?.changelog?.filter(
      (item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.version.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.notes.some((note) =>
          note.toLowerCase().includes(searchValue.toLowerCase()),
        ),
    );
    setItems(
      orderBy(
        newItems?.map((item) => ({
          ...item,
          date: new Date(item.date),
        })) || [],
        "date",
        "desc",
      ),
    );
  }, [searchValue, cmsCollections?.changelog]);

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${window.location.origin}/changelog`} />
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
          {getCMSDataField(cmsData, "pagesChangelog.title", "Changelog")}
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
            "pagesChangelog.description",
            "Latest updates and improvements to the Data Explorer.",
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
                  "pagesChangelog.searchPlaceholder",
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
      </Box>
      <Box
        sx={{
          pb: "100px",
          gap: "50px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Divider
          flexItem
          orientation="vertical"
          sx={{ borderColor: "#cfd4da" }}
        />
        <Box
          sx={{
            gap: "40px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {items.map((item) => (
            <ChangelogItem
              date={item.date}
              key={item.version}
              notes={item.notes}
              title={item.title}
              version={item.version}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};
