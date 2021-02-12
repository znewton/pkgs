import { ILoggerSettings, ILogger } from "./logger";

export type IConsoleLoggerSettings = ILoggerSettings;

export class ConsoleLogger implements ILogger {
    public async log(data: unknown): Promise<void> {
        console.log(data);
    }
    public async logMany(data: unknown[]): Promise<void> {
        data.forEach(console.log);
    }
}
