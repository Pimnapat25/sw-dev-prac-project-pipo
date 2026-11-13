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

test("countdown only for active rentals returning in 1-3 days", () => {
  assert.equal(rentalCountdown("2026-11-04", "2026-11-06", now), "Returns in 1 day");
  assert.equal(rentalCountdown("2026-11-04", "2026-11-08", now), "Returns in 3 days");
  assert.equal(rentalCountdown("2026-11-04", "2026-11-05", now), null);
  assert.equal(rentalCountdown("2026-11-04", "2026-11-09", now), null);
  assert.equal(rentalCountdown("2026-11-06", "2026-11-07", now), null);
  assert.equal(rentalCountdown("2026-11-01", "2026-11-02", now), null);
});
