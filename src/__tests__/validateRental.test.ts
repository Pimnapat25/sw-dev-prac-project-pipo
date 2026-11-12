import { test } from "node:test";
import assert from "node:assert/strict";
import validateRental, { todayBangkok } from "../libs/validateRental.ts";

const now = new Date("2026-11-05T10:00:00Z");
const ok = { quantity: 1, startDate: "2026-11-05", returnDate: "2026-11-06" };

test("accepts valid input", () => assert.equal(validateRental(ok, 5, now), null));
test("accepts same-day rental", () =>
  assert.equal(validateRental({ ...ok, returnDate: "2026-11-05" }, 5, now), null));
test("rejects start in past", () =>
  assert.match(validateRental({ ...ok, startDate: "2026-11-04" }, 5, now)!, /past/));
test("rejects return before start", () =>
  assert.match(
    validateRental({ ...ok, startDate: "2026-11-07", returnDate: "2026-11-06" }, 5, now)!,
    /before/,
  ));
test("rejects more than 3", () =>
  assert.match(validateRental({ ...ok, quantity: 4 }, 10, now)!, /at most 3/));
test("rejects more than available", () =>
  assert.match(validateRental({ ...ok, quantity: 2 }, 1, now)!, /Only 1/));
test("allows exactly 7 days", () =>
  assert.equal(validateRental({ ...ok, returnDate: "2026-11-12" }, 5, now), null));
test("rejects over 7 days", () =>
  assert.match(validateRental({ ...ok, returnDate: "2026-11-13" }, 5, now)!, /7 days/));
test("uses the Bangkok day for today (UTC evening is already tomorrow)", () => {
  const lateUtc = new Date("2026-11-05T20:00:00Z"); // 2026-11-06 03:00 in Bangkok
  assert.match(validateRental(ok, 5, lateUtc)!, /past/);
  assert.equal(
    validateRental({ ...ok, startDate: "2026-11-06", returnDate: "2026-11-06" }, 5, lateUtc),
    null,
  );
});
test("todayBangkok rolls over at 17:00 UTC", () => {
  assert.equal(todayBangkok(new Date("2026-11-05T16:59:00Z")), "2026-11-05");
  assert.equal(todayBangkok(new Date("2026-11-05T17:00:00Z")), "2026-11-06");
});
