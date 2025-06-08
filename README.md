# NeuKit

A Neutralino development stack.

## ✨ Features

- Rapid project scaffolding
- Built-in development server with live reload
- Easy cross-platform packaging (Mac | Linux | Windows)

## 🚀 Getting Started

### Prerequisites for the scaffold

- Bun (https://bun.sh/)
- Neutralino (https://github.com/neutralinojs/neutralino)


### Installation

To install NeuKit globally using bun:
```bash
bun install -g neukit
```

### Running without Installing
```bash
bun x neukit@latest <command> [options]
# Example: bun x neukit@latest --version
# Example: bun x neukit@latest create my-new-app

```

```bash
npx neukit@latest <command> [options]
# Example: npx neukit@latest --version
# Example: npx neukit@latest create my-new-app
```

```bash
pnpm dlx neukit@latest <command> [options]
# Example: pnpm dlx neukit@latest --version
# Example: pnpm dlx neukit@latest create my-new-app
```

### Usage
 - ***Create a New Project***
  *To scaffold a new Neutralino project using NeuKit:*
```bash
neukit create <APPNAME>
```

- ***Package Your Application***

```bash
neukit --pack --target <TARGET>
# Or using shorthand flags:
# neukit -p -T <TARGET>
```
 Where `<TARGET>` can be `mac`, `linux`, or `win`. 
 Example for macOS:
 ```bash
neukit -p -T mac
```

```plaintext
  _   _            _  ___ _   
 | \ | | ___ _   _| |/ (_) |_ 
 |  \| |/ _ \ | | | ' /| | __|
 | |\  |  __/ |_| | . \| | |_ 
 |_| \_|\___|\__,_|_|\_\_|\__|
                              
 
Usage: index [options] [command]

Neutralino CLI tools

Options:
  -V, --version                   output the version number
  -p, --pack                      Package your app
  -T --target, <type>             mac | linux | win
  -v, --verbose                   Enable verbose mode
  -h, --help                      display help for command

Commands:
  create [options] <projectName>  Create a new projec
  ```