"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { fetchColumns } from "../../api/fetcher-column.api";
import { fetchRows } from "../../api/fetcher-row.api";
import { TableSkeleton } from "../skeleton/table-skelton";
import { TableScrollSkeleton } from "../skeleton/table-scroll-skeleton";
export function Table() {
  const { ref, inView } = useInView();

  // Columns
  const {
    data: columns,
    isLoading: isColumnsLoading,
    error: columnsError,
  } = useQuery({
    queryKey: ["columns"],
    queryFn: fetchColumns,
    staleTime: Number.POSITIVE_INFINITY,
  });

  // Rows - Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["rows"],
    queryFn: ({ pageParam }) => fetchRows({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
  });

  // ----------------Infinite Scroll Effect

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const rows =
    (data && data.pages && data.pages.flatMap((page) => page.rows)) ?? [];

  // -------------------- Loading / Error --------------------

  if (isColumnsLoading || isLoading) {
    return <TableSkeleton columnsCount={columns?.length ?? 5} rowsCount={11} />;
  }

  if (columnsError || error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600">Error loading table</p>
      </div>
    );
  }

  // -------------------- Render Table --------------------
  return (
    <div className="p-4">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {columns!.map((col) => (
                  <th
                    key={col.key}
                    className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {rows.map((row) => (
                <tr
                  ref={ref}
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns &&
                    columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 text-sm text-gray-700"
                      >
                        {row[col.key]}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isFetchingNextPage && (
          <>
            <TableScrollSkeleton
              columnsCount={columns?.length ?? 5}
              rowsCount={3}
            />
            <div className="flex justify-center py-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
