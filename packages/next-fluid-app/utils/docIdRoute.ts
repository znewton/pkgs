import sillyname from "sillyname";

export function getOrSetDocIdLocationHash(window: Window): { documentId: string; createNew: boolean } {
    let createNew = false;
    let hash = window.location.hash.split("?")[0];
    if (hash.length === 0) {
        createNew = true;
        hash = (sillyname() as string).toLowerCase().split(" ").join("");
        window.location.hash = hash;
    } else {
        hash = window.location.hash.substring(1);
    }
    const documentId = hash;
    return { documentId, createNew };
}
