import { ILoggerSettings, ILogger } from "./logger";
import { ConsoleLogger } from "./consoleLogger";
import { MongoLogger, IMongoLoggerSettings } from "./mongoLogger";

export class MultiLogger implements ILogger {
    private readonly loggers: ILogger[] = [];

    constructor(loggers: ILoggerSettings[]) {
        for (const loggerSettings of loggers) {
            if (!loggerSettings.enabled) {
                continue;
            }

            let logger: ILogger;
            switch (loggerSettings.name) {
                case ConsoleLogger.name:
                    logger = new ConsoleLogger();
                    break;
                case MongoLogger.name:
                    logger = new MongoLogger(loggerSettings as IMongoLoggerSettings);
                    break;
                default:
                    console.error(`Invalid Logger Name Provided: ${loggerSettings.name}`);
                    return;
            }
            this.loggers.push(logger);
        }
    }

    public async log(data: unknown): Promise<void> {
        const logPs: Promise<void>[] = [];
        this.loggers.forEach((logger) => {
            logPs.push(logger.log(data));
        });
        await Promise.all(logPs);
    }

    public async logMany(data: unknown[]): Promise<void> {
        const logPs: Promise<void>[] = [];
        this.loggers.forEach((logger) => {
            logPs.push(logger.logMany(data));
        });
        await Promise.all(logPs);
    }
}
