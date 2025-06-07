import type { BUILDTARGET, NUETRALINO_CONFIG, paths } from "../../types"
import fs from 'fs'
import * as c from '8colors'
import ora from 'ora';
import png2icons from 'png2icons';

export const buildWindows = async (config: NUETRALINO_CONFIG, paths: paths, target: BUILDTARGET, verbose: boolean) => {
    const { projectRoot, wd } = paths;
    const out = `${wd}/build`

    console.log(c.green(`Starting build for Windows OS platform  App version ${config.version}`))

    if (!config.buildScript?.win) {
        console.log(c.red('missing buildscript entry for Windows'))
        return
    }

    const { win } = config.buildScript
    const { binaryName } = config.cli
    const APP_SRC = `${projectRoot}/templates/_app_scaffolds/win`

    if (!fs.existsSync(APP_SRC)) {
        console.log(c.red('‼️ missing app scaffold'))
        console.log(c.red('Aborting..'))
        return;
    }

    const spinner = ora(`🛠️  Building Neutralino Apps for Windows`).start();

    if (fs.existsSync(`${wd}/dist`)) {
        fs.rmdirSync(`${wd}/dist`, { recursive: true })
    }

    const build = await Bun.spawn(['neu', 'build'])
    const output = await new Response(build.stdout).text();
    verbose && console.log(output)
    spinner.succeed("Build Process Done")
    spinner.start('Preparing Package')

    fs.mkdirSync(`${wd}/build/win`, { recursive: true })

    for (const arch of win.architecture) {
        spinner.info(`Packaging for ${arch}`)
        const distDir = `${wd}/dist`
        const binFile = `${distDir}/${binaryName}/${binaryName}-${target}_${arch}.exe`
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

        spinner.info('cloning Application Package Template')

        const packageDir = `${out}/${target}/${target}_${arch}` // 
        fs.cpSync(`${projectRoot}/templates/_app_scaffolds/win`, packageDir, { recursive: true })

        fs.cpSync(binFile, `${packageDir}/${win.appName}.exe`);

        fs.cpSync(resourcesFile, `${packageDir}/resources.neu`);

        if (config.enableExtensions) {
            const extensionsDirectory = `${packageDir}/extensions`

            const extensions = fs.readdirSync(`${distDir}/${binaryName}/extensions`)
            for (const extension of extensions) {
                try {
                    fs.mkdirSync(`${extensionsDirectory}/${extension}`, { recursive: true })
                    fs.cpSync(`${distDir}/${binaryName}/extensions/${extension}/start-windows_${arch}.exe`, `${extensionsDirectory}/${extension}/start-windows.exe`, { recursive: true })
                } catch (error: Error | any) {
                    console.log(error.message)
                    console.log(c.red(`‼️ Extension start-windows_${arch} not found`))
                    console.log(c.red('Aborting... build your extension first and try again'))
                    return
                }
            }
        }
        const input = fs.readFileSync(`${wd}/assets/icon.png`);
        const ico = png2icons.createICO(input, png2icons.BEZIER, 20, true, true)
        ico && fs.writeFileSync(`${packageDir}/icon.ico`, ico);
        spinner.succeed(`📦 Package ${target}_${arch} now available at ${packageDir}`)
    }
}
