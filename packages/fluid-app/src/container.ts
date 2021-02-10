import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import { FluidApp } from "./fluid-object";

import { IRequest } from "@fluidframework/core-interfaces";
import { IRuntimeFactory } from "@fluidframework/container-definitions";
import { Container, Loader } from "@fluidframework/container-loader";
import { IFluidResolvedUrl, IResolvedUrl, IUrlResolver } from "@fluidframework/driver-definitions";

import {
    ITokenProvider,
    ITokenResponse,
    RouterliciousDocumentServiceFactory,
} from "@fluidframework/routerlicious-driver";
import { ScopeType } from "@fluidframework/protocol-definitions";
import { ITelemetryBaseEvent, ITelemetryBaseLogger } from "@fluidframework/common-definitions";
import { generateToken } from "@fluidframework/server-services-client";

export const FluidAppContainerRuntimeFactory = new ContainerRuntimeFactoryWithDefaultDataStore(FluidApp.getFactory(), [
    [FluidApp.Name, Promise.resolve(FluidApp.getFactory())],
]);

export class InsecureRouterliciousTokenProvider implements ITokenProvider {
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

export class InsecureRouterliciousUrlResolver implements IUrlResolver {
    constructor(
        private readonly tokenProvider: ITokenProvider,
        private readonly tenantId: string,
        private readonly documentId: string,
        private readonly ordererUrl: string,
        private readonly storageUrl: string
    ) {}

    public async resolve(request: IRequest): Promise<IResolvedUrl> {
        let requestedUrl = request.url;
        if (!requestedUrl.includes("://")) {
            if (requestedUrl.startsWith("/")) {
                requestedUrl = `http://dummy:3000${request.url}`;
            } else {
                requestedUrl = `http://dummy:3000/${request.url}`;
            }
        }
        const reqUrl = new URL(requestedUrl);

        const token = await this.tokenProvider.fetchOrdererToken(this.tenantId, this.documentId);
        const fluidUrl = `fluid://${this.ordererUrl.replace(/https?:\/\//, "")}/${encodeURIComponent(
            this.tenantId
        )}/${encodeURIComponent(this.documentId)}${reqUrl.search ?? ""}`;

        const deltaStorageUrl = `${this.ordererUrl}/deltas/${encodeURIComponent(this.tenantId)}/${encodeURIComponent(
            this.documentId
        )}`;
        const storageUrl = `${this.storageUrl}/repos/${this.tenantId}`;
        const ordererUrl = this.ordererUrl;

        const response: IFluidResolvedUrl = {
            endpoints: {
                deltaStorageUrl,
                ordererUrl,
                storageUrl,
            },
            tokens: { jwt: token.jwt },
            type: "fluid",
            url: fluidUrl,
        };
        return response;
    }

    public async getAbsoluteUrl(resolvedUrl: IFluidResolvedUrl, relativeUrl: string): Promise<string> {
        if (resolvedUrl.type !== "fluid") throw Error("Invalid Resolved Url");

        return `${resolvedUrl.url}/${relativeUrl}`;
    }
}

export class SimpleRouterliciousTelemetryLogger implements ITelemetryBaseLogger {
    constructor(private readonly telemetryUrl: string) {}

    send(event: ITelemetryBaseEvent): void {
        if (!this.telemetryUrl) return;

        fetch(this.telemetryUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
        });
    }
}

export async function getR11sContainer(
    documentId: string,
    containerRuntimeFactory: IRuntimeFactory,
    createNew: boolean,
    tenantId: string,
    tenantSecret: string,
    ordererUrl: string,
    storageUrl: string,
    telemetryUrl: string
): Promise<Container> {
    const module = { fluidExport: containerRuntimeFactory };
    const codeLoader = { load: async () => module };

    const tokenProvider = new InsecureRouterliciousTokenProvider(tenantSecret);
    const documentServiceFactory = new RouterliciousDocumentServiceFactory(tokenProvider);
    const urlResolver = new InsecureRouterliciousUrlResolver(
        tokenProvider,
        tenantId,
        documentId,
        ordererUrl,
        storageUrl
    );
    const logger = new SimpleRouterliciousTelemetryLogger(telemetryUrl);

    const loader = new Loader({
        urlResolver,
        documentServiceFactory,
        codeLoader,
        logger,
    });

    let container: Container;

    if (createNew) {
        container = await loader.createDetachedContainer({ package: "no-dynamic-package", config: {} });
        await container.attach({ url: documentId });
    } else {
        container = await loader.resolve({ url: documentId });
        if (!container.existing) {
            throw new Error("Attempted to load a non-existing container");
        }
    }
    return container;
}
