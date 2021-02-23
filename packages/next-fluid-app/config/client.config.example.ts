import { IFluidClientConfig } from "@znewton/fluid-utils";

export const configs: { [key: string]: IFluidClientConfig } = {
    local: {
        tenantId: "fluid",
        ordererUrl: "http://localhost:3003",
        storageUrl: "http://localhost:3001",
    },
};

export default configs.local;
