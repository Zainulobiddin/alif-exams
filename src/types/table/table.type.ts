export interface TableColumn<K extends string = string> {
  key: K;
  label: string;
}

export type TableRow<K extends string = string> = {
  [key in K]: string | number;
};

export type PaginatedResponse<T> = {
  data: T[];
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
};
