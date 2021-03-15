import { NextApiRequest, NextApiResponse } from "next";
import { MultiLogger } from "@znewton/telemetry-loggers";
import { telemetryConfig } from "../../config/server.config";

const multiLogger = new MultiLogger(telemetryConfig.loggers ?? []);

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
    const logBody = req.body;
    if (!logBody) {
        return res.status(400).send("Empty request body");
    }
    let logP;
    if (logBody instanceof Array) {
        logP = multiLogger.logMany(logBody);
    } else {
        logP = multiLogger.log(logBody);
    }
    logP.then(() => res.status(200).send("OK")).catch(() => res.status(500).send("Server Error"));
};

export default handler;
