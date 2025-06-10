#!/usr/bin/env bun
import { program } from "commander";
import { BUILDTARGET, type createOptions, type  NEUKIT_CONFIG, type options, type paths } from "../types";
import * as c from '8colors'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { buildMac } from "../src/cmd/builder-mac";
import { buildWindows } from "../src/cmd/builder-win";
import { buildLinux } from "../src/cmd/builder-linux";
import { horizontalGradient, gradient } from "../src/utils/gradient";
import { alertError } from '../src/utils/alert';
import { createNeuKit } from "../src/cmd/create";

const neukitBanner =await  Bun.file("./neukit.txt").text();

 const binPath = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(binPath, '..');
const packageJsonPath = path.join(projectRoot, 'package.json');
const pkg = await Bun.file(packageJsonPath).json();
const wd = process.cwd();

function noProject() {
    alertError(" There is no Neukit (Neutralino) project here");
    const store = () => Object.assign({}, c)
    const tip = store().w(`💡: run`).by(' neukit create').w(' to create a new project').end();
    console.log(tip)
}

async function projectRequired(callback: (config: NEUKIT_CONFIG) => void) {
    const configPath = path.join(wd, 'neutralino.config.json');
    const configExists = await fs.exists(configPath);
    if (configExists) {
        const config: NEUKIT_CONFIG = await Bun.file(configPath).json();
        console.log("App ID :", c.green(config.applicationId))
        callback && callback(config)
    } else {
        noProject()
    }

}
const paths: paths = {
    projectRoot, wd
}

console.log(horizontalGradient(neukitBanner))
 
console.log(c.yellow(`                 Version ${pkg.version}\n`))


const runPrepackage = async (arch: BUILDTARGET, verbose: boolean) => {

    if (!await fs.exists(`${wd}/package.json`)) {
        if (verbose) {
            console.log(c.yellow(`No package.json found in ${wd}. Skipping prepackage scripts.`));
        }
        return;
    }

    const project = await Bun.file(`${wd}/package.json`).json();
    const scripts = Object.keys(project.scripts);
    const prepackageScript = `neukit:prepackage`
    const prepackageScriptTarget = `${prepackageScript}:${arch}`
    scripts.includes(prepackageScript) && await Bun.spawn(['bun', 'run', prepackageScript])
    scripts.includes(prepackageScriptTarget) && await Bun.spawn(['bun', 'run', prepackageScriptTarget])
}



program
    .version(pkg.version)
    .description(pkg.description)
    .option("-p, --pack ", "Package your app")
    .option("-T --target, <type>", "mac | linux | win")
    .option('-v, --verbose', 'Enable verbose mode')
    .action(async (options: options) => {
        options.pack && await runPrepackage(options.target as BUILDTARGET, options.verbose)
        switch (true) {
            case options.pack: {
                projectRequired(async (config) => {

                    switch (options.target as BUILDTARGET) {

                        case BUILDTARGET.MAC: {
                            buildMac(config, paths, options.target as BUILDTARGET, options.verbose);
                            break;
                        }
                        case BUILDTARGET.LINUX: {
                            buildLinux(config, paths, options.target as BUILDTARGET, options.verbose);
                            break;
                        }
                        case BUILDTARGET.WIN: {
                            buildWindows(config, paths, options.target as BUILDTARGET, options.verbose);
                            break;
                        }
                        default: {
                            console.log(`Invalid build target`)
                            return
                        }
                    }
                })
                break;
            }
            case (options.create): {
                console.log('creating new neukit project')
                console.log(options)
                break;
            }
        }

    })

program
    .command("create")
    .description("Create a new project")
    .option("-t, --type [type]", "slim | full")
    .argument('<projectName>', 'Name of the project')
    .action((projectName: string, options: createOptions) => {
        createNeuKit(projectName, options)
    })

program.parse(process.argv);