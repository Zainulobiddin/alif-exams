import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columnsCount?: number;
  rowsCount?: number;
}

export function TableSkeleton({
  columnsCount = 5,
  rowsCount = 10,
}: TableSkeletonProps) {
  return (
    <div className="p-4">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Header skeleton */}
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: columnsCount }).map((_, index) => (
                  <th
                    key={index}
                    className="border-b border-gray-200 px-6 py-3"
                  >
                    <Skeleton className="h-4 w-24" />
                  </th>
                ))}
              </tr>
            </thead>

            {/* Rows skeleton */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {Array.from({ length: rowsCount }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: columnsCount }).map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
