import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import { useCMSData } from "app/hooks/useCMSData";
import { SearchProps } from "app/components/search/data";
import { SearchLayout } from "app/components/search/layout";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useDebounce, useUpdateEffect, useSessionStorage } from "react-use";
import { SearchResultsTabModel } from "app/components/search/components/results/data";

export function Search(props: SearchProps) {
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
  const [storedValue, setStoredValue] = useSessionStorage(
    "stored-search-string",
    "",
  );
  const [value, setValue] = React.useState(storedValue);

  // api call & data
  const clearData = useStoreActions((store) => store.GlobalSearch.clear);
  const fetchData = useStoreActions((store) => store.GlobalSearch.fetch);
  const data = useStoreState(
    (state) =>
      get(state.GlobalSearch.data, "data", []) as SearchResultsTabModel[],
  );
  const isLoading = useStoreState((state) => state.GlobalSearch.loading);

  useUpdateEffect(() => {
    setStoredValue(value);
    // if (value.length === 0) {
    //   fetchData({
    //     filterString: `q=${value}`,
    //   });
    // }
  }, [value]);

  const [,] = useDebounce(
    () => {
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
        setStoredValue={setStoredValue}
        hideClearBtn={Boolean(props.hocClose)}
      />
    </Box>
  );
}
