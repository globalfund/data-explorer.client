import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

let version = "unknown";
try {
  version = execSync("git rev-parse --short HEAD", {
    cwd: join(import.meta.dirname, ".."),
    encoding: "utf8",
  }).trim();
} catch (error) {
  console.warn("Could not determine git revision; using 'unknown'.");
}

const filePath = join(import.meta.dirname, "../.env");
const envVariable = `VITE_VERSION=${version}`;

// Read the current contents of .env
let envContent = "";
if (existsSync(filePath)) {
  envContent = readFileSync(filePath, "utf8");
}

// Check if VITE_VERSION already exists
if (envContent.includes("VITE_VERSION")) {
  // Replace the existing line
  envContent = envContent.replace(/VITE_VERSION=.*/g, envVariable);
} else {
  // Append to the end of the file
  envContent += `\n${envVariable}`;
}

// Write back to .env
writeFileSync(filePath, envContent, { flag: "w" });
console.log(`✔️  Version injected: ${version}`);
