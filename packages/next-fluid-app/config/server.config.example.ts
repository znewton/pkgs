import { IFluidServiceConfig } from "@znewton/fluid-utils";

const configs: { [key: string]: IFluidServiceConfig } = {
    local: {
        tenantId: "fluid",
        tenantSecret: "create-new-tenants-if-going-to-production",
        ordererUrl: "http://localhost:3003",
        storageUrl: "http://localhost:3001",
    },
};

export default configs.local;
