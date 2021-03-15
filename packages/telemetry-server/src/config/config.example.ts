import {
    ConsoleLogger,
    ILoggerSettings,
    IConsoleLoggerSettings,
    IMongoLoggerSettings,
    MongoLogger,
} from "@znewton/telemetry-loggers";

export default {
    loggers: [
        {
            enabled: false,
            name: ConsoleLogger.name,
        } as IConsoleLoggerSettings,
        {
            enabled: false,
            name: MongoLogger.name,
            connectionString: "",
            dbName: "",
            collectionNamePrefix: "",
            logSubsetField: "",
        } as IMongoLoggerSettings,
    ] as ILoggerSettings[],
};
