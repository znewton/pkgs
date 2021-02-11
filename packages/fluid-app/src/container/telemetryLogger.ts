import { ITelemetryBaseEvent, ITelemetryBaseLogger } from "@fluidframework/common-definitions";
import stringifySafe from "json-stringify-safe";

interface IStampedTelemetryEvent extends ITelemetryBaseEvent {
    timestamp: number;
}

export class FluidTelemetryLogger implements ITelemetryBaseLogger {
    private readonly pendingEvents: IStampedTelemetryEvent[] = [];

    constructor(private readonly telemetryUrl: string, private readonly batchLimit = 1) {
        window.addEventListener("beforeunload", () => {
            this.sendPending();
        });
    }

    public send(event: ITelemetryBaseEvent): void {
        this.pendingEvents.push({
            ...event,
            timestamp: Date.now(),
        });
        if (this.pendingEvents.length >= this.batchLimit) {
            void this.sendPending();
        }
    }

    private async sendPending(): Promise<any> {
        if (!this.pendingEvents.length || !this.telemetryUrl) {
            return;
        }

        // retrieve and clear pending events
        const events = this.pendingEvents.splice(0, this.pendingEvents.length);
        return fetch(this.telemetryUrl, {
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
            });
    }
}