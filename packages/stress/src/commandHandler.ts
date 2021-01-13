export interface ICommandResult {
    successCodes: number[];
    failureCodes: number[];
}

export interface ICommandHandlerResult {
    successes: {
        count: number;
        codes: number[];
    };
    failures: {
        count: number;
        codes: number[];
    };
    duration: number;
}

export async function commandHandler(command: () => Promise<ICommandResult>): Promise<ICommandHandlerResult> {
    const timerStart = Date.now();
    const { successCodes, failureCodes } = await command();
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
