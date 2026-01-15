import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import FontFamily from "@tiptap/extension-font-family";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { Extension, mergeAttributes } from "@tiptap/core";
import {
  Color,
  TextStyle,
  BackgroundColor,
  LineHeight,
} from "@tiptap/extension-text-style";
import FontWeight from "../tiptap-extensions/font-weight";
import LetterSpacing from "../tiptap-extensions/letter-spacing";

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
    };
  },
});

const CustomHeading = Heading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3, 10, 11],
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    if (node.attrs.level === 1) {
      return [
        "h1",
        mergeAttributes(HTMLAttributes, {
          style: "font-size: 18px; font-weight: 700;",
        }),
        0,
      ];
    }
    if (node.attrs.level === 2) {
      return [
        "h2",
        mergeAttributes(HTMLAttributes, {
          style: "font-size: 14px; font-weight: 700;",
        }),
        0,
      ];
    }
    if (node.attrs.level === 3) {
      return [
        "h3",
        mergeAttributes(HTMLAttributes, {
          style: "font-size: 12px; font-weight: 400;",
        }),
        0,
      ];
    }
    if (node.attrs.level === 10) {
      return [
        "span",
        mergeAttributes(HTMLAttributes, {
          style: "font-size: 48px; font-weight: 700;",
        }),
        0,
      ];
    }
    if (node.attrs.level === 11) {
      return [
        "span",
        mergeAttributes(HTMLAttributes, {
          style: "font-size: 24px; font-weight: 700;",
        }),
        0,
      ];
    }
    return this.parent?.({ node, HTMLAttributes });
  },

  parseHTML() {
    return [
      { tag: "span.title", attrs: { level: 10 } },
      { tag: "span.subtitle", attrs: { level: 11 } },
      ...((this.parent?.() as any[]) ?? []),
    ];
  },
});

const DefaultFontFamily = FontFamily.extend({
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontFamily: {
            default: "Inter",
            parseHTML: (el) => el.style.fontFamily || "Inter",
            renderHTML: (attrs) => {
              if (!attrs.fontFamily) return { style: "font-family: Inter" };
              return { style: `font-family: ${attrs.fontFamily}` };
            },
          },
        },
      },
    ];
  },
});

export const extensions = [
  StarterKit.configure({
    heading: false,
    bulletList: false,
    orderedList: false,
  }),
  TextStyle,
  DefaultFontFamily,
  FontSize,
  CustomHeading,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  Link,
  Color,
  BackgroundColor,
  FontWeight,
  LetterSpacing,
  LineHeight,
];
