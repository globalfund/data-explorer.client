// Keep Babel isolated from the Vite build. Vite's import.meta.env is supplied
// explicitly in tests; no developer .env files or production endpoints are read.
module.exports = require("babel-jest").createTransformer({
  babelrc: false,
  configFile: false,
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: [
    function ({ types: t }) {
      return {
        visitor: {
          MemberExpression(path) {
            const node = path.node;
            if (
              t.isMetaProperty(node.object) &&
              node.object.meta.name === "import" &&
              node.object.property.name === "meta" &&
              t.isIdentifier(node.property, { name: "env" })
            ) {
              path.replaceWith(
                t.memberExpression(
                  t.identifier("globalThis"),
                  t.identifier("__VITE_TEST_ENV__"),
                ),
              );
            }
          },
        },
      };
    },
  ],
});
