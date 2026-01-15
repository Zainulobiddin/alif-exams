import type { TableColumn } from "../types/table";

export async function fetchColumns(): Promise<TableColumn[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
  const res = await fetch("http://localhost:3000/columns");

  if (!res.ok) {
    throw new Error("failed to fetch columns");
  }

  return res.json();
}
