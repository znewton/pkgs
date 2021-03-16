import Head from "next/head";
import React from "react";
import { MongoTelemetryViewer } from "../components";

const Telemetry: React.FunctionComponent = () => (
    <div>
        <Head>
            <title>Next.js Fluid App — Telemetry</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" href="https://unpkg.com/mvp.css" />
        </Head>
        <MongoTelemetryViewer />
    </div>
);

export default Telemetry;
