import sillyname from "sillyname";
import { start } from "./app";
import appConfig from "./config/config";

// Since this is a single page Fluid application we are generating a new document id
// if one was not provided
let createNew = false;
if (window.location.hash.length === 0) {
    createNew = true;
    window.location.hash = (sillyname() as string).toLowerCase().split(" ").join("");
}
const documentId = window.location.hash.substring(1);

start(createNew, documentId, appConfig).catch((e) => {
    console.error(e);
});
