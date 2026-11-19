/* third-party */
import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import { useDebounce } from "react-use";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
/* project */
import { useCMSData } from "app/hooks/useCMSData";
import { SearchLayout } from "app/components/search/layout";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { SearchResultsTabModel } from "app/components/search/components/results/data";

export function Search(props: {
  hocClose?: () => void;
  withCatMenu?: boolean;
  forceCategory?: string;
  handleSearch?: (value: string) => void;
}) {
  const cmsData = useCMSData({ returnData: true });
  const categories = getCMSDataField(
    cmsData,
    "componentsSearch.categories",
    [],
  );

  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState(
    props.forceCategory
      ? props.forceCategory
      : get(categories, "[0].value", ""),
  );

  const [value, setValue] = React.useState("");

  // api call & data
  const clearData = useStoreActions((store) => store.GlobalSearch.clear);
  const fetchData = useStoreActions((store) => store.GlobalSearch.fetch);
  const data = useStoreState(
    (state) =>
      get(state.GlobalSearch.data, "data", []) as SearchResultsTabModel[],
  );
  const isLoading = useStoreState((state) => state.GlobalSearch.loading);

  const [,] = useDebounce(
    () => {
      if (props.handleSearch) return;
      if (value.length > 0) {
        fetchData({
          filterString: `q=${value}`,
        });
      } else {
        clearData();
      }
    },
    500,
    [value],
  );

  function onValueChange(v: string) {
    setValue(v);
    if (props.handleSearch) {
      props.handleSearch(v);
    }
  }

  function onClose() {
    setOpen(false);
    if (props.hocClose) {
      props.hocClose();
    }
  }

  React.useEffect(() => {
    if (categories.length > 0) {
      setCategory(get(categories, "[0].value", ""));
    }
  }, [categories]);

  return (
    <Box
      onClick={(e: any) => {
        e.stopPropagation();
        e.preventDefault();
        if (!open) {
          setOpen(true);
        }
      }}
      sx={{
        width: "80%",
        "@media (max-width: 767px)": {
          width: "100%",
        },
      }}
    >
      <SearchLayout
        value={value}
        results={data}
        onClose={onClose}
        loading={isLoading}
        category={category}
        setValue={onValueChange}
        setCategory={setCategory}
        withCatMenu={props.withCatMenu}
        hideClearBtn={Boolean(props.hocClose)}
        onlyInput={Boolean(props.handleSearch)}
      />
    </Box>
  );
}
