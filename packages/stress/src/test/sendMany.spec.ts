import assert from "assert";
import Axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { sendMany } from "../sendMany";

const mockAxios = new AxiosMockAdapter(Axios);

describe("sendMany()", () => {
    beforeEach(() => {
        mockAxios.reset();
    });
    it("returns many 200s", async () => {
        const url = "http://test:1337/test";
        const count = 5;
        mockAxios.onGet(url).reply(200);
        const { successCodes, failureCodes } = await sendMany(url, count);
        assert.strictEqual(successCodes.length, count);
        assert.strictEqual(failureCodes.length, 0);
        successCodes.forEach((code) => {
            assert.strictEqual(code, 200);
        });
    });
    it("returns many 429s", async () => {
        const url = "http://test:1337/test";
        const count = 5;
        mockAxios.onGet(url).reply(429);
        const { successCodes, failureCodes } = await sendMany(url, count);
        assert.strictEqual(successCodes.length, 0);
        assert.strictEqual(failureCodes.length, count);
        successCodes.forEach((code) => {
            assert.strictEqual(code, 429);
        });
    });
    it("returns many different codes", async () => {
        const url = "http://test:1337/test";
        const codes = [200, 400, 201, 500, 429];
        const codeStack = [...codes];
        const count = codes.length;
        mockAxios.onGet(url).reply(() => [codeStack.pop() || 404]);
        const { successCodes, failureCodes } = await sendMany(url, count);
        assert.strictEqual(successCodes.length, 2);
        assert.strictEqual(failureCodes.length, 3);
        assert.ok(successCodes.includes(codes[0]));
        assert.ok(successCodes.includes(codes[2]));
        assert.ok(failureCodes.includes(codes[1]));
        assert.ok(failureCodes.includes(codes[3]));
        assert.ok(failureCodes.includes(codes[4]));
    });
});
