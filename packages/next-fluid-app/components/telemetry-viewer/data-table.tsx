import React from "react";

export interface IDataTableProps {
    columns: string[];
    data: Record<string, string | number>[];
}
export const DataTable: React.FunctionComponent<IDataTableProps> = ({ data, columns }) => (
    <table>
        <thead>
            <tr>{data.length ? columns.map((key, i) => <th key={i}>{key}</th>) : <th>No Data</th>}</tr>
        </thead>
        <tbody>
            {data.map((dataItem, i) => (
                <tr key={i}>
                    {columns.map((column, j) => (
                        <td key={`${i}-${j}`}>{dataItem[column] ?? null}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);
