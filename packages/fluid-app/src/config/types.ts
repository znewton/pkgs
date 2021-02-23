import { ITelemetryServiceConfig, IFluidServiceConfig } from "@znewton/fluid-utils";

export interface IAppConfig {
    fluidService: IFluidServiceConfig;
    telemetryService: ITelemetryServiceConfig;
}
