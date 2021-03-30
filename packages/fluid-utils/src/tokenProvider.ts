import type { ITokenProvider, ITokenResponse } from "@fluidframework/routerlicious-driver";

export abstract class RouterliciousTokenProvider implements ITokenProvider {
    private readonly tokenCacheMap: Map<string, string> = new Map();

    public async fetchOrdererToken(tenantId: string, documentId: string, refresh = false): Promise<ITokenResponse> {
        return this.fetchToken("orderer", tenantId, documentId, refresh);
    }

    public async fetchStorageToken(tenantId: string, documentId: string, refresh = false): Promise<ITokenResponse> {
        return this.fetchToken("storage", tenantId, documentId, refresh);
    }

    private async fetchToken(
        type: "orderer" | "storage",
        tenantId: string,
        documentId: string,
        refresh: boolean
    ): Promise<ITokenResponse> {
        const cacheKey = this.getTokenCacheKey(type, tenantId, documentId);
        const cachedToken = this.tokenCacheMap.get(cacheKey);
        let fromCache = true;
        let jwt: string;
        if (refresh || cachedToken === undefined) {
            jwt = await this.getSignedToken(tenantId, documentId);
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

    protected abstract getSignedToken(tenantId: string, documentId: string): Promise<string>;
}
