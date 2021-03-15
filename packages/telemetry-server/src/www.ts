import express, { ErrorRequestHandler, RequestHandler } from "express";
import safeStringify from "json-stringify-safe";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/config";
import { MultiLogger } from "@znewton/telemetry-loggers";

const create = async (): Promise<express.Application> => {
    const app = express();

    const multiLogger = new MultiLogger(config.loggers ?? []);

    app.use(cors({ origin: /http:\/\/localhost:.*/ }));
    app.use(cookieParser());
    app.use(bodyParser.json({ limit: 1000000 }));
    app.use(bodyParser.urlencoded({ limit: 1000000, extended: false }));

    app.post("/", async (req, res) => {
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
        logP.then(() => res.sendStatus(200)).catch(() => res.sendStatus(500));
    });

    // Catch 404 and forward to error handler
    const handle404s = (): RequestHandler => (req, res, next) => {
        const err = new Error("Not Found");
        (err as any).status = 404;
        next(err);
    };
    app.use(handle404s());

    // Error handlers
    const handleError = (): ErrorRequestHandler => (err, req, res) => {
        res.status(err.status || 500);
        res.json({ error: safeStringify(err), message: err.message });
    };
    app.use(handleError());

    return app;
};

create().then((app) => {
    const port = process.env.PORT || 6060;
    app.listen(port, () => {
        console.log(`Telemetry Server: Listening on port ${port}`);
    });
});
