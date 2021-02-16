import { IAppConfig } from "../app";

const example: IAppConfig = {
    fluidService: {
        tenantId: "fluid",
        tenantSecret: "create-new-tenants-if-going-to-production",
        ordererUrl: "http://localhost:3003",
        storageUrl: "http://localhost:3001",
    },
    telemetryService: {
        endpoint: "",
        serviceName: "",
        batchLimit: 100,
        maxLogIntervalInMs: 60000,
    },
};

export default example;
