import Head from "next/head";
import React from "react";
import { CollabTextareaStressApp } from "../components";

const Stress: React.FunctionComponent = () => (
    <div>
        <Head>
            <title>Next.js Fluid App — Textarea Stress</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <CollabTextareaStressApp />
    </div>
);

export default Stress;
