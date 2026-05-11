#!/usr/bin/env node
/**
 * extract_component_manifest.ts
 *
 * Generates data/project-config/component-manifest.json by parsing every
 * Storybook story file (src/**\/*.stories.tsx) and the component source files
 * they reference.
 *
 * Run:  npx tsx extract_component_manifest.ts
 * Deps: npx tsx (zero-install runner) + ts-morph (install once, see README)
 */

import { InterfaceDeclaration, Node, Project, SourceFile } from "ts-morph";
import * as fs from "fs";
import * as path from "path";
import { globSync } from "glob";

// Paths
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const SRC_DIR = path.join(ROOT, "src");
const OUTPUT_PATH = path.join(
  ROOT,
  "data",
  "project-config",
  "component-manifest.json",
);

// ts-morph project - parse syntactically only (no full type-check needed)
const project = new Project({
  tsConfigFilePath: path.join(ROOT, "tsconfig.json"),
  skipAddingFilesFromTsConfig: true,
  skipFileDependencyResolution: true,
});

// Path alias resolution:  app/* → src/app/*
function resolveModule(
  moduleSpecifier: string,
  fromDir: string,
): string | null {
  let base: string;
  if (moduleSpecifier.startsWith("app/")) {
    base = path.join(SRC_DIR, moduleSpecifier);
  } else if (moduleSpecifier.startsWith(".")) {
    base = path.resolve(fromDir, moduleSpecifier);
  } else {
    return null; // external package - skip
  }

  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    path.join(base, "index.tsx"),
    path.join(base, "index.ts"),
  ];

  return (
    candidates.find((c) => {
      try {
        return fs.statSync(c).isFile();
      } catch {
        return false;
      }
    }) ?? null
  );
}

function getSF(filePath: string): SourceFile {
  return (
    project.getSourceFile(filePath) ?? project.addSourceFileAtPath(filePath)
  );
}

// Prop extraction
interface PropEntry {
  name: string;
  type: string;
  required: boolean;
  description: string | null;
}

function extractProps(iface: InterfaceDeclaration): PropEntry[] {
  return iface.getProperties().map((prop) => {
    const jsdoc = prop
      .getJsDocs()
      .map((d) => d.getCommentText())
      .filter(Boolean)
      .join(" ");
    return {
      name: prop.getName(),
      type: (prop.getTypeNode()?.getText() ?? prop.getType().getText())
        .replace(/\s+/g, " ")
        .trim(),
      required: !prop.hasQuestionToken(),
      description: jsdoc || null,
    };
  });
}

// Find a named interface inside a source file (and its sibling data file)
function findInterface(
  sf: SourceFile,
  name: string,
  componentFile: string,
): InterfaceDeclaration | null {
  // 1. Direct hit in the given file
  const direct = sf.getInterface(name);
  if (direct) return direct;

  // 2. Check sibling data.ts / data.tsx files
  const dir = path.dirname(componentFile);
  for (const sibling of ["data.ts", "data.tsx"]) {
    const siblingPath = path.join(dir, sibling);
    try {
      if (!fs.statSync(siblingPath).isFile()) continue;
    } catch {
      continue;
    }
    const hit = getSF(siblingPath).getInterface(name);
    if (hit) return hit;
  }

  // 3. Walk imports of the given file to find where the name was re-exported
  for (const imp of sf.getImportDeclarations()) {
    const named = imp.getNamedImports().map((n) => n.getName());
    if (!named.includes(name)) continue;
    const resolved = resolveModule(
      imp.getModuleSpecifierValue(),
      path.dirname(sf.getFilePath()),
    );
    if (!resolved) continue;
    const hit = getSF(resolved).getInterface(name);
    if (hit) return hit;
  }

  return null;
}

// Describe a named type as a plain JSON-serialisable shape
function describeType(
  typeName: string,
  contextSf: SourceFile,
  componentFile: string,
  depth = 0,
): object | null {
  if (depth > 3) return { type: typeName }; // guard against recursion

  const iface = findInterface(contextSf, typeName, componentFile);
  if (!iface) return null;

  const properties: Record<string, { type: string; required: boolean }> = {};
  for (const prop of iface.getProperties()) {
    properties[prop.getName()] = {
      type: (prop.getTypeNode()?.getText() ?? "unknown")
        .replace(/\s+/g, " ")
        .trim(),
      required: !prop.hasQuestionToken(),
    };
  }
  return { type: "object", properties };
}

// Build a data_shape descriptor from the `data` prop of a Props interface
function buildDataShape(
  propsIface: InterfaceDeclaration,
  componentFile: string,
): object | null {
  const dataProp = propsIface.getProperty("data");
  if (!dataProp) return null;

  const typeNode = dataProp.getTypeNode();
  const typeText = (typeNode?.getText() ?? "").trim();

  if (!typeText || typeText === "any") return null;

  // Foo[]
  if (typeText.endsWith("[]")) {
    const itemName = typeText.slice(0, -2).trim();
    const itemShape = describeType(
      itemName,
      propsIface.getSourceFile(),
      componentFile,
    );
    return { type: "array", items: itemShape ?? { type: "object" } };
  }

  // Array<Foo>
  const arrayGeneric = typeText.match(/^Array<(.+)>$/);
  if (arrayGeneric) {
    const itemName = arrayGeneric[1].trim();
    const itemShape = describeType(
      itemName,
      propsIface.getSourceFile(),
      componentFile,
    );
    return { type: "array", items: itemShape ?? { type: "object" } };
  }

  // Named object type
  const shape = describeType(
    typeText,
    propsIface.getSourceFile(),
    componentFile,
  );
  if (shape) return shape;

  return { type: typeText };
}

// Serialise story args object literal text → JSX usage string
function buildUsageExample(
  storySf: SourceFile,
  componentName: string,
): string | null {
  // Find the first exported story variable that has `args`
  for (const varDecl of storySf.getVariableDeclarations()) {
    if (!varDecl.isExported()) continue;
    const init = varDecl.getInitializer();
    if (!Node.isObjectLiteralExpression(init)) continue;

    const argsProp = init.getProperty("args");
    if (!Node.isPropertyAssignment(argsProp)) continue;

    const argsObj = argsProp.getInitializer();
    if (!Node.isObjectLiteralExpression(argsObj)) continue;

    const parts: string[] = [];
    for (const p of argsObj.getProperties()) {
      if (!Node.isPropertyAssignment(p)) continue;
      const key = p.getNameNode().getText();
      const val = p.getInitializer()?.getText() ?? "undefined";

      if (/^["']/.test(val)) {
        parts.push(`${key}=${val}`);
      } else if (val === "true") {
        parts.push(key);
      } else if (val === "false") {
        parts.push(`${key}={false}`);
      } else {
        parts.push(`${key}={${val}}`);
      }
    }

    if (parts.length === 0) return null;

    return `<${componentName}\n  ${parts.join("\n  ")}\n/>`;
  }

  return null;
}

// Extract component identity from a story file's default export meta
interface StoryTarget {
  componentName: string;
  componentFile: string | null;
  title: string;
  isWrapper: boolean;
}

function resolveStoryTarget(storySf: SourceFile): StoryTarget | null {
  const storyDir = path.dirname(storySf.getFilePath());

  // Locate `const meta = { ... }`
  let metaObj = null as Node | null;
  for (const varDecl of storySf.getVariableDeclarations()) {
    if (varDecl.getName() !== "meta") continue;
    const init = varDecl.getInitializer();
    if (Node.isObjectLiteralExpression(init)) {
      metaObj = init;
      break;
    }
    // `const meta = { ... } as Meta<...>`  →  AsExpression wrapping OLE
    if (Node.isAsExpression(init)) {
      const inner = init.getExpression();
      if (Node.isObjectLiteralExpression(inner)) {
        metaObj = inner;
        break;
      }
    }
  }
  if (!metaObj || !Node.isObjectLiteralExpression(metaObj)) return null;

  // Read title
  const titleProp = metaObj.getProperty("title");
  const title = Node.isPropertyAssignment(titleProp)
    ? (titleProp.getInitializer()?.getText() ?? "").replace(/['"]/g, "")
    : "";

  // Read component identifier
  const componentProp = metaObj.getProperty("component");
  if (!Node.isPropertyAssignment(componentProp)) return null;
  const componentId = componentProp.getInitializer()?.getText().trim() ?? "";
  if (!componentId) return null;

  // Check imports for this identifier
  const nonSbImports = storySf
    .getImportDeclarations()
    .filter((i) => !i.getModuleSpecifierValue().includes("storybook"));

  for (const imp of nonSbImports) {
    const named = imp.getNamedImports().map((n) => n.getName());
    const def = imp.getDefaultImport()?.getText();
    if (!named.includes(componentId) && def !== componentId) continue;
    const resolved = resolveModule(imp.getModuleSpecifierValue(), storyDir);
    return {
      componentName: componentId,
      componentFile: resolved,
      title,
      isWrapper: false,
    };
  }

  // Local wrapper - infer from title
  const lastSegment = title.split("/").pop()?.trim() ?? "";
  const normalized = lastSegment
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  for (const imp of nonSbImports) {
    const named = imp.getNamedImports().map((n) => n.getName());
    const match = named.find(
      (n) => n === normalized || n.toLowerCase() === normalized.toLowerCase(),
    );
    if (match) {
      const resolved = resolveModule(imp.getModuleSpecifierValue(), storyDir);
      return {
        componentName: match,
        componentFile: resolved,
        title,
        isWrapper: true,
      };
    }
  }

  // Last resort: first named import from a non-storybook module
  for (const imp of nonSbImports) {
    const named = imp.getNamedImports();
    if (named.length === 0) continue;
    const name = named[0].getName();
    const resolved = resolveModule(imp.getModuleSpecifierValue(), storyDir);
    return {
      componentName: name,
      componentFile: resolved,
      title,
      isWrapper: true,
    };
  }

  return null;
}

// Describe where the component lives relative to the project root
function relPath(absPath: string | null): string | null {
  if (!absPath) return null;
  return path.relative(ROOT, absPath).replace(/\\/g, "/");
}

// Derive a human description from the story title
function deriveDescription(title: string, componentName: string): string {
  const lastPart = title.split("/").pop()?.trim();
  if (lastPart && lastPart.toLowerCase() !== componentName.toLowerCase()) {
    return `${lastPart} component (${componentName}).`;
  }
  return `${componentName} component.`;
}

// Main
interface ManifestEntry {
  name: string;
  description: string;
  file_path: string | null;
  props: PropEntry[] | null;
  data_shape: object | null;
  usage_example: string | null;
  notes: string;
}

async function main() {
  const storyFiles = globSync("src/**/*.stories.tsx", {
    cwd: ROOT,
    absolute: true,
  });

  console.log(`Found ${storyFiles.length} story files.`);

  const components: ManifestEntry[] = [];
  const seen = new Set<string>();

  for (const storyPath of storyFiles.sort()) {
    const storySf = getSF(storyPath);
    const target = resolveStoryTarget(storySf);

    if (!target) {
      console.warn(
        `  [SKIP] ${path.relative(ROOT, storyPath)} - could not resolve meta.component`,
      );
      continue;
    }

    const key = `${target.componentName}::${target.componentFile ?? "unknown"}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const notes: string[] = [];
    if (target.isWrapper)
      notes.push(
        "meta.component is a local wrapper - component inferred from title/imports",
      );

    // Find props interface
    let propsIface: InterfaceDeclaration | null = null;
    let componentSf: SourceFile | null = null;

    if (target.componentFile) {
      componentSf = getSF(target.componentFile);
      propsIface = findInterface(
        componentSf,
        `${target.componentName}Props`,
        target.componentFile,
      );
      if (!propsIface) {
        propsIface = findInterface(
          componentSf,
          `${target.componentName}Properties`,
          target.componentFile,
        );
      }
    }

    if (!propsIface) notes.push("[NEEDS REVIEW] Props interface not found");

    const props = propsIface ? extractProps(propsIface) : null;
    const dataShape =
      propsIface && target.componentFile
        ? buildDataShape(propsIface, target.componentFile)
        : null;

    const usageExample = buildUsageExample(storySf, target.componentName);
    if (!usageExample)
      notes.push(
        "[NEEDS REVIEW] No story args found - no usage example generated",
      );

    const entry: ManifestEntry = {
      name: target.componentName,
      description: deriveDescription(target.title, target.componentName),
      file_path: relPath(target.componentFile),
      props: props ?? null,
      data_shape: dataShape,
      usage_example: usageExample,
      notes: notes.join("; "),
    };

    components.push(entry);

    const status = propsIface ? "✓" : "?";
    console.log(`  [${status}] ${target.componentName}  (${target.title})`);
  }

  // Write output
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const manifest = { components };
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2), "utf-8");

  console.log(
    `\nWrote ${components.length} components → ${relPath(OUTPUT_PATH)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
