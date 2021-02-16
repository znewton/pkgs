import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import { IRuntimeFactory } from "@fluidframework/container-definitions";
import { Container, Loader } from "@fluidframework/container-loader";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";

import { FluidApp } from "../fluid-object";
import { InsecureRouterliciousTokenProvider } from "./tokenProvider";
import { InsecureRouterliciousUrlResolver } from "./urlResolver";
import { ITelemetryBaseLogger } from "@fluidframework/common-definitions";

export interface IFluidServiceConfig {
    tenantId: string;
    tenantSecret: string;
    ordererUrl: string;
    storageUrl: string;
}

export const FluidAppContainerRuntimeFactory = new ContainerRuntimeFactoryWithDefaultDataStore(FluidApp.getFactory(), [
    [FluidApp.Name, Promise.resolve(FluidApp.getFactory())],
]);

export async function getFluidContainer(
    documentId: string,
    containerRuntimeFactory: IRuntimeFactory,
    logger: ITelemetryBaseLogger,
    createNew: boolean,
    config: IFluidServiceConfig
): Promise<Container> {
    const module = { fluidExport: containerRuntimeFactory };
    const codeLoader = { load: async () => module };

    const tokenProvider = new InsecureRouterliciousTokenProvider(config.tenantSecret);
    const documentServiceFactory = new RouterliciousDocumentServiceFactory(tokenProvider);
    const urlResolver = new InsecureRouterliciousUrlResolver(
        tokenProvider,
        config.tenantId,
        documentId,
        config.ordererUrl,
        config.storageUrl
    );

    const loader = new Loader({
        urlResolver,
        documentServiceFactory,
        codeLoader,
        logger,
    });

    let container: Container;

    if (createNew) {
        container = await loader.createDetachedContainer({ package: "no-dynamic-package", config: {} });
        await container.attach({ url: documentId });
    } else {
        container = await loader.resolve({ url: documentId });
        if (!container.existing) {
            throw new Error("Attempted to load a non-existing container");
        }
    }
    return container;
}
