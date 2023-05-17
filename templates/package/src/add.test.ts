import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { add } from "./add";

describe("add", () => {
  it("should add parameters and return sum.", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(add(a, b)).toBe(a + b);
      })
    );
  });
});
