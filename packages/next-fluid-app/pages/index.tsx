import Head from "next/head";
import React from "react";
import { CollabTextareaApp } from "../components";

const Home: React.FunctionComponent = () => (
    <div>
        <Head>
            <title>Next.js Fluid App — Textarea</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <CollabTextareaApp />
    </div>
);

export default Home;
