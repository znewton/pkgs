import { ITelemetryServiceConfig, IFluidClientConfig } from "@znewton/fluid-utils";
import { DataObject, getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import { Container } from "@fluidframework/container-loader";
import { IFluidHTMLView } from "@fluidframework/view-interfaces";

type ContainerFactory = (
    documentId: string,
    createNew: boolean,
    clientConfig: IFluidClientConfig,
    telemetryConfig: ITelemetryServiceConfig
) => Promise<Container>;

interface FluidHtmlViewDataObject extends DataObject, IFluidHTMLView {}

export async function startFluidApp<FluidAppView extends FluidHtmlViewDataObject>(
    createNew: boolean,
    documentId: string,
    clientConfig: IFluidClientConfig,
    telemetryConfig: ITelemetryServiceConfig,
    getContainer: ContainerFactory
): Promise<void> {
    // Get the Fluid Container associated with the provided id
    const container = await getContainer(documentId, createNew, clientConfig, telemetryConfig);

    container.addListener("connected", (clientId) => {
        console.log(`${clientId} connected`);
    });
    container.addListener("disconnected", () => {
        console.log("disconnected");
    });
    container.addListener("connect", (opsBehind) => {
        console.log(`Connected. ${opsBehind} Ops Behind`);
    });
    container.addListener("closed", (error) => {
        console.warn("Container closed");
        if (error) {
            console.error(error);
        }
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
