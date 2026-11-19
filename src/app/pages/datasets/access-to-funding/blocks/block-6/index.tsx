import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { TableContainer } from "app/components/table-container";
import { TABLE_VARIATION_6_COLUMNS as DOCUMENTS_TABLE_COLUMNS } from "app/components/table/data";

interface AccessToFundingBlock6Props {
  filterString: string;
}

// INFO: switched from easy-peasy data fetching to direct API call
// because the output size was exceeding the easy-peasy store limit
// and causing the whole app to freeze

export const AccessToFundingBlock6: React.FC<AccessToFundingBlock6Props> = (
  props: AccessToFundingBlock6Props,
) => {
  const cmsData = useCMSData({ returnData: true });
  const [tableSearch, setTableSearch] = React.useState("");
  const [dataDocumentsTable, setDataDocumentsTable] = React.useState([]);
  const [loadingDocumentsTable, setLoadingDocumentsTable] =
    React.useState(false);

  const fetchDocumentsTable = async ({
    filterString,
  }: {
    filterString: string;
  }) => {
    setLoadingDocumentsTable(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/documents?${filterString}`,
      );
      const result = await response.json();
      setDataDocumentsTable(
        result.data.map((item: any, index: number) => {
          if (index === 0) {
            return {
              ...item,
              top: true,
              _children: item._children.map((subItem: any) => ({
                ...subItem,
                top: true,
                _children: subItem._children.map((subSubItem: any) => ({
                  ...subSubItem,
                  top: true,
                })),
              })),
            };
          }
          return item;
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDocumentsTable(false);
    }
  };

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    let filterString = `types=Application${
      props.filterString.length > 0 ? `&${props.filterString}` : ""
    }`;
    if (search) {
      filterString += `&q=${search}`;
    }
    fetchDocumentsTable({ filterString });
  };

  React.useEffect(() => {
    fetchDocumentsTable({
      filterString: `types=Application${
        props.filterString.length > 0 ? `&${props.filterString}` : ""
      }`,
    });
  }, [props.filterString]);

  return (
    <Box
      id="documents"
      padding="50px 0"
      sx={{
        "@media (max-width: 767px)": {
          padding: "20px 0",
        },
      }}
    >
      <Typography variant="h3" lineHeight={1.2}>
        {get(
          cmsData,
          "pagesDatasetsAccessToFunding.documentsTitle",
          "Documents",
        )}
      </Typography>
      <Divider
        sx={{
          margin: "20px 0",
          "@media (max-width: 767px)": {
            display: "none",
          },
        }}
      />
      {loadingDocumentsTable && (
        <Box
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      )}
      {dataDocumentsTable.length === 0 && tableSearch.length === 0 ? (
        <Box
          width="100%"
          height="100%"
          minHeight="250px"
          alignItems="center"
          justifyContent="center"
          display={!loadingDocumentsTable ? "flex" : "none"}
        >
          <Typography>No data available</Typography>
        </Box>
      ) : (
        <React.Fragment>
          <Box
            height="40px"
            sx={{
              "@media (max-width: 767px)": {
                display: "none",
              },
            }}
          />
          <TableContainer
            dataTree
            search={tableSearch}
            id="documents-table"
            data={dataDocumentsTable}
            onSearchChange={onSearchChange}
            columns={DOCUMENTS_TABLE_COLUMNS}
            dataTreeStartExpandedFn={(row) => row.getData().top}
          />
        </React.Fragment>
      )}
    </Box>
  );
};
