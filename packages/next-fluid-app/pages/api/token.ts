import { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "@fluidframework/server-services-utils";
import { ScopeType } from "@fluidframework/protocol-definitions";
import defaultServerConfig, { configs as serverConfigs } from "../../config/server.config";
import { IServerConfig } from "../../config";

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
    // decide what config to use
    let config: IServerConfig = defaultServerConfig;
    const configParam = req.query.config as string;
    if (configParam && serverConfigs[configParam]) {
        config = serverConfigs[configParam];
    }

    const tenantId = req.query.tenantId as string;
    const documentId = req.query.documentId as string;
    const scopes = req.query.scopes as ScopeType[];
    if (!tenantId || !documentId) {
        res.status(400).send("Must provide tenantId and documentId");
        return;
    }
    if (tenantId !== config.tenantId) {
        res.status(400).send("Invalid tenantId");
        return;
    }
    const token = generateToken(tenantId, documentId, config.tenantSecret, scopes || []);
    res.status(200).send(token);
};

export default handler;
