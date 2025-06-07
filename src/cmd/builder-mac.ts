import type { BUILDTARGET, NUETRALINO_CONFIG, paths } from "../../types"
import fs from 'fs'
import * as c from '8colors'
import ora from 'ora';
import { generatePlist } from "./generatePlist";
import png2icons from 'png2icons';

export const buildMac = async (config: NUETRALINO_CONFIG, paths: paths, target: BUILDTARGET, verbose: boolean) => {
    const { projectRoot, wd } = paths;
    const out = `${wd}/build`

    console.log(c.green(`Starting build for Mac OS platform  App version ${config.version}`))

    if (!config.buildScript?.mac) {
        console.log(c.red('missing buildscript entry for mac'))
        return
    }

    const { mac } = config.buildScript
    const { binaryName } = config.cli
    const APP_SRC = `${projectRoot}/templates/_app_scaffolds/mac/myapp.app`
    //check if exist
    if (!fs.existsSync(APP_SRC)) {
        console.log(c.red('‼️ missing app scaffold'))
        console.log(c.red('Aborting..'))
        return;
    }

    const spinner = ora(`🛠️  Building Neutralino Apps for Mac`).start();

    if (fs.existsSync(`${wd}/dist`)) {
        fs.rmdirSync(`${wd}/dist`, { recursive: true })
    }

    const build = await Bun.spawn(['neu', 'build'])
    const output = await new Response(build.stdout).text();
    verbose && console.log(output)
    spinner.succeed("Build Process Done")

    spinner.start('Preparing Package')

    fs.mkdirSync(`${wd}/build/mac`, { recursive: true })

    for (const arch of mac.architecture) {
        spinner.info(`Packaging for ${arch}`)
        const distDir = `${wd}/dist`
        const binFile = `${distDir}/${binaryName}/${binaryName}-${target}_${arch}`
        const resourcesFile = `${distDir}/${binaryName}/resources.neu`

        if (!fs.existsSync(binFile)) {
            console.log(c.red(`‼️ missing app Binary file ${binFile}`))
            return;
        }
        if (!fs.existsSync(resourcesFile)) {
            console.log(c.red(`‼️ missing resources file ${resourcesFile} `))
            return;
        }
        if (fs.existsSync(`${out}/${target}/${target}_${arch}`)) {
            fs.rmdirSync(`${out}/${target}/${target}_${arch}`, { recursive: true })
        }

        spinner.info('cloning Application Package Template')
        const packageArchDir = `${out}/${target}/${target}_${arch}`
        const packageDir = `${packageArchDir}/${mac.appBundleName}.app`
        fs.cpSync(`${projectRoot}/templates/_app_scaffolds/mac/myapp.app`, `${packageDir}`, { recursive: true })

        fs.cpSync(binFile, `${packageDir}/Contents/MacOS/main`);

        fs.cpSync(resourcesFile, `${packageDir}/Contents/Resources/resources.neu`);

        if (config.enableExtensions) {
            const extensionsDirectory = `${packageDir}/Contents/Resources/extensions`

            const extensions = fs.readdirSync(`${distDir}/${binaryName}/extensions`)
            for (const extension of extensions) {
                try {
                    fs.mkdirSync(`${extensionsDirectory}/${extension}`, { recursive: true })
                    fs.cpSync(`${distDir}/${binaryName}/extensions/${extension}/start-mac_${arch}`, `${extensionsDirectory}/${extension}/start-mac`, { recursive: true })
                } catch (error: Error | any) {
                    console.log(error.message)
                    console.log(c.red(`‼️  Extension start-mac_${arch} not found`))
                    console.log(c.red('Aborting... build your extension first and try again'))
                    return
                }
            }
        }

        fs.writeFileSync(`${packageDir}/Contents/Info.plist`, generatePlist(config), 'utf-8')
        const input = fs.readFileSync(`${wd}/assets/icon.png`);
        const icns = png2icons.createICNS(input, png2icons.BEZIER, 20)
        icns && fs.writeFileSync(`${packageDir}/Contents/Resources/icon.icns`, icns);
        spinner.succeed(`📦 Package ${target}_${arch} now available at ${packageArchDir}`)
    }
}
