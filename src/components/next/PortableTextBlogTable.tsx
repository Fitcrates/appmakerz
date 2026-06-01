import React from 'react';

type TableRow = {
  _key?: string;
  cells?: string[];
};

interface BlogTableValue {
  _key: string;
  _type: 'blogTable';
  caption?: string;
  headerRow?: boolean;
  rows?: TableRow[];
}

interface PortableTextBlogTableProps {
  value: BlogTableValue;
}

export default function PortableTextBlogTable({ value }: PortableTextBlogTableProps) {
  if (!value?.rows || value.rows.length === 0) {
    return null;
  }

  const { caption, headerRow, rows } = value;
  const isHeaderVisible = headerRow !== false; // Default to true
  const columnCount = Math.max(1, ...rows.map((row) => row.cells?.length || 0));
  const normalizedRows = rows.map((row) => ({
    ...row,
    cells: Array.from({ length: columnCount }, (_, index) => row.cells?.[index] || ''),
  }));
  const bodyRows = isHeaderVisible ? normalizedRows.slice(1) : normalizedRows;
  const headerCells = normalizedRows[0]?.cells || [];

  return (
    <figure className="my-10 w-full max-w-full overflow-hidden rounded-lg border border-white/10 bg-indigo-950/20">
      <div className="w-full overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-white/5">
        <table className="w-full min-w-max border-collapse text-left text-sm text-white/70">
          {caption ? (
            <caption className="caption-top border-b border-white/10 bg-white/5 px-4 py-3 text-left font-oxanium text-base font-light text-white sm:px-6 sm:py-4 sm:text-lg">
              {caption}
            </caption>
          ) : null}
          {isHeaderVisible ? (
            <thead className="bg-white/5 font-oxanium font-medium text-white/90">
              <tr>
                {headerCells.map((cell, cellIndex) => (
                  <th
                    key={cellIndex}
                    scope="col"
                    className="min-w-[11rem] border-r border-white/10 px-4 py-3 align-top last:border-r-0 sm:min-w-[13rem] sm:px-6 sm:py-4"
                  >
                    <span className="block whitespace-pre-wrap break-words">{cell}</span>
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody className="divide-y divide-white/10">
            {bodyRows.map((row, rowIndex) => (
              <tr
                key={row._key || rowIndex}
                className="transition-colors hover:bg-white/5"
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="min-w-[11rem] border-r border-white/10 px-4 py-3 align-top last:border-r-0 sm:min-w-[13rem] sm:px-6 sm:py-4"
                  >
                    <span className="block whitespace-pre-wrap break-words">
                      {cell}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
