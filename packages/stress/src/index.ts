import yargs from "yargs";
import { sendMany } from "./sendMany";

const args = yargs.options({
    url: { type: "string", alias: "u", demandOption: true },
    numRequests: { type: "number", alias: "n", demandOption: false, default: 1 },
    delayInMs: { type: "number", alias: "d", demandOption: false, default: 0 },
    verbose: { type: "boolean", alias: "v", demandOption: false, default: false },
}).argv;

async function main() {
    const timerStart = Date.now();
    const { successCodes, failureCodes } = await sendMany(args.url, args.numRequests, args.delayInMs, args.verbose);
    const timerEnd = Date.now();

    return {
        successes: {
            count: successCodes.length,
            codes: successCodes,
        },
        failures: {
            count: failureCodes.length,
            codes: failureCodes,
        },
        duration: timerEnd - timerStart,
    };
}

main().then(console.log).catch(console.error);
