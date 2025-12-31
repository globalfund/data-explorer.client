export const datasetItems = [
  {
    id: 1,
    name: "Reported Results",
    description: "Global Fund results reported on an annual basis.",
    date: "2023-01-01",
    isSelected: false,
  },
  {
    id: 2,
    name: "Pledges and Contributions - Reference Rate",
    description:
      "Donor pledges and contributions in US$ equivalents based on the Reference Rate.",
    date: "2023-01-02",
    isSelected: false,
  },
  {
    id: 3,
    name: "Pledges and Contributions - Source Currency",
    description:
      "Donor pledges and contributions in the currency in which they were made.",
    date: "2023-01-03",
    isSelected: false,
  },
  {
    id: 4,
    name: "Country Eligibility",
    description: "Country eligibility for funding over time.",
    date: "2023-01-04",
    isSelected: false,
  },

  {
    id: 5,
    name: "Allocations",
    description: "Allocations amounts for countries by disease.",
    date: "2023-01-04",
    isSelected: false,
  },
];

export const chartTypes = [
  {
    id: "bar",
    chartType: "Bar Chart",
    description: "Compare values across categories.",
    isSelected: false,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.75 3.75V23.75C3.75 24.413 4.01339 25.0489 4.48223 25.5178C4.95107 25.9866 5.58696 26.25 6.25 26.25H26.25M20 6.25H22.5C23.1904 6.25 23.75 6.80964 23.75 7.5V20C23.75 20.6904 23.1904 21.25 22.5 21.25H20C19.3096 21.25 18.75 20.6904 18.75 20V7.5C18.75 6.80964 19.3096 6.25 20 6.25ZM10 10H12.5C13.1904 10 13.75 10.5596 13.75 11.25V20C13.75 20.6904 13.1904 21.25 12.5 21.25H10C9.30964 21.25 8.75 20.6904 8.75 20V11.25C8.75 10.5596 9.30964 10 10 10Z"
          stroke="#252C34"
          strokeWidth="1.875"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    id: "line",
    chartType: "Line Chart",
    description: "Show trends or changes over time.",
    isSelected: false,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.75 0.75V20.75C0.75 21.413 1.01339 22.0489 1.48223 22.5178C1.95107 22.9866 2.58696 23.25 3.25 23.25H23.25M20.75 8.25L14.5 14.5L9.5 9.5L5.75 13.25"
          stroke="#252C34"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "pie",
    chartType: "Pie Chart",
    description: "Show proportions of a whole.",
    icon: (
      <svg
        width="27"
        height="27"
        viewBox="0 0 27 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.763 18.0549C23.9678 19.9355 22.724 21.5926 21.1404 22.8815C19.5567 24.1703 17.6815 25.0516 15.6786 25.4483C13.6756 25.845 11.606 25.745 9.65069 25.1571C7.69534 24.5692 5.91379 23.5112 4.46178 22.0757C3.00977 20.6402 1.93152 18.8708 1.3213 16.9223C0.711074 14.9738 0.587456 12.9055 0.961251 10.8982C1.33505 8.89083 2.19487 7.00564 3.46556 5.4074C4.73625 3.80915 6.37911 2.54651 8.2505 1.72986M24.5005 13.1922C25.1905 13.1922 25.7567 12.6309 25.688 11.9447C25.3998 9.07487 24.1281 6.39304 22.0884 4.35381C20.0487 2.31459 17.3666 1.04346 14.4967 0.755911C13.8092 0.687161 13.2492 1.25341 13.2492 1.94341V11.9434C13.2492 12.2749 13.3809 12.5929 13.6154 12.8273C13.8498 13.0617 14.1677 13.1934 14.4992 13.1934L24.5005 13.1922Z"
          stroke="#252C34"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "scatter",
    chartType: "Scatter Chart",
    description: "Reveal relationships or distributions.",
    isSelected: false,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.75 0.75V20.75C0.75 21.413 1.01339 22.0489 1.48223 22.5178C1.95107 22.9866 2.58696 23.25 3.25 23.25H23.25M7 6.375C7 6.72018 6.72018 7 6.375 7C6.02982 7 5.75 6.72018 5.75 6.375C5.75 6.02982 6.02982 5.75 6.375 5.75C6.72018 5.75 7 6.02982 7 6.375ZM20.75 3.875C20.75 4.22018 20.4702 4.5 20.125 4.5C19.7798 4.5 19.5 4.22018 19.5 3.875C19.5 3.52982 19.7798 3.25 20.125 3.25C20.4702 3.25 20.75 3.52982 20.75 3.875ZM12 11.375C12 11.7202 11.7202 12 11.375 12C11.0298 12 10.75 11.7202 10.75 11.375C10.75 11.0298 11.0298 10.75 11.375 10.75C11.7202 10.75 12 11.0298 12 11.375ZM7 17.625C7 17.9702 6.72018 18.25 6.375 18.25C6.02982 18.25 5.75 17.9702 5.75 17.625C5.75 17.2798 6.02982 17 6.375 17C6.72018 17 7 17.2798 7 17.625ZM19.5 15.125C19.5 15.4702 19.2202 15.75 18.875 15.75C18.5298 15.75 18.25 15.4702 18.25 15.125C18.25 14.7798 18.5298 14.5 18.875 14.5C19.2202 14.5 19.5 14.7798 19.5 15.125Z"
          stroke="#252C34"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "geomap",
    chartType: "Geo Map",
    description: "Visualize data by location.",
    isSelected: false,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.75 3.90983C15.3621 3.90983 14.9795 3.81956 14.6325 3.64616L9.3675 1.01367C9.0205 0.840269 8.63791 0.75 8.25 0.75M15.75 3.90983C16.1379 3.90983 16.5205 3.81956 16.8675 3.64616L21.4413 1.35867C21.632 1.26336 21.8439 1.21843 22.0569 1.22813C22.2699 1.23782 22.4768 1.30184 22.6581 1.41408C22.8393 1.52632 22.9889 1.68306 23.0925 1.86939C23.1961 2.05573 23.2503 2.26546 23.25 2.47866V18.4337C23.2499 18.6657 23.1852 18.8932 23.0631 19.0906C22.941 19.2879 22.7664 19.4474 22.5588 19.5512L16.8675 22.3974C16.5205 22.5708 16.1379 22.6611 15.75 22.6611C15.3621 22.6611 14.9795 22.5708 14.6325 22.3974L9.3675 19.7649C9.0205 19.5915 8.63791 19.5013 8.25 19.5013C7.86209 19.5013 7.4795 19.5915 7.1325 19.7649L2.55875 22.0524C2.36794 22.1478 2.15591 22.1927 1.94282 22.1829C1.72974 22.1732 1.5227 22.1091 1.3414 21.9967C1.1601 21.8843 1.01058 21.7274 0.907062 21.5409C0.803545 21.3544 0.749477 21.1445 0.750004 20.9312V4.97742C0.750128 4.74534 0.814858 4.51788 0.936944 4.32051C1.05903 4.12314 1.23365 3.96365 1.44125 3.85991L7.1325 1.01367C7.4795 0.840269 7.86209 0.75 8.25 0.75M15.75 3.90983L15.75 22.6598M8.25 0.75L8.25 19.5"
          stroke="#252C34"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "sankey",
    chartType: "Sankey Diagram",
    description: "Show flows between sources and targets.",
    isSelected: false,
    icon: (
      <svg
        width="27"
        height="17"
        viewBox="0 0 27 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.75 15.75H18.1988C17.3795 15.7416 16.5748 15.5321 15.8555 15.1397C15.1363 14.7474 14.5244 14.1843 14.0738 13.5L13.6251 12.9375M25.75 0.75L18.2838 0.750117C17.4756 0.744597 16.6782 0.935038 15.9598 1.30513C15.2414 1.67522 14.6234 2.21393 14.1588 2.87512L7.34125 13.6251C6.87659 14.2863 6.25859 14.825 5.54018 15.1951C4.82177 15.5652 4.02436 15.7556 3.21625 15.7501H0.75M0.75 0.750121H3.215C4.14682 0.743636 5.06192 0.99768 5.85705 1.48359C6.65217 1.9695 7.29569 2.66794 7.715 3.50012"
          stroke="#252C34"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "treemap",
    chartType: "Tree Map",
    description: "Show proportions within hierarchies.",
    isSelected: false,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.25 3.75H6.25C5.58696 3.75 4.95107 4.01339 4.48223 4.48223C4.01339 4.95107 3.75 5.58696 3.75 6.25V11.25M11.25 3.75H23.75C24.413 3.75 25.0489 4.01339 25.5178 4.48223C25.9866 4.95107 26.25 5.58696 26.25 6.25V11.25M11.25 3.75V26.25M3.75 11.25V23.75C3.75 24.413 4.01339 25.0489 4.48223 25.5178C4.95107 25.9866 5.58696 26.25 6.25 26.25H11.25M3.75 11.25H26.25M26.25 11.25V23.75C26.25 24.413 25.9866 25.0489 25.5178 25.5178C25.0489 25.9866 24.413 26.25 23.75 26.25H11.25"
          stroke="#252C34"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "heatmap",
    chartType: "Heatmap Chart",
    description: "Show intensity or distribution across two dimensions.",
    isSelected: false,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3.75"
          y="20.3289"
          width="5.92105"
          height="5.92105"
          stroke="black"
          strokeWidth="1.57895"
          strokeLinejoin="round"
        />
        <rect
          x="3.75"
          y="12.0396"
          width="5.92105"
          height="5.92105"
          stroke="black"
          strokeWidth="1.57895"
          strokeLinejoin="round"
        />
        <rect
          x="3.75"
          y="3.75"
          width="5.92105"
          height="5.92105"
          stroke="black"
          strokeWidth="1.57895"
          strokeLinejoin="round"
        />
        <rect
          x="12.0396"
          y="20.3289"
          width="5.92105"
          height="5.92105"
          stroke="black"
          strokeWidth="1.57895"
          strokeLinejoin="round"
        />
        <rect
          x="12.0396"
          y="12.0396"
          width="5.92105"
          height="5.92105"
          stroke="black"
          strokeWidth="1.57895"
          strokeLinejoin="round"
        />
        <rect
          x="12.0396"
          y="3.75"
          width="5.92105"
          height="5.92105"
          stroke="black"
          strokeWidth="1.57895"
          strokeLinejoin="round"
        />
        <rect
          x="20.3291"
          y="20.3289"
          width="5.92105"
          height="5.92105"
          stroke="black"
          strokeWidth="1.57895"
          strokeLinejoin="round"
        />
        <rect
          x="20.3291"
          y="12.0396"
          width="5.92105"
          height="5.92105"
          stroke="black"
          strokeWidth="1.57895"
          strokeLinejoin="round"
        />
        <rect
          x="20.3291"
          y="3.75"
          width="5.92105"
          height="5.92105"
          stroke="black"
          strokeWidth="1.57895"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "radar",
    chartType: "Radar Chart",
    description: "Compare multivariate data across categories.",
    isSelected: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
      >
        <path
          d="M23.932 9.17136L12.341 0.75L0.75 9.17136L5.17737 22.7974H19.5046L23.932 9.17136Z"
          stroke="#252C34"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];
