import Head from "next/head";
import React from "react";
import { ProseEditorApp } from "../components";

const Home: React.FunctionComponent = () => (
    <div>
        <Head>
            <title>Next.js Fluid App - Prose Editor</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <ProseEditorApp />
    </div>
);

export default Home;
