// components/ReusableTable.js
const ReusableTable = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">No</th>
            {columns.map((column) => (
              <th
                key={column.key}
                className="border border-gray-300 px-4 py-2 text-left"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-gray-50" : ""}
            >
              <td className="border border-gray-300 px-4 py-2">{rowIndex + 1}</td>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="border border-gray-300 px-4 py-2"
                >
                  {typeof column.render === "function"
                    ? column.render({ value: row[column.key], row })
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
