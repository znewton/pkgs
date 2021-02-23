import React from "react";
import { CollaborativeInput } from "@fluidframework/react-inputs";
import { SharedString } from "@fluidframework/sequence";

interface ICollabAreaProps {
    text: SharedString;
}

export const CollabArea: React.FunctionComponent<ICollabAreaProps> = (props: ICollabAreaProps) => {
    return (
        <div className="collab-area">
            <CollaborativeInput sharedString={props.text} />
        </div>
    );
};
