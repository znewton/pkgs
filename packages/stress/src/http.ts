import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { stagger } from "@znewton/utils";
import { ICommandResult } from "./commandHandler";

export interface HttpResponse {
    status: number;
    statusText: string;
    data: any;
    isSuccess: boolean;
}

function makeHttpRequest(url: string, method?: AxiosRequestConfig["method"]): Promise<HttpResponse> {
    const onSuccess = (response: AxiosResponse<any>): HttpResponse => {
        return {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            isSuccess: true,
        };
    };
    const onFailure = (reason: any): HttpResponse => {
        if (reason?.response) {
            const response: AxiosResponse<any> = reason.response;
            return {
                status: response.status,
                statusText: response.statusText,
                data: response.data,
                isSuccess: false,
            };
        }
        return {
            status: -1,
            statusText:
                typeof reason === "string" || typeof reason?.toString === "function" ? reason.toString() : "Failed",
            data: undefined,
            isSuccess: false,
        };
    };
    return Axios.request({
        method,
        url,
    }).then(onSuccess, onFailure);
}

export async function sendMany(
    url: string,
    numRequests: number,
    method: AxiosRequestConfig["method"] = "get",
    delayInMs = 0,
    verbose = false
): Promise<ICommandResult> {
    const successCodes: number[] = [];
    const failureCodes: number[] = [];
    const requestPromises: Promise<void>[] = [];
    await stagger(numRequests, delayInMs, () => {
        requestPromises.push(
            makeHttpRequest(url, method).then((httpResponse) => {
                if (verbose) {
                    console.log(
                        `${httpResponse.isSuccess ? "🟢" : "🔴"} ${httpResponse.status} ${httpResponse.statusText}`
                    );
                    console.log(httpResponse.data);
                }
                if (httpResponse.isSuccess) {
                    successCodes.push(httpResponse.status);
                } else {
                    failureCodes.push(httpResponse.status);
                }
            })
        );
    });

    await Promise.allSettled(requestPromises).catch(console.error);

    return {
        successCodes,
        failureCodes,
    };
}
