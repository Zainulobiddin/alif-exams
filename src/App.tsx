type Column = {
  key: string;
  label: string;
};

type Row = {
  [key: string]: string | number;
};

interface TableProps {
  columns: Column[];
  rows: Row[];
}

const Table: React.FC<TableProps> = ({ columns, rows }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white text-sm">
        {/* Header */}
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-semibold text-gray-700 border-b"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 border-b text-gray-800">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
