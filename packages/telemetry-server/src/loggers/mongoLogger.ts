import { Collection, MongoClient } from "mongodb";
import { ILoggerSettings, ILogger } from "./logger";

export interface IMongoLoggerSettings extends ILoggerSettings {
    connectionString: string;
    dbName: string;
    collectionName: string;
}

export class MongoLogger implements ILogger {
    private readonly connectionP: Promise<MongoClient>;

    constructor(private readonly settings: IMongoLoggerSettings) {
        this.connectionP = MongoClient.connect(settings.connectionString);
    }

    public async log(data: unknown): Promise<void> {
        const collection = await this.getCollection();
        await collection.insertOne(data);
    }

    public async logMany(data: unknown[]): Promise<void> {
        const collection = await this.getCollection();
        await collection.insertMany(data);
    }

    private async getCollection(): Promise<Collection<any>> {
        const client = await this.connectionP;
        const db = client.db(this.settings.dbName);
        return db.collection(this.settings.collectionName);
    }
}
