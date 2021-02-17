import { ITelemetryServiceConfig, IInsecureFluidServiceConfig } from "@znewton/fluid-utils";

export interface IAppConfig {
    fluidService: IInsecureFluidServiceConfig;
    telemetryService: ITelemetryServiceConfig;
}
