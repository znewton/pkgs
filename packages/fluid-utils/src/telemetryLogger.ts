import { ITelemetryBaseEvent, ITelemetryBaseLogger } from "@fluidframework/common-definitions";
import stringifySafe from "json-stringify-safe";

export interface ITelemetryServiceConfig {
    endpoint: string;
    serviceName: string;
    batchLimit?: number;
    maxLogIntervalInMs?: number;
}

interface ITelemetryEvent extends ITelemetryBaseEvent {
    tenantId: string;
    serviceName: string;
    appName: string;
    timestamp: number;
}

export class FluidTelemetryLogger implements ITelemetryBaseLogger {
    private readonly endpoint: string;
    private readonly serviceName: string;
    private readonly batchLimit: number;
    private readonly maxLogIntervalInMs: number;

    private readonly pendingEvents: ITelemetryEvent[] = [];
    private lastLogsSentAt: number = Date.now();

    constructor(private readonly tenantId: string, private readonly appName: string, config: ITelemetryServiceConfig) {
        this.endpoint = config.endpoint;
        this.serviceName = config.serviceName;
        this.batchLimit = config.batchLimit ?? 1;
        this.maxLogIntervalInMs = config.maxLogIntervalInMs ?? 1000000;

        window.addEventListener("beforeunload", () => {
            this.sendPending();
        });
    }

    public send(event: ITelemetryBaseEvent): void {
        this.pendingEvents.push({
            ...event,
            tenantId: this.tenantId,
            serviceName: this.serviceName,
            appName: this.appName,
            timestamp: Date.now(),
        });
        if (
            this.pendingEvents.length >= this.batchLimit ||
            Date.now() - this.lastLogsSentAt > this.maxLogIntervalInMs
        ) {
            void this.sendPending();
        }
    }

    private async sendPending(): Promise<any> {
        if (!this.pendingEvents.length || !this.endpoint) {
            return;
        }

        this.lastLogsSentAt = Date.now();
        // retrieve and clear pending events
        const events = this.pendingEvents.splice(0, this.pendingEvents.length);
        return fetch(this.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: stringifySafe(events),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Telemetry call failed: ${response.status} - ${response.statusText}`);
                }
            })
            .catch((error) => {
                console.error(error);
                // put events back in pending if call fails
                this.pendingEvents.push(...events);
            });
    }
}
