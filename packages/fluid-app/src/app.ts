import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import sillyname from "sillyname";

import { FluidApp } from "./fluid-object";
import { FluidAppContainerRuntimeFactory, getR11sContainer } from "./container";
import appConfig from "./config/config";

// Re-export everything
export { FluidApp, FluidAppContainerRuntimeFactory };

// Since this is a single page Fluid application we are generating a new document id
// if one was not provided
let createNew = false;
if (window.location.hash.length === 0) {
    createNew = true;
    window.location.hash = (sillyname() as string).toLowerCase().split(" ").join("");
}
const documentId = window.location.hash.substring(1);

/**
 * This is a helper function for loading the page. It's required because getting the Fluid Container
 * requires making async calls.
 */
async function start() {
    // Get the Fluid Container associated with the provided id
    const container = await getR11sContainer(
        documentId,
        FluidAppContainerRuntimeFactory,
        createNew,
        appConfig.tenantId,
        appConfig.tenantSecret,
        appConfig.fluidUrls.orderer,
        appConfig.fluidUrls.storage,
        appConfig.telemetry.endpoint,
        appConfig.telemetry.batchLimit
    );

    // Get the Default Object from the Container
    const defaultObject = await getDefaultObjectFromContainer<FluidApp>(container);

    // For now we will just reach into the FluidObject to render it
    const contentDiv = document.getElementById("content");
    if (contentDiv !== null) {
        defaultObject.render(contentDiv);
    }
}

start().catch((e) => {
    console.error(e);
});
