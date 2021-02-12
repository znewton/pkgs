import { ConsoleLogger, ILoggerSettings, IConsoleLoggerSettings, IMongoLoggerSettings, MongoLogger } from "../loggers";

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
            collectionName: "",
        } as IMongoLoggerSettings,
    ] as ILoggerSettings[],
};
