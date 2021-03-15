import { IFluidServiceConfig } from "@znewton/fluid-utils";
import {
    ConsoleLogger,
    IConsoleLoggerSettings,
    ILoggerSettings,
    IMongoLoggerSettings,
    MongoLogger,
} from "@znewton/telemetry-loggers";

const serviceConfigs: { [key: string]: IFluidServiceConfig } = {
    local: {
        tenantId: "fluid",
        tenantSecret: "create-new-tenants-if-going-to-production",
        ordererUrl: "http://localhost:3003",
        storageUrl: "http://localhost:3001",
    },
};

export const serviceConfig = serviceConfigs.local;

export const telemetryConfig: { loggers: ILoggerSettings[] } = {
    loggers: [
        {
            enabled: true,
            name: ConsoleLogger.name,
        } as IConsoleLoggerSettings,
        {
            enabled: true,
            name: MongoLogger.name,
            connectionString: "",
            dbName: "",
            collectionNamePrefix: "",
            logSubsetField: "",
        } as IMongoLoggerSettings,
    ],
};
