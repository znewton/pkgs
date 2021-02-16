import { ITelemetryServiceConfig } from "@znewton/fluid-client-utils";

export interface IFluidServiceConfig {
    tenantId: string;
    tenantSecret: string;
    ordererUrl: string;
    storageUrl: string;
}

export interface IAppConfig {
    fluidService: IFluidServiceConfig;
    telemetryService: ITelemetryServiceConfig;
}
