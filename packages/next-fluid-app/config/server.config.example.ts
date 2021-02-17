import { IServerConfig } from "./types";

const config: IServerConfig = {
    tenantId: "fluid",
    tenantSecret: "create-new-tenants-if-going-to-production",
    ordererUrl: "http://localhost:3003",
    storageUrl: "http://localhost:3001",
};

export default config;
