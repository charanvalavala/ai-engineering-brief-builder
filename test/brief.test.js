import test from "node:test";
import assert from "node:assert/strict";
import { buildBrief, readiness } from "../src/brief.js";

test("readiness counts only populated required fields", () => {
  assert.deepEqual(readiness({ project: "api", goal: "", criteria: "done", verification: "test" }), { complete: 3, total: 4, percent: 75 });
});

test("brief is structured and makes criteria checkable", () => {
  const result = buildBrief({ project: "api", goal: "Add safe retries", criteria: "Returns after success\n- Never retries invalid input", verification: "npm test\nManual timeout check", constraints: "Keep the public API stable" });
  assert.match(result, /^# api — implementation brief/);
  assert.match(result, /- \[ \] Returns after success/);
  assert.match(result, /- \[ \] Never retries invalid input/);
  assert.match(result, /npm test/);
  assert.match(result, /Keep the public API stable/);
  assert.match(result, /Only report measurements and checks that were actually run\./);
});

test("brief refuses incomplete required fields", () => {
  assert.throws(() => buildBrief({ project: "api", goal: "work", criteria: "", verification: "test" }), /Complete project/);
});
