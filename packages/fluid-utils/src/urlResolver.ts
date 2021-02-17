import { IRequest } from "@fluidframework/core-interfaces";
import { IFluidResolvedUrl, IResolvedUrl, IUrlResolver } from "@fluidframework/driver-definitions";
import { ITokenProvider } from "@fluidframework/routerlicious-driver";

export class SimpleRouterliciousUrlResolver implements IUrlResolver {
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
