import { Skeleton } from "@/components/ui/skeleton";

interface TableScrollSkeletonProps {
  columnsCount?: number;
  rowsCount?: number;
}

export function TableScrollSkeleton({
  columnsCount = 5,
  rowsCount = 10,
}: TableScrollSkeletonProps) {
  return (
    <div className="border-t border-gray-200 bg-white">
      <table className="w-full border-collapse">
        <tbody>
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
  );
}
