import "@tiptap/extension-text-style";

import { Extension } from "@tiptap/core";

export type LetterSpacingOptions = {
  /**
   * A list of node names where the letter spacing can be applied.
   * @default ['textStyle']
   * @example ['heading', 'paragraph']
   */
  types: string[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    letterSpacing: {
      /**
       * Set the letter spacing
       * @param letterSpacing The letter spacing
       * @example editor.commands.setLetterSpacing('Arial')
       */
      setLetterSpacing: (letterSpacing: string) => ReturnType;
      /**
       * Unset the letter spacing
       * @example editor.commands.unsetLetterSpacing()
       */
      unsetLetterSpacing: () => ReturnType;
    };
  }
}

declare module "@tiptap/extension-text-style" {
  interface TextStyleAttributes {
    fontWeight?: string | null;
  }
}

/**
 * This extension allows you to set a letter spacing for text.
 * @see https://www.tiptap.dev/api/extensions/font-weight
 */
export const LetterSpacing = Extension.create<LetterSpacingOptions>({
  name: "letterSpacing",

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
          letterSpacing: {
            default: null,
            parseHTML: (element) => element.style.letterSpacing,
            renderHTML: (attributes) => {
              if (!attributes.letterSpacing) {
                return {};
              }

              return {
                style: `letter-spacing: ${attributes.letterSpacing}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLetterSpacing:
        (letterSpacing) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { letterSpacing }).run();
        },
      unsetLetterSpacing:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { letterSpacing: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
