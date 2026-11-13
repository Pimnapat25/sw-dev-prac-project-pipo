import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addDays,
  estimateTotal,
  rentalCountdown,
  rentalDays,
  rentalStatus,
} from "../libs/rentalInfo.ts";

const now = new Date("2026-11-05T10:00:00Z");

test("status is Upcoming before start", () =>
  assert.equal(rentalStatus("2026-11-06", "2026-11-08", now), "Upcoming"));
test("status is Active on start and return day", () => {
  assert.equal(rentalStatus("2026-11-05", "2026-11-08", now), "Active");
  assert.equal(rentalStatus("2026-11-03", "2026-11-05", now), "Active");
});
test("status is Past after return", () =>
  assert.equal(rentalStatus("2026-11-01", "2026-11-04T00:00:00.000Z", now), "Past"));
test("same-day rental counts as one day", () =>
  assert.equal(estimateTotal(2, 100, "2026-11-05", "2026-11-05"), 200));
test("total is qty x rate x days", () => {
  assert.equal(rentalDays("2026-11-05", "2026-11-08"), 3);
  assert.equal(estimateTotal(2, 50, "2026-11-05", "2026-11-08"), 300);
});
test("addDays crosses month boundaries", () =>
  assert.equal(addDays("2026-11-28", 7), "2026-12-05"));

test("countdown wording", () => {
  assert.deepEqual(rentalCountdown("2026-11-08", "2026-11-09", now), { label: "Starts in 3 days", urgent: false });
  assert.deepEqual(rentalCountdown("2026-11-06", "2026-11-09", now), { label: "Starts tomorrow", urgent: false });
  assert.deepEqual(rentalCountdown("2026-11-04", "2026-11-05", now), { label: "Returns today", urgent: true });
  assert.deepEqual(rentalCountdown("2026-11-04", "2026-11-06", now), { label: "Returns tomorrow", urgent: true });
  assert.deepEqual(rentalCountdown("2026-11-04", "2026-11-10", now), { label: "Returns in 5 days", urgent: false });
  assert.deepEqual(rentalCountdown("2026-11-01", "2026-11-02", now), { label: "Ended 3 days ago", urgent: false });
});
