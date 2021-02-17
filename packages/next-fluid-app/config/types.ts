export interface IClientConfig {
    tenantId: string;
    ordererUrl: string;
    storageUrl: string;
}

export interface IServerConfig {
    tenantId: string;
    tenantSecret: string;
    ordererUrl: string;
    storageUrl: string;
}
