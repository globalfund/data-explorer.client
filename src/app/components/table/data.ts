import { appColors } from "app/theme";
import { formatLocale } from "app/utils/formatLocale";
import {
  RowComponent,
  CellComponent,
  ColumnDefinition,
  TabulatorFull as Tabulator,
} from "tabulator-tables";

export type TableDataItem =
  | string
  | number
  | boolean
  | null
  | object
  | Array<object>;

export interface TableProps {
  id: string;
  data: {
    [key: string]: TableDataItem;
  }[];
  columns: ColumnDefinition[];
  dataTree?: boolean;
  search?: string;
  setTable?: (table: Tabulator) => void;
  dataTreeBranchElement?: boolean;
  dataTreeStartExpanded?: boolean;
  extraColumns?: ColumnDefinition[];
  dataTreeStartExpandedFn?: (row: RowComponent, level: number) => boolean;
  onScrollToBottom?: () => void;
  disableHover?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const cellBGColorFormatter = (cell: CellComponent) => {
  const cellValue = cell.getValue();
  let text = "";
  let backgroundColor = "#FFFFFF";
  if (!cellValue) {
    backgroundColor = "#DFE3E5";
  } else {
    switch (cellValue) {
      case "Eligible":
        backgroundColor = "#013E77";
        break;
      case "Transition Funding":
        backgroundColor = "#00B5AE";
        break;
      case "Not Eligible":
        backgroundColor = "#D9D9D9";
        break;
      case "Extreme":
        backgroundColor = appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[0];
        break;
      case "Severe":
        backgroundColor = appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[1];
        break;
      case "High":
        backgroundColor = appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[2];
        break;
      case "Not High":
        backgroundColor = appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[3];
        break;
      case "Moderate":
        backgroundColor = appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[4];
        break;
      case "Low":
        backgroundColor = appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[5];
        break;
      case "NA":
        break;
      default:
        text = cellValue.toString();
        break;
    }
  }
  if (cell.getRow().getTreeChildren().length > 0) {
    cell.getElement().style.fontWeight = "bold";
    backgroundColor = "#FFFFFF";
  }
  cell.getElement().style.backgroundColor = backgroundColor;
  if (cellValue && !cellValue?.includes("<a")) {
    cell.getElement().style.whiteSpace = "pre-wrap";
  }
  return text;
};

export const financialFormatter = (cell: CellComponent) => {
  if (!cell.getValue()) {
    return cellBGColorFormatter(cell);
  }
  cell.getElement().style.backgroundColor = "#FFFFFF";
  return formatLocale(cell.getValue()).replace("US$", "");
};

export const cellBaselineTargetResultFormatter = (cell: CellComponent) => {
  const cellValue = cell.getValue();
  let text = "";
  let backgroundColor = "#FFFFFF";

  if (!cellValue) {
    backgroundColor = "#DFE3E5";
  } else {
    const splits = cellValue.split(",");
    text = splits.join("\n");
  }

  cell.getElement().style.backgroundColor = backgroundColor;
  cell.getElement().style.whiteSpace = "pre-wrap";

  return text;
};

export const cellAchievementFormatter = (cell: CellComponent) => {
  const cellValue = cell.getValue()?.replace("%", "");
  let backgroundColor = "#FFFFFF";
  let color = "#000000";

  if (cellValue > 0 && cellValue < 25) {
    backgroundColor = appColors.TARGETS_RESULTS.PERFORMANCE_COLORS[0];
    color = appColors.TARGETS_RESULTS.PERCENTAGE_TEXT_COLORS[0];
  } else if (cellValue >= 25 && cellValue < 50) {
    backgroundColor = appColors.TARGETS_RESULTS.PERFORMANCE_COLORS[1];
    color = appColors.TARGETS_RESULTS.PERCENTAGE_TEXT_COLORS[1];
  } else if (cellValue >= 50 && cellValue < 75) {
    backgroundColor = appColors.TARGETS_RESULTS.PERFORMANCE_COLORS[2];
    color = appColors.TARGETS_RESULTS.PERCENTAGE_TEXT_COLORS[2];
  } else if (cellValue >= 75) {
    backgroundColor = appColors.TARGETS_RESULTS.PERFORMANCE_COLORS[3];
    color = appColors.TARGETS_RESULTS.PERCENTAGE_TEXT_COLORS[3];
  } else if (cellValue > 100) {
    backgroundColor = appColors.TARGETS_RESULTS.PERFORMANCE_COLORS[4];
    color = appColors.TARGETS_RESULTS.PERCENTAGE_TEXT_COLORS[4];
  }

  cell.getElement().style.backgroundColor = backgroundColor;
  cell.getElement().style.color = color;
  cell.getElement().style.whiteSpace = "pre-wrap";

  return `\n${cell.getValue()}`;
};

export const TABLE_VARIATION_1_COLUMNS: ColumnDefinition[] = [
  { title: "Name", field: "name", width: "20%" },
  {
    title: "Years",
    columns: [
      { title: "2002", field: "2002" },
      { title: "2003", field: "2003" },
      { title: "2004", field: "2004" },
      { title: "2005", field: "2005" },
    ],
  },
  {
    title: "Components",
    columns: [
      { title: "HIV", field: "HIV" },
      { title: "Tuberculosis", field: "Tuberculosis" },
      { title: "Malaria", field: "Malaria" },
      { title: "Others", field: "Others" },
    ],
  },
];

export const TABLE_VARIATION_1_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    name: "Africa",
    2002: 100,
    2003: 120,
    2004: 140,
    2005: 160,
    HIV: 10,
    Tuberculosis: 20,
    Malaria: 30,
    Others: 40,
    _children: [
      {
        name: "Eastern Africa",
        2002: 10,
        2003: 12,
        2004: 14,
        2005: 16,
        HIV: 1,
        Tuberculosis: 2,
        Malaria: 3,
        Others: 4,
        _children: [
          {
            name: "Kenya",
            2002: 1,
            2003: 1.2,
            2004: 1.4,
            2005: 1.6,
            HIV: 0.1,
            Tuberculosis: 0.2,
            Malaria: 0.3,
            Others: 0.4,
          },
          {
            name: "Uganda",
            2002: 1,
            2003: 1.2,
            2004: 1.4,
            2005: 1.6,
            HIV: 0.1,
            Tuberculosis: 0.2,
            Malaria: 0.3,
            Others: 0.4,
          },
        ],
      },
      {
        name: "Western Africa",
        2002: 10,
        2003: 12,
        2004: 14,
        2005: 16,
        HIV: 1,
        Tuberculosis: 2,
        Malaria: 3,
        Others: 4,
        _children: [
          {
            name: "Nigeria",
            2002: 1,
            2003: 1.2,
            2004: 1.4,
            2005: 1.6,
            HIV: 0.1,
            Tuberculosis: 0.2,
            Malaria: 0.3,
            Others: 0.4,
          },
          {
            name: "Ghana",
            2002: 1,
            2003: 1.2,
            2004: 1.4,
            2005: 1.6,
            HIV: 0.1,
            Tuberculosis: 0.2,
            Malaria: 0.3,
            Others: 0.4,
          },
        ],
      },
    ],
  },
  {
    name: "Asia",
    2002: 100,
    2003: 120,
    2004: 140,
    2005: 160,
    HIV: 10,
    Tuberculosis: 20,
    Malaria: 30,
    Others: 40,
    _children: [
      {
        name: "Eastern Asia",
        2002: 10,
        2003: 12,
        2004: 14,
        2005: 16,
        HIV: 1,
        Tuberculosis: 2,
        Malaria: 3,
        Others: 4,
        _children: [
          {
            name: "China",
            2002: 1,
            2003: 1.2,
            2004: 1.4,
            2005: 1.6,
            HIV: 0.1,
            Tuberculosis: 0.2,
            Malaria: 0.3,
            Others: 0.4,
          },
          {
            name: "Japan",
            2002: 1,
            2003: 1.2,
            2004: 1.4,
            2005: 1.6,
            HIV: 0.1,
            Tuberculosis: 0.2,
            Malaria: 0.3,
            Others: 0.4,
          },
        ],
      },
      {
        name: "Southern Asia",
        2002: 10,
        2003: 12,
        2004: 14,
        2005: 16,
        HIV: 1,
        Tuberculosis: 2,
        Malaria: 3,
        Others: 4,
        _children: [
          {
            name: "India",
            2002: 1,
            2003: 1.2,
            2004: 1.4,
            2005: 1.6,
            HIV: 0.1,
            Tuberculosis: 0.2,
            Malaria: 0.3,
            Others: 0.4,
          },
          {
            name: "Pakistan",
            2002: 1,
            2003: 1.2,
            2004: 1.4,
            2005: 1.6,
            HIV: 0.1,
            Tuberculosis: 0.2,
            Malaria: 0.3,
            Others: 0.4,
          },
        ],
      },
    ],
  },
];

export const TABLE_VARIATION_2_COLUMNS: ColumnDefinition[] = [
  {
    title: "Components",
    field: "components",
    formatter: cellBGColorFormatter,
    minWidth: 180,
  },
  {
    title: "Submission Date",
    field: "submissionDate",
    formatter: cellBGColorFormatter,
  },
  { title: "Approach", field: "approach", formatter: cellBGColorFormatter },
  { title: "TRP Window", field: "trpWindow", formatter: cellBGColorFormatter },
  {
    title: "TRP Outcome",
    field: "trpOutcome",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Portfolio Categorization",
    field: "portfolioCategorization",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Board Approval",
    field: "boardApproval",
    formatter: cellBGColorFormatter,
  },
  {
    title: "GAC Meeting",
    field: "gacMeeting",
    formatter: cellBGColorFormatter,
  },
  { title: "Grant", field: "grant", formatter: cellBGColorFormatter },
  {
    title: "Starting date",
    field: "startingDate",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Ending date",
    field: "endingDate",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Principal Recipient",
    field: "principalRecipient",
    formatter: cellBGColorFormatter,
  },
  // { title: "Component", field: "component", formatter: cellBGColorFormatter },
];

export const TABLE_VARIATION_2_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    components: "HIV",
    submissionDate: "23 March 2023",
    approach: "Program continuation",
    trpWindow: "B2",
    trpOutcome: "Grant making",
    portfolioCategorization: "--",
    _children: [
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH001",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH001",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
    ],
  },
  {
    components: "Malaria",
    submissionDate: "23 March 2023",
    approach: "Program continuation",
    trpWindow: "B2",
    trpOutcome: "Grant making",
    portfolioCategorization: "--",
    _children: [
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH001",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH002",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
    ],
  },
  {
    components: "Tuberculosis",
    submissionDate: "23 March 2023",
    approach: "Program continuation",
    trpWindow: "B2",
    trpOutcome: "Grant making",
    portfolioCategorization: "--",
    _children: [
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH001",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH002",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
    ],
  },
  {
    components: "HIV",
    submissionDate: "23 March 2023",
    approach: "Program continuation",
    trpWindow: "B2",
    trpOutcome: "Grant making",
    portfolioCategorization: "--",
    _children: [
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH001",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH001",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
    ],
  },
  {
    components: "Malaria",
    submissionDate: "23 March 2023",
    approach: "Program continuation",
    trpWindow: "B2",
    trpOutcome: "Grant making",
    portfolioCategorization: "--",
    _children: [
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH001",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH002",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
    ],
  },
  {
    components: "Tuberculosis",
    submissionDate: "23 March 2023",
    approach: "Program continuation",
    trpWindow: "B2",
    trpOutcome: "Grant making",
    portfolioCategorization: "--",
    _children: [
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH001",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
      {
        boardApproval: "November 2023",
        gacMeeting: "November 2022",
        grant: "AFG-H-MOH002",
        startingDate: "31-12-2023",
        endingDate: "31-12-2025",
        principalRecipient: "Private health ministry of Ghana",
      },
    ],
  },
];

export const TABLE_VARIATION_3_COLUMNS: ColumnDefinition[] = [
  { title: "Location", field: "name", formatter: cellBGColorFormatter },
  { title: "2023", field: "2023", formatter: cellBGColorFormatter },
  { title: "2022", field: "2022", formatter: cellBGColorFormatter },
  { title: "2021", field: "2021", formatter: cellBGColorFormatter },
  { title: "2020", field: "2020", formatter: cellBGColorFormatter },
  { title: "2019", field: "2019", formatter: cellBGColorFormatter },
];

export const TABLE_VARIATION_3_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    name: "Algeria",
    _children: [
      {
        name: "HIV",
        2023: "Eligible",
        2022: "Eligible",
        2021: "Eligible",
        2020: "Eligible",
        2019: "Eligible",
        _children: [
          {
            name: "Burden Disease",
            2023: "Low",
            2022: "Low",
            2021: "Low",
            2020: "Low",
            2019: "Low",
          },
        ],
      },
    ],
  },
  {
    name: "Kenya",
    _children: [
      {
        name: "HIV",
        2023: "Eligible",
        2022: "Eligible",
        2021: "Eligible",
        2020: "Eligible",
        2019: "Eligible",
        _children: [
          {
            name: "Burden Disease",
            2023: "Low",
            2022: "Low",
            2021: "Low",
            2020: "Low",
            2019: "Low",
          },
        ],
      },
    ],
  },
];

export const TABLE_VARIATION_4_COLUMNS: ColumnDefinition[] = [
  {
    title: "Modules & Coverage Indicators",
    field: "name",
    formatter: cellBGColorFormatter,
    width: "35%",
  },
  {
    title: "Reversed",
    columns: [
      {
        title: "Value",
        field: "reversed",
        formatter: cellBGColorFormatter,
      },
    ],
  },
  {
    title: "Geo. coverage",
    columns: [
      { title: "Value", field: "geoCoverage", formatter: cellBGColorFormatter },
    ],
  },
  {
    title: "Cumulation",
    columns: [
      { title: "Period", field: "cumulation", formatter: cellBGColorFormatter },
    ],
  },
  {
    title: "Baseline",
    columns: [
      {
        title: "Value",
        field: "baselineValue",
        formatter: cellBaselineTargetResultFormatter,
      },
      {
        title: "Year",
        field: "baselineYear",
        formatter: cellBGColorFormatter,
      },
    ],
  },
  {
    title: "2020",
    field: "2020",
    formatter: (cell: CellComponent) => {
      const tableEl = document.createElement("div");
      cell.getElement().appendChild(tableEl);
      const data = cell.getValue();

      if (!cell.getValue()) {
        return "";
      }

      new Tabulator(tableEl, {
        data,
        layout: "fitDataTable",
        height: "fit-content",
        columns: [
          { title: "Target", field: "target" },
          { title: "Result", field: "result" },
          { title: "Achievement", field: "achievement" },
        ],
      });

      // cell.getElement().style.height = "max-content";
      cell.getElement().style.padding = "0";

      return tableEl;
    },
  },
  {
    title: "2021",
    field: "2021",
    formatter: (cell: CellComponent) => {
      const tableEl = document.createElement("div");
      cell.getElement().appendChild(tableEl);
      const data = cell.getValue();

      if (!cell.getValue()) {
        return "";
      }

      new Tabulator(tableEl, {
        data,
        layout: "fitDataTable",
        height: "fit-content",
        columns: [
          { title: "Target", field: "target" },
          { title: "Result", field: "result" },
          { title: "Achievement", field: "achievement" },
        ],
      });

      // cell.getElement().style.height = "max-content";
      cell.getElement().style.padding = "0";

      return tableEl;
    },
  },
];

export const TABLE_VARIATION_4_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    name: "TB CARE AND PREVENTION",
    _children: [
      {
        name: "Number of notified cases of all forms of TB (i.e. bacteriologically confirmed + clinically diagnosed), new and relapse cases",
        _children: [
          {
            reversed: "No",
            geoCoverage: "National",
            cumulation: "Annually",
            baselineValue: "T:0.5%",
            baselineYear: "2018",
            baselineSource: "--",
            "2020": [
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
            ],
            "2021": [
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "TB CARE AND PREVENTION",
    _children: [
      {
        name: "Number of notified cases of all forms of TB (i.e. bacteriologically confirmed + clinically diagnosed), new and relapse cases",
        _children: [
          {
            reversed: "No",
            geoCoverage: "National",
            cumulation: "Annually",
            baselineValue: "T:0.5%",
            baselineYear: "2018",
            baselineSource: "--",
            "2020": [
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
            ],
            "2021": [
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
              {
                target: "T:0.5%",
                result: "T:0.5%",
                achievement: "100%",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const TABLE_VARIATION_5_COLUMNS: ColumnDefinition[] = [
  {
    title: "Grant ID",
    field: "grantId",
    formatter: (cell: CellComponent) =>
      `<a href="/grant/${cell.getValue()}">${cell.getValue()}</a>`,
    width: "10%",
    minWidth: 150,
  },
  {
    title: "Start/End date",
    field: "startEndDate",
    formatter: cellBGColorFormatter,
    width: "15%",
    minWidth: 150,
  },
  {
    title: "Geography",
    field: "geography",
    formatter: cellBGColorFormatter,
    width: "10%",
    minWidth: 100,
  },
  {
    title: "Component",
    field: "component",
    formatter: cellBGColorFormatter,
    width: "10%",
    minWidth: 100,
  },
  {
    title: "Principal Recipient",
    field: "principalRecipient",
    formatter: cellBGColorFormatter,
    width: "25%",
    minWidth: 250,
  },
  {
    title: "Status",
    field: "status",
    formatter: cellBGColorFormatter,
    width: "10%",
    minWidth: 150,
  },
  {
    title: "Signed (US$)",
    field: "signed",
    formatter: financialFormatter,
    width: "10%",
    minWidth: 150,
  },
  {
    title: "Disbursed (US$)",
    field: "disbursed",
    formatter: financialFormatter,
    width: "10%",
    minWidth: 150,
  },
];

export const TABLE_VARIATION_5_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    grantId: "AFG-H-MOH001",
    startEndDate: "Jul 2023 - Dec 2023",
    geography: "Ghana",
    component: "HIV",
    principalRecipient: "Private health ministry of Ghana",
    status: "Active",
    signed: 1000000,
    disbursed: 1000000,
  },
  {
    grantId: "AFG-H-MOH001",
    startEndDate: "Jul 2023 - Dec 2023",
    geography: "Ghana",
    component: "HIV",
    principalRecipient: "Private health ministry of Ghana",
    status: "Active",
    signed: 1000000,
    disbursed: 1000000,
  },
];

const docsMutator = (_value: any, data: any) => {
  if (!isNaN(parseInt(data.documents, 10))) return data.name;
  return `
    <a href="${data.documents}" style="gap: 5px;display: inline-flex;align-items: center;color: #000000;text-decoration: none;" aria-label="${data.name}">
      <span>${data.name}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="table-download-icon">
        <path d="M10.1656 6.7063C10.2326 6.63597 10.3128 6.58 10.4013 6.54169C10.4899 6.50339 10.5851 6.48351 10.6813 6.48324C10.7775 6.48296 10.8728 6.50229 10.9615 6.54009C11.0503 6.5779 11.1308 6.6334 11.1982 6.70335C11.2656 6.7733 11.3186 6.85627 11.354 6.9474C11.3895 7.03852 11.4067 7.13595 11.4047 7.23395C11.4026 7.33195 11.3814 7.42855 11.3422 7.51807C11.303 7.60758 11.2466 7.6882 11.1763 7.75518L8.43516 10.509C8.30006 10.6442 8.11825 10.72 7.92886 10.72C7.73947 10.72 7.55766 10.6442 7.42255 10.509L4.7207 7.79046C4.58418 7.65377 4.50655 7.46743 4.50488 7.27242C4.50322 7.07742 4.57765 6.88973 4.71181 6.75064C4.84596 6.61155 5.02885 6.53245 5.22025 6.53075C5.41164 6.52906 5.59586 6.60489 5.73237 6.74158L7.21947 8.24338L7.23444 2.95417C7.24257 2.76358 7.323 2.58364 7.45879 2.45229C7.59457 2.32093 7.77511 2.24842 7.96234 2.25003C8.14957 2.25163 8.32888 2.32724 8.46248 2.4609C8.59607 2.59457 8.67352 2.77586 8.67849 2.96657L8.66445 8.21096L10.1656 6.7063ZM2.25 13.0453L2.25936 10.1676C2.25686 10.0688 2.27391 9.97051 2.3095 9.87858C2.34508 9.78664 2.39848 9.70295 2.46649 9.63248C2.5345 9.56202 2.61574 9.50624 2.70537 9.46845C2.795 9.43066 2.89117 9.41165 2.98817 9.41255C3.08516 9.41345 3.18098 9.43423 3.26992 9.47367C3.35886 9.51311 3.43909 9.57039 3.50584 9.64209C3.57259 9.7138 3.62448 9.79847 3.65842 9.89105C3.69236 9.98362 3.70766 10.0822 3.70341 10.181L3.69685 12.2787C6.56686 12.2844 9.43405 12.2844 12.2984 12.2787L12.305 10.1695C12.3067 9.97428 12.3845 9.78774 12.5212 9.65095C12.658 9.51415 12.8424 9.43829 13.034 9.44006C13.2256 9.44183 13.4087 9.52108 13.543 9.66039C13.6773 9.79969 13.7517 9.98763 13.75 10.1829L13.7406 13.0434H13.7322C13.7238 13.2314 13.645 13.409 13.512 13.5395C13.379 13.6701 13.2019 13.7437 13.0172 13.7452C9.6649 13.7516 6.31511 13.7516 2.96781 13.7452C2.78287 13.7447 2.60521 13.6718 2.4716 13.5415C2.33799 13.4112 2.25865 13.2336 2.25 13.0453Z" fill="#373D43"/>
      </svg>
    </a>`;
};

export const TABLE_VARIATION_6_COLUMNS: ColumnDefinition[] = [
  {
    title: "Geography",
    field: "name",
    width: "98%",
    resizable: false,
    formatter: cellBGColorFormatter,
    mutator: docsMutator,
  },
];

export const TABLE_VARIATION_6_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    name: "Kenya",
    documents: 23,
    _children: [
      {
        name: "Application",
        documents: 23,
        _children: [
          {
            name: "Proposal - Round 04 - Malaria - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 04/Malaria/en/KEN-R04-ML_Proposal_0_en.pdf",
          },
          {
            name: "Proposal - Round 04 - Malaria - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 04/Malaria/en/KEN-R04-ML_AMFmApplication_0_en.pdf",
          },
          {
            name: "2022 - Additional Covid Funding Request - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Additional Covid Funding Requests/KEN/2022/NA/en/KEN-X_AddnlCovidFundingRequest_1_EN.zip",
          },
          {
            name: "2023 - Funding Request - Window 3 - Malaria - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Funding Requests/KEN/2023/Malaria/en/KEN-M_FundingRequest_1_en.zip",
          },
          {
            name: "Proposal - Round 10 - HIV - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 10/HIV/en/KEN-R10-HA_Proposal_0_en.pdf",
          },
          {
            name: "Proposal - Round 09 - Tuberculosis - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 09/Tuberculosis/en/KEN-R09-TB_Proposal_0_en.pdf",
          },
          {
            name: "2021 - Full Covid Funding Request - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Full Covid Funding Requests/KEN/2021/NA/en/KEN-X_FullCovidFundingRequest_1_en.zip",
          },
          {
            name: "2015 - Concept Note - Malaria - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Concept Notes/KEN/2015/Malaria/en/KEN-M_ConceptNote_0_en.zip",
          },
          {
            name: "Proposal - Round 02 - Malaria - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 02/Malaria/en/KEN-R02-ML_Proposal_0_en.pdf",
          },
          {
            name: "Proposal - Round 05 - Tuberculosis - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 05/Tuberculosis/en/KEN-R05-TB_Proposal_0_en.pdf",
          },
          {
            name: "2020 - Funding Request - Window 3 - TB/HIV - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Funding Requests/KEN/2020/TB_HIV/en/KEN-C_FundingRequest_1_en.zip",
          },
          {
            name: "Proposal - Round 07 - HIV - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 07/HIV/en/KEN-R07-HA_Proposal_0_en.pdf",
          },
          {
            name: "2015 - Concept Note - TB/HIV - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Concept Notes/KEN/2015/TB_HIV/en/KEN-TH_ConceptNote_0_en.zip",
          },
          {
            name: "2020 - Funding Request - Window 3 - Malaria - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Funding Requests/KEN/2020/Malaria/en/KEN-M_FundingRequest_1_en.zip",
          },
          {
            name: "Proposal - Round 02 - HIV - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 02/HIV/en/KEN-R02-HA_Proposal_0_en.pdf",
          },
          {
            name: "2023 - Funding Request - Window 3 - TB/HIV - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Funding Requests/KEN/2023/TB_HIV/en/KEN-C_FundingRequest_1_en.zip",
          },
          {
            name: "Proposal - Round 02 - Tuberculosis - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 02/Tuberculosis/en/KEN-R02-TB_Proposal_0_en.pdf",
          },
          {
            name: "2017 - Funding Request - TB/HIV - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Funding Requests/KEN/2017/TB_HIV/en/KEN-C_FundingRequest_0_en.zip",
          },
          {
            name: "2021 - Fast-track Covid Funding Request - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Fast-track Covid Funding Requests/KEN/2021/NA/en/KEN-X_FastCovidFundingRequest_1_en.zip",
          },
          {
            name: "Proposal - Round 10 - Malaria - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 10/Malaria/en/KEN-R10-ML_Proposal_0_en.pdf",
          },
          {
            name: "2017 - Funding Request - Malaria - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Funding Requests/KEN/2017/Malaria/en/KEN-M_FundingRequest_0_en.zip",
          },
          {
            name: "Proposal - Round 06 - Tuberculosis - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 06/Tuberculosis/en/KEN-R06-TB_Proposal_0_en.pdf",
          },
          {
            name: "Proposal - Round 01 - HIV - Kenya",
            documents:
              "https://gfdatastore.blob.core.windows.net/files/Applications/Proposals/KEN/Round 01/HIV/en/KEN-R01-HA_Proposal_0_en.pdf",
          },
        ],
      },
    ],
  },
];

export const TABLE_VARIATION_7_COLUMNS: ColumnDefinition[] = [
  {
    title: "Description",
    field: "description",
    formatter: cellBGColorFormatter,
    width: "70%",
  },
  {
    title: "Component",
    field: "component",
    formatter: cellBGColorFormatter,
    width: "15%",
  },
  {
    title: "Result",
    field: "result",
    formatter: financialFormatter,
    width: "15%",
  },
];

export const TABLE_VARIATION_7_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    description: "People on antiretroviral therapy for HIV",
    component: "HIV",
    result: 1965401,
  },
  {
    description: "People with TB treated",
    component: "Tuberculosis",
    result: 1965401,
  },
  {
    description: "Insecticide-treated mosquito nets distributed",
    component: "Malaria",
    result: 10000000,
  },
  {
    description: "Peopleusing pre-exposure prophylaxis",
    component: "HIV",
    result: 1000000,
  },
  {
    description:
      "Other vulnerable populations reached with HIV prevention programs",
    component: "HIV",
    result: 100000,
  },
  {
    description:
      "People in contact with TB patients received preventive therapy",
    component: "Tuberculosis",
    result: 100000,
  },
  {
    description: "Rifampicin - and/or multidrug-resistant TB cases notified",
    component: "Tuberculosis",
    result: 10000,
  },
  {
    description:
      "People in contact with TB patients received preventive therapy",
    component: "Tuberculosis",
    result: 200000,
  },
];

export const TABLE_VARIATION_8_COLUMNS: ColumnDefinition[] = [
  {
    title: "Donors Types & Donors",
    field: "name",
    formatter: cellBGColorFormatter,
    width: "50%",
  },
  {
    title: "Pledge (US$)",
    field: "pledge",
    formatter: financialFormatter,
    width: "25%",
  },
  {
    title: "Contribution (US$)",
    field: "contribution",
    formatter: financialFormatter,
    width: "25%",
  },
];

export const TABLE_VARIATION_8_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    name: "Affordable Medicines Facility - malaria (AMFm)",
    pledge: 537458185.43,
    contribution: 537458185.43,
    _children: [
      {
        name: "AMFm Bill & Melinda Gates Foundation",
        pledge: 24365000,
        contribution: 24365000,
      },
      {
        name: "AMFm Canada",
        pledge: 39596763.03,
        contribution: 39596763.03,
      },
      {
        name: "AMFm United Kingdom",
        pledge: 273496422.4,
        contribution: 273496422.4,
      },
      {
        name: "AMFm World Health Organization-Unitaid",
        pledge: 200000000,
        contribution: 200000000,
      },
    ],
  },
  {
    name: "Corporation",
    pledge: 655304646.01,
    contribution: 695475765.3599999,
    _children: [
      {
        name: "Absa Group Ltd",
        pledge: 150000,
        contribution: 150000,
      },
      {
        name: "Anglo American plc",
        pledge: 18500000,
        contribution: 7125000,
      },
      {
        name: "BHP Billiton Sustainable Communities",
        pledge: 10000000,
        contribution: 10000000,
      },
      {
        name: "Chevron Corporation",
        pledge: 60004000,
        contribution: 60004000,
      },
      {
        name: "Ecobank",
        pledge: 6000000,
        contribution: 1500000,
      },
      {
        name: "Gift from Africa",
        pledge: 3000000,
        contribution: 1495856.61,
      },
      {
        name: "GlaxoSmithKline plc and Viiv Healthcare",
        pledge: 9408997.36,
        contribution: 5880623.35,
      },
      {
        name: "Goodbye Malaria - Sonhos Social Capital / Relate Trust ZA",
        pledge: 15000000,
        contribution: 6719279.34,
      },
      {
        name: "Munich Re",
        pledge: 1002000,
        contribution: 1002000,
      },
      {
        name: "Nationale Postcode Loterij N.V.",
        pledge: 3397662.5,
        contribution: 3397662.5,
      },
      {
        name: "Product (RED)",
        pledge: 500000000,
        contribution: 575059357.4,
      },
      {
        name: "PT. Kalbe Farma Tbk",
        pledge: 1500000,
        contribution: 500000,
      },
      {
        name: "Standard Bank",
        pledge: 4000000,
        contribution: 2000000,
      },
      {
        name: "Takeda Pharmaceutical",
        pledge: 17641986.15,
        contribution: 17641986.16,
      },
      {
        name: "Vale",
        pledge: 3000000,
        contribution: 3000000,
      },
      {
        name: "Duet Group",
        pledge: 2600000,
        contribution: 0,
      },
      {
        name: "Medtronic LABS",
        pledge: 100000,
        contribution: 0,
      },
    ],
  },
  {
    name: "Debt2Health",
    pledge: 232224123,
    contribution: 225894765.36,
    _children: [
      {
        name: "Debt2Health - Australia-Indonesia",
        pledge: 35267489.58,
        contribution: 35267489.57,
      },
      {
        name: "Debt2Health - Germany - El Salvador",
        pledge: 11222085.1,
        contribution: 11222085.1,
      },
      {
        name: "Debt2Health - Germany-Côte d'Ivoire",
        pledge: 12540097.19,
        contribution: 12540096.89,
      },
      {
        name: "Debt2Health - Germany-Egypt",
        pledge: 4807118.2,
        contribution: 4807118.2,
      },
      {
        name: "Debt2Health - Germany-Indonesia",
        pledge: 90905435.51,
        contribution: 90905435.51,
      },
      {
        name: "Debt2Health - Germany-Pakistan",
        pledge: 26374033.3,
        contribution: 26374033.3,
      },
      {
        name: "Debt2Health - Germany-Sri Lanka",
        pledge: 22444170.2,
        contribution: 16114812.87,
      },
      {
        name: "Debt2Health - Jordan-Germany",
        pledge: 11222085.1,
        contribution: 11222085.1,
      },
      {
        name: "Debt2Health - Spain-Cameroon",
        pledge: 10456922.94,
        contribution: 10456922.94,
      },
      {
        name: "Debt2Health - Spain-Congo (Democratic Republic)",
        pledge: 3403543.46,
        contribution: 3403543.46,
      },
      {
        name: "Debt2Health - Spain-Ethiopia",
        pledge: 3581142.42,
        contribution: 3581142.42,
      },
    ],
  },
  {
    name: "Faith-Based Organization",
    pledge: 41500000,
    contribution: 25510854.39,
    _children: [
      {
        name: "LMI (Lutheran Malaria Initiative)",
        pledge: 13500000,
        contribution: 1654957.39,
      },
      {
        name: "United Methodist Church",
        pledge: 28000000,
        contribution: 23855897,
      },
    ],
  },
  {
    name: "Foundation",
    pledge: 4157886086.67,
    contribution: 3455554123.85,
    _children: [
      {
        name: "Abbott Fund",
        pledge: 5000000,
        contribution: 1667000,
      },
      {
        name: "AIDS Healthcare Foundation",
        pledge: 10000000,
        contribution: 2000000,
      },
      {
        name: "Bill & Melinda Gates Foundation",
        pledge: 3928300348,
        contribution: 3305259289,
      },
      {
        name: "Catholic Relief Services",
        pledge: 11000000,
        contribution: 8000000,
      },
      {
        name: "Children's Investment Fund Foundation",
        pledge: 68090668.75,
        contribution: 48995232.75,
      },
      {
        name: "Comic Relief",
        pledge: 58195069.92,
        contribution: 51032602.1,
      },
      {
        name: "Communitas Foundation",
        pledge: 2000000,
        contribution: 2000000,
      },
      {
        name: "Fondation Chanel",
        pledge: 1550000,
        contribution: 1550000,
      },
      {
        name: "J.C. Flowers Foundation",
        pledge: 1000000,
        contribution: 1000000,
      },
      {
        name: "Johnson & Johnson Foundation",
        pledge: 0,
        contribution: 4500000,
      },
      {
        name: "M∙A∙C AIDS Fund",
        pledge: 3250000,
        contribution: 3250000,
      },
      {
        name: "McGovern Foundation",
        pledge: 1000000,
        contribution: 1000000,
      },
      {
        name: "Rockefeller Foundation",
        pledge: 30000000,
        contribution: 21000000,
      },
      {
        name: "Skoll Foundation",
        pledge: 10000000,
        contribution: 4000000,
      },
      {
        name: "Tanoto Foundation",
        pledge: 1000000,
        contribution: 300000,
      },
      {
        name: "FIFA Foundation",
        pledge: 1500000,
        contribution: 0,
      },
      {
        name: "Outcomes Fund for Fevers",
        pledge: 25000000,
        contribution: 0,
      },
      {
        name: "SMJR Foundation",
        pledge: 1000000,
        contribution: 0,
      },
    ],
  },
  {
    name: "Individual",
    pledge: 79215156.01,
    contribution: 23340405.44,
    _children: [
      {
        name: "Tahir Foundation",
        pledge: 79215156.01,
        contribution: 23340405.44,
      },
    ],
  },
  {
    name: "Private Sector & Nongovernment",
    pledge: 231880131.54999998,
    contribution: 65813531.28,
    _children: [
      {
        name: "Co-Impact",
        pledge: 8000000,
        contribution: 6650000,
      },
      {
        name: "Hottokenai Campaign (G-CAP Coalition Japan)",
        pledge: 250000,
        contribution: 250000,
      },
      {
        name: "Idol Gives Back",
        pledge: 16600000,
        contribution: 16600000,
      },
      {
        name: "KN Cam Ranh Co., Ltd.",
        pledge: 4000000,
        contribution: 1000000,
      },
      {
        name: "Other Private Sector",
        pledge: 160647487.07,
        contribution: 29502198.44,
      },
      {
        name: "Plan International and Plan Canada",
        pledge: 5175551.6,
        contribution: 1804239.96,
      },
      {
        name: "United Nations Foundation",
        pledge: 9707092.88,
        contribution: 9707092.88,
      },
      {
        name: "YMCA and Y's Men International",
        pledge: 500000,
        contribution: 300000,
      },
      {
        name: "Cordaid",
        pledge: 5000000,
        contribution: 0,
      },
      {
        name: "Human Crescent",
        pledge: 10000000,
        contribution: 0,
      },
      {
        name: "Rotary Australia World Community Service and Rotarians Against Malaria",
        pledge: 12000000,
        contribution: 0,
      },
    ],
  },
  {
    name: "Public Sector",
    pledge: 83023804221.21999,
    contribution: 68674070397.42001,
    _children: [
      {
        name: "Andorra",
        pledge: 100000,
        contribution: 100000,
      },
      {
        name: "Australia",
        pledge: 1061452595.5,
        contribution: 857868607.82,
      },
      {
        name: "Austria",
        pledge: 1075900,
        contribution: 1075900,
      },
      {
        name: "Azerbaijan",
        pledge: 20000000,
        contribution: 5800000,
      },
      {
        name: "Barbados",
        pledge: 100000,
        contribution: 100000,
      },
      {
        name: "Belgium",
        pledge: 406271977.08,
        contribution: 391368847.43,
      },
      {
        name: "Benin",
        pledge: 3000000,
        contribution: 2000000,
      },
      {
        name: "Brazil",
        pledge: 202355.08,
        contribution: 202355.08,
      },
      {
        name: "Brunei Darussalam",
        pledge: 150000,
        contribution: 150000,
      },
      {
        name: "Burkina Faso",
        pledge: 2075832.15,
        contribution: 1075832.15,
      },
      {
        name: "Burundi",
        pledge: 1000000,
        contribution: 596080.38,
      },
      {
        name: "Canada",
        pledge: 4379254163.97,
        contribution: 3776157910.87,
      },
      {
        name: "Central African Republic",
        pledge: 1999001,
        contribution: 423016.73,
      },
      {
        name: "Chad",
        pledge: 551480.73,
        contribution: 551480.73,
      },
      {
        name: "China",
        pledge: 81000000,
        contribution: 81000000,
      },
      {
        name: "Congo (Democratic Republic)",
        pledge: 12000000,
        contribution: 4000000,
      },
      {
        name: "Côte d'Ivoire",
        pledge: 4526477.5,
        contribution: 2445500.45,
      },
      {
        name: "Cyprus",
        pledge: 99354.2,
        contribution: 99354.2,
      },
      {
        name: "Denmark",
        pledge: 499164879.31,
        contribution: 449066686.85,
      },
      {
        name: "Estonia",
        pledge: 4077.2,
        contribution: 4077.2,
      },
      {
        name: "Eswatini",
        pledge: 7000000,
        contribution: 6000000,
      },
      {
        name: "European Commission",
        pledge: 4152680240.25,
        contribution: 3966197215.12,
      },
      {
        name: "Finland",
        pledge: 33200900,
        contribution: 33200900,
      },
      {
        name: "France",
        pledge: 9521557247.41,
        contribution: 8017719950.15,
      },
      {
        name: "Georgia",
        pledge: 40000,
        contribution: 40000,
      },
      {
        name: "Germany",
        pledge: 6713397327.33,
        contribution: 5794835379.71,
      },
      {
        name: "Greece",
        pledge: 2205233.07,
        contribution: 2205233.07,
      },
      {
        name: "Hungary",
        pledge: 55000,
        contribution: 55000,
      },
      {
        name: "Iceland",
        pledge: 1170707.23,
        contribution: 1170707.23,
      },
      {
        name: "India",
        pledge: 94500000,
        contribution: 76500000,
      },
      {
        name: "Indonesia",
        pledge: 10000000,
        contribution: 1500000,
      },
      {
        name: "Ireland",
        pledge: 406349691.8,
        contribution: 362633844.82,
      },
      {
        name: "Italy",
        pledge: 2030558623.96,
        contribution: 1521147534.93,
      },
      {
        name: "Japan",
        pledge: 5387195584,
        contribution: 4622979225,
      },
      {
        name: "Kenya",
        pledge: 23008273,
        contribution: 13008273,
      },
      {
        name: "Korea (Republic)",
        pledge: 170622486.94,
        contribution: 120622486.94,
      },
      {
        name: "Kuwait",
        pledge: 25999965,
        contribution: 17999965,
      },
      {
        name: "Latvia",
        pledge: 10000,
        contribution: 10000,
      },
      {
        name: "Liechtenstein",
        pledge: 1634623.49,
        contribution: 1634623.49,
      },
      {
        name: "Luxembourg",
        pledge: 81395478.42,
        contribution: 72602631.95,
      },
      {
        name: "Malaysia",
        pledge: 132216.49,
        contribution: 132216.49,
      },
      {
        name: "Malta",
        pledge: 479919.74,
        contribution: 380565.55,
      },
      {
        name: "Mexico",
        pledge: 200000,
        contribution: 200000,
      },
      {
        name: "Monaco",
        pledge: 970601.37,
        contribution: 672538.78,
      },
      {
        name: "Namibia",
        pledge: 4750000,
        contribution: 4050000,
      },
      {
        name: "Netherlands",
        pledge: 1667078517.4,
        contribution: 1515473488.79,
      },
      {
        name: "New Zealand",
        pledge: 12063563.09,
        contribution: 11062090.32,
      },
      {
        name: "Niger",
        pledge: 2000000,
        contribution: 1238712.85,
      },
      {
        name: "Nigeria",
        pledge: 94280914,
        contribution: 38791305.11,
      },
      {
        name: "Norway",
        pledge: 1597585463.72,
        contribution: 1445550033.87,
      },
      {
        name: "Poland",
        pledge: 150000,
        contribution: 150000,
      },
      {
        name: "Portugal",
        pledge: 18646007.53,
        contribution: 17856141.65,
      },
      {
        name: "Qatar",
        pledge: 110000000,
        contribution: 70000000,
      },
      {
        name: "Romania",
        pledge: 819457.78,
        contribution: 819457.78,
      },
      {
        name: "Russian Federation",
        pledge: 316999995.61,
        contribution: 316999995.61,
      },
      {
        name: "Rwanda",
        pledge: 6750000,
        contribution: 3500000,
      },
      {
        name: "Saudi Arabia",
        pledge: 162000000,
        contribution: 136000000,
      },
      {
        name: "Senegal",
        pledge: 2000000,
        contribution: 1914594.06,
      },
      {
        name: "Singapore",
        pledge: 1600000,
        contribution: 1200000,
      },
      {
        name: "Slovenia",
        pledge: 253869.34,
        contribution: 253869.34,
      },
      {
        name: "South Africa",
        pledge: 41301559.09,
        contribution: 32601559.09,
      },
      {
        name: "Spain",
        pledge: 1079015182.39,
        contribution: 879228916.98,
      },
      {
        name: "Sweden",
        pledge: 2088394444.35,
        contribution: 1861339250.78,
      },
      {
        name: "Switzerland",
        pledge: 381350853.24,
        contribution: 336703360.76,
      },
      {
        name: "Tanzania (United Republic)",
        pledge: 1000000,
        contribution: 997809.1,
      },
      {
        name: "Thailand",
        pledge: 26499941,
        contribution: 24880356.91,
      },
      {
        name: "Togo",
        pledge: 3500000,
        contribution: 2000000,
      },
      {
        name: "Tunisia",
        pledge: 2000000,
        contribution: 2000000,
      },
      {
        name: "Uganda",
        pledge: 8500000,
        contribution: 4214817.98,
      },
      {
        name: "Ukraine",
        pledge: 80000,
        contribution: 80000,
      },
      {
        name: "Unitaid",
        pledge: 38691956,
        contribution: 38691956,
      },
      {
        name: "United Arab Emirates",
        pledge: 55148072.57,
        contribution: 55148072.57,
      },
      {
        name: "United Kingdom",
        pledge: 8250967810.82,
        contribution: 7674536242.55,
      },
      {
        name: "United States",
        pledge: 31722465791.2,
        contribution: 23985370962.2,
      },
      {
        name: "Zambia",
        pledge: 8525000,
        contribution: 775000,
      },
      {
        name: "Zimbabwe",
        pledge: 4158462,
        contribution: 3108462,
      },
      {
        name: "Armenia",
        pledge: 15000000,
        contribution: 0,
      },
      {
        name: "Cameroon",
        pledge: 5020005,
        contribution: 0,
      },
      {
        name: "Commitments to be personally secured by Bill Gates and Bono with the active support of France for the period 2020-2022",
        pledge: 96724259.64,
        contribution: 0,
      },
      {
        name: "Congo",
        pledge: 5500000,
        contribution: 0,
      },
      {
        name: "Equatorial Guinea",
        pledge: 2205922.9,
        contribution: 0,
      },
      {
        name: "Ghana",
        pledge: 2000000,
        contribution: 0,
      },
      {
        name: "Guinea",
        pledge: 200000,
        contribution: 0,
      },
      {
        name: "Madagascar",
        pledge: 1000000,
        contribution: 0,
      },
      {
        name: "Malawi",
        pledge: 1500000,
        contribution: 0,
      },
      {
        name: "Mali",
        pledge: 551480.73,
        contribution: 0,
      },
      {
        name: "Morocco",
        pledge: 1283940.39,
        contribution: 0,
      },
      {
        name: "Other Public",
        pledge: 45799538.21,
        contribution: 0,
      },
      {
        name: "Paraguay",
        pledge: 50000,
        contribution: 0,
      },
    ],
  },
];

export const TABLE_VARIATION_9_COLUMNS: ColumnDefinition[] = [
  {
    title: "Years",
    field: "name",
    formatter: cellBGColorFormatter,
    width: "70%",
  },
  {
    title: "Total Number",
    field: "value",
    formatter: financialFormatter,
    width: "30%",
  },
];

export const TABLE_VARIATION_9_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    name: "2022",
    _children: [
      {
        name: "Malaria",
        _children: [
          {
            name: "Suspected malaria cases that received a parasitological test",
            value: 321018609,
          },
          {
            name: "Insecticide-treated mosquito nets distributed",
            value: 219678398,
          },
          {
            name: "Cases of malaria treated",
            value: 165297849,
          },
          {
            name: "Children who received seasonal malaria chemoprophylaxis",
            value: 37103714,
          },
          {
            name: "Population covered by Indoor Residual Spraying",
            value: 18516771,
          },
          {
            name: "Pregnant women attending antenatal clinics who received intermittent preventive treatment for malaria",
            value: 14620922,
          },
          {
            name: "Households covered by Indoor Residual Spraying",
            value: 8451212,
          },
          {
            name: "Confirmed malaria cases fully investigated and classified",
            value: 78347,
          },
          {
            name: "Malaria foci fully investigated and classified",
            value: 38227,
          },
        ],
      },
      {
        name: "HIV",
        _children: [
          {
            name: "Total number of HIV tests",
            value: 53074640,
          },
          {
            name: "Pregnant women who know their HIV status",
            value: 43943450,
          },
          {
            name: "People on antiretroviral therapy for HIV",
            value: 24471293,
          },
          {
            name: "Young people aged 10-24 years reached by comprehensive sexuality education and/or life skills-based HIV education in or out of schools",
            value: 4001648,
          },
          {
            name: "Adolescent girls and young women (AGYW) reached with HIV prevention programs services",
            value: 3566170,
          },
          {
            name: "Sex workers reached with HIV prevention programs",
            value: 2731926,
          },
          {
            name: "Pregnant women tested for syphilis",
            value: 2647380,
          },
          {
            name: "Men who have sex with men reached with HIV prevention programs",
            value: 2605902,
          },
          {
            name: "Number of HIV tests taken among men who have sex with men",
            value: 2408640,
          },
          {
            name: "Number of HIV tests taken among other vulnerable population",
            value: 2294467,
          },
          {
            name: "Number of HIV tests taken among sex workers",
            value: 2198995,
          },
          {
            name: "Number of HIV tests taken among adolescents and youth",
            value: 2127567,
          },
          {
            name: "Number of HIV tests taken among prisoners",
            value: 1532177,
          },
          {
            name: "Number of HIV positive tests",
            value: 1294853,
          },
          {
            name: "People who use drugs reached with HIV prevention programs",
            value: 1083995,
          },
          {
            name: "Number of HIV tests taken among people who use drugs",
            value: 1034576,
          },
          {
            name: "Other vulnerable populations reached with HIV prevention programs",
            value: 836845,
          },
          {
            name: "Medical male circumcisions",
            value: 830749,
          },
          {
            name: "HIV-positive pregnant women who received ART during pregnancy",
            value: 710418,
          },
          {
            name: "Care and support services provided to people living with HIV",
            value: 512946,
          },
          {
            name: "Infants tested for HIV",
            value: 473415,
          },
          {
            name: "People newly diagnosed with HIV initiated on ART",
            value: 418533,
          },
          {
            name: "Prisoners reached with HIV prevention programs",
            value: 204054,
          },
          {
            name: "Sex workers who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 198592,
          },
          {
            name: "Transgender people reached with HIV prevention programs",
            value: 159092,
          },
          {
            name: "Number of HIV tests taken among transgender population",
            value: 149303,
          },
          {
            name: "Men who have sex with men who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 61811,
          },
          {
            name: "People receiving Opioid Substitution Therapy",
            value: 60441,
          },
          {
            name: "People aged 10–24 years reached with HIV prevention programs",
            value: 45863,
          },
          {
            name: "Adolescent girls and young women who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 44273,
          },
          {
            name: "People using pre-exposure prophylaxis",
            value: 30167,
          },
          {
            name: "Transgender people who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 3134,
          },
        ],
      },
      {
        name: "Tuberculosis",
        _children: [
          {
            name: "People with TB treated",
            value: 6670422,
          },
          {
            name: "People in contact with TB patients received preventive therapy",
            value: 1542219,
          },
          {
            name: "TB patients with drug-susceptibility testing result for at least Rifampicin",
            value: 961896,
          },
          {
            name: "TB patients tested using WHO recommended rapid tests",
            value: 875351,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases that began second-line treatment",
            value: 118075,
          },
          {
            name: "Care and support services provided to TB patients",
            value: 93538,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases notified",
            value: 70621,
          },
          {
            name: "People with extensively drug-resistant TB on treatment",
            value: 435,
          },
        ],
      },
      {
        name: "TB/HIV",
        _children: [
          {
            name: "People living with HIV in care screened for TB",
            value: 3989358,
          },
          {
            name: "TB patients with documented HIV status",
            value: 2230611,
          },
          {
            name: "People living with HIV on ART who initiated TB preventive therapy",
            value: 2202957,
          },
          {
            name: "HIV-positive TB patients on antiretroviral therapy during TB treatment",
            value: 331349,
          },
        ],
      },
      {
        name: "RSSH",
        _children: [
          {
            name: "Number of iCCM conditions treated among children under five in target areas",
            value: 2239104,
          },
          {
            name: "Number of community based organizations that received a pre-defined package of training",
            value: 109,
          },
        ],
      },
    ],
  },
  {
    name: "2021",
    _children: [
      {
        name: "Malaria",
        _children: [
          {
            name: "Suspected malaria cases that received a parasitological test",
            value: 284147443,
          },
          {
            name: "Cases of malaria treated",
            value: 149071542,
          },
          {
            name: "Insecticide-treated mosquito nets distributed",
            value: 133391767,
          },
          {
            name: "Children who received seasonal malaria chemoprophylaxis",
            value: 34450468,
          },
          {
            name: "Population covered by Indoor Residual Spraying",
            value: 17493091,
          },
          {
            name: "Pregnant women attending antenatal clinics who received intermittent preventive treatment for malaria",
            value: 11343587,
          },
          {
            name: "Households covered by Indoor Residual Spraying",
            value: 9122870,
          },
          {
            name: "Confirmed malaria cases fully investigated and classified",
            value: 55869,
          },
          {
            name: "Malaria foci fully investigated and classified",
            value: 24596,
          },
        ],
      },
      {
        name: "HIV",
        _children: [
          {
            name: "Total number of HIV tests",
            value: 70745675,
          },
          {
            name: "Pregnant women who know their HIV status",
            value: 41307334,
          },
          {
            name: "People on antiretroviral therapy for HIV",
            value: 23079751,
          },
          {
            name: "Number of HIV tests taken among other vulnerable population",
            value: 5248864,
          },
          {
            name: "Adolescent girls and young women (AGYW) reached with HIV prevention programs services",
            value: 3677364,
          },
          {
            name: "Pregnant women tested for syphilis",
            value: 2460258,
          },
          {
            name: "Young people aged 10-24 years reached by comprehensive sexuality education and/or life skills-based HIV education in or out of schools",
            value: 2414726,
          },
          {
            name: "Sex workers reached with HIV prevention programs",
            value: 2182512,
          },
          {
            name: "Men who have sex with men reached with HIV prevention programs",
            value: 2077880,
          },
          {
            name: "Number of HIV tests taken among men who have sex with men",
            value: 1901298,
          },
          {
            name: "Number of HIV tests taken among adolescents and youth",
            value: 1751798,
          },
          {
            name: "Care and support services provided to people living with HIV",
            value: 1721871,
          },
          {
            name: "Number of HIV tests taken among sex workers",
            value: 1664975,
          },
          {
            name: "Number of HIV positive tests",
            value: 1204828,
          },
          {
            name: "Medical male circumcisions",
            value: 1113048,
          },
          {
            name: "People who use drugs reached with HIV prevention programs",
            value: 1078713,
          },
          {
            name: "Number of HIV tests taken among people who use drugs",
            value: 924477,
          },
          {
            name: "Number of HIV tests taken among prisoners",
            value: 675537,
          },
          {
            name: "HIV-positive pregnant women who received ART during pregnancy",
            value: 667105,
          },
          {
            name: "Other vulnerable populations reached with HIV prevention programs",
            value: 591918,
          },
          {
            name: "People newly diagnosed with HIV initiated on ART",
            value: 546787,
          },
          {
            name: "People on ART with suppressed viral load at 12 months (<1000 copies/ml)",
            value: 422191,
          },
          {
            name: "Infants tested for HIV",
            value: 421907,
          },
          {
            name: "Prisoners reached with HIV prevention programs",
            value: 294546,
          },
          {
            name: "Number of HIV tests taken among transgender population",
            value: 120956,
          },
          {
            name: "Transgender people reached with HIV prevention programs",
            value: 118891,
          },
          {
            name: "People receiving Opioid Substitution Therapy",
            value: 65086,
          },
          {
            name: "Men who have sex with men who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 40222,
          },
          {
            name: "Adolescent girls and young women who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 30110,
          },
          {
            name: "People aged 10–24 years reached with HIV prevention programs",
            value: 18466,
          },
          {
            name: "Sex workers who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 15944,
          },
          {
            name: "People using pre-exposure prophylaxis",
            value: 9322,
          },
          {
            name: "Transgender people who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 1739,
          },
        ],
      },
      {
        name: "TB/HIV",
        _children: [
          {
            name: "People living with HIV in care screened for TB",
            value: 5727859,
          },
          {
            name: "People living with HIV on ART who initiated TB preventive therapy",
            value: 2935106,
          },
          {
            name: "TB patients with documented HIV status",
            value: 2408534,
          },
          {
            name: "HIV-positive TB patients on antiretroviral therapy during TB treatment",
            value: 286992,
          },
        ],
      },
      {
        name: "Tuberculosis",
        _children: [
          {
            name: "People with TB treated",
            value: 5288136,
          },
          {
            name: "TB patients with drug-susceptibility testing result for at least Rifampicin",
            value: 1277033,
          },
          {
            name: "TB patients tested using WHO recommended rapid tests",
            value: 505495,
          },
          {
            name: "People in contact with TB patients received preventive therapy",
            value: 399973,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases that began second-line treatment",
            value: 108706,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases notified",
            value: 88145,
          },
          {
            name: "Care and support services provided to TB patients",
            value: 2047,
          },
          {
            name: "People with extensively drug-resistant TB on treatment",
            value: 1634,
          },
        ],
      },
      {
        name: "RSSH",
        _children: [
          {
            name: "Number of iCCM conditions treated among children under five in target areas",
            value: 1688123,
          },
        ],
      },
    ],
  },
  {
    name: "2020",
    _children: [
      {
        name: "Malaria",
        _children: [
          {
            name: "Suspected malaria cases that received a parasitological test",
            value: 261406547,
          },
          {
            name: "Insecticide-treated mosquito nets distributed",
            value: 202005157,
          },
          {
            name: "Cases of malaria treated",
            value: 137134813,
          },
          {
            name: "Children who received seasonal malaria chemoprophylaxis",
            value: 26683289,
          },
          {
            name: "Population covered by Indoor Residual Spraying",
            value: 16926932,
          },
          {
            name: "Pregnant women attending antenatal clinics who received intermittent preventive treatment for malaria",
            value: 11534554,
          },
          {
            name: "Households covered by Indoor Residual Spraying",
            value: 10133803,
          },
          {
            name: "Confirmed malaria cases fully investigated and classified",
            value: 52043,
          },
          {
            name: "Malaria foci fully investigated and classified",
            value: 7683,
          },
        ],
      },
      {
        name: "HIV",
        _children: [
          {
            name: "Total number of HIV tests",
            value: 102545818,
          },
          {
            name: "Pregnant women who know their HIV status",
            value: 43725693,
          },
          {
            name: "People on antiretroviral therapy for HIV",
            value: 21877303,
          },
          {
            name: "People on ART with suppressed viral load at 12 months (<1000 copies/ml)",
            value: 2464038,
          },
          {
            name: "Sex workers reached with HIV prevention programs",
            value: 1923489,
          },
          {
            name: "Adolescent girls and young women (AGYW) reached with HIV prevention programs services",
            value: 1707719,
          },
          {
            name: "Men who have sex with men reached with HIV prevention programs",
            value: 1542769,
          },
          {
            name: "Care and support services provided to people living with HIV",
            value: 1406570,
          },
          {
            name: "Number of HIV tests taken among sex workers",
            value: 1288927,
          },
          {
            name: "Number of HIV tests taken among men who have sex with men",
            value: 1284819,
          },
          {
            name: "Medical male circumcisions",
            value: 1166613,
          },
          {
            name: "Other vulnerable populations reached with HIV prevention programs",
            value: 1008861,
          },
          {
            name: "People who use drugs reached with HIV prevention programs",
            value: 892215,
          },
          {
            name: "Number of HIV tests taken among people who use drugs",
            value: 769221,
          },
          {
            name: "Number of HIV tests taken among other vulnerable population",
            value: 717891,
          },
          {
            name: "Number of HIV tests taken among adolescents and youth",
            value: 705739,
          },
          {
            name: "HIV-positive pregnant women who received ART during pregnancy",
            value: 686292,
          },
          {
            name: "Young people aged 10-24 years reached by comprehensive sexuality education and/or life skills-based HIV education in or out of schools",
            value: 658888,
          },
          {
            name: "Pregnant women tested for syphilis",
            value: 624184,
          },
          {
            name: "Number of HIV tests taken among prisoners",
            value: 572856,
          },
          {
            name: "People aged 10–24 years reached with HIV prevention programs",
            value: 541444,
          },
          {
            name: "Infants tested for HIV",
            value: 418342,
          },
          {
            name: "Transgender people reached with HIV prevention programs",
            value: 101552,
          },
          {
            name: "People receiving Opioid Substitution Therapy",
            value: 92227,
          },
          {
            name: "Number of HIV tests taken among transgender population",
            value: 78399,
          },
          {
            name: "Prisoners reached with HIV prevention programs",
            value: 50729,
          },
          {
            name: "People using pre-exposure prophylaxis",
            value: 18907,
          },
          {
            name: "Men who have sex with men who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 12209,
          },
          {
            name: "Sex workers who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 11358,
          },
          {
            name: "Adolescent girls and young women who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 8938,
          },
          {
            name: "People newly diagnosed with HIV initiated on ART",
            value: 121,
          },
        ],
      },
      {
        name: "TB/HIV",
        _children: [
          {
            name: "People living with HIV in care screened for TB",
            value: 18047013,
          },
          {
            name: "People living with HIV on ART who initiated TB preventive therapy",
            value: 4404205,
          },
          {
            name: "TB patients with documented HIV status",
            value: 3004544,
          },
          {
            name: "HIV-positive TB patients on antiretroviral therapy during TB treatment",
            value: 272543,
          },
        ],
      },
      {
        name: "Tuberculosis",
        _children: [
          {
            name: "People with TB treated",
            value: 4692587,
          },
          {
            name: "TB patients with drug-susceptibility testing result for at least Rifampicin",
            value: 1738576,
          },
          {
            name: "TB patients tested using WHO recommended rapid tests",
            value: 239464,
          },
          {
            name: "People in contact with TB patients received preventive therapy",
            value: 194166,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases notified",
            value: 110586,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases that began second-line treatment",
            value: 100406,
          },
          {
            name: "Care and support services provided to TB patients",
            value: 38802,
          },
          {
            name: "People with extensively drug-resistant TB on treatment",
            value: 3821,
          },
        ],
      },
    ],
  },
  {
    name: "2019",
    _children: [
      {
        name: "Malaria",
        _children: [
          {
            name: "Suspected malaria cases that received a parasitological test",
            value: 258888396,
          },
          {
            name: "Insecticide-treated mosquito nets distributed",
            value: 161677120,
          },
          {
            name: "Cases of malaria treated",
            value: 138070353,
          },
          {
            name: "Population covered by Indoor Residual Spraying",
            value: 15251640,
          },
          {
            name: "Children who received seasonal malaria chemoprophylaxis",
            value: 14693040,
          },
          {
            name: "Pregnant women attending antenatal clinics who received intermittent preventive treatment for malaria",
            value: 11432952,
          },
          {
            name: "Households covered by Indoor Residual Spraying",
            value: 9137467,
          },
          {
            name: "Confirmed malaria cases fully investigated and classified",
            value: 33765,
          },
          {
            name: "Malaria foci fully investigated and classified",
            value: 5972,
          },
        ],
      },
      {
        name: "HIV",
        _children: [
          {
            name: "Total number of HIV tests",
            value: 127035654,
          },
          {
            name: "Pregnant women who know their HIV status",
            value: 45249969,
          },
          {
            name: "People on antiretroviral therapy for HIV",
            value: 20085609,
          },
          {
            name: "People on ART with suppressed viral load at 12 months (<1000 copies/ml)",
            value: 2430120,
          },
          {
            name: "Sex workers reached with HIV prevention programs",
            value: 1921920,
          },
          {
            name: "Men who have sex with men reached with HIV prevention programs",
            value: 1770721,
          },
          {
            name: "Care and support services provided to people living with HIV",
            value: 1764761,
          },
          {
            name: "Adolescent girls and young women (AGYW) reached with HIV prevention programs services",
            value: 1512424,
          },
          {
            name: "Number of HIV tests taken among men who have sex with men",
            value: 1434511,
          },
          {
            name: "Young people aged 10-24 years reached by comprehensive sexuality education and/or life skills-based HIV education in or out of schools",
            value: 1425760,
          },
          {
            name: "Other vulnerable populations reached with HIV prevention programs",
            value: 1371473,
          },
          {
            name: "Medical male circumcisions",
            value: 1277911,
          },
          {
            name: "Number of HIV tests taken among sex workers",
            value: 1277099,
          },
          {
            name: "Number of HIV tests taken among other vulnerable population",
            value: 923244,
          },
          {
            name: "People who use drugs reached with HIV prevention programs",
            value: 852952,
          },
          {
            name: "Number of HIV tests taken among people who use drugs",
            value: 774400,
          },
          {
            name: "Number of HIV tests taken among prisoners",
            value: 742287,
          },
          {
            name: "HIV-positive pregnant women who received ART during pregnancy",
            value: 718501,
          },
          {
            name: "Number of HIV tests taken among adolescents and youth",
            value: 715755,
          },
          {
            name: "Pregnant women tested for syphilis",
            value: 600614,
          },
          {
            name: "Infants tested for HIV",
            value: 435512,
          },
          {
            name: "People aged 10–24 years reached with HIV prevention programs",
            value: 388083,
          },
          {
            name: "Transgender people reached with HIV prevention programs",
            value: 136810,
          },
          {
            name: "Number of HIV tests taken among transgender population",
            value: 106464,
          },
          {
            name: "People receiving Opioid Substitution Therapy",
            value: 82919,
          },
          {
            name: "Prisoners reached with HIV prevention programs",
            value: 33597,
          },
          {
            name: "Men who have sex with men who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 12518,
          },
          {
            name: "People using pre-exposure prophylaxis",
            value: 7645,
          },
          {
            name: "Sex workers who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 6092,
          },
          {
            name: "People newly diagnosed with HIV initiated on ART",
            value: 231,
          },
        ],
      },
      {
        name: "TB/HIV",
        _children: [
          {
            name: "People living with HIV in care screened for TB",
            value: 14289931,
          },
          {
            name: "People living with HIV on ART who initiated TB preventive therapy",
            value: 3619367,
          },
          {
            name: "TB patients with documented HIV status",
            value: 3412792,
          },
          {
            name: "HIV-positive TB patients on antiretroviral therapy during TB treatment",
            value: 321354,
          },
        ],
      },
      {
        name: "Tuberculosis",
        _children: [
          {
            name: "People with TB treated",
            value: 5771298,
          },
          {
            name: "TB patients with drug-susceptibility testing result for at least Rifampicin",
            value: 1706570,
          },
          {
            name: "TB patients tested using WHO recommended rapid tests",
            value: 244005,
          },
          {
            name: "People in contact with TB patients received preventive therapy",
            value: 170621,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases notified",
            value: 131542,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases that began second-line treatment",
            value: 125033,
          },
          {
            name: "Care and support services provided to TB patients",
            value: 29889,
          },
          {
            name: "People with extensively drug-resistant TB on treatment",
            value: 6071,
          },
        ],
      },
    ],
  },
  {
    name: "2018",
    _children: [
      {
        name: "Malaria",
        _children: [
          {
            name: "Suspected malaria cases that received a parasitological test",
            value: 226498673,
          },
          {
            name: "Insecticide-treated mosquito nets distributed",
            value: 152867767,
          },
          {
            name: "Cases of malaria treated",
            value: 114435433,
          },
          {
            name: "Population covered by Indoor Residual Spraying",
            value: 12451968,
          },
          {
            name: "Children who received seasonal malaria chemoprophylaxis",
            value: 10672227,
          },
          {
            name: "Pregnant women attending antenatal clinics who received intermittent preventive treatment for malaria",
            value: 9535620,
          },
          {
            name: "Households covered by Indoor Residual Spraying",
            value: 7695951,
          },
          {
            name: "People covered by LLINs distributed",
            value: 4252756,
          },
          {
            name: "Confirmed malaria cases fully investigated and classified",
            value: 78003,
          },
          {
            name: "Malaria foci fully investigated and classified",
            value: 7380,
          },
        ],
      },
      {
        name: "HIV",
        _children: [
          {
            name: "Total number of HIV tests",
            value: 125429887,
          },
          {
            name: "Pregnant women who know their HIV status",
            value: 34997474,
          },
          {
            name: "People on antiretroviral therapy for HIV",
            value: 18718588,
          },
          {
            name: "Other vulnerable populations reached with HIV prevention programs",
            value: 1802944,
          },
          {
            name: "Care and support services provided to people living with HIV",
            value: 1652756,
          },
          {
            name: "Sex workers reached with HIV prevention programs",
            value: 1630218,
          },
          {
            name: "Men who have sex with men reached with HIV prevention programs",
            value: 1564646,
          },
          {
            name: "Medical male circumcisions",
            value: 1487169,
          },
          {
            name: "People on ART with suppressed viral load at 12 months (<1000 copies/ml)",
            value: 1454486,
          },
          {
            name: "Number of HIV tests taken among men who have sex with men",
            value: 1197140,
          },
          {
            name: "Number of HIV tests taken among sex workers",
            value: 1018821,
          },
          {
            name: "Young people aged 10-24 years reached by comprehensive sexuality education and/or life skills-based HIV education in or out of schools",
            value: 991049,
          },
          {
            name: "Number of HIV tests taken among other vulnerable population",
            value: 876567,
          },
          {
            name: "Number of HIV tests taken among people who use drugs",
            value: 772029,
          },
          {
            name: "People who use drugs reached with HIV prevention programs",
            value: 751632,
          },
          {
            name: "HIV-positive pregnant women who received ART during pregnancy",
            value: 713587,
          },
          {
            name: "Pregnant women tested for syphilis",
            value: 636853,
          },
          {
            name: "Number of HIV tests taken among adolescents and youth",
            value: 490672,
          },
          {
            name: "Number of HIV tests taken among prisoners",
            value: 454625,
          },
          {
            name: "Infants tested for HIV",
            value: 431574,
          },
          {
            name: "Adolescent girls and young women (AGYW) reached with HIV prevention programs services",
            value: 366532,
          },
          {
            name: "People aged 10–24 years reached with HIV prevention programs",
            value: 321279,
          },
          {
            name: "Transgender people reached with HIV prevention programs",
            value: 123876,
          },
          {
            name: "Targeted population reached reached with standardized HIV prevention interventions",
            value: 92350,
          },
          {
            name: "Number of HIV tests taken among transgender population",
            value: 87868,
          },
          {
            name: "Prisoners reached with HIV prevention programs",
            value: 43556,
          },
          {
            name: "People receiving Opioid Substitution Therapy",
            value: 31700,
          },
          {
            name: "Men who have sex with men who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 3693,
          },
          {
            name: "Sex workers who initiated oral antiretroviral pre-exposure prophylaxis",
            value: 2887,
          },
          {
            name: "People newly diagnosed with HIV initiated on ART",
            value: 261,
          },
        ],
      },
      {
        name: "TB/HIV",
        _children: [
          {
            name: "People living with HIV in care screened for TB",
            value: 14219389,
          },
          {
            name: "People living with HIV on ART who initiated TB preventive therapy",
            value: 2262970,
          },
          {
            name: "TB patients with documented HIV status",
            value: 2242036,
          },
          {
            name: "HIV-positive TB patients on antiretroviral therapy during TB treatment",
            value: 342148,
          },
          {
            name: "HIV-positive TB patients on co-trimoxazole prophylaxis during treatment",
            value: 1435,
          },
        ],
      },
      {
        name: "Tuberculosis",
        _children: [
          {
            name: "People with TB treated",
            value: 5240744,
          },
          {
            name: "TB patients with drug-susceptibility testing result for at least Rifampicin",
            value: 816166,
          },
          {
            name: "TB patients tested using WHO recommended rapid tests",
            value: 220584,
          },
          {
            name: "People in contact with TB patients received preventive therapy",
            value: 138694,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases that began second-line treatment",
            value: 111737,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases notified",
            value: 110003,
          },
          {
            name: "Care and support services provided to TB patients",
            value: 16854,
          },
          {
            name: "People with extensively drug-resistant TB on treatment",
            value: 7446,
          },
        ],
      },
    ],
  },
  {
    name: "2017",
    _children: [
      {
        name: "Malaria",
        _children: [
          {
            name: "Suspected malaria cases that received a parasitological test",
            value: 215730104,
          },
          {
            name: "People covered by LLINs distributed",
            value: 209779093,
          },
          {
            name: "Insecticide-treated mosquito nets distributed",
            value: 179114637,
          },
          {
            name: "Cases of malaria treated",
            value: 114556835,
          },
          {
            name: "Households covered by Indoor Residual Spraying",
            value: 9888178,
          },
          {
            name: "Children who received seasonal malaria chemoprophylaxis",
            value: 5647038,
          },
          {
            name: "Pregnant women attending antenatal clinics who received intermittent preventive treatment for malaria",
            value: 5110485,
          },
          {
            name: "Population covered by Indoor Residual Spraying",
            value: 4892853,
          },
          {
            name: "Confirmed malaria cases fully investigated and classified",
            value: 70222,
          },
          {
            name: "Malaria foci fully investigated and classified",
            value: 700,
          },
        ],
      },
      {
        name: "HIV",
        _children: [
          {
            name: "Total number of HIV tests",
            value: 93629023,
          },
          {
            name: "Pregnant women who know their HIV status",
            value: 29360695,
          },
          {
            name: "People on antiretroviral therapy for HIV",
            value: 17543868,
          },
          {
            name: "Care and support services provided to people living with HIV",
            value: 2887555,
          },
          {
            name: "Other vulnerable populations reached with HIV prevention programs",
            value: 2226719,
          },
          {
            name: "Sex workers reached with HIV prevention programs",
            value: 2036026,
          },
          {
            name: "Men who have sex with men reached with HIV prevention programs",
            value: 1854489,
          },
          {
            name: "Number of HIV tests taken among other vulnerable population",
            value: 1611442,
          },
          {
            name: "People aged 10–24 years reached with HIV prevention programs",
            value: 1424078,
          },
          {
            name: "Number of HIV tests taken among sex workers",
            value: 1213334,
          },
          {
            name: "Young people aged 10-24 years reached by comprehensive sexuality education and/or life skills-based HIV education in or out of schools",
            value: 1136085,
          },
          {
            name: "Number of HIV tests taken among men who have sex with men",
            value: 1056351,
          },
          {
            name: "Medical male circumcisions",
            value: 988904,
          },
          {
            name: "People on ART with suppressed viral load at 12 months (<1000 copies/ml)",
            value: 882048,
          },
          {
            name: "People who use drugs reached with HIV prevention programs",
            value: 799182,
          },
          {
            name: "HIV-positive pregnant women who received ART during pregnancy",
            value: 710495,
          },
          {
            name: "Pregnant women tested for syphilis",
            value: 606113,
          },
          {
            name: "Targeted population reached reached with standardized HIV prevention interventions",
            value: 501627,
          },
          {
            name: "Number of HIV tests taken among people who use drugs",
            value: 501527,
          },
          {
            name: "Number of HIV tests taken among adolescents and youth",
            value: 466591,
          },
          {
            name: "Infants tested for HIV",
            value: 427105,
          },
          {
            name: "Prisoners reached with HIV prevention programs",
            value: 190312,
          },
          {
            name: "Transgender people reached with HIV prevention programs",
            value: 117277,
          },
          {
            name: "People receiving Opioid Substitution Therapy",
            value: 88391,
          },
          {
            name: "Number of HIV tests taken among transgender population",
            value: 74653,
          },
          {
            name: "Number of HIV tests taken among prisoners",
            value: 64600,
          },
          {
            name: "Adolescent girls and young women (AGYW) reached with HIV prevention programs services",
            value: 28354,
          },
          {
            name: "People newly diagnosed with HIV initiated on ART",
            value: 23,
          },
        ],
      },
      {
        name: "TB/HIV",
        _children: [
          {
            name: "People living with HIV in care screened for TB",
            value: 14013627,
          },
          {
            name: "TB patients with documented HIV status",
            value: 2203724,
          },
          {
            name: "People living with HIV on ART who initiated TB preventive therapy",
            value: 1021833,
          },
          {
            name: "HIV-positive TB patients on antiretroviral therapy during TB treatment",
            value: 350728,
          },
          {
            name: "HIV-positive TB patients on co-trimoxazole prophylaxis during treatment",
            value: 2176,
          },
        ],
      },
      {
        name: "Tuberculosis",
        _children: [
          {
            name: "People with TB treated",
            value: 5040008,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases that began second-line treatment",
            value: 103557,
          },
          {
            name: "People in contact with TB patients received preventive therapy",
            value: 98222,
          },
          {
            name: "Rifampicin- and/or multidrug-resistant TB cases notified",
            value: 87296,
          },
          {
            name: "TB patients with drug-susceptibility testing result for at least Rifampicin",
            value: 58522,
          },
          {
            name: "TB patients tested using WHO recommended rapid tests",
            value: 21391,
          },
          {
            name: "Care and support services provided to TB patients",
            value: 16945,
          },
          {
            name: "People with extensively drug-resistant TB on treatment",
            value: 3312,
          },
        ],
      },
    ],
  },
];

export const TABLE_VARIATION_10_COLUMNS: ColumnDefinition[] = [
  {
    title: "Geography",
    field: "name",
    formatter: cellBGColorFormatter,
    minWidth: 250,
    frozen: true,
  },
  {
    title: "2023",
    field: "2023",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2022",
    field: "2022",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2021",
    field: "2021",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2020",
    field: "2020",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2019",
    field: "2019",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2018",
    field: "2018",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2017",
    field: "2017",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2016",
    field: "2016",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2015",
    field: "2015",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2014",
    field: "2014",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2013",
    field: "2013",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2012",
    field: "2012",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2011",
    field: "2011",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2010",
    field: "2010",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2009",
    field: "2009",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2008",
    field: "2008",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2007",
    field: "2007",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2006",
    field: "2006",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2005",
    field: "2005",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2004",
    field: "2004",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
  {
    title: "2003",
    field: "2003",
    formatter: cellBGColorFormatter,
    maxWidth: 70,
  },
];

export const TABLE_VARIATION_10_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    name: "Algeria",
    _children: [
      {
        name: "Income Level",
        2023: "Low Income",
        2022: "Low Income",
        2021: "Low Income",
        2020: "Low Income",
        2019: "Low Income",
        2018: "Low Income",
        2017: "Low Income",
        2016: "Low Income",
        2015: "Low Income",
        2014: "Low Income",
        2013: "Low Income",
        2012: "Low Income",
        2011: "Low Income",
        2010: "Low Income",
      },
      {
        name: "HIV",
        _children: [
          {
            name: "Disease Burden",
            2023: "Low",
            2022: "Low",
            2021: "Low",
            2020: "Low",
            2019: "Low",
            2018: "Low",
            2017: "Low",
            2016: "Low",
            2015: "Low",
            2014: "Low",
            2013: "Low",
            2012: "Low",
            2011: "Low",
            2010: "Low",
          },
          {
            name: "Eligibility",
            2023: "Eligible",
            2022: "Eligible",
            2021: "Eligible",
            2020: "Eligible",
            2019: "Eligible",
            2018: "Eligible",
            2017: "Eligible",
            2016: "Eligible",
            2015: "Eligible",
            2014: "Eligible",
            2013: "Eligible",
            2012: "Eligible",
            2011: "Eligible",
            2010: "Eligible",
          },
        ],
      },
      {
        name: "Malaria",
        _children: [
          {
            name: "Disease Burden",
            2023: "Low",
            2022: "Low",
            2021: "Low",
            2020: "Low",
            2019: "Low",
            2018: "Low",
            2017: "Low",
            2016: "Low",
            2015: "Low",
            2014: "Low",
            2013: "Low",
            2012: "Low",
            2011: "Low",
            2010: "Low",
          },
          {
            name: "Eligibility",
            2023: "Eligible",
            2022: "Eligible",
            2021: "Eligible",
            2020: "Eligible",
            2019: "Eligible",
            2018: "Eligible",
            2017: "Eligible",
            2016: "Eligible",
            2015: "Eligible",
            2014: "Eligible",
            2013: "Eligible",
            2012: "Eligible",
            2011: "Eligible",
            2010: "Eligible",
          },
        ],
      },
      {
        name: "Tuberculosis",
        _children: [
          {
            name: "Disease Burden",
            2023: "Low",
            2022: "Low",
            2021: "Low",
            2020: "Low",
            2019: "Low",
            2018: "Low",
            2017: "Low",
            2016: "Low",
            2015: "Low",
            2014: "Low",
            2013: "Low",
            2012: "Low",
            2011: "Low",
            2010: "Low",
          },
          {
            name: "Eligibility",
            2023: "Eligible",
            2022: "Eligible",
            2021: "Eligible",
            2020: "Eligible",
            2019: "Eligible",
            2018: "Eligible",
            2017: "Eligible",
            2016: "Eligible",
            2015: "Eligible",
            2014: "Eligible",
            2013: "Eligible",
            2012: "Eligible",
            2011: "Eligible",
            2010: "Eligible",
          },
        ],
      },
    ],
  },
  {
    name: "Afghanistan",
    _children: [
      {
        name: "Income Level",
        2023: "Low Income",
        2022: "Low Income",
        2021: "Low Income",
        2020: "Low Income",
        2019: "Low Income",
        2018: "Low Income",
        2017: "Low Income",
        2016: "Low Income",
        2015: "Low Income",
        2014: "Low Income",
        2013: "Low Income",
        2012: "Low Income",
        2011: "Low Income",
        2010: "Low Income",
      },
      {
        name: "HIV",
        _children: [
          {
            name: "Disease Burden",
            2023: "Low",
            2022: "Low",
            2021: "Low",
            2020: "Low",
            2019: "Low",
            2018: "Low",
            2017: "Low",
            2016: "Low",
            2015: "Low",
            2014: "Low",
            2013: "Low",
            2012: "Low",
            2011: "Low",
            2010: "Low",
          },
          {
            name: "Eligibility",
            2023: "Eligible",
            2022: "Eligible",
            2021: "Eligible",
            2020: "Eligible",
            2019: "Eligible",
            2018: "Eligible",
            2017: "Eligible",
            2016: "Eligible",
            2015: "Eligible",
            2014: "Eligible",
            2013: "Eligible",
            2012: "Eligible",
            2011: "Eligible",
            2010: "Eligible",
          },
        ],
      },
      {
        name: "Malaria",
        _children: [
          {
            name: "Disease Burden",
            2023: "Low",
            2022: "Low",
            2021: "Low",
            2020: "Low",
            2019: "Low",
            2018: "Low",
            2017: "Low",
            2016: "Low",
            2015: "Low",
            2014: "Low",
            2013: "Low",
            2012: "Low",
            2011: "Low",
            2010: "Low",
          },
          {
            name: "Eligibility",
            2023: "Eligible",
            2022: "Eligible",
            2021: "Eligible",
            2020: "Eligible",
            2019: "Eligible",
            2018: "Eligible",
            2017: "Eligible",
            2016: "Eligible",
            2015: "Eligible",
            2014: "Eligible",
            2013: "Eligible",
            2012: "Eligible",
            2011: "Eligible",
            2010: "Eligible",
          },
        ],
      },
      {
        name: "Tuberculosis",
        _children: [
          {
            name: "Disease Burden",
            2023: "Low",
            2022: "Low",
            2021: "Low",
            2020: "Low",
            2019: "Low",
            2018: "Low",
            2017: "Low",
            2016: "Low",
            2015: "Low",
            2014: "Low",
            2013: "Low",
            2012: "Low",
            2011: "Low",
            2010: "Low",
          },
          {
            name: "Eligibility",
            2023: "Eligible",
            2022: "Eligible",
            2021: "Eligible",
            2020: "Eligible",
            2019: "Eligible",
            2018: "Eligible",
            2017: "Eligible",
            2016: "Eligible",
            2015: "Eligible",
            2014: "Eligible",
            2013: "Eligible",
            2012: "Eligible",
            2011: "Eligible",
            2010: "Eligible",
          },
        ],
      },
    ],
  },
];

export const TABLE_VARIATION_11_COLUMNS: ColumnDefinition[] = [
  {
    title: "Geography",
    field: "name",
    formatter: cellBGColorFormatter,
    width: "25%",
  },
  {
    title: "2017 - 2019 (US$)",
    field: "2017-2019",
    formatter: financialFormatter,
    width: "20%",
  },
  {
    title: "2020 - 2022 (US$)",
    field: "2020-2022",
    formatter: financialFormatter,
    width: "20%",
  },
  {
    title: "2023 - 2025 (US$)",
    field: "2023-2025",
    formatter: financialFormatter,
    width: "20%",
  },
];

export const TABLE_VARIATION_11_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    name: "Afghanistan",
    _children: [
      {
        name: "HIV",
        "2017-2019": 9109250,
        "2020-2022": 10474755,
        "2023-2025": 7700026,
      },
      {
        name: "Malaria",
        "2017-2019": 27112391,
        "2020-2022": 24306935,
        "2023-2025": 21624624,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 14964754,
        "2020-2022": 23741050,
        "2023-2025": 36213004,
      },
    ],
    "2017-2019": 51186395,
    "2020-2022": 58522740,
    "2023-2025": 65537654,
  },
  {
    name: "Albania",
    _children: [
      {
        name: "HIV",
        "2017-2019": 1138134,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 500000,
      },
    ],
    "2017-2019": 1638134,
  },
  {
    name: "Algeria",
    _children: [
      {
        name: "HIV",
        "2017-2019": 2312936,
      },
    ],
    "2017-2019": 2312936,
  },
  {
    name: "Angola",
    _children: [
      {
        name: "HIV",
        "2017-2019": 25110399,
        "2020-2022": 38734092,
        "2023-2025": 57007044,
      },
      {
        name: "Malaria",
        "2017-2019": 26898141,
        "2020-2022": 31047306,
        "2023-2025": 47999848,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 6080400,
        "2020-2022": 12818951,
        "2023-2025": 20957852,
      },
    ],
    "2017-2019": 58088940,
    "2020-2022": 82600349,
    "2023-2025": 125964744,
  },
  {
    name: "Armenia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 5282781,
        "2020-2022": 6112987,
        "2023-2025": 6550471,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 3138925,
        "2020-2022": 3554194,
        "2023-2025": 3081582,
      },
    ],
    "2017-2019": 8421706,
    "2020-2022": 9667181,
    "2023-2025": 9632053,
  },
  {
    name: "Azerbaijan",
    _children: [
      {
        name: "HIV",
        "2017-2019": 6068394,
        "2020-2022": 9264124,
        "2023-2025": 12736573,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 6529446,
        "2020-2022": 7997084,
        "2023-2025": 7083662,
      },
    ],
    "2017-2019": 12597840,
    "2020-2022": 17261208,
    "2023-2025": 19820235,
  },
  {
    name: "Bangladesh",
    _children: [
      {
        name: "HIV",
        "2017-2019": 18295447,
        "2020-2022": 23000765,
        "2023-2025": 25393719,
      },
      {
        name: "Malaria",
        "2017-2019": 30000000,
        "2020-2022": 20100000,
        "2023-2025": 20091193,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 97935663,
        "2020-2022": 115770502,
        "2023-2025": 120811080,
      },
    ],
    "2017-2019": 146231110,
    "2020-2022": 158871267,
    "2023-2025": 166295992,
  },
  {
    name: "Belarus",
    _children: [
      {
        name: "HIV",
        "2017-2019": 7862511,
        "2020-2022": 12221135,
        "2023-2025": 15873645,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 7977941,
        "2020-2022": 8618456,
        "2023-2025": 6527509,
      },
    ],
    "2017-2019": 15840452,
    "2020-2022": 20839591,
    "2023-2025": 22401154,
  },
  {
    name: "Belize",
    _children: [
      {
        name: "HIV",
        "2017-2019": 1378449,
        "2020-2022": 2999251,
        "2023-2025": 3019115,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 537829,
      },
    ],
    "2017-2019": 1916278,
    "2020-2022": 2999251,
    "2023-2025": 3019115,
  },
  {
    name: "Benin",
    _children: [
      {
        name: "HIV",
        "2017-2019": 29962378,
        "2020-2022": 39964530.97,
        "2023-2025": 38839506.11,
      },
      {
        name: "Malaria",
        "2017-2019": 36949701,
        "2020-2022": 55880305.52,
        "2023-2025": 56495280.98,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 8300000,
        "2020-2022": 8304999.72,
        "2023-2025": 7379606.73,
      },
    ],
    "2017-2019": 75212079,
    "2020-2022": 104149836.21000001,
    "2023-2025": 102714393.82000001,
  },
  {
    name: "Bhutan",
    _children: [
      {
        name: "HIV",
        "2017-2019": 1081903,
        "2020-2022": 1054855,
        "2023-2025": 1054796,
      },
      {
        name: "Malaria",
        "2017-2019": 1432470,
        "2020-2022": 1374353,
        "2023-2025": 1373076,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 1074146,
        "2020-2022": 1105609,
        "2023-2025": 1101949,
      },
    ],
    "2017-2019": 3588519,
    "2020-2022": 3534817,
    "2023-2025": 3529821,
  },
  {
    name: "Bolivia (Plurinational State)",
    _children: [
      {
        name: "HIV",
        "2017-2019": 9175449,
        "2020-2022": 10168010,
        "2023-2025": 11225870,
      },
      {
        name: "Malaria",
        "2017-2019": 3807860,
        "2020-2022": 5555895,
        "2023-2025": 4137260,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 5648949,
        "2020-2022": 5436712,
        "2023-2025": 4385978,
      },
    ],
    "2017-2019": 18632258,
    "2020-2022": 21160617,
    "2023-2025": 19749108,
  },
  {
    name: "Botswana",
    _children: [
      {
        name: "HIV",
        "2017-2019": 13950867,
        "2020-2022": 19077252,
        "2023-2025": 22878037,
      },
      {
        name: "Malaria",
        "2017-2019": 1287500,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 1916471,
        "2020-2022": 1437353,
        "2023-2025": 1145473,
      },
    ],
    "2017-2019": 17154838,
    "2020-2022": 20514605,
    "2023-2025": 24023510,
  },
  {
    name: "Burkina Faso",
    _children: [
      {
        name: "HIV",
        "2017-2019": 36760555,
        "2020-2022": 53239523.52,
        "2023-2025": 45753995.09,
      },
      {
        name: "Malaria",
        "2017-2019": 100133418,
        "2020-2022": 155188286.6,
        "2023-2025": 184847665.5,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 7000000,
        "2020-2022": 13810708.65,
        "2023-2025": 11892815.97,
      },
    ],
    "2017-2019": 143893973,
    "2020-2022": 222238518.77,
    "2023-2025": 242494476.56,
  },
  {
    name: "Burundi",
    _children: [
      {
        name: "HIV",
        "2017-2019": 29916039,
        "2020-2022": 38883452,
        "2023-2025": 38898974,
      },
      {
        name: "Malaria",
        "2017-2019": 36656018,
        "2020-2022": 70849593,
        "2023-2025": 76098949,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 5728765,
        "2020-2022": 9211130,
        "2023-2025": 9235526,
      },
    ],
    "2017-2019": 72300822,
    "2020-2022": 118944175,
    "2023-2025": 124233449,
  },
  {
    name: "Cabo Verde",
    _children: [
      {
        name: "HIV",
        "2017-2019": 2544394,
        "2020-2022": 2994952.85,
        "2023-2025": 2994587.25,
      },
      {
        name: "Malaria",
        "2017-2019": 1000000,
        "2020-2022": 1227736.17,
        "2023-2025": 1213937.43,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 500000,
        "2020-2022": 500000,
        "2023-2025": 500000.01,
      },
    ],
    "2017-2019": 4044394,
    "2020-2022": 4722689.02,
    "2023-2025": 4708524.6899999995,
  },
  {
    name: "Cambodia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 41597533,
        "2020-2022": 41595706,
        "2023-2025": 41549020,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 13812665,
        "2020-2022": 13948350,
        "2023-2025": 14845335,
      },
      {
        name: "Malaria",
        "2020-2022": 4000000,
      },
    ],
    "2017-2019": 55410198,
    "2020-2022": 59544056,
    "2023-2025": 56394355,
  },
  {
    name: "Cameroon",
    _children: [
      {
        name: "HIV",
        "2017-2019": 99897386,
        "2020-2022": 149772367.5,
        "2023-2025": 161358210.4,
      },
      {
        name: "Malaria",
        "2017-2019": 73453444,
        "2020-2022": 111670203.5,
        "2023-2025": 109654277.7,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 11205425,
        "2020-2022": 14293267.52,
        "2023-2025": 17023814.6,
      },
    ],
    "2017-2019": 184556255,
    "2020-2022": 275735838.52,
    "2023-2025": 288036302.70000005,
  },
  {
    name: "Central African Republic",
    _children: [
      {
        name: "HIV",
        "2017-2019": 25946486,
        "2020-2022": 67076163.9,
        "2023-2025": 62096913.5,
      },
      {
        name: "Malaria",
        "2017-2019": 30409209,
        "2020-2022": 59295433.74,
        "2023-2025": 66649142.12,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 6307078,
        "2020-2022": 7976934.87,
        "2023-2025": 11471064.35,
      },
    ],
    "2017-2019": 62662773,
    "2020-2022": 134348532.51,
    "2023-2025": 140217119.97,
  },
  {
    name: "Chad",
    _children: [
      {
        name: "HIV",
        "2017-2019": 35365870,
        "2020-2022": 52435328.96,
        "2023-2025": 55460580.51,
      },
      {
        name: "Malaria",
        "2017-2019": 42205388,
        "2020-2022": 67614008.71,
        "2023-2025": 73459639.05,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 5704156,
        "2020-2022": 9421077.59,
        "2023-2025": 10000456.27,
      },
    ],
    "2017-2019": 83275414,
    "2020-2022": 129470415.25999999,
    "2023-2025": 138920675.83,
  },
  {
    name: "Colombia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 10014581,
        "2020-2022": 19457001,
        "2023-2025": 22725404,
      },
    ],
    "2017-2019": 10014581,
    "2020-2022": 19457001,
    "2023-2025": 22725404,
  },
  {
    name: "Comoros",
    _children: [
      {
        name: "HIV",
        "2017-2019": 1335201,
        "2020-2022": 1051469.7,
        "2023-2025": 981611.55,
      },
      {
        name: "Malaria",
        "2017-2019": 4588919,
        "2020-2022": 5332344.34,
        "2023-2025": 4953221.18,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 864857,
        "2020-2022": 648642.81,
        "2023-2025": 500000.01,
      },
    ],
    "2017-2019": 6788977,
    "2020-2022": 7032456.85,
    "2023-2025": 6434832.739999999,
  },
  {
    name: "Congo",
    _children: [
      {
        name: "HIV",
        "2017-2019": 12950236,
        "2020-2022": 19362717.7,
        "2023-2025": 29633112.46,
      },
      {
        name: "Malaria",
        "2017-2019": 14208223,
        "2020-2022": 34485172.89,
        "2023-2025": 32941526.84,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 4165629,
        "2020-2022": 6284440.52,
        "2023-2025": 8642474.12,
      },
    ],
    "2017-2019": 31324088,
    "2020-2022": 60132331.11,
    "2023-2025": 71217113.42,
  },
  {
    name: "Congo (Democratic Republic)",
    _children: [
      {
        name: "HIV",
        "2017-2019": 122678456,
        "2020-2022": 174093362,
        "2023-2025": 189997416,
      },
      {
        name: "Malaria",
        "2017-2019": 347651023,
        "2020-2022": 393891463,
        "2023-2025": 409812233,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 56656946,
        "2020-2022": 76950962,
        "2023-2025": 100844218,
      },
    ],
    "2017-2019": 526986425,
    "2020-2022": 644935787,
    "2023-2025": 700653867,
  },
  {
    name: "Costa Rica",
    _children: [
      {
        name: "HIV",
        "2017-2019": 2120098,
        "2020-2022": 2200662,
        "2023-2025": 2043734,
      },
    ],
    "2017-2019": 2120098,
    "2020-2022": 2200662,
    "2023-2025": 2043734,
  },
  {
    name: "Côte d'Ivoire",
    _children: [
      {
        name: "HIV",
        "2017-2019": 74113356,
        "2020-2022": 90998409.53,
        "2023-2025": 81898856.33,
      },
      {
        name: "Malaria",
        "2017-2019": 124696572,
        "2020-2022": 145592529.6,
        "2023-2025": 130372340.8,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 13921205,
        "2020-2022": 18726409.31,
        "2023-2025": 16827783.79,
      },
    ],
    "2017-2019": 212731133,
    "2020-2022": 255317348.44,
    "2023-2025": 229098980.92,
  },
  {
    name: "Cuba",
    _children: [
      {
        name: "HIV",
        "2017-2019": 13253226,
        "2020-2022": 17394860,
        "2023-2025": 19709425,
      },
    ],
    "2017-2019": 13253226,
    "2020-2022": 17394860,
    "2023-2025": 19709425,
  },
  {
    name: "Djibouti",
    _children: [
      {
        name: "HIV",
        "2017-2019": 2910923,
        "2020-2022": 3392778,
        "2023-2025": 3394291,
      },
      {
        name: "Malaria",
        "2017-2019": 2731792,
        "2020-2022": 4048844,
        "2023-2025": 4613836,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 2873205,
        "2020-2022": 3454904,
        "2023-2025": 3452257,
      },
    ],
    "2017-2019": 8515920,
    "2020-2022": 10896526,
    "2023-2025": 11460384,
  },
  {
    name: "Dominican Republic",
    _children: [
      {
        name: "HIV",
        "2017-2019": 15994956,
        "2020-2022": 15995839,
        "2023-2025": 16101778,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 4493840,
      },
    ],
    "2017-2019": 20488796,
    "2020-2022": 15995839,
    "2023-2025": 16101778,
  },
  {
    name: "Ecuador",
    _children: [
      {
        name: "HIV",
        "2017-2019": 5328421,
        "2020-2022": 6005764,
        "2023-2025": 7257254,
      },
    ],
    "2017-2019": 5328421,
    "2020-2022": 6005764,
    "2023-2025": 7257254,
  },
  {
    name: "Egypt",
    _children: [
      {
        name: "HIV",
        "2017-2019": 500093,
        "2020-2022": 4203113,
        "2023-2025": 6920930,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 1558243,
        "2020-2022": 1067310,
        "2023-2025": 2028039,
      },
    ],
    "2017-2019": 2058336,
    "2020-2022": 5270423,
    "2023-2025": 8948969,
  },
  {
    name: "El Salvador",
    _children: [
      {
        name: "HIV",
        "2017-2019": 14481816,
        "2020-2022": 16074816,
        "2023-2025": 14382672,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 4242741,
        "2020-2022": 3182056,
        "2023-2025": 2221745,
      },
    ],
    "2017-2019": 18724557,
    "2020-2022": 19256872,
    "2023-2025": 16604417,
  },
  {
    name: "Eritrea",
    _children: [
      {
        name: "HIV",
        "2017-2019": 17649811,
        "2020-2022": 21312156,
        "2023-2025": 21276487,
      },
      {
        name: "Malaria",
        "2017-2019": 21554342,
        "2020-2022": 18032288,
        "2023-2025": 18023331,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 4462207,
        "2020-2022": 5274977,
        "2023-2025": 5303054,
      },
    ],
    "2017-2019": 43666360,
    "2020-2022": 44619421,
    "2023-2025": 44602872,
  },
  {
    name: "Eswatini",
    _children: [
      {
        name: "HIV",
        "2017-2019": 35310126,
        "2020-2022": 39348102,
        "2023-2025": 32901259,
      },
      {
        name: "Malaria",
        "2017-2019": 2581055,
        "2020-2022": 2635791,
        "2023-2025": 2632098,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 11900000,
        "2020-2022": 11925000,
        "2023-2025": 9826179,
      },
    ],
    "2017-2019": 49791181,
    "2020-2022": 53908893,
    "2023-2025": 45359536,
  },
  {
    name: "Ethiopia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 194160287.7,
        "2020-2022": 278315505,
        "2023-2025": 256910005,
      },
      {
        name: "Malaria",
        "2017-2019": 129849218,
        "2020-2022": 115344133,
        "2023-2025": 116298685,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 51599380.89,
        "2020-2022": 50893976,
        "2023-2025": 54362193,
      },
    ],
    "2017-2019": 375608886.59,
    "2020-2022": 444553614,
    "2023-2025": 427570883,
  },
  {
    name: "Gabon",
    _children: [
      {
        name: "Tuberculosis",
        "2017-2019": 1400000,
        "2020-2022": 3029880.33,
        "2023-2025": 2128464.03,
      },
      {
        name: "HIV",
        "2023-2025": 2634056.69,
      },
      {
        name: "Malaria",
        "2023-2025": 3200000.07,
      },
    ],
    "2017-2019": 1400000,
    "2020-2022": 3029880.33,
    "2023-2025": 7962520.789999999,
  },
  {
    name: "Gambia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 8665790,
        "2020-2022": 17529962,
        "2023-2025": 17044875,
      },
      {
        name: "Malaria",
        "2017-2019": 15293792,
        "2020-2022": 21962105,
        "2023-2025": 20173996,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 4000000,
        "2020-2022": 3750000,
        "2023-2025": 3748296,
      },
    ],
    "2017-2019": 27959582,
    "2020-2022": 43242067,
    "2023-2025": 40967167,
  },
  {
    name: "Georgia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 8412986,
        "2020-2022": 12076771,
        "2023-2025": 12156754,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 7175076,
        "2020-2022": 5479715,
        "2023-2025": 4066002,
      },
    ],
    "2017-2019": 15588062,
    "2020-2022": 17556486,
    "2023-2025": 16222756,
  },
  {
    name: "Ghana",
    _children: [
      {
        name: "HIV",
        "2017-2019": 66436395,
        "2020-2022": 88833024,
        "2023-2025": 95049043,
      },
      {
        name: "Malaria",
        "2017-2019": 111531421,
        "2020-2022": 119665794,
        "2023-2025": 120781507,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 16012823,
        "2020-2022": 18197239,
        "2023-2025": 18217425,
      },
    ],
    "2017-2019": 193980639,
    "2020-2022": 226696057,
    "2023-2025": 234047975,
  },
  {
    name: "Guatemala",
    _children: [
      {
        name: "HIV",
        "2017-2019": 19773326,
        "2020-2022": 25609594,
        "2023-2025": 24972106,
      },
      {
        name: "Malaria",
        "2017-2019": 6362560,
        "2020-2022": 4771920,
        "2023-2025": 3553464,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 5849483,
        "2020-2022": 4387112,
        "2023-2025": 3213134,
      },
    ],
    "2017-2019": 31985369,
    "2020-2022": 34768626,
    "2023-2025": 31738704,
  },
  {
    name: "Guinea",
    _children: [
      {
        name: "HIV",
        "2017-2019": 40598457,
        "2020-2022": 53120571,
        "2023-2025": 52493058,
      },
      {
        name: "Malaria",
        "2017-2019": 56663302,
        "2020-2022": 72670272,
        "2023-2025": 81506179,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 6750605,
        "2020-2022": 10433256,
        "2023-2025": 11183674,
      },
    ],
    "2017-2019": 104012364,
    "2020-2022": 136224099,
    "2023-2025": 145182911,
  },
  {
    name: "Guinea-Bissau",
    _children: [
      {
        name: "HIV",
        "2017-2019": 10254189,
        "2020-2022": 23126468.87,
        "2023-2025": 21227603.07,
      },
      {
        name: "Malaria",
        "2017-2019": 19720996,
        "2020-2022": 27199255.5,
        "2023-2025": 29581209.82,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 3256493,
        "2020-2022": 6057020.9,
        "2023-2025": 6129088.07,
      },
    ],
    "2017-2019": 33231678,
    "2020-2022": 56382745.27,
    "2023-2025": 56937900.96,
  },
  {
    name: "Guyana",
    _children: [
      {
        name: "HIV",
        "2017-2019": 3993335,
        "2020-2022": 4816401,
        "2023-2025": 4066316,
      },
      {
        name: "Malaria",
        "2017-2019": 1612021,
        "2020-2022": 1185793,
        "2023-2025": 1882532,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 500000,
        "2020-2022": 500000,
        "2023-2025": 500000,
      },
    ],
    "2017-2019": 6105356,
    "2020-2022": 6502194,
    "2023-2025": 6448848,
  },
  {
    name: "Haiti",
    _children: [
      {
        name: "HIV",
        "2017-2019": 66216854,
        "2020-2022": 72959840,
        "2023-2025": 67995904,
      },
      {
        name: "Malaria",
        "2017-2019": 21600000,
        "2020-2022": 21000000,
        "2023-2025": 17444350,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 17896075,
        "2020-2022": 25422056,
        "2023-2025": 25356124,
      },
    ],
    "2017-2019": 105712929,
    "2020-2022": 119381896,
    "2023-2025": 110796378,
  },
  {
    name: "Honduras",
    _children: [
      {
        name: "HIV",
        "2017-2019": 10004747,
        "2020-2022": 11604842,
        "2023-2025": 12473040,
      },
      {
        name: "Malaria",
        "2017-2019": 5376572,
        "2020-2022": 4032429,
        "2023-2025": 3002794,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 2743600,
        "2020-2022": 3057700,
        "2023-2025": 2734923,
      },
    ],
    "2017-2019": 18124919,
    "2020-2022": 18694971,
    "2023-2025": 18210757,
  },
  {
    name: "India",
    _children: [
      {
        name: "HIV",
        "2017-2019": 155063624,
        "2020-2022": 155000000,
        "2023-2025": 155000000,
      },
      {
        name: "Malaria",
        "2017-2019": 65006452,
        "2020-2022": 65000000,
        "2023-2025": 65000000,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 279929924,
        "2020-2022": 280000000,
        "2023-2025": 280000000,
      },
    ],
    "2017-2019": 500000000,
    "2020-2022": 500000000,
    "2023-2025": 500000000,
  },
  {
    name: "Indonesia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 91934562,
        "2020-2022": 102717937,
        "2023-2025": 102736705,
      },
      {
        name: "Malaria",
        "2017-2019": 53644906,
        "2020-2022": 40233680,
        "2023-2025": 35796157,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 102416537,
        "2020-2022": 150456123,
        "2023-2025": 156710720,
      },
    ],
    "2017-2019": 247996005,
    "2020-2022": 293407740,
    "2023-2025": 295243582,
  },
  {
    name: "Iran (Islamic Republic)",
    _children: [
      {
        name: "HIV",
        "2017-2019": 10687693,
        "2020-2022": 11222078,
        "2023-2025": 13983498,
      },
    ],
    "2017-2019": 10687693,
    "2020-2022": 11222078,
    "2023-2025": 13983498,
  },
  {
    name: "Jamaica",
    _children: [
      {
        name: "HIV",
        "2017-2019": 9930638,
        "2020-2022": 11488614,
        "2023-2025": 13523239,
      },
    ],
    "2017-2019": 9930638,
    "2020-2022": 11488614,
    "2023-2025": 13523239,
  },
  {
    name: "Kazakhstan",
    _children: [
      {
        name: "HIV",
        "2017-2019": 2714223,
        "2020-2022": 5197500,
        "2023-2025": 8086543,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 9840440,
        "2020-2022": 10040997,
        "2023-2025": 6759439,
      },
    ],
    "2017-2019": 12554663,
    "2020-2022": 15238497,
    "2023-2025": 14845982,
  },
  {
    name: "Kenya",
    _children: [
      {
        name: "HIV",
        "2017-2019": 246899292,
        "2020-2022": 271649197,
        "2023-2025": 252843015,
      },
      {
        name: "Malaria",
        "2017-2019": 63225487,
        "2020-2022": 86966676,
        "2023-2025": 78578587,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 45507072,
        "2020-2022": 56694297,
        "2023-2025": 61567466,
      },
    ],
    "2017-2019": 355631851,
    "2020-2022": 415310170,
    "2023-2025": 392989068,
  },
  {
    name: "Korea (Democratic Peoples Republic)",
    _children: [
      {
        name: "Malaria",
        "2017-2019": 8083880,
        "2023-2025": 2836297,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 35979788,
        "2023-2025": 23966904,
      },
    ],
    "2017-2019": 44063668,
    "2023-2025": 26803201,
  },
  {
    name: "Kosovo",
    _children: [
      {
        name: "HIV",
        "2017-2019": 1769087,
        "2020-2022": 1990223.35,
        "2023-2025": 2261906.66,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 1714198,
        "2020-2022": 1285649.37,
        "2023-2025": 897654.27,
      },
    ],
    "2017-2019": 3483285,
    "2020-2022": 3275872.72,
    "2023-2025": 3159560.93,
  },
  {
    name: "Kyrgyzstan",
    _children: [
      {
        name: "HIV",
        "2017-2019": 11266362,
        "2020-2022": 11491690,
        "2023-2025": 13695211,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 12203652,
        "2020-2022": 14944703,
        "2023-2025": 13705547,
      },
    ],
    "2017-2019": 23470014,
    "2020-2022": 26436393,
    "2023-2025": 27400758,
  },
  {
    name: "Lao (Peoples Democratic Republic)",
    _children: [
      {
        name: "HIV",
        "2017-2019": 7374096,
        "2020-2022": 6930536,
        "2023-2025": 7449033,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 7393149,
        "2020-2022": 8576696,
        "2023-2025": 8088355,
      },
    ],
    "2017-2019": 14767245,
    "2020-2022": 15507232,
    "2023-2025": 15537388,
  },
  {
    name: "Lesotho",
    _children: [
      {
        name: "HIV",
        "2017-2019": 59413092,
        "2020-2022": 60654854,
        "2023-2025": 59981314,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 6934422,
        "2020-2022": 6906608,
        "2023-2025": 10018183,
      },
    ],
    "2017-2019": 66347514,
    "2020-2022": 67561462,
    "2023-2025": 69999497,
  },
  {
    name: "Liberia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 24833450,
        "2020-2022": 31095109,
        "2023-2025": 35963003,
      },
      {
        name: "Malaria",
        "2017-2019": 36268149,
        "2020-2022": 39812759,
        "2023-2025": 43533232,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 4646649,
        "2020-2022": 6803878,
        "2023-2025": 7811749,
      },
    ],
    "2017-2019": 65748248,
    "2020-2022": 77711746,
    "2023-2025": 87307984,
  },
  {
    name: "Madagascar",
    _children: [
      {
        name: "HIV",
        "2017-2019": 15485534,
        "2020-2022": 20407983,
        "2023-2025": 28371317,
      },
      {
        name: "Malaria",
        "2017-2019": 52000000,
        "2020-2022": 50370650,
        "2023-2025": 72297135,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 9300000,
        "2020-2022": 18045448,
        "2023-2025": 25041766,
      },
    ],
    "2017-2019": 76785534,
    "2020-2022": 88824081,
    "2023-2025": 125710218,
  },
  {
    name: "Malawi",
    _children: [
      {
        name: "HIV",
        "2017-2019": 370804766,
        "2020-2022": 393004813,
        "2023-2025": 404987463,
      },
      {
        name: "Malaria",
        "2017-2019": 70670374,
        "2020-2022": 99984069,
        "2023-2025": 92122352,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 9000000,
        "2020-2022": 19950195,
        "2023-2025": 20036530,
      },
    ],
    "2017-2019": 450475140,
    "2020-2022": 512939077,
    "2023-2025": 517146345,
  },
  {
    name: "Malaysia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 4031592,
        "2020-2022": 3964273,
        "2023-2025": 3561223,
      },
    ],
    "2017-2019": 4031592,
    "2020-2022": 3964273,
    "2023-2025": 3561223,
  },
  {
    name: "Mali",
    _children: [
      {
        name: "HIV",
        "2017-2019": 51808127,
        "2020-2022": 80322830.2,
        "2023-2025": 72025245.57,
      },
      {
        name: "Malaria",
        "2017-2019": 56000000,
        "2020-2022": 90096463.91,
        "2023-2025": 99207798.61,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 4854374,
        "2020-2022": 8412422.65,
        "2023-2025": 8395750.81,
      },
    ],
    "2017-2019": 112662501,
    "2020-2022": 178831716.76000002,
    "2023-2025": 179628794.99,
  },
  {
    name: "Mauritania",
    _children: [
      {
        name: "HIV",
        "2017-2019": 5760741,
        "2020-2022": 5011845,
        "2023-2025": 6370317,
      },
      {
        name: "Malaria",
        "2017-2019": 8616815,
        "2020-2022": 12523998,
        "2023-2025": 12497049,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 1972385,
        "2020-2022": 2055658,
        "2023-2025": 2135286,
      },
    ],
    "2017-2019": 16349941,
    "2020-2022": 19591501,
    "2023-2025": 21002652,
  },
  {
    name: "Mauritius",
    _children: [
      {
        name: "HIV",
        "2017-2019": 2487917,
        "2020-2022": 2265213,
        "2023-2025": 2368481,
      },
    ],
    "2017-2019": 2487917,
    "2020-2022": 2265213,
    "2023-2025": 2368481,
  },
  {
    name: "Moldova",
    _children: [
      {
        name: "HIV",
        "2017-2019": 8018089,
        "2020-2022": 9554788.51,
        "2023-2025": 10350429.45,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 9821347,
        "2020-2022": 10366010.04,
        "2023-2025": 8037673.31,
      },
    ],
    "2017-2019": 17839436,
    "2020-2022": 19920798.549999997,
    "2023-2025": 18388102.759999998,
  },
  {
    name: "Mongolia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 3044708,
        "2020-2022": 2626061,
        "2023-2025": 3410907,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 7224359,
        "2020-2022": 10718269,
        "2023-2025": 10683629,
      },
    ],
    "2017-2019": 10269067,
    "2020-2022": 13344330,
    "2023-2025": 14094536,
  },
  {
    name: "Montenegro",
    _children: [
      {
        name: "HIV",
        "2017-2019": 625000,
        "2020-2022": 620000,
        "2023-2025": 929108.81,
      },
    ],
    "2017-2019": 625000,
    "2020-2022": 620000,
    "2023-2025": 929108.81,
  },
  {
    name: "Morocco",
    _children: [
      {
        name: "HIV",
        "2017-2019": 13282255,
        "2020-2022": 14547900.51,
        "2023-2025": 16911747.04,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 2100000,
        "2020-2022": 3031007.56,
        "2023-2025": 4238513.76,
      },
    ],
    "2017-2019": 15382255,
    "2020-2022": 17578908.07,
    "2023-2025": 21150260.799999997,
  },
  {
    name: "Mozambique",
    _children: [
      {
        name: "HIV",
        "2017-2019": 289889134,
        "2020-2022": 496359122,
        "2023-2025": 506987373,
      },
      {
        name: "Malaria",
        "2017-2019": 167870339,
        "2020-2022": 200001211,
        "2023-2025": 207998460,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 45122235,
        "2020-2022": 55152849,
        "2023-2025": 55556657,
      },
    ],
    "2017-2019": 502881708,
    "2020-2022": 751513182,
    "2023-2025": 770542490,
  },
  {
    name: "Multicountry Caribbean MCC",
    _children: [
      {
        name: "HIV",
        "2017-2019": 2350000,
        "2020-2022": 2450000,
        "2023-2025": 2191214,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 1200000,
        "2020-2022": 1200000,
        "2023-2025": 1200000,
      },
    ],
    "2017-2019": 3550000,
    "2020-2022": 3650000,
    "2023-2025": 3391214,
  },
  {
    name: "Multicountry East Asia and Pacific RAI",
    _children: [
      {
        name: "Malaria",
        "2017-2019": 123393579,
        "2020-2022": 106545184,
        "2023-2025": 96294061,
      },
    ],
    "2017-2019": 123393579,
    "2020-2022": 106545184,
    "2023-2025": 96294061,
  },
  {
    name: "Multicountry Middle East MER",
    _children: [
      {
        name: "HIV",
        "2017-2019": 7780584,
        "2020-2022": 11516412,
        "2023-2025": 14962882,
      },
      {
        name: "Malaria",
        "2017-2019": 14869781,
        "2020-2022": 17997941,
        "2023-2025": 20269782,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 13758003,
        "2020-2022": 18075782,
        "2023-2025": 19213805,
      },
    ],
    "2017-2019": 36408368,
    "2020-2022": 47590135,
    "2023-2025": 54446469,
  },
  {
    name: "Multicountry Western Pacific",
    _children: [
      {
        name: "HIV",
        "2017-2019": 5092793,
        "2020-2022": 5169562,
        "2023-2025": 6572889,
      },
      {
        name: "Malaria",
        "2017-2019": 1572033,
        "2020-2022": 2968368,
        "2023-2025": 2461679,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 6275920,
        "2020-2022": 5116912,
        "2023-2025": 4765382,
      },
    ],
    "2017-2019": 12940746,
    "2020-2022": 13254842,
    "2023-2025": 13799950,
  },
  {
    name: "Myanmar",
    _children: [
      {
        name: "HIV",
        "2017-2019": 123102465,
        "2020-2022": 122408561,
        "2023-2025": 97456405,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 82947503,
        "2020-2022": 93126255,
        "2023-2025": 75453054,
      },
    ],
    "2017-2019": 206049968,
    "2020-2022": 215534816,
    "2023-2025": 172909459,
  },
  {
    name: "Namibia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 29406863,
        "2020-2022": 28300213,
        "2023-2025": 23914632,
      },
      {
        name: "Malaria",
        "2017-2019": 1823454,
        "2020-2022": 3094835,
        "2023-2025": 3093812,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 5876588,
        "2020-2022": 6007441,
        "2023-2025": 5744469,
      },
    ],
    "2017-2019": 37106905,
    "2020-2022": 37402489,
    "2023-2025": 32752913,
  },
  {
    name: "Nepal",
    _children: [
      {
        name: "HIV",
        "2017-2019": 21964144,
        "2020-2022": 26926654,
        "2023-2025": 29427095,
      },
      {
        name: "Malaria",
        "2017-2019": 4208547,
        "2020-2022": 4156410,
        "2023-2025": 3095118,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 16138548,
        "2020-2022": 20556048,
        "2023-2025": 27108540,
      },
    ],
    "2017-2019": 42311239,
    "2020-2022": 51639112,
    "2023-2025": 59630753,
  },
  {
    name: "Nicaragua",
    _children: [
      {
        name: "HIV",
        "2017-2019": 8429981,
        "2020-2022": 12457279,
        "2023-2025": 12381024,
      },
      {
        name: "Malaria",
        "2017-2019": 6435536,
        "2020-2022": 6426652,
        "2023-2025": 6284069,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 4129716,
        "2020-2022": 3097287,
        "2023-2025": 2162558,
      },
    ],
    "2017-2019": 18995233,
    "2020-2022": 21981218,
    "2023-2025": 20827651,
  },
  {
    name: "Niger",
    _children: [
      {
        name: "HIV",
        "2017-2019": 15032504,
        "2020-2022": 15913473.78,
        "2023-2025": 20505649.75,
      },
      {
        name: "Malaria",
        "2017-2019": 56747651,
        "2020-2022": 107446514.1,
        "2023-2025": 120656502.5,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 12510177,
        "2020-2022": 13597200.68,
        "2023-2025": 8913152.71,
      },
    ],
    "2017-2019": 84290332,
    "2020-2022": 136957188.56,
    "2023-2025": 150075304.96,
  },
  {
    name: "Nigeria",
    _children: [
      {
        name: "HIV",
        "2017-2019": 239781871,
        "2020-2022": 329107978,
        "2023-2025": 361689416,
      },
      {
        name: "Malaria",
        "2017-2019": 313409111,
        "2020-2022": 417893727,
        "2023-2025": 417695711,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 107495151,
        "2020-2022": 143595962,
        "2023-2025": 153771804,
      },
    ],
    "2017-2019": 660686133,
    "2020-2022": 890597667,
    "2023-2025": 933156931,
  },
  {
    name: "Pakistan",
    _children: [
      {
        name: "HIV",
        "2017-2019": 34956107,
        "2020-2022": 71687227,
        "2023-2025": 65446113,
      },
      {
        name: "Malaria",
        "2017-2019": 39232878,
        "2020-2022": 34424659,
        "2023-2025": 34425895,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 130163215,
        "2020-2022": 171981709,
        "2023-2025": 181689888,
      },
    ],
    "2017-2019": 204352200,
    "2020-2022": 278093595,
    "2023-2025": 281561896,
  },
  {
    name: "Panama",
    _children: [
      {
        name: "HIV",
        "2017-2019": 1779385,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 906507,
      },
    ],
    "2017-2019": 2685892,
  },
  {
    name: "Papua New Guinea",
    _children: [
      {
        name: "HIV",
        "2017-2019": 8211639,
        "2020-2022": 21065825,
        "2023-2025": 20179277,
      },
      {
        name: "Malaria",
        "2017-2019": 23563097,
        "2020-2022": 37534289,
        "2023-2025": 37440753,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 11364975,
        "2020-2022": 19388755,
        "2023-2025": 19437470,
      },
    ],
    "2017-2019": 43139711,
    "2020-2022": 77988869,
    "2023-2025": 77057500,
  },
  {
    name: "Paraguay",
    _children: [
      {
        name: "HIV",
        "2017-2019": 4432967,
        "2020-2022": 6722401,
        "2023-2025": 7028868,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 2915321,
      },
    ],
    "2017-2019": 7348288,
    "2020-2022": 6722401,
    "2023-2025": 7028868,
  },
  {
    name: "Peru",
    _children: [
      {
        name: "HIV",
        "2017-2019": 6264586,
        "2020-2022": 9018643,
        "2023-2025": 13970236,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 7199291,
        "2020-2022": 10898534,
        "2023-2025": 10860018,
      },
    ],
    "2017-2019": 13463877,
    "2020-2022": 19917177,
    "2023-2025": 24830254,
  },
  {
    name: "Philippines",
    _children: [
      {
        name: "HIV",
        "2017-2019": 8483242,
        "2020-2022": 20338651,
        "2023-2025": 25087000,
      },
      {
        name: "Malaria",
        "2017-2019": 10662817,
        "2020-2022": 7997113,
        "2023-2025": 6953360,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 78543887,
        "2020-2022": 119096167,
        "2023-2025": 136020179,
      },
    ],
    "2017-2019": 97689946,
    "2020-2022": 147431931,
    "2023-2025": 168060539,
  },
  {
    name: "Romania",
    _children: [
      {
        name: "Tuberculosis",
        "2017-2019": 4548280,
      },
    ],
    "2017-2019": 4548280,
  },
  {
    name: "Rwanda",
    _children: [
      {
        name: "HIV",
        "2017-2019": 154462907,
        "2020-2022": 121349916,
        "2023-2025": 109231273,
      },
      {
        name: "Malaria",
        "2017-2019": 41460255,
        "2020-2022": 54795191,
        "2023-2025": 50034762,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 14154994,
        "2020-2022": 14016245,
        "2023-2025": 12848472,
      },
    ],
    "2017-2019": 210078156,
    "2020-2022": 190161352,
    "2023-2025": 172114507,
  },
  {
    name: "Sao Tome and Principe",
    _children: [
      {
        name: "HIV",
        "2017-2019": 899645,
        "2020-2022": 1009680.69,
        "2023-2025": 1008797.84,
      },
      {
        name: "Malaria",
        "2017-2019": 3900000,
        "2020-2022": 11006784.32,
        "2023-2025": 10955334.58,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 911177,
        "2020-2022": 883381.68,
        "2023-2025": 886788.89,
      },
    ],
    "2017-2019": 5710822,
    "2020-2022": 12899846.69,
    "2023-2025": 12850921.31,
  },
  {
    name: "Senegal",
    _children: [
      {
        name: "HIV",
        "2017-2019": 24540785,
        "2020-2022": 28542091.21,
        "2023-2025": 31857932.18,
      },
      {
        name: "Malaria",
        "2017-2019": 40804408,
        "2020-2022": 36195010.2,
        "2023-2025": 31041850.69,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 7568000,
        "2020-2022": 12052625.6,
        "2023-2025": 12935280.97,
      },
    ],
    "2017-2019": 72913193,
    "2020-2022": 76789727.01,
    "2023-2025": 75835063.84,
  },
  {
    name: "Serbia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 1232579,
        "2020-2022": 1663980.59,
        "2023-2025": 2242340.84,
      },
    ],
    "2017-2019": 1232579,
    "2020-2022": 1663980.59,
    "2023-2025": 2242340.84,
  },
  {
    name: "Sierra Leone",
    _children: [
      {
        name: "HIV",
        "2017-2019": 40265850,
        "2020-2022": 42675300,
        "2023-2025": 38051061,
      },
      {
        name: "Malaria",
        "2017-2019": 43960771,
        "2020-2022": 68353985,
        "2023-2025": 73235736,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 6698030,
        "2020-2022": 15175737,
        "2023-2025": 15157877,
      },
    ],
    "2017-2019": 90924651,
    "2020-2022": 126205022,
    "2023-2025": 126444674,
  },
  {
    name: "Solomon Islands",
    _children: [
      {
        name: "Malaria",
        "2017-2019": 4852890,
        "2020-2022": 8031136,
        "2023-2025": 7236395,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 1251604,
        "2020-2022": 1193480,
        "2023-2025": 833300,
      },
    ],
    "2017-2019": 6104494,
    "2020-2022": 9224616,
    "2023-2025": 8069695,
  },
  {
    name: "Somalia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 16004070,
        "2020-2022": 21172635,
        "2023-2025": 18723090,
      },
      {
        name: "Malaria",
        "2017-2019": 30337699,
        "2020-2022": 34438600,
        "2023-2025": 35281750,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 22110931,
        "2020-2022": 29018030,
        "2023-2025": 29702178,
      },
    ],
    "2017-2019": 68452700,
    "2020-2022": 84629265,
    "2023-2025": 83707018,
  },
  {
    name: "South Africa",
    _children: [
      {
        name: "HIV",
        "2017-2019": 317721470,
        "2020-2022": 491237860,
        "2023-2025": 463598573,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 35599651,
        "2020-2022": 45528766,
        "2023-2025": 72441924,
      },
    ],
    "2017-2019": 353321121,
    "2020-2022": 536766626,
    "2023-2025": 536040497,
  },
  {
    name: "South Sudan",
    _children: [
      {
        name: "HIV",
        "2017-2019": 29015250,
        "2020-2022": 58196898,
        "2023-2025": 68125558,
      },
      {
        name: "Malaria",
        "2017-2019": 48666045,
        "2020-2022": 54669027,
        "2023-2025": 59712409,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 9000000,
        "2020-2022": 9000000,
        "2023-2025": 14117233,
      },
    ],
    "2017-2019": 86681295,
    "2020-2022": 121865925,
    "2023-2025": 141955200,
  },
  {
    name: "Sri Lanka",
    _children: [
      {
        name: "HIV",
        "2017-2019": 6948047,
        "2020-2022": 6387963,
        "2023-2025": 6381149,
      },
      {
        name: "Malaria",
        "2017-2019": 2500000,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 3024073,
        "2020-2022": 3039336,
        "2023-2025": 2969568,
      },
    ],
    "2017-2019": 12472120,
    "2020-2022": 9427299,
    "2023-2025": 9350717,
  },
  {
    name: "Sudan",
    _children: [
      {
        name: "HIV",
        "2017-2019": 18839720,
        "2020-2022": 22106965,
        "2023-2025": 19740899,
      },
      {
        name: "Malaria",
        "2017-2019": 98522995,
        "2020-2022": 110314123,
        "2023-2025": 118116410,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 12262049,
        "2020-2022": 13285731,
        "2023-2025": 13382769,
      },
    ],
    "2017-2019": 129624764,
    "2020-2022": 145706819,
    "2023-2025": 151240078,
  },
  {
    name: "Suriname",
    _children: [
      {
        name: "HIV",
        "2017-2019": 810721,
        "2020-2022": 2355648,
        "2023-2025": 2371250,
      },
      {
        name: "Malaria",
        "2017-2019": 2011482,
        "2020-2022": 3292987,
        "2023-2025": 3474724,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 989674,
      },
    ],
    "2017-2019": 3811877,
    "2020-2022": 5648635,
    "2023-2025": 5845974,
  },
  {
    name: "Tajikistan",
    _children: [
      {
        name: "HIV",
        "2017-2019": 12939544,
        "2020-2022": 14362894,
        "2023-2025": 15437432,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 9752657,
        "2020-2022": 10754493,
        "2023-2025": 10526715,
      },
    ],
    "2017-2019": 22692201,
    "2020-2022": 25117387,
    "2023-2025": 25964147,
  },
  {
    name: "Tanzania (United Republic)",
    _children: [
      {
        name: "HIV",
        "2017-2019": 408487081,
        "2020-2022": 364840423,
        "2023-2025": 370004151,
      },
      {
        name: "Malaria",
        "2017-2019": 145258808,
        "2020-2022": 179362012,
        "2023-2025": 182910065,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 25849887,
        "2020-2022": 43068093,
        "2023-2025": 49963120,
      },
    ],
    "2017-2019": 579595776,
    "2020-2022": 587270528,
    "2023-2025": 602877336,
  },
  {
    name: "Thailand",
    _children: [
      {
        name: "HIV",
        "2017-2019": 24569150,
        "2020-2022": 40573017,
        "2023-2025": 48079625,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 13096509,
        "2020-2022": 20075452,
        "2023-2025": 20116930,
      },
    ],
    "2017-2019": 37665659,
    "2020-2022": 60648469,
    "2023-2025": 68196555,
  },
  {
    name: "Timor-Leste",
    _children: [
      {
        name: "HIV",
        "2017-2019": 2312598,
        "2020-2022": 3357640,
        "2023-2025": 3353220,
      },
      {
        name: "Malaria",
        "2017-2019": 10969331,
        "2020-2022": 7593719,
        "2023-2025": 3913003,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 2494891,
        "2020-2022": 4800000,
        "2023-2025": 8328831,
      },
    ],
    "2017-2019": 15776820,
    "2020-2022": 15751359,
    "2023-2025": 15595054,
  },
  {
    name: "Togo",
    _children: [
      {
        name: "HIV",
        "2017-2019": 30858946,
        "2020-2022": 44982023.93,
        "2023-2025": 44518909.12,
      },
      {
        name: "Malaria",
        "2017-2019": 31939623,
        "2020-2022": 60172698.4,
        "2023-2025": 63671327.84,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 1839749,
        "2020-2022": 3879811.39,
        "2023-2025": 3908933.03,
      },
    ],
    "2017-2019": 64638318,
    "2020-2022": 109034533.72,
    "2023-2025": 112099169.99000001,
  },
  {
    name: "Tunisia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 4060055,
        "2020-2022": 4798985,
      },
    ],
    "2017-2019": 4060055,
    "2020-2022": 4798985,
  },
  {
    name: "Turkmenistan",
    _children: [
      {
        name: "Tuberculosis",
        "2017-2019": 3956665,
        "2020-2022": 5067499,
        "2023-2025": 6238193,
      },
    ],
    "2017-2019": 3956665,
    "2020-2022": 5067499,
    "2023-2025": 6238193,
  },
  {
    name: "Uganda",
    _children: [
      {
        name: "HIV",
        "2017-2019": 255632244,
        "2020-2022": 289203023,
        "2023-2025": 288484740,
      },
      {
        name: "Malaria",
        "2017-2019": 188322878,
        "2020-2022": 260024950,
        "2023-2025": 267250747,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 21101922,
        "2020-2022": 29773958,
        "2023-2025": 31392046,
      },
    ],
    "2017-2019": 465057044,
    "2020-2022": 579001931,
    "2023-2025": 587127533,
  },
  {
    name: "Ukraine",
    _children: [
      {
        name: "HIV",
        "2017-2019": 70836441,
        "2020-2022": 70833698,
        "2023-2025": 101299533,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 48646090,
        "2020-2022": 48644568,
        "2023-2025": 55864257,
      },
    ],
    "2017-2019": 119482531,
    "2020-2022": 119478266,
    "2023-2025": 157163790,
  },
  {
    name: "Uzbekistan",
    _children: [
      {
        name: "HIV",
        "2017-2019": 13928377,
        "2020-2022": 17969088,
        "2023-2025": 20902851,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 21640400,
        "2020-2022": 26150623,
        "2023-2025": 23258685,
      },
    ],
    "2017-2019": 35568777,
    "2020-2022": 44119711,
    "2023-2025": 44161536,
  },
  {
    name: "Viet Nam",
    _children: [
      {
        name: "HIV",
        "2017-2019": 56638006,
        "2020-2022": 54996342,
        "2023-2025": 54980054,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 47281094,
        "2020-2022": 59771812,
        "2023-2025": 59814002,
      },
    ],
    "2017-2019": 103919100,
    "2020-2022": 114768154,
    "2023-2025": 114794056,
  },
  {
    name: "Zambia",
    _children: [
      {
        name: "HIV",
        "2017-2019": 184377140,
        "2020-2022": 233545183,
        "2023-2025": 251027914,
      },
      {
        name: "Malaria",
        "2017-2019": 69000000,
        "2020-2022": 65131160,
        "2023-2025": 77243020,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 10008862,
        "2020-2022": 16568354,
        "2023-2025": 21508410,
      },
    ],
    "2017-2019": 263386002,
    "2020-2022": 315244697,
    "2023-2025": 349779344,
  },
  {
    name: "Zanzibar",
    _children: [
      {
        name: "HIV",
        "2017-2019": 3992509,
        "2020-2022": 4631020,
        "2023-2025": 4209668,
      },
      {
        name: "Malaria",
        "2017-2019": 5134807,
        "2020-2022": 5185635,
        "2023-2025": 5229004,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 1866654,
        "2020-2022": 1399991,
        "2023-2025": 1377491,
      },
    ],
    "2017-2019": 10993970,
    "2020-2022": 11216646,
    "2023-2025": 10816163,
  },
  {
    name: "Zimbabwe",
    _children: [
      {
        name: "HIV",
        "2017-2019": 406518928,
        "2020-2022": 425034567,
        "2023-2025": 432970984,
      },
      {
        name: "Malaria",
        "2017-2019": 53685777,
        "2020-2022": 51684333,
        "2023-2025": 47975037,
      },
      {
        name: "Tuberculosis",
        "2017-2019": 23775807,
        "2020-2022": 23771855,
        "2023-2025": 23797805,
      },
    ],
    "2017-2019": 483980512,
    "2020-2022": 500490755,
    "2023-2025": 504743826,
  },
  {
    name: "Russian Federation",
    _children: [
      {
        name: "HIV",
        "2020-2022": 10014430,
        "2023-2025": 10010167,
      },
    ],
    "2020-2022": 10014430,
    "2023-2025": 10010167,
  },
  {
    name: "Venezuela",
    _children: [
      {
        name: "Malaria",
        "2020-2022": 19800000,
        "2023-2025": 14744295,
      },
      {
        name: "HIV",
        "2023-2025": 18028173,
      },
      {
        name: "Tuberculosis",
        "2023-2025": 3711817,
      },
    ],
    "2020-2022": 19800000,
    "2023-2025": 36484285,
  },
  {
    name: "Equatorial Guinea",
    _children: [
      {
        name: "HIV",
        "2023-2025": 4161483.45,
      },
      {
        name: "Malaria",
        "2023-2025": 2000000.05,
      },
    ],
    "2023-2025": 6161483.5,
  },
  {
    name: "Multicountry North Africa",
    _children: [
      {
        name: "HIV",
        "2023-2025": 9551333,
      },
    ],
    "2023-2025": 9551333,
  },
];

export const TABLE_VARIATION_12_COLUMNS: ColumnDefinition[] = [
  {
    title: "Components",
    field: "components",
    formatter: cellBGColorFormatter,
    width: "20%",
  },
  {
    title: "Submission Date",
    field: "submissionDate",
    formatter: cellBGColorFormatter,
  },
  { title: "Approach", field: "approach", formatter: cellBGColorFormatter },
  { title: "TRP Window", field: "trpWindow", formatter: cellBGColorFormatter },
  {
    title: "TRP Outcome",
    field: "trpOutcome",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Portfolio Categorization",
    field: "portfolioCategorization",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Board Approval",
    field: "boardApproval",
    formatter: cellBGColorFormatter,
  },
  {
    title: "GAC Meeting",
    field: "gacMeeting",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Starting date",
    field: "startingDate",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Ending date",
    field: "endingDate",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Principal Recipient",
    field: "principalRecipient",
    formatter: cellBGColorFormatter,
  },
];

export const TABLE_VARIATION_12_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    components: "Afghanistan",
    _children: [
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
    ],
  },
  {
    components: "Albania",
    _children: [
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
    ],
  },
  {
    components: "Algeria",
    _children: [
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
    ],
  },
  {
    components: "Angola",
    _children: [
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
    ],
  },
  {
    components: "Botswana",
    _children: [
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
    ],
  },
  {
    components: "Ghana",
    _children: [
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
      {
        components: "HIV",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Malaria",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Malaria",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "HIV",
          },
        ],
      },
      {
        components: "Tuberculosis",
        submissionDate: "23 March 2023",
        approach: "Program continuation",
        trpWindow: "B2",
        trpOutcome: "Grant making",
        portfolioCategorization: "--",
        boardApproval: "November 2023",
        _children: [
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH001",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
          {
            gacMeeting: "November 2022",
            grant: "AFG-H-MOH002",
            startingDate: "31-12-2023",
            endingDate: "31-12-2025",
            principalRecipient: "Private health ministry of Ghana",
            component: "Tuberculosis",
          },
        ],
      },
    ],
  },
];

export const TABLE_VARIATION_13_COLUMNS: ColumnDefinition[] = [
  {
    title: "Components",
    field: "component",
    width: "25%",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Signed (US$)",
    field: "signed",
    width: "25%",
    formatter: financialFormatter,
  },
  {
    title: "Committed (US$)",
    field: "committed",
    width: "25%",
    formatter: financialFormatter,
  },
  {
    title: "Disbursed (US$)",
    field: "disbursed",
    width: "25%",
    formatter: financialFormatter,
  },
];

export const TABLE_VARIATION_13_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    component: "HIV",
    grants: 593,
    signed: 29276661067.43,
    committed: 27230518396.57,
    disbursed: 26387750549.6,
  },
  {
    component: "Malaria",
    grants: 380,
    signed: 21772422774.93,
    committed: 19601032601.56,
    disbursed: 18749842379.82,
  },
  {
    component: "Tuberculosis",
    grants: 397,
    signed: 11188367142.65,
    committed: 10354246800.06,
    disbursed: 9728602404.67,
  },
  {
    component: "TB/HIV",
    grants: 116,
    signed: 9872930982.46,
    committed: 8063100176.66,
    disbursed: 7063645064.53,
  },
  {
    component: "RSSH",
    grants: 51,
    signed: 1823833440.67,
    committed: 1485211366.37,
    disbursed: 1258115789.13,
  },
  {
    component: "Multicomponent",
    grants: 24,
    signed: 1770608991.38,
    committed: 1230893645.88,
    disbursed: 971523102.53,
  },
];

export const TABLE_VARIATION_14_COLUMNS: ColumnDefinition[] = [
  {
    title: "Investment Landscapes & Cost Category",
    field: "name",
    width: "70%",
    formatter: cellBGColorFormatter,
  },
  // {
  //   title: "Grants",
  //   field: "grants",
  //   width: "30%",
  //   formatter: financialFormatter,
  // },
  {
    title: "Budget Amount (US$)",
    field: "amount",
    width: "30%",
    formatter: financialFormatter,
  },
];

export const TABLE_VARIATION_14_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    name: "Capacity Building and Technical Assistance",
    grants: 593,
    amount: 29459468145,
    _children: [
      {
        name: "Capacity Building",
        grants: 593,
        amount: 29459468145,
      },
      {
        name: "Technical Assistance",
        grants: 593,
        amount: 29459468145,
      },
    ],
  },
  {
    name: "Health Equipment",
    grants: 398,
    amount: 11448613884,
    _children: [
      {
        name: "Health Equipment",
        grants: 398,
        amount: 11448613884,
      },
    ],
  },
  {
    name: "Health products/commodities and PSM related costs",
    grants: 381,
    amount: 21837104346,
    _children: [
      {
        name: "Health products/commodities",
        grants: 381,
        amount: 21837104346,
      },
      {
        name: "PSM related costs",
        grants: 381,
        amount: 21837104346,
      },
    ],
  },
  {
    name: "Human Resources including Fiscal Agents",
    grants: 118,
    amount: 9966218523,
    _children: [
      {
        name: "Human Resources",
        grants: 118,
        amount: 9966218523,
      },
      {
        name: "Fiscal Agents",
        grants: 118,
        amount: 9966218523,
      },
    ],
  },
  {
    name: "Indirect and Overhead Costs",
    grants: 51,
    amount: 1823833441,
    _children: [
      {
        name: "Indirect Costs",
        grants: 51,
        amount: 1823833441,
      },
      {
        name: "Overhead Costs",
        grants: 51,
        amount: 1823833441,
      },
    ],
  },
  {
    name: "Infrastructure and Non-Health Equipment",
    grants: 23,
    amount: 1778547724,
    _children: [
      {
        name: "Infrastructure",
        grants: 23,
        amount: 1778547724,
      },
      {
        name: "Non-Health Equipment",
        grants: 23,
        amount: 1778547724,
      },
    ],
  },
  {
    name: "Program related costs",
    grants: 21,
    amount: 1778547724,
    _children: [
      {
        name: "Program related costs",
        grants: 21,
        amount: 1778547724,
      },
    ],
  },
];

export const TABLE_VARIATION_15_COLUMNS: ColumnDefinition[] = [
  {
    title: "Modules & Interventions",
    field: "name",
    width: "40%",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Cumulative Expenditure",
    field: "cumulativeExpenditure",
    width: "30%",
    formatter: financialFormatter,
  },
  {
    title: "Expenditure For Reported Period",
    field: "periodExpenditure",
    width: "30%",
    formatter: financialFormatter,
  },
];

export const TABLE_VARIATION_15_DATA: {
  [key: string]: TableDataItem;
}[] = [
  {
    name: "HIV",
    cumulativeExpenditure: 945025388.9299998,
    periodExpenditure: 6507650968.13,
    _children: [
      {
        name: "Comprehensive prevention programs for MSM",
        cumulativeExpenditure: 3095814.04,
        periodExpenditure: 104951271.79,
      },
      {
        name: "Comprehensive prevention programs for people who inject drugs (PWID) and their partners",
        cumulativeExpenditure: 3087159.89,
        periodExpenditure: 124653010.87,
      },
      {
        name: "Comprehensive prevention programs for sex workers and their clients",
        cumulativeExpenditure: 1945034.29,
        periodExpenditure: 129591746.86,
      },
      {
        name: "Comprehensive prevention programs for TGs",
        cumulativeExpenditure: 558764.8,
        periodExpenditure: 11422198.65,
      },
      {
        name: "Comprehensive programs for people in prisons and other closed settings",
        cumulativeExpenditure: 15195.97,
        periodExpenditure: 9761187.64,
      },
      {
        name: "Differentiated HIV Testing Services",
        cumulativeExpenditure: 79468314.09,
        periodExpenditure: 468169158.73,
      },
      {
        name: "PMTCT",
        cumulativeExpenditure: 32744229.97,
        periodExpenditure: 163804046.97,
      },
      {
        name: "Prevention",
        cumulativeExpenditure: 142960180.17,
        periodExpenditure: 390694260.87,
      },
      {
        name: "Prevention package for adolescent girls and young women (AGYW) and male sexual partners in high HIV incidence settings",
        cumulativeExpenditure: 1347529.74,
        periodExpenditure: 4175173.75,
      },
      {
        name: "Prevention package for men who have sex with men (MSM) and their sexual partners",
        cumulativeExpenditure: 28165.94,
        periodExpenditure: 7904916.84,
      },
      {
        name: "Prevention package for sex workers, their clients and other sexual partners",
        cumulativeExpenditure: -19982.04,
        periodExpenditure: 8453813.99,
      },
      {
        name: "Prevention package for transgender people and their sexual partners",
        cumulativeExpenditure: 0,
        periodExpenditure: 868195.7,
      },
      {
        name: "Prevention programs for adolescents and youth, in and out of school",
        cumulativeExpenditure: 2595808.1,
        periodExpenditure: 162657316.14,
      },
      {
        name: "Prevention programs for general population",
        cumulativeExpenditure: 14447070.34,
        periodExpenditure: 124795311.63,
      },
      {
        name: "Prevention programs for other vulnerable populations",
        cumulativeExpenditure: 327981.95,
        periodExpenditure: 51397820.99,
      },
      {
        name: "Reducing human rights-related barriers to TB/HIV services",
        cumulativeExpenditure: 18609011.89,
        periodExpenditure: 110293032.98,
      },
      {
        name: "Treatment, care and support",
        cumulativeExpenditure: 643815109.79,
        periodExpenditure: 4634058503.73,
      },
    ],
  },
  {
    name: "Malaria",
    cumulativeExpenditure: 767240818.6099999,
    periodExpenditure: 4691504230.91,
    _children: [
      {
        name: "Case management",
        cumulativeExpenditure: 231073572.73,
        periodExpenditure: 1446824819.11,
      },
      {
        name: "Specific prevention interventions (SPI)",
        cumulativeExpenditure: 58211332.79,
        periodExpenditure: 353183640.88,
      },
      {
        name: "Vector control",
        cumulativeExpenditure: 477955913.09,
        periodExpenditure: 2891495770.92,
      },
    ],
  },
  {
    name: "Multicomponent",
    cumulativeExpenditure: 1110513490.01,
    periodExpenditure: 4929393204.469999,
    _children: [
      {
        name: "COVID-19",
        cumulativeExpenditure: 569660247,
        periodExpenditure: 2057307680.09,
      },
      {
        name: "Payment for results",
        cumulativeExpenditure: 151973435.59,
        periodExpenditure: 228306691.42,
      },
      {
        name: "Program management",
        cumulativeExpenditure: 388879807.42,
        periodExpenditure: 2643778832.96,
      },
    ],
  },
  {
    name: "RSSH",
    cumulativeExpenditure: 244256205.64999998,
    periodExpenditure: 1724136777.71,
    _children: [
      {
        name: "RSSH: Community systems strengthening",
        cumulativeExpenditure: 23587938.07,
        periodExpenditure: 135267519.12,
      },
      {
        name: "RSSH: Financial management systems",
        cumulativeExpenditure: 3419956.55,
        periodExpenditure: 57462392.76,
      },
      {
        name: "RSSH: Health management information systems and M&E",
        cumulativeExpenditure: 39553580.71,
        periodExpenditure: 287142221.18,
      },
      {
        name: "RSSH: Health products management systems",
        cumulativeExpenditure: 36950949.24,
        periodExpenditure: 301525332.77,
      },
      {
        name: "RSSH: Health sector governance and planning",
        cumulativeExpenditure: 7117526.2,
        periodExpenditure: 53602859.18,
      },
      {
        name: "RSSH: Human resources for health, including community health workers",
        cumulativeExpenditure: 30065280.27,
        periodExpenditure: 316340982.58,
      },
      {
        name: "RSSH: Integrated service delivery and quality improvement",
        cumulativeExpenditure: 26914877.32,
        periodExpenditure: 183240141.16,
      },
      {
        name: "RSSH: Laboratory systems",
        cumulativeExpenditure: 12653299.13,
        periodExpenditure: 38541776.18,
      },
      {
        name: "RSSH: Monitoring and evaluation systems",
        cumulativeExpenditure: 63992798.16,
        periodExpenditure: 351013552.78,
      },
    ],
  },
  {
    name: "Tuberculosis",
    cumulativeExpenditure: 420470219.93,
    periodExpenditure: 2635910621.08,
    _children: [
      {
        name: "MDR-TB",
        cumulativeExpenditure: 120612114.68,
        periodExpenditure: 951422631.83,
      },
      {
        name: "Removing human rights and gender related barriers to TB services",
        cumulativeExpenditure: 1960500.13,
        periodExpenditure: 5603168.07,
      },
      {
        name: "TB care and prevention",
        cumulativeExpenditure: 281616061.24,
        periodExpenditure: 1549500562.04,
      },
      {
        name: "TB/HIV",
        cumulativeExpenditure: 16281543.88,
        periodExpenditure: 129384259.14,
      },
    ],
  },
  {
    name: "Ungrouped Components",
    cumulativeExpenditure: 128356.87999999999,
    periodExpenditure: 220719.97,
    _children: [
      {
        name: "Malaria",
        cumulativeExpenditure: -4939.6,
        periodExpenditure: 0,
      },
      {
        name: "Multicomponent",
        cumulativeExpenditure: 103036.59,
        periodExpenditure: 193997.94,
      },
      {
        name: "RSSH",
        cumulativeExpenditure: 26722.03,
        periodExpenditure: 26722.03,
      },
      {
        name: "Tuberculosis",
        cumulativeExpenditure: 3537.86,
        periodExpenditure: 0,
      },
    ],
  },
];

export const TABLE_VARIATION_16_COLUMNS: ColumnDefinition[] = [
  {
    title: "Disbursement Area",
    field: "name",
    width: "70%",
    formatter: cellBGColorFormatter,
  },
  {
    title: "Amount (US$)",
    field: "amount",
    width: "30%",
    formatter: financialFormatter,
  },
];
