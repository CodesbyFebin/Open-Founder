import { test } from "node:test";
import assert from "node:assert/strict";
import { computeGst, rupeesToPaise, paiseToRupeeString, buildUpiUri, MemoryReplayStore, verifyHmac, hmacSha256Hex, isValidGstin } from "./index.js";
test("paise", () => { assert.equal(rupeesToPaise("499.5"), 49950n); assert.equal(paiseToRupeeString(49950n), "499.50"); });
test("intra-state", () => {
    const r = computeGst([{ description: "x", quantity: 2, unitPricePaise: 10000n, gstRateBp: 1800 }], "32", "32");
    assert.equal(r.cgstPaise, 1800n);
    assert.equal(r.sgstPaise, 1800n);
    assert.equal(r.igstPaise, 0n);
    assert.equal(r.totalPaise, 23600n);
});
test("inter-state", () => {
    const r = computeGst([{ description: "x", quantity: 1, unitPricePaise: 10001n, gstRateBp: 500 }], "32", "29");
    assert.equal(r.igstPaise, 500n);
    assert.equal(r.cgstPaise, 0n);
});
test("upi uri", () => assert.match(buildUpiUri({ vpa: "shop@okaxis", payeeName: "Shop", amountPaise: 100n, txnRef: "T1" }), /am=1\.00/));
test("replay", async () => { const s = new MemoryReplayStore(); assert.ok(await s.claim("u")); assert.ok(!(await s.claim("u"))); });
test("hmac", () => { assert.ok(verifyHmac("k", "b", hmacSha256Hex("k", "b"))); assert.ok(!verifyHmac("k", "b", "00")); });
test("gstin", () => assert.ok(isValidGstin("32AABCU9603R1ZM")));
