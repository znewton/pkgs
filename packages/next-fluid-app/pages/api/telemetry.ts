import { IMongoLoggerSettings, MongoLogger, MongoTelemetryBase } from "@znewton/telemetry-loggers";
import type { NextApiRequest, NextApiResponse } from "next";
import { telemetryConfig } from "../../config/server.config";

const mongoConfig: IMongoLoggerSettings | undefined = telemetryConfig.loggers.find(
    (loggerSettings) => loggerSettings.name === MongoLogger.name
) as IMongoLoggerSettings;

const mongoTelemetryBase = new MongoTelemetryBase(mongoConfig);

const ONE_SECOND_IN_MS = 1000;
const ONE_MINUTE_IN_MS = 60 * ONE_SECOND_IN_MS;
const ONE_HOUR_IN_MS = 60 * ONE_MINUTE_IN_MS;
const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;
const parseDateStr = (dateStr: string): number => {
    const daysRegex = new RegExp(/[\d.]+d/);
    const days = Number.parseFloat((daysRegex.exec(dateStr) || ["0d"])[0].slice(0, -1));
    const hoursRegex = new RegExp(/[\d.]+h/);
    const hours = Number.parseFloat((hoursRegex.exec(dateStr) || ["0h"])[0].slice(0, -1));
    const minutesRegex = new RegExp(/[\d.]+m/);
    const minutes = Number.parseFloat((minutesRegex.exec(dateStr) || ["0m"])[0].slice(0, -1));
    const secondsRegex = new RegExp(/[\d.]+s/);
    const seconds = Number.parseFloat((secondsRegex.exec(dateStr) || ["0s"])[0].slice(0, -1));

    return days * ONE_DAY_IN_MS - hours * ONE_HOUR_IN_MS - minutes * ONE_MINUTE_IN_MS - seconds * ONE_SECOND_IN_MS;
};

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (!mongoConfig) {
        return res.status(500).send("No telemetry database attached");
    }
    const subset = req.query.subset as string;
    if (!subset) {
        return res.status(400).send("Must include subset query param");
    }
    let timeAgo: number | undefined = Date.now();
    const newerThan = req.query.newerThan as string | undefined;
    if (newerThan) {
        timeAgo = parseDateStr(newerThan);
    }
    const collection = await mongoTelemetryBase.getCollection(subset);
    const response = await collection.find({ timestamp: { $gte: Date.now() - timeAgo } }).toArray();
    res.status(200).json(response);
};

export default handler;
