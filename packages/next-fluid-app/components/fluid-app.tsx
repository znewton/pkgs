import sillyname from "sillyname";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import React, { useEffect } from "react";
import { IClientConfig } from "../config";
import ClientConfig from "../config/client.config";
import { FluidAppView, getContainer } from "./fluid-app-view";

async function start(createNew: boolean, documentId: string, config: IClientConfig): Promise<void> {
    // Get the Fluid Container associated with the provided id
    const container = await getContainer(documentId, createNew, config, {
        endpoint: "/api/log",
        serviceName: FluidAppView.Name,
    });

    // Get the Default Object from the Container
    const defaultObject = await getDefaultObjectFromContainer<FluidAppView>(container);

    // For now we will just reach into the FluidObject to render it
    const contentDiv = document.getElementById("content");
    if (contentDiv !== null) {
        defaultObject.render(contentDiv);
    } else {
        console.error("Can't find content div");
    }
}

export const FluidApp: React.FunctionComponent = () => {
    useEffect(() => {
        // Since this is a single page Fluid application we are generating a new document id
        // if one was not provided
        let createNew = false;
        if (window.location.hash.length === 0) {
            createNew = true;
            window.location.hash = (sillyname() as string).toLowerCase().split(" ").join("");
        }
        const documentId = window.location.hash.substring(1);

        start(createNew, documentId, ClientConfig).catch((e) => {
            console.error(e);
        });
    }, []);

    return <div id="content"></div>;
};
