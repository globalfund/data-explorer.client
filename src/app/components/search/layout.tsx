import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import findIndex from "lodash/findIndex";
import { useCMSData } from "app/hooks/useCMSData";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Dropdown } from "app/components/dropdown";
import SearchIcon from "@mui/icons-material/Search";
import { categories } from "app/components/search/data";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getCMSDataField } from "app/utils/getCMSDataField";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { SearchResults } from "app/components/search/components/results";
import {
  SearchResultModel,
  SearchResultsTabModel,
} from "app/components/search/components/results/data";
import {
  Input,
  Container,
  MobileContainer,
} from "app/components/search/styles";

interface SearchLayoutProps {
  value: string;
  loading: boolean;
  category?: string;
  onClose?: () => void;
  withCatMenu?: boolean;
  hideClearBtn?: boolean;
  results: SearchResultsTabModel[];
  setValue: (value: string) => void;
  setCategory?: (value: string) => void;
  setStoredValue: (value: string) => void;
}

export function SearchLayout(props: SearchLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const cmsData = useCMSData({ returnData: true });

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [data, setData] = React.useState<SearchResultModel[]>([]);
  const [open, setOpen] = React.useState(props.value.length > 0);

  // const handleItemClick = (value: string) => () => {
  //   if (props.setCategory) {
  //     props.setCategory(value);
  //   }
  // };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      props.setStoredValue("");
      props.setValue("");
      setOpen(false);
      if (props.onClose) {
        props.onClose();
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    const newOpen = props.value.length > 0;
    if (newOpen !== open) {
      setOpen(newOpen);
    }
  }, [props.value]);

  React.useEffect(() => {
    let allData: SearchResultModel[] = [];
    props.results.forEach((tab: SearchResultsTabModel) => {
      allData = [...allData, ...tab.results];
    });
    if (props.category && props.category !== categories[0].label) {
      const fIndex = findIndex(categories, { label: props.category }) - 1;
      if (props.results[fIndex]) {
        setData(props.results[fIndex].results);
      }
    } else {
      setData(allData);
    }
  }, [props.results, props.category, isMobile]);

  return (
    <MobileContainer>
      {props.withCatMenu && props.category && props.setCategory && (
        <Box id="search-category-dropdown" marginRight="10px">
          <Dropdown
            height={40}
            dropdownItems={categories}
            dropdownSelected={props.category}
            handleDropdownChange={props.setCategory}
          />
        </Box>
      )}
      <Container
        id="search-container"
        theme={{ focused: open, withCatMenu: props.withCatMenu }}
      >
        <Input
          type="text"
          tabIndex={0}
          ref={inputRef}
          value={props.value}
          id="general-search"
          placeholder={getCMSDataField(
            cmsData,
            "componentsSearch.placeholder",
            "e.g. Kenya",
          )}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.setValue(e.target.value)
          }
          data-cy="search-input"
        />
        {props.value.length > 0 && !props.hideClearBtn && (
          <IconButton
            onClick={() => {
              props.setValue("");
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
            sx={{
              padding: 0,
              marginRight: "10px",
              "&:hover": {
                background: "transparent",
              },
              svg: {
                path: {
                  fill: appColors.SEARCH.INPUT_COLOR,
                },
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <Box
          id="search-icon"
          sx={{
            width: "40px",
            height: "100%",
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
      {open && (
        <ClickAwayListener
          onClickAway={(event) => {
            if ((get(event.target, "tagName", "") as string) !== "INPUT") {
              props.setValue("");
            }
          }}
        >
          <Box>
            <SearchResults
              results={data}
              loading={props.loading}
              withCatMenu={props.withCatMenu}
              anchor={props.hideClearBtn ? "right" : "left"}
            />
          </Box>
        </ClickAwayListener>
      )}
    </MobileContainer>
  );
}
