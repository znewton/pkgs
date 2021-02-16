import { ITokenProvider, ITokenResponse } from "@fluidframework/routerlicious-driver";
import { ScopeType } from "@fluidframework/protocol-definitions";
import { generateToken } from "@fluidframework/server-services-utils";

export class RouterliciousTokenProvider implements ITokenProvider {
    private readonly tokenCacheMap: Map<string, string> = new Map();

    constructor(private readonly key: string) {}

    public async fetchOrdererToken(tenantId: string, documentId: string, refresh = false): Promise<ITokenResponse> {
        return this.fetchToken("orderer", tenantId, documentId, refresh);
    }

    public async fetchStorageToken(tenantId: string, documentId: string, refresh = false): Promise<ITokenResponse> {
        return this.fetchToken("storage", tenantId, documentId, refresh);
    }

    private fetchToken(
        type: "orderer" | "storage",
        tenantId: string,
        documentId: string,
        refresh: boolean
    ): ITokenResponse {
        const cacheKey = this.getTokenCacheKey(type, tenantId, documentId);
        const cachedToken = this.tokenCacheMap.get(cacheKey);
        let fromCache = true;
        let jwt: string;
        if (refresh || cachedToken === undefined) {
            jwt = this.getSignedToken(tenantId, documentId);
            fromCache = false;
        } else {
            jwt = cachedToken;
        }
        return {
            fromCache,
            jwt,
        };
    }

    private getTokenCacheKey(type: "orderer" | "storage", tenantId: string, documentId: string): string {
        return `${type}:${tenantId}:${documentId}`;
    }

    private getSignedToken(tenantId: string, documentId: string): string {
        return generateToken(tenantId, documentId, this.key, [
            ScopeType.DocRead,
            ScopeType.DocWrite,
            ScopeType.SummaryWrite,
        ]);
    }
}
