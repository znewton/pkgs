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
