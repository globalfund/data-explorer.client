import React from "react";
import { TableContainer } from "app/components/table-container";
import { ColumnDefinition, CellComponent } from "tabulator-tables";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";
import {
  VIEWS,
  years,
  tableData,
  simpleFormatter,
} from "app/pages/datasets/opex/blocks/block-8/data";
import get from "lodash/get";

export const OpexPageBlock8: React.FC = () => {
  const [tableSearch, setTableSearch] = React.useState("");
  const [selectedView, setSelectedView] = React.useState(VIEWS[0]);

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    // reloadTable(search);
  };

  const numberOfAllRows = React.useMemo(() => {
    let count = tableData.length;
    tableData.forEach((row) => {
      if (row._children && Array.isArray(row._children)) {
        count += get(row, "_children.length", 0) as number;
        row._children.forEach((subRow) => {
          if (subRow._children && Array.isArray(subRow._children)) {
            count += get(subRow, "_children.length", 0) as number;
          }
        });
      }
    });
    return count;
  }, [tableData]);

  const columns: ColumnDefinition[] = React.useMemo(() => {
    return [
      {
        title: "Line item ($M)",
        field: "name",
        width: "28%",
        headerSort: false,
      },
      ...years.map((year) => ({
        title: year,
        field: `${year}.${selectedView.toLowerCase()}`,
        width: "8%",
        headerSort: false,
        formatter: (v: CellComponent) => {
          const value = simpleFormatter(v.getValue());
          if (selectedView !== VIEWS[2]) {
            return value;
          }
          const color = v.getValue() < 0 ? "#EA1541" : "#013E77";
          return `<span style="color: ${color}">
              ${v.getValue() > 0 ? "+" : ""}${value}
            </span>`;
        },
      })),
    ];
  }, [selectedView]);

  return (
    <OpexPageChartBlock
      data={null}
      views={VIEWS}
      empty={false}
      loading={false}
      infoType="opex"
      id="cost-breakdown"
      viewSelected={selectedView}
      onViewChange={setSelectedView}
      title="Detailed Cost Breakdown"
      subtitle=""
      exportName="cost-breakdown"
      text="All amounts are in millions (USD). When viewing the 'Variance' tab, blue shows savings (under budget) and red shows overspending (over budget)."
    >
      <TableContainer
        dataTree
        data={tableData}
        columns={columns}
        search={tableSearch}
        dataTreeStartExpanded
        noColumnVisibilitySelection
        id="opex-cost-breakdown-table"
        onSearchChange={onSearchChange}
        rowFormatter={(row) => {
          const isLastRow = row.getPosition() === numberOfAllRows;
          if (isLastRow) {
            row.getElement().style.fontWeight = "700";
            row.getElement().style.color = "#013E77";
            row.getElement().style.background = "#EFF1FE";
            row.getElement().style.borderTop = "1px solid #013E77";
          }
        }}
      />
    </OpexPageChartBlock>
  );
};
