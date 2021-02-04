import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IFluidHTMLView } from "@fluidframework/view-interfaces";
import { SharedString } from "@fluidframework/sequence";

import React from "react";
import ReactDOM from "react-dom";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { FluidAppView } from "../view";

export class FluidApp extends DataObject implements IFluidHTMLView {
    private readonly textKey = "textKey";

    private text: SharedString | undefined;

    public get IFluidHTMLView() { return this; }

    public static get Name() { return "@znewton/fluid-app"; }

    private static readonly factory = new DataObjectFactory(
        FluidApp.Name,
        FluidApp,
        [
            SharedString.getFactory(),
        ],
        {},
    );

    public static getFactory() { return this.factory; }

    protected async initializingFirstTime() {
        // Create the SharedString and store the handle in our root SharedDirectory
        const text = SharedString.create(this.runtime);
        this.root.set(this.textKey, text.handle);
    }

    protected async hasInitialized() {
        // Store the text if we are loading the first time or loading from existing
        this.text = await this.root.get<IFluidHandle<SharedString>>(this.textKey)?.get();
    }

    /**
     * Renders a new view into the provided div
     */
    public render(div: HTMLElement) {
        if (this.text === undefined) {
            throw new Error("The SharedString was not initialized correctly");
        }

        ReactDOM.render(
            <FluidAppView text={this.text} />,
            div,
        );
        return div;
    }
}

// Export the CollaborativeText factory as fluidExport for the dynamic component loading scenario
export const fluidExport = FluidApp.getFactory();
