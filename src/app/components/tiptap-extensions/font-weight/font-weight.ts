import "@tiptap/extension-text-style";

import { Extension } from "@tiptap/core";

export type FontWeightOptions = {
  /**
   * A list of node names where the font Weight can be applied.
   * @default ['textStyle']
   * @example ['heading', 'paragraph']
   */
  types: string[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontWeight: {
      /**
       * Set the font Weight
       * @param fontWeight The font Weight
       * @example editor.commands.setFontWeight('Arial')
       */
      setFontWeight: (fontWeight: string) => ReturnType;
      /**
       * Unset the font Weight
       * @example editor.commands.unsetFontWeight()
       */
      unsetFontWeight: () => ReturnType;
    };
  }
}

declare module "@tiptap/extension-text-style" {
  interface TextStyleAttributes {
    fontWeight?: string | null;
  }
}

/**
 * This extension allows you to set a font Weight for text.
 * @see https://www.tiptap.dev/api/extensions/font-weight
 */
export const FontWeight = Extension.create<FontWeightOptions>({
  name: "fontWeight",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: (element) => element.style.fontWeight,
            renderHTML: (attributes) => {
              if (!attributes.fontWeight) {
                return {};
              }

              return {
                style: `font-weight: ${attributes.fontWeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontWeight:
        (fontWeight) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontWeight }).run();
        },
      unsetFontWeight:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontWeight: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
