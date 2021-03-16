import React, { useEffect } from "react";
import { FluidAppView } from "./fluid-object";
import { getContainer } from "./container";
import { clientConfig, telemetryConfig as clientTelemetryConfig } from "../../config/client.config";
import { startFluidApp, getOrSetDocIdLocationHash } from "../../utils";

export const CollabTextareaApp: React.FunctionComponent = () => {
    useEffect(() => {
        const { createNew, documentId } = getOrSetDocIdLocationHash(window);

        console.log({
            createNew,
            documentId,
            clientConfig,
        });

        const telemetryConfig = {
            endpoint: clientTelemetryConfig.endpoint,
            serviceName: FluidAppView.Name,
        };

        startFluidApp(createNew, documentId, clientConfig, telemetryConfig, getContainer).catch((e) => {
            console.error(e);
        });
    }, []);

    return <div id="content"></div>;
};
