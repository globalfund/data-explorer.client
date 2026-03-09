import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Divider from "@mui/material/Divider";
import { Search } from "app/components/search";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import {
  GeoCategoryProps,
  GeoSubCategoryProps,
} from "app/pages/geography/data";

const GeoCategory: React.FC<GeoCategoryProps> = (props: GeoCategoryProps) => {
  return (
    <Box marginBottom="48px">
      <Typography
        variant="h6"
        lineHeight={1}
        fontSize="20px"
        fontWeight="700"
        marginBottom="16px"
        sx={
          props.search
            ? {
                opacity: props.highlighted ? 1 : 0.2,
              }
            : {}
        }
      >
        {props.name}
      </Typography>
      <Grid container spacing={2}>
        {props.items.map((item) => (
          <Grid
            item
            key={item.name}
            sm={props.items.length > 1 ? 6 : 12}
            md={props.items.length > 1 ? 4 : 12}
            lg={props.items.length > 1 ? 2 : 12}
          >
            <GeoSubCategory {...item} search={props.search} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const GeoSubCategory: React.FC<GeoSubCategoryProps> = (
  props: GeoSubCategoryProps,
) => {
  return (
    <Box>
      <Typography
        lineHeight={1}
        fontSize="14px"
        fontWeight="700"
        marginBottom="16px"
        sx={
          props.search
            ? {
                opacity: props.highlighted ? 1 : 0.2,
              }
            : {}
        }
      >
        {props.name}
      </Typography>
      <Box>
        {props.items.map((item) => (
          <Link
            key={item.name}
            component={NavLink}
            to={`/location/${item.value?.replace(/\//g, "|")}`}
            sx={{
              color: "#000",
              display: "block",
              fontSize: "12px",
              fontWeight: "400",
              textDecoration: "none",
              ...(props.search
                ? {
                    opacity: item.highlighted ? 1 : 0.2,
                    pointerEvents: item.highlighted ? "all" : "none",
                  }
                : {}),
              "&:hover": {
                fontWeight: "700",
              },
            }}
          >
            {item.name}
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export const Geography: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "geographies",
  });

  useTitle("The Data Explorer - Geography");
  const [search, setSearch] = React.useState("");

  const dataList = useStoreState(
    (state) => get(state.GeographyList, "data.data", []) as GeoCategoryProps[],
  );
  const loading = useStoreState((state) => state.GeographyList.loading);
  const fetchList = useStoreActions((actions) => actions.GeographyList.fetch);

  const [filteredData, setFilteredData] = React.useState(dataList);

  React.useEffect(() => {
    const updatedData = [...dataList];
    if (search.length > 0) {
      for (const item of updatedData) {
        for (const subItem of item.items) {
          for (const subItemItem of subItem.items) {
            const highlighted = subItemItem.name
              .toLowerCase()
              .includes(search.toLowerCase());
            subItemItem.highlighted = highlighted;
          }
          subItem.highlighted = subItem.items.some((i) => i.highlighted);
        }
        item.highlighted = item.items.some((i) => i.highlighted);
      }
    }
    setFilteredData(updatedData);
  }, [search, dataList]);

  React.useEffect(() => {
    fetchList({});
  }, []);

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

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${window.location.origin}/geography`} />
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
          {get(cmsData, "pagesGeography.title", "Geography")}
        </Typography>
        <Box
          height="56px"
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
          margin="20px 0"
          flexDirection="row"
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
            <Search forceCategory="Locations" handleSearch={setSearch} />
          </Box>
        </Box>
        {fullWidthDivider}
        <Box
          sx={{
            "@media (max-width: 767px)": {
              padding: "16px 0",
            },
          }}
        >
          <Box height="18px" />
          <Box position="relative">
            {loading && (
              <Box
                top="0"
                left="0"
                width="100%"
                height="100%"
                display="flex"
                position="absolute"
                alignItems="flex-start"
                justifyContent="center"
                bgcolor="rgba(255, 255, 255, 0.5)"
              >
                <CircularProgress />
              </Box>
            )}
            {filteredData.map((item) => (
              <GeoCategory
                key={item.name}
                search={search.length > 0}
                {...item}
              />
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="overline" fontSize="14px">
            Latest Update: <b>{latestUpdateDate}</b>
          </Typography>
        </Box>
      </Box>
    </>
  );
};
