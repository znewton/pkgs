import { RouterliciousTokenProvider } from "@znewton/fluid-utils";
import qs from "querystring";
import { ScopeType } from "@fluidframework/protocol-definitions";

export class SimpleRouterliciousTokenProvider extends RouterliciousTokenProvider {
    constructor(private readonly endpoint: string) {
        super();
    }

    protected async getSignedToken(tenantId: string, documentId: string): Promise<string> {
        const params = qs.encode({
            tenantId,
            documentId,
            scopes: [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite],
        });
        return fetch(`${this.endpoint}?${params}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Token call failed");
                }
                return response.text();
            })
            .catch((err) => {
                console.error("Failed to retrieve token", err);
                throw err;
            });
    }
}
