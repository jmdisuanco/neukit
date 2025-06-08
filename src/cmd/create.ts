import type { createOptions, NEUKIT_CONFIG, OSBuild } from "../../types";
import * as degit from 'degit';
import { createNeuKitForm } from "../form/neukitCreate";
import fs from 'fs';
import ora, { Ora } from "ora";
import { horizontalGradient } from "../utils/gradient";

type packageJson = {
    name: string,
    version: string,
    description?: string,
    author?: string,
    license?: string,
    scripts: {
        [key: string]: string | undefined;
    };
}


export const createNeuKit = async (projectName: string, options: createOptions) => {

    const payload = await createNeuKitForm(projectName, options);
    const projectPath = `${process.cwd()}/${payload.appName}`;


    let spinner: Ora | null = null; // Declare spinner variable

    try {

        spinner = ora('Cloning starter template...').start();
        const repo = `jmdisuanco/neukit-starter#${payload.template === 'full' ? 'bun@latest' : 'main@latest'}`;
        const emitter = degit.default(repo, {
            cache: false,
            force: true,
            verbose: false,
        });

        emitter.on('info', (info: any) => {
            if (info.code === 'SUCCESS') return;
            spinner?.info(info.message).start();
        });

        await emitter.clone(`./${payload.appName}`);
        spinner.succeed('Template cloned successfully!');


        if (!fs.existsSync(`${projectPath}/package.json`)) {
            throw new Error('Clone failed: package.json not found.');
        }


        spinner = ora('Preparing project package...').start();
        const pkg: packageJson = await Bun.file(`${projectPath}/package.json`).json();

        pkg.name = payload.appName;
        pkg.version = payload.version;
        pkg.description = payload.description;
        pkg.author = payload.author;
        pkg.license = payload.license;

        const keysToRemove = ['tag:patch', 'tag:minor', 'tag:major'];
        for (const key of keysToRemove) {
            delete (pkg.scripts as Record<string, string>)[key];
        }

        await Bun.write(`${projectPath}/package.json`, JSON.stringify(pkg, null, 2));
        spinner.succeed('package.json configured!');

        spinner = ora('Setting Neutralino config...').start();
        const config: NEUKIT_CONFIG = await Bun.file(`${projectPath}/neutralino.config.json`).json();

        config.applicationId = payload.appId;
        config.version = payload.version;
        config.companyName = payload.companyName! || 'NO_COMPANY_SET';
        config.author = payload.author || 'NO_AUTHOR_SET';
        config.modes.window.title = payload.windowTitle;

        if (config.buildScript) {
            const allowedKeys = new Set(payload.targetOS);
            const filteredBuildScript = Object.entries(config.buildScript)
                .filter(([key]) => allowedKeys.has(key))
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {} as Record<string, any>);

            for (const os in filteredBuildScript) {
                if (filteredBuildScript.hasOwnProperty(os)) {
                    filteredBuildScript[os].appName = payload.appName;
                    if (os === 'mac') {
                        filteredBuildScript[os].appBundleName = payload.appId;
                    }
                }
            }
            config.buildScript = filteredBuildScript;
        }

        await Bun.write(`${projectPath}/neutralino.config.json`, JSON.stringify(config, null, 2));
        spinner.succeed('neutralino.config.json configured!');



        spinner = ora('Installing dependencies...').start();
        Bun.spawnSync(['bun', 'install'], { cwd: projectPath });
        spinner.succeed('Dependencies installed.');

        spinner = ora('Updating Neutralino').start();
        Bun.spawnSync(['neu', 'update'], { cwd: projectPath });
        spinner.succeed('Neutralino updated.');
        const neukit = horizontalGradient('NeuKit')

        console.log(`\n✨ ${neukit} Project created successfully in ./${payload.appName}`);
        console.log('To get started, run:');
        console.log(`  → cd ${payload.appName}`);
        console.log('  → bun run dev');


    } catch (error: any) {
        if (spinner) {
            spinner.fail(spinner.text + ' failed.');
        }
        console.error('\n❌ An error occurred:', error.message);
        process.exit(1);
    }
};

