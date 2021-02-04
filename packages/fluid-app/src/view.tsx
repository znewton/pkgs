import React from "react";
import { CollaborativeInput } from "@fluidframework/react-inputs";
import { SharedString } from "@fluidframework/sequence";

interface IFluidAppViewProps {
    text: SharedString;
}

export const FluidAppView = (props: IFluidAppViewProps) => {
    return (
        <div className="fluid-app">
            <CollaborativeInput sharedString={props.text} />
        </div>
    );
}
