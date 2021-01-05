/**
 * Run a `callback` function `count` times with `delay` milliseconds between each call.
 * Returns a Promise that resolves when loop is complete, or rejects if `callback` throws.
 *
 * @param count number of iterations
 * @param delay time in milliseconds between each iteration
 * @param callback action to perform on each iteration
 */
export async function stagger(count: number, delay: number, callback: () => void): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (!count) {
            resolve();
            return;
        }
        try {
            callback();
        } catch (e) {
            reject(e);
        }
        setTimeout(() => {
            stagger(count - 1, delay, callback).then(resolve);
        }, delay);
    });
}
