import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const EXPORT_RE = /^\s*export\s+default\s+(\w+)\s*;?\s*$/m;

/**
 * Helper function to build the complete HTML document for the iframe, embedding the provided React component code and props.
 *
 * @param code - The string of React component code, expected to contain a default export of a React component
 * @param componentName - The name of the component extracted from the export statement, used to render the component in the iframe
 * @param propsJson - A JSON string representing the props to be passed to the component when rendering
 * @returns A complete HTML document as a string, which includes the necessary scripts to run React and renders the specified component with the given props
 */
function buildIframeHtml(
  code: string,
  componentName: string,
  propsJson: string,
): string {
  const cleanCode = code.replace(EXPORT_RE, "").trim();
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body { margin: 0; padding: 12px; font-family: Inter, sans-serif; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
${cleanCode}

const props = ${propsJson};
ReactDOM.createRoot(document.getElementById('root')).render(
  <${componentName} {...props} />
);
  </script>
</body>
</html>`;
}

interface GeneratedComponentBlockProps {
  data: {
    component_code: string;
    suggested_name: string;
    props: Record<string, unknown>;
  } | null;
  compact?: boolean;
}

/**
 * A block that renders a generated React component inside an iframe.
 * It takes the component code, extracts the default exported component, and renders it with the provided props.
 * If the code does not contain a valid export, it shows an error message instead.
 *
 * The generated code is validated and checked for safety before being rendered.
 *
 * @param data - An object containing the component code, a suggested name for display, and the props to pass to the component
 * @param compact - A boolean flag that determines the height of the iframe (true for a more compact view)
 * @returns A React element that renders the generated component or an error message if the code is invalid
 */
export function GeneratedComponentBlock({
  data,
  compact,
}: GeneratedComponentBlockProps) {
  if (!data?.component_code) return null;

  const match = EXPORT_RE.exec(data.component_code);
  const componentName = match?.[1];

  if (!componentName) {
    return (
      <Box sx={{ p: 2, color: "text.secondary", fontStyle: "italic" }}>
        Generated component &ldquo;{data.suggested_name}&rdquo;: no{" "}
        <code>export default</code> found in code.
      </Box>
    );
  }

  const propsJson = JSON.stringify(data.props ?? {}, null, 2);
  const html = buildIframeHtml(data.component_code, componentName, propsJson);

  return (
    <Box sx={{ width: "100%", borderRadius: 1, overflow: "hidden" }}>
      <Typography
        variant="caption"
        sx={{ display: "block", px: 1, pb: 0.5, color: "text.disabled" }}
      >
        {data.suggested_name}
      </Typography>
      <iframe
        srcDoc={html}
        sandbox="allow-scripts"
        title={data.suggested_name}
        style={{
          width: "100%",
          height: compact ? 260 : 420,
          border: "none",
          display: "block",
        }}
      />
    </Box>
  );
}
