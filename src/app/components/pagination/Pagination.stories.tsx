import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Pagination from "app/components/pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "padded",
  },
  tags: [],
  argTypes: {
    count: { control: "number" },
    page: { control: "number" },
    pageSearchValue: { control: "number" },
  },
};

export default meta;
type StoryType = StoryObj<typeof meta>;

const PaginationWrapper = (args: any) => {
  const [page, setPage] = useState(args.page || 1);
  const [pageSearchValue, setPageSearchValue] = useState(
    args.pageSearchValue || 1,
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handlePageSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageSearchValue(Number(e.target.value));
  };

  const handlePageSearch = () => {
    setPage(pageSearchValue);
  };

  return (
    <Pagination
      count={args.count || 100}
      page={page}
      pageSearchValue={pageSearchValue}
      handlePageChange={handlePageChange}
      handlePageSearchChange={handlePageSearchChange}
      handlePageSearch={handlePageSearch}
    />
  );
};

export const Primary: StoryType = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    count: 100,
    page: 1,
    pageSearchValue: 1,
    handlePageChange: () => {},
    handlePageSearchChange: () => {},
    handlePageSearch: () => {},
  },
};
