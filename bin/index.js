#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createRequire } from "module";
import chalk from "chalk";
import os from "os";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);

const userHome = os.homedir();
const jsrunDir = path.join(userHome, ".jsrun");
const jsrunNodeModules = path.join(jsrunDir, "node_modules");
const jsrunPackageJson = path.join(jsrunDir, "package.json");
const jsrunConfigPath = path.join(jsrunDir, "jsrun.config.json");

const isJsonMode = args.includes("--json");

const printHelpAndExit = () => {
  console.log(`
${chalk.bold("Usage:")} jsrun <script.jsr> [options]

${chalk.bold("Description:")}
        jsrun is a lightweight CLI tool that allows you to run JavaScript, TypeScript, and .jsr scripts easily.
        It automatically handles the installation of missing dependencies, allowing you to focus on your code.
        
${chalk.bold("Options:")}
        -h, --help       Show this help message and exit.
        --dry-run        Simulate execution without actually running the script.
        --clean          Clean all installed packages from ~/.jsrun/.
        --json           Output result in JSON format, suppressing other logs.
        create <file>    Create a new script file with a basic sample.
        --option=value   Additional options passed to the script.
    `);
  process.exit(0);
};

const cleanPackages = () => {
  const cleanSpinner = ora(
    chalk.cyan("Cleaning installed packages from ~/.jsrun/... Please wait")
  );
  if (!isJsonMode) cleanSpinner.start();

  try {
    if (fs.existsSync(jsrunNodeModules)) {
      fs.rmSync(jsrunNodeModules, { recursive: true, force: true });
      if (!isJsonMode) {
        cleanSpinner.succeed(
          chalk.green(
            "[OK] All installed packages have been successfully cleaned from ~/.jsrun/"
          )
        );
      }
    } else {
      if (!isJsonMode) {
        cleanSpinner.info(
          chalk.yellow("[INFO] No packages to clean in ~/.jsrun/")
        );
      }
    }
  } catch (error) {
    if (!isJsonMode) {
      cleanSpinner.fail(
        chalk.red(`[ERROR] Failed to clean packages: ${error.message}`)
      );
    }
    process.exit(1);
  }
  process.exit(0);
};

const validateScriptPath = (scriptPath) => {
  if (!scriptPath) {
    if (!isJsonMode) {
      console.error(chalk.red("\n[ERROR] Please provide a script to run."));
      console.error(chalk.cyan("Use 'jsrun --help' for more information.\n"));
    }
    process.exit(1);
  }

  const validExtensions = [".jsr", ".js", ".mjs", ".ts"];
  if (!validExtensions.includes(path.extname(scriptPath))) {
    if (!isJsonMode) {
      console.error(
        chalk.red("\n[ERROR] The file extension is not supported.")
      );
      console.error(chalk.cyan("Valid extensions: .jsr, .js, .mjs, .ts\n"));
    }
    process.exit(1);
  }

  const absoluteScriptPath = path.resolve(scriptPath);
  if (!fs.existsSync(absoluteScriptPath)) {
    if (!isJsonMode) {
      console.error(
        chalk.red(
          `\n[ERROR] The script file "${absoluteScriptPath}" does not exist.\n`
        )
      );
    }
    process.exit(1);
  }

  return absoluteScriptPath;
};

const setupJsrunDirectory = () => {
  if (!fs.existsSync(jsrunDir)) {
    fs.mkdirSync(jsrunDir, { recursive: true });
  }

  if (!fs.existsSync(jsrunPackageJson)) {
    fs.writeFileSync(
      jsrunPackageJson,
      JSON.stringify(
        {
          name: "jsrun-executor",
          version: "1.0.0",
          type: "module",
          dependencies: {},
        },
        null,
        2
      )
    );
  }
};

const loadConfig = () => {
  if (fs.existsSync(jsrunConfigPath)) {
    return JSON.parse(fs.readFileSync(jsrunConfigPath, "utf-8"));
  }
  return {};
};

const ensureModule = (moduleName, version = "", log = true) => {
  if (isJsonMode) log = false;

  const moduleIdentifier = version ? `${moduleName}@${version}` : moduleName;
  let spinner;

  if (log) {
    spinner = ora(chalk.cyan(`Checking '${moduleName}'...`)).start();
  }

  try {
    require.resolve(moduleName, { paths: [jsrunDir] });
    if (log && spinner) {
      spinner.succeed(
        chalk.green(`[OK] '${moduleName}' is already installed.`)
      );
    }
  } catch (err) {
    if (log && spinner) {
      spinner.text = chalk.yellow(
        `'${moduleName}' is not installed. Attempting to install it...`
      );
      spinner.start();
    }
    try {
      const packageJson = JSON.parse(fs.readFileSync(jsrunPackageJson));
      packageJson.dependencies[moduleName] = version || "latest";
      fs.writeFileSync(jsrunPackageJson, JSON.stringify(packageJson, null, 2));

      const installCommand = `npm install --prefix ${jsrunDir}`;
      execSync(installCommand, { stdio: log ? "inherit" : "pipe" });

      if (log && spinner) {
        spinner.succeed(
          chalk.green(`[OK] '${moduleName}' was successfully installed.`)
        );
      }
    } catch (error) {
      if (log && spinner) {
        spinner.fail(chalk.red(`[ERROR] Failed to install '${moduleName}'.`));
      }
      if (!isJsonMode) {
        console.error(chalk.red(`Details: ${error.message}`));
      }
      process.exit(1);
    }
  } finally {
    if (spinner && !log) {
      spinner.stop();
    }
  }
};

const extractImports = (scriptContent) => {
  const importRegex = /import\s+(?:[\w*\s{},]*)\s+from\s+['"]([^'"]+)['"]/g;
  const modules = [];
  let match;
  while ((match = importRegex.exec(scriptContent)) !== null) {
    let moduleName = match[1];
    if (!moduleName.startsWith(".") && !moduleName.startsWith("/")) {
      modules.push(moduleName);
    }
  }
  return modules;
};

const updateNodePath = () => {
  if (!isJsonMode) {
    const nodePathSpinner = ora(chalk.cyan("Updating NODE_PATH...")).start();
    try {
      process.env.NODE_PATH = jsrunNodeModules;
      require("module").Module._initPaths();
      nodePathSpinner.succeed(
        chalk.green(`[OK] NODE_PATH updated to include: ${jsrunNodeModules}`)
      );
    } catch (error) {
      nodePathSpinner.fail(
        chalk.red(`[ERROR] Failed to update NODE_PATH: ${error.message}`)
      );
      process.exit(1);
    }
  } else {
    process.env.NODE_PATH = jsrunNodeModules;
    require("module").Module._initPaths();
  }
};

const createSampleScript = (fileName) => {
  let fullPath = path.resolve(fileName);

  if (!path.extname(fullPath)) {
    fullPath += ".jsr";
  }

  const sampleContent = `import { $ } from 'zx';
import chalk from 'chalk';

console.log(chalk.green("Hello, welcome to JSRUN!"));
// Add your custom code below
await $\`echo Running with JSRUN CLI...\`;
`;

  try {
    if (fs.existsSync(fullPath)) {
      console.error(
        chalk.red(`\n[ERROR] File "${fullPath}" already exists.\n`)
      );
      process.exit(1);
    }

    fs.writeFileSync(fullPath, sampleContent);
    console.log(chalk.green(`[OK] Sample script created at: ${fullPath}\n`));
  } catch (error) {
    console.error(
      chalk.red(`\n[ERROR] Could not create file: ${error.message}\n`)
    );
    process.exit(1);
  }
};

if (args.includes("--help") || args.includes("-h")) {
  printHelpAndExit();
}

if (args[0] === "create" && args[1]) {
  createSampleScript(args[1]);
  process.exit(0);
}

if (args.includes("--clean")) {
  cleanPackages();
}

const scriptPath = validateScriptPath(args[0]);
const scriptArgs = args.slice(1);
setupJsrunDirectory();
const config = loadConfig();
const require = createRequire(import.meta.url);

ensureModule("chalk", "", false);
ensureModule("zx", "", false);

const configSpinner = ora(chalk.cyan("Configuring jsrun...")).start();
try {
  configSpinner.succeed(chalk.green(`[OK] Configuration of jsrun completed.`));
} catch (error) {
  configSpinner.fail(
    chalk.red(`[ERROR] Configuration failed: ${error.message}`)
  );
  process.exit(1);
}

let userScriptContent;
try {
  userScriptContent = fs.readFileSync(scriptPath, "utf-8");
} catch (err) {
  if (!isJsonMode) {
    console.error(chalk.red(`\n[ERROR] Reading the script: ${err.message}\n`));
  }
  process.exit(1);
}

if (args.includes("--dry-run")) {
  if (!isJsonMode) {
    console.log(chalk.blue("\n🔄 Simulating script execution (Dry-run)..."));
    console.log(chalk.blue(`NODE_PATH: ${jsrunNodeModules}`));
    console.log(chalk.blue("Modules to install:"));
    extractImports(userScriptContent).forEach((module) =>
      console.log(chalk.blue(`- ${module}`))
    );
  }
  process.exit(0);
}

const importedModules = extractImports(userScriptContent);
importedModules.forEach((moduleEntry) => {
  const version = config.dependencies?.[moduleEntry] || "";
  ensureModule(moduleEntry, version);
});

const tempMjsPath = path.join(jsrunDir, "tempScript.mjs");
fs.writeFileSync(tempMjsPath, userScriptContent);

updateNodePath();

let nodeCommand = `node --experimental-specifier-resolution=node ${tempMjsPath}`;
if (scriptArgs.length > 0) {
  nodeCommand += ` ${scriptArgs.join(" ")}`;
}

try {
  if (isJsonMode) {
    const jsonResult = execSync(nodeCommand, { stdio: "pipe" }).toString();
    console.log(JSON.stringify({ result: jsonResult.trim() }));
  } else {
    console.log(chalk.cyan("\n🚀 Running the script...\n"));
    console.log(chalk.cyan("-".repeat(30)));
    execSync(nodeCommand, { stdio: "inherit" });
  }
} catch (error) {
  if (isJsonMode) {
    console.error(JSON.stringify({ error: error.message }));
  } else {
    console.error(chalk.red(`[ERROR] Running the script: ${error.message}`));
  }
  process.exit(1);
} finally {
  if (fs.existsSync(tempMjsPath)) {
    fs.unlinkSync(tempMjsPath);
    if (!isJsonMode) {
      console.log(chalk.cyan("-".repeat(30) + "\n"));
      console.log(chalk.cyan("🧹 Cleaning up the temporary file..."));
    }
  }
}
