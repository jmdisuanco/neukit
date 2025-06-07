import type { BUILDTARGET, NUETRALINO_CONFIG, paths } from "../../types"
import fs from 'fs'
import * as c from '8colors'
import ora from 'ora';
import { createLinuxInstaller } from "../utils/createInstall";
import { createDesktopFile, prepareEntries } from "../utils/createDesktopFile";

export const buildLinux = async (config: NUETRALINO_CONFIG, paths: paths, target: BUILDTARGET, verbose: boolean) => {
    const { projectRoot, wd } = paths;
    const out = `${wd}/build`

    console.log(c.green(`Starting build for Linux OS platform  App version ${config.version}`))

    if (!config.buildScript?.linux) {
        console.log(c.red('missing buildscript entry for Linux'))
        return
    }

    const { linux } = config.buildScript
    const { binaryName } = config.cli

    const spinner = ora(`🛠️  Building Neutralino Apps for Linux`).start();

    if (fs.existsSync(`${wd}/dist`)) {
        fs.rmdirSync(`${wd}/dist`, { recursive: true })
    }

    const build = await Bun.spawn(['neu', 'build'])
    const output = await new Response(build.stdout).text();
    verbose && console.log(output)
    spinner.succeed("Build Process Done")

    spinner.start('Preparing Package')

    fs.mkdirSync(`${wd}/build/win`, { recursive: true })

    for (const arch of linux.architecture) {
        spinner.info(`Packaging for ${arch}`)
        const distDir = `${wd}/dist`
        const binFile = `${distDir}/${binaryName}/${binaryName}-${target}_${arch}`
        const resourcesFile = `${distDir}/${binaryName}/resources.neu`

        if (!fs.existsSync(binFile)) {
            console.log(c.red(`‼️ missing app Binary file ${binFile}`))
            return;
        }
        if (!fs.existsSync(resourcesFile)) {
            console.log(c.red(`‼️ missing resources file ${resourcesFile}`))
            return;
        }
        if (fs.existsSync(`${out}/${target}/${target}_${arch}`)) {
            fs.rmdirSync(`${out}/${target}/${target}_${arch}`, { recursive: true })
        }

        const packageDir = `${out}/${target}/${target}_${arch}` // 

        fs.cpSync(binFile, `${packageDir}/${linux.appName}`);

        fs.cpSync(resourcesFile, `${packageDir}/resources.neu`);

        if (config.enableExtensions) {
            const extensionsDirectory = `${packageDir}/extensions`

            const extensions = fs.readdirSync(`${distDir}/${binaryName}/extensions`)
            for (const extension of extensions) {
                try {
                    fs.mkdirSync(`${extensionsDirectory}/${extension}`, { recursive: true })
                    fs.cpSync(`${distDir}/${binaryName}/extensions/${extension}/start-linux_${arch}`, `${extensionsDirectory}/${extension}/start-linux`, { recursive: true })
                } catch (error: Error | any) {
                    console.log(error.message)
                    console.log(c.red(`‼️ Extension start-linux_${arch} not found`))
                    console.log(c.red('Aborting.., build your extension first and try again'))
                    return
                }
            }
        }
        fs.cpSync(`${wd}/assets/icon.png`, `${packageDir}/icon.png`);
        const payload = prepareEntries(config, `${packageDir}/${linux.appName}`)
        if (payload) {
            fs.writeFileSync(`${packageDir}/${linux.appName}.desktop`, createDesktopFile(payload))
            fs.writeFileSync(`${packageDir}/install.sh`, createLinuxInstaller(payload));
        } else {
            console.log(c.red('‼️  Unable to create Desktop File'))
            console.log(c.red('Aborting..'))
            return
        }

        spinner.succeed(`📦 Package ${target}_${arch} now available at ${packageDir}`)
    }
}