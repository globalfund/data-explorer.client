import React from "react";
import Box from "@mui/material/Box";
import { useDebounce } from "react-use";
import findIndex from "lodash/findIndex";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import { Table } from "app/components/table";
import Close from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import { TableContainerProps } from "app/components/table-container/data";
import SearchIcon from "app/assets/vectors/TableToolbarSearch.svg?react";
import ColumnsIcon from "app/assets/vectors/TableToolbarColumns.svg?react";
// import FilterIcon from "app/assets/vectors/TableToolbarFilter.svg?react";
// import DownloadIcon from "app/assets/vectors/TableToolbarDownload.svg?react";
import FullscreenIcon from "app/assets/vectors/TableToolbarFullscreen.svg?react";

export const TableContainer: React.FC<TableContainerProps> = (
  props: TableContainerProps,
) => {
  const [columns, setColumns] = React.useState(
    props.columns.map((column) => ({
      ...column,
      visible: true,
    })),
  );
  const [extraColumns, setExtraColumns] = React.useState(
    props.extraColumns
      ? props.extraColumns.map((column) => ({
          ...column,
          visible: true,
        }))
      : [],
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(
    null,
  );
  const [search, setSearch] = React.useState("");
  const [search1, setSearch1] = React.useState("");
  const [openSearch, setOpenSearch] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const fullscreenRef = React.useRef<HTMLDivElement>(null);

  const handleColumnsMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const fullscreen = () => {
    if (!fullscreenRef.current) {
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      fullscreenRef.current.requestFullscreen();
    }
  };

  const handleColumnCheckboxChange =
    (title: string, extraCol?: boolean) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const columnsLocal = extraCol ? extraColumns : columns;
      const setColumnsAction = extraCol ? setExtraColumns : setColumns;
      const fColumnIndex = findIndex(columnsLocal, { title });
      if (fColumnIndex > -1) {
        columnsLocal[fColumnIndex].visible = event.target.checked;
      }
      setColumnsAction([...columnsLocal]);
    };

  const onSearchBtnClick = () => {
    setOpenSearch(!openSearch);
    if (openSearch) {
      if (search.length > 0) {
        setSearch("");
        setSearch1("");
        if (props.onSearchChange) {
          props.onSearchChange("");
        }
      }
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearch1(e.target.value);
    if (e.target.value.length === 0 && props.onSearchChange) {
      props.onSearchChange("");
    }
  };

  useDebounce(
    () => {
      if (search.length > 0 && props.onSearchChange) {
        props.onSearchChange(search);
      }
    },
    500,
    [search],
  );

  React.useEffect(() => {
    if (props.search) {
      setSearch1(props.search);
      setOpenSearch(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  return (
    <Box
      gap="24px"
      display="flex"
      bgcolor="#fff"
      borderRadius="32px"
      ref={fullscreenRef}
      flexDirection="column"
      data-cy="table-container"
      sx={{
        "&:fullscreen": {
          padding: "32px",
        },
      }}
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent={props.tabsView ? "space-between" : "flex-end"}
      >
        {props.tabsView && (
          <Box
            gap="8px"
            display="flex"
            flexDirection="row"
            alignItems="center"
            sx={{
              "@media (max-width: 767px)": {
                flexWrap: "wrap",
              },
              "& > button": {
                height: "35px",
                fontSize: "14px",
                fontWeight: "400",
                padding: "0px 12px",
                borderRadius: "4px",
                textTransform: "none",
                border: "1px solid #98A1AA",
                "&:hover": {
                  color: "#fff",
                  background: "#000",
                },
              },
            }}
          >
            {props.tabsView.tabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => props.tabsView?.onTabChange(tab)}
                sx={{
                  color: props.tabsView?.selectedTab === tab ? "#fff" : "#000",
                  background:
                    props.tabsView?.selectedTab === tab ? "#000" : "#fff",
                }}
                data-cy="table-tab-button"
              >
                {tab}
              </Button>
            ))}
          </Box>
        )}
        <Box
          gap="8px"
          display="flex"
          justifyContent="flex-end"
          sx={{
            "& > button": {
              padding: "0",
              width: "40px",
              height: "35px",
              borderRadius: "4px",
              background: "transparent",
              border: "1px solid #98A1AA",
              "&:hover": {
                background: "#000000",
                borderColor: "#000000",
                svg: {
                  filter: "invert(1)",
                },
              },
            },
          }}
        >
          {openSearch && (
            <input
              type="text"
              ref={inputRef}
              value={search1}
              placeholder="Search"
              onChange={onSearchInputChange}
              style={{
                padding: "6px 8px",
                borderRadius: "4px",
                border: "1px solid #98A1AA",
              }}
            />
          )}
          <IconButton disableRipple onClick={onSearchBtnClick}>
            {!openSearch ? <SearchIcon /> : <Close />}
          </IconButton>
          <IconButton disableRipple onClick={fullscreen}>
            <FullscreenIcon />
          </IconButton>
          {!props.noColumnVisibilitySelection && (
            <IconButton disableRipple onClick={handleColumnsMenuClick}>
              <ColumnsIcon />
            </IconButton>
          )}
          {/* <IconButton disableRipple onClick={download}>
            <DownloadIcon />
          </IconButton> */}
          <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            sx={{
              "& > .MuiPaper-root": {
                minWidth: "168px",
                borderRadius: "8px",
                padding: "10px 12px",
                boxShadow: "0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <Box width="100%" display="flex" flexDirection="column">
              <Box
                display="flex"
                marginBottom="20px"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body1">Show columns</Typography>
                <IconButton
                  disableRipple
                  sx={{ padding: "0px" }}
                  onClick={() => setAnchorEl(null)}
                >
                  <Close htmlColor="#000" />
                </IconButton>
              </Box>
              <FormGroup>
                {columns.map((column) => (
                  <FormControlLabel
                    key={column.title}
                    label={column.title}
                    sx={{ marginLeft: "0px" }}
                    control={
                      <Checkbox
                        name={column.title}
                        checked={column.visible}
                        onChange={handleColumnCheckboxChange(column.title)}
                      />
                    }
                  />
                ))}
                {extraColumns.map((column) => (
                  <FormControlLabel
                    key={column.title}
                    label={column.title}
                    sx={{ marginLeft: "0px" }}
                    control={
                      <Checkbox
                        name={column.title}
                        checked={column.visible}
                        onChange={handleColumnCheckboxChange(
                          column.title,
                          true,
                        )}
                      />
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          </Popover>
        </Box>
      </Box>
      <Table
        {...props}
        data={props.data}
        columns={columns}
        extraColumns={extraColumns}
      />
    </Box>
  );
};
