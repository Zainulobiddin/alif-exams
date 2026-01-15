import type { PaginatedResponse, TableRow } from "../types/table";

export async function fetchRows({
  pageParam = 1,
}: {
  pageParam: number;
}): Promise<{
  rows: TableRow[];
  page: number;
  total: number;
  hasNext: boolean;
}> {
  const res = await fetch(
    `http://localhost:3000/rows?_page=${pageParam}&_per_page=20`
  );

  if (!res.ok) {
    throw new Error("failed to fetch rows");
  }

  const json: PaginatedResponse<TableRow> = await res.json();

  return {
    rows: json.data,
    page: pageParam,
    total: json.items,
    hasNext: json.next !== null,
  };
}
