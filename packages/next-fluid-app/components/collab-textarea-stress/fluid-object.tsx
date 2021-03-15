import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IFluidHTMLView } from "@fluidframework/view-interfaces";
import { SharedString } from "@fluidframework/sequence";
import { SharedMap } from "@fluidframework/map";
import { v4 as uuid } from "uuid";

import React from "react";
import ReactDOM from "react-dom";
import { IFluidHandle, IFluidLoadable, IFluidObject } from "@fluidframework/core-interfaces";
import { CollabArea } from "./collab-component";

type FluidKeyValue = { key: string; value: IFluidObject & IFluidLoadable };

export class FluidAppView extends DataObject implements IFluidHTMLView {
    private readonly mapKey = "mapKey";

    private map: SharedMap | undefined;
    private items: FluidKeyValue[] | undefined;

    public get IFluidHTMLView(): IFluidHTMLView {
        return this;
    }

    public static get Name(): string {
        return "@znewton/next-fluid-app";
    }

    private static readonly factory = new DataObjectFactory(
        FluidAppView.Name,
        FluidAppView,
        [SharedString.getFactory()],
        {}
    );

    public static getFactory(): DataObjectFactory<any, any, any, any> {
        return this.factory;
    }

    protected async initializingFirstTime(): Promise<void> {
        // Create the SharedString and store the handle in our SharedMap
        const map = SharedMap.create(this.runtime);
        this.root.set(this.mapKey, map.handle);
        for (let i = 0; i < 100; i++) {
            const text = SharedString.create(this.runtime);
            map.set(uuid(), text.handle);
        }
    }

    protected async hasInitialized(): Promise<void> {
        // Store the map if we are loading the first time or loading from existing
        this.map = await this.root.get<IFluidHandle<SharedMap>>(this.mapKey)?.get();
        if (this.map === undefined) {
            throw new Error("The SharedMap was not initialized correctly");
        }
        const itemPs: Promise<FluidKeyValue>[] = [];
        this.map.forEach((value, key) => {
            if (value.get) {
                itemPs.push(
                    (async () => {
                        const handle = await (value as IFluidHandle).get();
                        return { key, value: handle };
                    })()
                );
            }
        });

        this.items = await Promise.all(itemPs);
    }

    /**
     * Renders a new view into the provided div
     */
    public render(div: HTMLElement): HTMLElement {
        if (this.items === undefined) {
            throw new Error("The items were not initialized correctly");
        }

        ReactDOM.render(
            <>
                <button onClick={() => this.makeRandomChanges()}>Make Random Changes</button>
                <ol>
                    {this.items.map(({ key, value }) => {
                        if (value instanceof SharedString) {
                            return (
                                <li key={key}>
                                    <CollabArea text={value} />
                                </li>
                            );
                        }
                    })}
                </ol>
            </>,
            div
        );
        return div;
    }

    private makeRandomChanges() {
        const delayLoop = (count, callback, delay, index = 0) => {
            if (index >= count) return;
            setTimeout(() => {
                callback(index);
                delayLoop(count, callback, delay, index + 1);
            }, delay);
        };
        const inputs = document.getElementsByTagName("input");
        delayLoop(
            inputs.length,
            (i) => {
                const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                const input = inputs[i];
                delayLoop(
                    randomColor.length,
                    (j) => {
                        const char = randomColor[j];
                        input.focus();
                        input.value = char;
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                    },
                    200
                );
            },
            300
        );
    }
}
