import Head from "next/head";
import React from "react";
import { FluidApp } from "../components/fluid-app";

const Home: React.FunctionComponent = () => (
    <div>
        <Head>
            <title>Next.js Fluid App</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        Hello, World!
        <FluidApp />
    </div>
);

export default Home;
