export interface ILoggerSettings {
    enabled: boolean;
    name: string;
}
export interface ILogger {
    log(data: unknown): Promise<void>;
    logMany(data: unknown[]): Promise<void>;
}
