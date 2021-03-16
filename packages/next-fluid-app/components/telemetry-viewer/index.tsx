import React, { useEffect, useState } from "react";
import qs from "querystring";
import { DataTable } from "./data-table";
import { DataChart } from "./data-chart";

const fetchTelemetryData = async (subset: string, newerThan?: string): Promise<any[]> => {
    const params = qs.stringify({
        subset,
        newerThan,
    });
    const telemetryData = await fetch(`/api/telemetry?${params}`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Data call failed");
            }
            return response.json();
        })
        .catch((err) => {
            console.error("Failed to retreive telemetry data", err);
            throw err;
        });
    if (!(telemetryData instanceof Array)) {
        throw new Error(`Malformed telemetry data: \n${JSON.stringify(telemetryData)}`);
    }
    return telemetryData;
};

const getTelemetryDataKeys = (data: Record<string, string | number>[]): Array<string> => {
    const keys = new Set<string>();
    data.forEach((record) => {
        Object.keys(record).forEach((key) => keys.add(key));
    });
    const arr: string[] = [];
    keys.forEach((key) => arr.push(key));
    return arr;
};

export const MongoTelemetryViewer: React.FunctionComponent = () => {
    const [data, setData] = useState<Record<string, string | number>[]>([]);
    const refreshData = () => {
        const query = qs.parse((window.location.search || "?").substr(1));
        const subset = query.subset as string;
        if (!subset) {
            return;
        }
        const newerThan = query.newerThan as string | undefined;
        fetchTelemetryData(subset, newerThan)
            .then((telemetryData) => setData(telemetryData))
            .catch(console.error);
    };
    useEffect(() => {
        refreshData();
    }, []);
    const dataKeys = getTelemetryDataKeys(data);
    return (
        <>
            <header>
                <h1>Telemetry</h1>
            </header>
            <main>
                <button onClick={() => refreshData()}>Refresh Data</button>
                <DataChart columns={dataKeys} data={data} />
                <DataTable columns={dataKeys} data={data} />
            </main>
        </>
    );
};
