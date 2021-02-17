import { IServerConfig } from "./types";

const configs: { [key: string]: IServerConfig } = {
    local: {
        tenantId: "fluid",
        tenantSecret: "create-new-tenants-if-going-to-production",
        ordererUrl: "http://localhost:3003",
        storageUrl: "http://localhost:3001",
    },
};

export default configs.local;
