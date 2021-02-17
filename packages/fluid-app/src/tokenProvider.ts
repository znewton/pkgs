import { ScopeType } from "@fluidframework/protocol-definitions";
import { generateToken } from "@fluidframework/server-services-client";
import { RouterliciousTokenProvider } from "@znewton/fluid-utils";

export class InsecureRouterliciousTokenProvider extends RouterliciousTokenProvider {
    constructor(private readonly key: string) {
        super();
    }

    protected async getSignedToken(tenantId: string, documentId: string): Promise<string> {
        return generateToken(tenantId, documentId, this.key, [
            ScopeType.DocRead,
            ScopeType.DocWrite,
            ScopeType.SummaryWrite,
        ]);
    }
}
