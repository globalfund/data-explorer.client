export interface PaginationProps {
  count: number;
  page: number;
  pageSearchValue: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  handlePageSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePageSearch: () => void;
}
