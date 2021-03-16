import { Collection, MongoClient } from "mongodb";
import { ILoggerSettings, ILogger } from "./logger";

export interface IMongoLoggerSettings extends ILoggerSettings {
    connectionString: string;
    dbName: string;
    collectionNamePrefix: string;
    logSubsetField?: string;
}

export class MongoTelemetryBase {
    public readonly connectionP: Promise<MongoClient>;
    public readonly logSubsetField: string;

    constructor(private readonly settings: IMongoLoggerSettings) {
        this.connectionP = MongoClient.connect(settings.connectionString, { useUnifiedTopology: true });
        this.logSubsetField = settings.logSubsetField || "eventName";
    }

    public async getCollection(subset: string): Promise<Collection<any>> {
        const client = await this.connectionP;
        const db = client.db(this.settings.dbName);
        const collectionName = this.getCollectionNameForSubset(subset);
        return db.collection(collectionName);
    }

    private getCollectionNameForSubset(subset: string): string {
        if (!this.settings.collectionNamePrefix) {
            return this.normalizeCollectionName(subset);
        }
        return this.normalizeCollectionName(`${this.settings.collectionNamePrefix}_${subset}`);
    }

    private normalizeCollectionName(name: string): string {
        return name.replace(/[ :/-]/g, "_").toLowerCase();
    }
}

export class MongoLogger implements ILogger {
    private readonly mongoTelemetryBase: MongoTelemetryBase;

    constructor(settings: IMongoLoggerSettings) {
        this.mongoTelemetryBase = new MongoTelemetryBase(settings);
    }

    public async log(data: unknown): Promise<void> {
        if (!data) return;
        const subset: string = this.getLogSubsetFromData(data);
        const collection = await this.mongoTelemetryBase.getCollection(subset);
        await collection.insertOne(data);
    }

    public async logMany(data: unknown[]): Promise<void> {
        const logSubsetMap: { [eventName: string]: unknown[] } = {};
        data.forEach((d) => {
            if (!d) return;
            const subset: string = this.getLogSubsetFromData(d);
            if (logSubsetMap[subset] instanceof Array) {
                logSubsetMap[subset].push(d);
            } else {
                logSubsetMap[subset] = [d];
            }
        });
        const writePs: Promise<void>[] = [];
        const insertManyLogs = async (subset: string): Promise<void> => {
            const collection = await this.mongoTelemetryBase.getCollection(subset);
            await collection.insertMany(logSubsetMap[subset]);
        };
        for (const eventName of Object.keys(logSubsetMap)) {
            writePs.push(insertManyLogs(eventName).catch(console.error));
        }
        await Promise.all(writePs);
    }

    private getLogSubsetFromData(data: unknown): string {
        return (data as any)[this.mongoTelemetryBase.logSubsetField] ?? "unknown";
    }
}
