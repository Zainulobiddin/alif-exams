"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { fetchColumns } from "../../api/fetcher-column.api";
import { fetchRows } from "../../api/fetcher-row.api";
import { TableSkeleton } from "../skeleton/table-skeleton";
import { TableScrollSkeleton } from "../skeleton/table-scroll-skeleton";
import { AddRowModal } from "./add-modal";
import Button from "../button/button";
import { useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

export function Table() {
  const { ref, inView } = useInView();
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();

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

  // Rows
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

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const rows =
    (data && data.pages && data.pages.flatMap((page) => page.rows)) ?? [];

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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center p-2 mx-1 fixed top-0 left-3 right-3 shadow bg-white rounded-[3px]">
        <h2 className="text-xl text-blue-600 font-semibold italic">
          Users Table
        </h2>
        <Button onClick={() => setShowAddModal(true)}> Add</Button>
      </div>
      {showAddModal && columns && (
        <AddRowModal
          columns={columns}
          onClose={() => setShowAddModal(false)}
          onSubmit={async (newRow) => {
            const res = await fetch("http://localhost:3000/rows", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newRow),
            });
            if (!res.ok) throw new Error("Failed to add row");
            await queryClient.invalidateQueries({ queryKey: ["rows"] });
          }}
        />
      )}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white  pt-12">
        <div className="overflow-x-auto">
          <InfiniteScroll
            dataLength={rows.length} // сколько строк сейчас
            next={fetchNextPage} // функция загрузки следующей страницы
            hasMore={hasNextPage ?? false} // есть ли еще страницы
            loader={
              <TableScrollSkeleton
                columnsCount={columns?.length ?? 5}
                rowsCount={3}
              />
            }
            scrollableTarget="scrollableDiv"
          >
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
                {rows.map((row, index) => {
                  const isLastRow = index === rows.length - 1;
                  return (
                    <tr
                      ref={isLastRow ? ref : undefined}
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors "
                    >
                      {columns?.map((col) => (
                        <td
                          key={col.key}
                          className="px-6 py-4 text-sm text-gray-700"
                        >
                          {row[col.key]}{" "}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </InfiniteScroll>
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
  {
  }
}
