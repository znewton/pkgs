import Axios from "axios";
import { stagger } from "@znewton/utils";

export async function sendMany(
    url: string,
    numRequests: number,
    delayInMs = 0,
    verbose = false
): Promise<{ successCodes: number[]; failureCodes: number[] }> {
    const successCodes: number[] = [];
    const failureCodes: number[] = [];
    const requestPromises: Promise<void>[] = [];
    await stagger(numRequests, delayInMs, () => {
        requestPromises.push(
            Axios.get(url).then(
                (response) => {
                    if (verbose) {
                        console.log(`🟢 ${response.status} ${response.statusText}`);
                    }
                    successCodes.push(response.status);
                },
                (reason) => {
                    if (reason && reason.response) {
                        if (verbose) {
                            console.log(`🔴 ${reason.response.status} ${reason.response.statusText}`);
                            console.log(reason.response.data);
                        }
                        failureCodes.push(reason.response.status);
                    } else {
                        console.error(reason || "Failed");
                        failureCodes.push(-1);
                    }
                }
            )
        );
    });

    await Promise.allSettled(requestPromises).catch(console.error);

    return {
        successCodes,
        failureCodes,
    };
}
