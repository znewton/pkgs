export interface ILoggerSettings {
    enabled: boolean;
    name: string;
}
export interface ILogger {
    log(data: unknown): Promise<void>;
}

export type IConsoleLoggerSettings = ILoggerSettings;
export class ConsoleLogger implements ILogger {
    public async log(data: unknown): Promise<void> {
        console.log(data);
    }
}

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
}
