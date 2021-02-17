import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import { Container } from "@fluidframework/container-loader";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";

import { FluidApp } from "./fluid-object";
import { getFluidContainer, FluidTelemetryLogger, SimpleRouterliciousUrlResolver } from "@znewton/fluid-utils";
import { InsecureRouterliciousTokenProvider } from "./tokenProvider";
import { IAppConfig } from "./config";

export const FluidAppContainerRuntimeFactory = new ContainerRuntimeFactoryWithDefaultDataStore(FluidApp.getFactory(), [
    [FluidApp.Name, Promise.resolve(FluidApp.getFactory())],
]);

export async function getContainer(documentId: string, createNew: boolean, config: IAppConfig): Promise<Container> {
    const tokenProvider = new InsecureRouterliciousTokenProvider(config.fluidService.tenantSecret);
    const documentServiceFactory = new RouterliciousDocumentServiceFactory(tokenProvider);
    const urlResolver = new SimpleRouterliciousUrlResolver(
        tokenProvider,
        config.fluidService.tenantId,
        documentId,
        config.fluidService.ordererUrl,
        config.fluidService.storageUrl
    );
    const logger = new FluidTelemetryLogger(config.fluidService.tenantId, FluidApp.Name, config.telemetryService);

    return getFluidContainer(
        documentId,
        FluidAppContainerRuntimeFactory,
        documentServiceFactory,
        urlResolver,
        logger,
        createNew
    );
}
