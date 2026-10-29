import { Fragment, Slice, type Node } from "@tiptap/pm/model";
import { fontFamilyOptions, MAX_FONT_SIZE, MIN_FONT_SIZE } from "./data";

const supportedFonts = new Map(
  fontFamilyOptions.map(({ value }) => [value.toLowerCase(), value]),
);

function normaliseFontFamily(value: string) {
  const candidates = value
    .split(",")
    .map((font) => font.replace(/["']/g, "").trim());

  for (const candidate of candidates) {
    const supported = supportedFonts.get(candidate.toLowerCase());

    if (supported) {
      return supported;
    }
  }

  return null;
}

function normaliseFontSize(value: string) {
  const match = value.trim().match(/^([\d.]+)(px|pt)?$/i);

  if (!match) {
    return null;
  }

  let size = Number(match[1]);
  const unit = match[2]?.toLowerCase();

  if (!Number.isFinite(size)) {
    return null;
  }

  // CSS conversion: 1pt = 96 / 72 px
  if (unit === "pt") {
    size *= 96 / 72;
  }

  size = Math.round(size);

  if (size < MIN_FONT_SIZE || size > MAX_FONT_SIZE) {
    return null;
  }

  return `${size}px`;
}

function normaliseFontWeight(value: string) {
  if (value === "normal") return "400";
  if (value === "bold") return "700";

  const weight = Number(value);

  if (!Number.isFinite(weight)) {
    return null;
  }

  const supported = [400, 500, 600, 700];

  return supported
    .reduce((closest, current) =>
      Math.abs(current - weight) < Math.abs(closest - weight)
        ? current
        : closest,
    )
    .toString();
}

export function normalisePastedHTML(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");

  // Google Docs wraps the whole clipboard in <b style="font-weight:normal">.
  // Unwrap bold tags that declare a non-bold weight; once "normal" is
  // normalised to "400" below, Tiptap would otherwise treat them as bold.
  doc.body.querySelectorAll<HTMLElement>("b, strong").forEach((element) => {
    const fontWeight = element.style.fontWeight;
    const normalised = fontWeight ? normaliseFontWeight(fontWeight) : null;

    if (normalised && Number(normalised) <= 400) {
      element.replaceWith(...Array.from(element.childNodes));
    }
  });

  doc.body.querySelectorAll<HTMLElement>("*").forEach((element) => {
    const fontFamily = element.style.fontFamily;
    const fontSize = element.style.fontSize;
    const fontWeight = element.style.fontWeight;

    if (fontFamily) {
      const normalised = normaliseFontFamily(fontFamily);

      if (normalised) {
        element.style.fontFamily = normalised;
      } else {
        element.style.removeProperty("font-family");
      }
    }

    if (fontSize) {
      const normalised = normaliseFontSize(fontSize);

      if (normalised) {
        element.style.fontSize = normalised;
      } else {
        element.style.removeProperty("font-size");
      }
    }

    if (fontWeight) {
      const normalised = normaliseFontWeight(fontWeight);

      if (normalised) {
        element.style.fontWeight = normalised;
      } else {
        element.style.removeProperty("font-weight");
      }
    }

    // These currently don't have useful matching option sets in the editor.
    element.style.removeProperty("letter-spacing");
    element.style.removeProperty("line-height");

    element.removeAttribute("class");
    element.removeAttribute("id");

    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name.startsWith("data-")) {
        element.removeAttribute(attribute.name);
      }
    }

    if (!element.getAttribute("style")?.trim()) {
      element.removeAttribute("style");
    }
  });

  return doc.body.innerHTML;
}

function hasBoldWeight(node: Node) {
  return node.marks.some(
    (mark) =>
      mark.type.name === "textStyle" && Number(mark.attrs.fontWeight) > 400,
  );
}

function dropRedundantBold(fragment: Fragment): Fragment {
  const nodes: Node[] = [];

  fragment.forEach((node) => {
    if (node.isText) {
      nodes.push(
        hasBoldWeight(node)
          ? node.mark(node.marks.filter((mark) => mark.type.name !== "bold"))
          : node,
      );
    } else {
      nodes.push(node.copy(dropRedundantBold(node.content)));
    }
  });

  return Fragment.from(nodes);
}

// Tiptap's Bold also turns inline font-weight >= 500 into a <strong> on top of
// the textStyle weight, which renders heavier than the source and hides the
// real weight from the Text panel. Keep only the weight in that case.
export function normalisePastedSlice(slice: Slice) {
  return new Slice(
    dropRedundantBold(slice.content),
    slice.openStart,
    slice.openEnd,
  );
}
