import type { TableColumn } from "../types/table";

export async function fetchColumns(): Promise<TableColumn[]> {
  const res = await fetch("http://localhost:3000/columns");

  if (!res.ok) {
    throw new Error("failed to fetch columns");
  }

  return res.json();
}
