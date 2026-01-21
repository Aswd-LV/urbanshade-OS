interface DocTableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  accentColor?: "cyan" | "amber" | "teal" | "green" | "purple" | "red" | "blue";
}

const accentStyles = {
  cyan: { headerBg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  amber: { headerBg: "bg-amber-500/10", border: "border-amber-500/20" },
  teal: { headerBg: "bg-teal-500/10", border: "border-teal-500/20" },
  green: { headerBg: "bg-green-500/10", border: "border-green-500/20" },
  purple: { headerBg: "bg-purple-500/10", border: "border-purple-500/20" },
  red: { headerBg: "bg-red-500/10", border: "border-red-500/20" },
  blue: { headerBg: "bg-blue-500/10", border: "border-blue-500/20" },
};

const DocTable = ({ headers, rows, accentColor = "cyan" }: DocTableProps) => {
  const accent = accentStyles[accentColor];

  return (
    <div className={`rounded-xl overflow-hidden border ${accent.border}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className={accent.headerBg}>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left font-semibold text-slate-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-t ${accent.border} hover:bg-slate-800/30 transition-colors`}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocTable;
