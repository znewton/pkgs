import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import { FluidApp } from "./fluid-object";
import { FluidAppContainerRuntimeFactory, getContainer } from "./container";
import { IAppConfig } from "./config";

// Re-export everything
export { FluidApp, FluidAppContainerRuntimeFactory };

/**
 * This is a helper function for loading the page. It's required because getting the Fluid Container
 * requires making async calls.
 */
export async function start(createNew: boolean, documentId: string, config: IAppConfig): Promise<void> {
    // Get the Fluid Container associated with the provided id
    const container = await getContainer(documentId, createNew, config);

    // Get the Default Object from the Container
    const defaultObject = await getDefaultObjectFromContainer<FluidApp>(container);

    // For now we will just reach into the FluidObject to render it
    const contentDiv = document.getElementById("content");
    if (contentDiv !== null) {
        defaultObject.render(contentDiv);
    }
}
