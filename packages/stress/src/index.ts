import yargs from "yargs";
import { commandHandler } from "./commandHandler";
import * as http from "./http";

yargs
    .command(
        "http",
        "stress test an http endpoint",
        {
            url: { type: "string", alias: "u", demandOption: true },
            numRequests: { type: "number", alias: "n", demandOption: false, default: 1 },
            delayInMs: { type: "number", alias: "d", demandOption: false, default: 0 },
            verbose: { type: "boolean", alias: "v", demandOption: false, default: false },
        },
        (argv) => {
            commandHandler(async () => http.sendMany(argv.url, argv.numRequests, argv.delayInMs, argv.verbose))
                .then(console.log)
                .catch(console.error);
        }
    )
    .help().argv;
