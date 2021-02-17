import { IClientConfig } from "./types";

export const configs: { [key: string]: IClientConfig } = {
    local: {
        tenantId: "fluid",
        ordererUrl: "http://localhost:3003",
        storageUrl: "http://localhost:3001",
    },
};

export default configs.local;
