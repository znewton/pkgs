import React from "react";
import { CollaborativeTextArea } from "@fluidframework/react-inputs";
import { SharedString } from "@fluidframework/sequence";

interface ICollabAreaProps {
    text: SharedString;
}

export const CollabArea: React.FunctionComponent<ICollabAreaProps> = (props: ICollabAreaProps) => {
    return (
        <div className="collab-area">
            <CollaborativeTextArea sharedString={props.text} />
        </div>
    );
};
