import test from "node:test";
import assert from "node:assert/strict";
import { parseJsonData } from "../../src/browser-data.ts";

test("parseJsonData accepts Vite-served JSON-shaped JavaScript with an inline source map", () => {
  const data = parseJsonData<{ name: string }[]>(
    '[\n  { "name": "brute" }\n]\n//# sourceMappingURL=data:application/json;base64,abc123',
  );

  assert.deepEqual(data, [{ name: "brute" }]);
});

test("parseJsonData still parses ordinary JSON", () => {
  assert.deepEqual(parseJsonData<number[]>("[1, 2, 3]"), [1, 2, 3]);
});
