import assert from "assert";
import { stagger } from "../stagger";

describe("stagger()", () => {
    it("counts with delay", async () => {
        const reps = 5;
        const delay = 50;
        let count = 0;
        const startTimer = Date.now();
        await stagger(reps, delay, () => {
            count++;
        });
        const endTimer = Date.now();
        assert.strictEqual(count, 5);
        assert.ok(endTimer - startTimer > reps * delay);
    });
});
