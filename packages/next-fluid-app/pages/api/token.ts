import { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "@fluidframework/server-services-utils";
import { ScopeType } from "@fluidframework/protocol-definitions";
import { serviceConfig } from "../../config/server.config";

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
    const tenantId = req.query.tenantId as string;
    const documentId = req.query.documentId as string;
    const scopes = req.query.scopes as ScopeType[];
    if (!tenantId || !documentId) {
        return res.status(400).send("Must provide tenantId and documentId");
    }
    if (tenantId !== serviceConfig.tenantId) {
        return res.status(400).send("Invalid tenantId");
    }
    const token = generateToken(tenantId, documentId, serviceConfig.tenantSecret, scopes || []);
    res.status(200).send(token);
};

export default handler;
