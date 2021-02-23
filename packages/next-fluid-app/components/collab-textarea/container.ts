import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import { Container } from "@fluidframework/container-loader";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";

import { FluidAppView } from "./fluid-object";
import {
    getFluidContainer,
    FluidTelemetryLogger,
    SimpleRouterliciousUrlResolver,
    ITelemetryServiceConfig,
    IFluidClientConfig,
} from "@znewton/fluid-utils";
import { SimpleRouterliciousTokenProvider } from "../../utils";

export const FluidAppContainerRuntimeFactory = new ContainerRuntimeFactoryWithDefaultDataStore(
    FluidAppView.getFactory(),
    [[FluidAppView.Name, Promise.resolve(FluidAppView.getFactory())]]
);

export async function getContainer(
    documentId: string,
    createNew: boolean,
    fluidServiceConfig: IFluidClientConfig,
    telemetryServiceConfig: ITelemetryServiceConfig
): Promise<Container> {
    const tokenProvider = new SimpleRouterliciousTokenProvider("/api/token");
    const documentServiceFactory = new RouterliciousDocumentServiceFactory(tokenProvider);
    const urlResolver = new SimpleRouterliciousUrlResolver(
        tokenProvider,
        fluidServiceConfig.tenantId,
        documentId,
        fluidServiceConfig.ordererUrl,
        fluidServiceConfig.storageUrl
    );
    const logger = new FluidTelemetryLogger(fluidServiceConfig.tenantId, FluidAppView.Name, telemetryServiceConfig);

    return getFluidContainer(
        documentId,
        FluidAppContainerRuntimeFactory,
        documentServiceFactory,
        urlResolver,
        logger,
        createNew
    );
}
