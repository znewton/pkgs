import { ConsoleLogger, ILoggerSettings, IConsoleLoggerSettings } from "../logger";

export default {
    loggers: [
        {
            enabled: false,
            name: ConsoleLogger.name,
        } as IConsoleLoggerSettings,
    ] as ILoggerSettings[],
};
