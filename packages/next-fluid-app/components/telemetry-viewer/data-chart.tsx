import React, { useEffect, useState } from "react";
import { Chart, ChartPoint } from "chart.js";
import qs from "querystring";

export interface IDataChartProps {
    columns: string[];
    data: Record<string, string | number>[];
}
const updateQueryParams = (key: string, value: string | string[]) => {
    const query = qs.parse((window.location.search || "?").substr(1));
    const newQuery = {
        ...query,
        [key]: value,
    };
    window.location.search = `?${qs.stringify(newQuery)}`;
};
export const DataChart: React.FunctionComponent<IDataChartProps> = ({ data, columns }) => {
    if (columns.length < 2) {
        return <div>Not Enough Data</div>;
    }
    const [xAxis, setXAxis] = useState(columns[0]);
    const [yAxis, setYAxis] = useState(columns[1]);
    const [filterColumnName, setFilterColumnName] = useState<string | undefined>();
    const [filterColumnValue, setFilterColumnValue] = useState<string | undefined>();
    useEffect(() => {
        const query = qs.parse((window.location.search || "?").substr(1));
        console.log(query);
        if (query.xAxis && columns.includes(query.xAxis as string)) {
            setXAxis(query.xAxis as string);
        }
        if (query.yAxis && columns.includes(query.yAxis as string)) {
            setYAxis(query.yAxis as string);
        }
        if (query.filterColumnName && columns.includes(query.filterColumnName as string)) {
            setFilterColumnName(query.filterColumnName as string);
        }
        if (query.filterColumnValue) {
            setFilterColumnValue(query.filterColumnValue as string);
        }
    }, []);
    useEffect(() => {
        if (xAxis === yAxis) {
            return;
        }
        const canvas = document.getElementById("data-chart") as HTMLCanvasElement;
        if (!canvas) {
            return;
        }
        const dataplots: ChartPoint[] = data
            .filter((item) => {
                if (filterColumnName && filterColumnValue) {
                    return item[filterColumnName] === filterColumnValue;
                }
                return true;
            })
            .map((item) => {
                if (typeof item[xAxis] === "number" && typeof item[yAxis] === "number") {
                    return { x: item[xAxis] as number, y: item[yAxis] as number };
                }
            })
            .filter((item) => item !== undefined) as ChartPoint[];
        console.log(dataplots);
        new Chart(canvas, {
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: `${yAxis} Over ${xAxis}`,
                        data: dataplots,
                    },
                ],
            },
        });
    }, [data, xAxis, yAxis, filterColumnName, filterColumnValue]);
    const handleChangeXAxis = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setXAxis(e.target.value);
        updateQueryParams("xAxis", e.target.value);
    };
    const handleChangeYAxis = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYAxis(e.target.value);
        updateQueryParams("yAxis", e.target.value);
    };
    const handleChangeFilterColumnName = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterColumnName(e.target.value);
        updateQueryParams("filterColumnName", e.target.value);
    };
    const handleChangeFilterColumnValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterColumnValue(e.target.value);
        updateQueryParams("filterColumnValue", e.target.value);
    };
    return (
        <>
            <form>
                <label>
                    X Axis:
                    <select value={xAxis} onChange={handleChangeXAxis}>
                        {columns.map((column) => (
                            <option key={column} value={column}>
                                {column}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Y Axis:
                    <select value={yAxis} onChange={handleChangeYAxis}>
                        {columns.map((column) => (
                            <option key={column} value={column}>
                                {column}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Filter Where:
                    <select
                        value={filterColumnName}
                        onChange={handleChangeFilterColumnName}
                        style={{ display: "inline" }}
                    >
                        <option value={undefined}></option>
                        {columns.map((column) => (
                            <option key={column} value={column}>
                                {column}
                            </option>
                        ))}
                    </select>
                    ==
                    <input
                        value={filterColumnValue}
                        onChange={handleChangeFilterColumnValue}
                        style={{ display: "inline" }}
                    />
                </label>
            </form>
            <canvas id="data-chart" />
        </>
    );
};
