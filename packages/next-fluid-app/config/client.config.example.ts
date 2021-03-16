import { IFluidClientConfig } from "@znewton/fluid-utils";

export const clientConfigs: { [key: string]: IFluidClientConfig } = {
    local: {
        tenantId: "fluid",
        ordererUrl: "http://localhost:3003",
        storageUrl: "http://localhost:3001",
    },
};

export const clientConfig = clientConfigs.local;

export const telemetryConfig: { endpoint: string } = {
    endpoint: "",
};
