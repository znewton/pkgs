import { IRuntimeFactory } from "@fluidframework/container-definitions";
import { Container, Loader } from "@fluidframework/container-loader";
import { ITelemetryBaseLogger } from "@fluidframework/common-definitions";
import { IUrlResolver, IDocumentServiceFactory } from "@fluidframework/driver-definitions";

export async function getFluidContainer(
    documentId: string,
    containerRuntimeFactory: IRuntimeFactory,
    documentServiceFactory: IDocumentServiceFactory,
    urlResolver: IUrlResolver,
    logger: ITelemetryBaseLogger,
    createNew: boolean
): Promise<Container> {
    const module = { fluidExport: containerRuntimeFactory };
    const codeLoader = { load: async () => module };

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
