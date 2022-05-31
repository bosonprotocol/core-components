import { sortObjKeys } from "../src/utils";

describe("#sortObjKeys()", () => {
  test("sort object keys", () => {
    const unsorted = {
      c: "c",
      b: "b",
      1: "1",
      a: "a",
      2: "2"
    };
    expect(sortObjKeys(unsorted)).toMatchObject({
      a: "a",
      b: "b",
      c: "c",
      1: "1",
      2: "2"
    });
  });
});
