import { test } from "node:test";
import assert from "node:assert/strict";
import { encodeDescription, withIcon } from "../libs/equipmentIcon.ts";
import type { Equipment } from "../types/index.ts";

const item = (description: string) => ({ description }) as Equipment;

test("no icon leaves description unchanged", () => {
  assert.equal(encodeDescription("Two rackets."), "Two rackets.");
  assert.deepEqual(withIcon(item("Two rackets.")), item("Two rackets."));
});
test("icon round-trips through the description", () => {
  const e = withIcon(item(encodeDescription("Two rackets.", "racket")));
  assert.equal(e.description, "Two rackets.");
  assert.equal(e.icon, "racket");
});
test("re-encoding never doubles the marker", () => {
  assert.equal(encodeDescription("Hi\n[icon:drone]", "tent"), "Hi\n[icon:tent]");
});
