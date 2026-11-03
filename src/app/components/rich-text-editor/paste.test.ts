import { normalisePastedHTML } from "./paste";

test("unwraps the Google Docs font-weight:normal wrapper so it isn't bold", () => {
  const html = normalisePastedHTML(
    `<b style="font-weight:normal;" id="docs-internal-guid-abc"><p><span style="font-weight:700">Bold</span><span>plain</span></p></b>`,
  );
  expect(html).toBe(
    `<p><span style="font-weight: 700;">Bold</span><span>plain</span></p>`,
  );
});
test.each([
  [`<b>Bold</b>`, `<b>Bold</b>`],
  [`<strong>Bold</strong>`, `<strong>Bold</strong>`],
  [
    `<b style="font-weight:bold">Bold</b>`,
    `<b style="font-weight: 700;">Bold</b>`,
  ],
  [`<b style="font-weight:bolder">Bold</b>`, `<b>Bold</b>`],
])("keeps bold tags that are actually bold: %s", (input, expected) => {
  expect(normalisePastedHTML(input)).toBe(expected);
});
