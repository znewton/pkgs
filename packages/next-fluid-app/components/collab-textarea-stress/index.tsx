import React, { useEffect } from "react";
import { FluidAppView } from "./fluid-object";
import { getContainer } from "./container";
import { clientConfig } from "../../config/client.config";
import { startFluidApp, getOrSetDocIdLocationHash } from "../../utils";

export const CollabTextareaStressApp: React.FunctionComponent = () => {
    useEffect(() => {
        const { createNew, documentId } = getOrSetDocIdLocationHash(window);

        console.log({
            createNew,
            documentId,
            clientConfig,
        });

        const telemetryConfig = {
            endpoint: "/api/log",
            serviceName: `${FluidAppView.Name}_CollabTextareaStress`,
        };

        startFluidApp(createNew, documentId, clientConfig, telemetryConfig, getContainer).catch((e) => {
            console.error(e);
        });
    }, []);

    return <div id="content"></div>;
};
