import { NextApiRequest, NextApiResponse } from "next";
import { MultiLogger } from "@znewton/telemetry-loggers";
import { telemetryConfig } from "../../config/server.config";

const multiLogger = new MultiLogger(telemetryConfig.loggers ?? []);

const handler = (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const logBody = req.body;
    if (!logBody) {
        return Promise.resolve(res.status(400).send("Empty request body"));
    }
    let logP: Promise<void>;
    if (logBody instanceof Array) {
        logP = multiLogger.logMany(logBody);
    } else {
        logP = multiLogger.log(logBody);
    }
    return logP.then(() => res.status(200).send("OK")).catch(() => res.status(500).send("Server Error"));
};

export default handler;
