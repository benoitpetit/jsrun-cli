# JSRUN
<div align="center">

<img src="src/jsrun.png" alt="JSRUN Logo" width="200" height="auto">

**The ultimate CLI tool for effortlessly running JavaScript, TypeScript, and `.jsr` scripts.**

⚡ Focus on coding, let JSRUN handle the rest! ⚡

[![npm version](https://badge.fury.io/js/jsrun-cli.svg)](https://badge.fury.io/js/jsrun-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/jsrun-cli.svg)](https://www.npmjs.com/package/jsrun-cli)

</div>

---

## ✨ Features

- **Automatic Module Management**: Automatically installs missing dependencies.
- **Version Control**: Specify version numbers directly in your imports.
- **Caching for Speed**: Locally cached modules reduce installation time.
- **Colorful Logging**: Clear, colorful logs powered by `chalk`.
- **Error Handling**: Comprehensive error messages for easy troubleshooting.
- **Extendable**: Customizable and ready for expansion.

---

## 🔧 Installation

### Prerequisites

- **Node.js**: Ensure you're using Node.js version 14 or higher. [Get Node.js here](https://nodejs.org/).

### Install via npm

```bash
npm install -g jsrun-cli
```

---

## 🚀 Usage

### Run a Script

Run any script supported by JSRUN:

```bash
jsrun myscript.jsr
```

Supported extensions: `.jsr`, `.js`, `.mjs`, `.ts`.

### Import Modules with Versions

```javascript
import express from "express@4.17.1";
import chalk from "chalk@4.1.2";

console.log(chalk.green("Starting server..."));
const app = express();
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(3000, () => console.log(chalk.blue("Server running on port 3000")));
```

**Run the script:**

```bash
jsrun server.jsr
```

### Pass Arguments to Your Script

```bash
jsrun myscript.jsr --port=4000 --env=production
```

Inside your script:

```javascript
const args = process.argv.slice(2);
const port =
    args.find((arg) => arg.startsWith("--port="))?.split("=")[1] || 3000;
const env =
    args.find((arg) => arg.startsWith("--env="))?.split("=")[1] || "development";

console.log(`Running on port ${port} in ${env} mode.`);
```

---

## 🧹 Clean Installed Packages

```bash
jsrun --clean
```

---

## 🎯 Key Features Explained

- **Performance Caching**: Caches modules locally in `~/.jsrun/node_modules` to speed up subsequent runs.
- **Colorful Logging**: Uses `chalk` for colored feedback (Green for success, Yellow for warnings, Red for errors, and Blue for status).
- **Error Handling**: Gives detailed error messages, simplifying debugging and fixing issues.

---

## 📝 Why JSRUN?

JSRUN was created to make running JavaScript and TypeScript scripts with modules a breeze, without the hassle of managing `node_modules`. Instead of manually installing packages every time, JSRUN handles everything for you. It installs the necessary dependencies automatically, allowing you to create and run executable scripts from anywhere with minimal setup.

No more worrying about how to manage `node_modules` just focus on writing and running your scripts, and let JSRUN take care of the rest!

---

## 📂 Examples

Explore the `/examples` directory for use cases and `.jsr` script examples.

## 🛠️ Troubleshooting

### Common Issues

1. **Module Not Found**: Ensure module names and versions are correct.
2. **Permission Denied**: Use elevated privileges or adjust the ownership of the `~/.jsrun` folder.
3. **Syntax Errors**: Verify that your JavaScript/TypeScript syntax is correct. Use the appropriate Node.js version.
4. **Network Problems**: Check your network connection or try manually installing the module.

---

## ❓ FAQ

1. **Why `.jsr`?**  
     `.jsr` highlights scripts specifically made for `jsrun`.

2. **Can I use `.js` files?**  
     Yes, `.js` files are supported, but `.jsr` is recommended for clarity.

3. **Where are modules installed?**  
     In the cache directory `~/.jsrun/node_modules`.

4. **How do I update `jsrun`?**  
     Run `npm update -g jsrun-cli`.

---

## 🤝 Contributing

1. **Fork the repo**
2. **Create a new branch**
3. **Make your changes**
4. **Push your branch**
5. **Submit a Pull Request**

---

## 📜 License

`jsrun` is licensed under the [MIT License](LICENSE).

---

## ✉️ Contact

Have questions or feedback? Check out our [GitHub page](https://github.com/benoitpetit/).

---

## 📚 Documentation en Français

Pour la documentation en français, consultez [ce lien](/README_fr.md).

