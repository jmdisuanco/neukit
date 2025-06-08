import * as Enquirer from "enquirer"
import type { createOptions } from "../../types";


export type CreateNeuKitOptions = {
    appName: string,
    version: string,
    windowTitle: string,
    appId: string,
    targetOS: string[],
    author?: string,
    companyName: string,
    license?: string,
    description?: string,
    template: "full" | "base",
}

export const createNeuKitForm = async (projectName: string, options: createOptions) => {

    const response: CreateNeuKitOptions = await Enquirer.default.prompt([
        {
            type: 'input',
            name: 'appName',
            required: true,
            message: 'Application Name',
            initial: projectName
        },
        {
            type: 'input',
            message: 'Version',
            name: 'version',
            initial: '1.0.0'
        },
        {
            type: 'input',
            name: 'windowTitle',
            required: true,
            message: 'Window Title',
            initial: projectName
        },
        {
            type: 'input',
            name: 'appId',
            required: true,
            message: 'Application ID',
            initial: `dev.neukit.${projectName}`
        },
        {
            type: 'multiselect',
            message: 'Target Architecture (Space to select)',
            name: 'targetOS',
            required: true,
            initial: 0,
            choices: [
                { name: 'mac', value: 'mac' },
                { name: 'win', value: 'win' },
                { name: 'linux', value: 'linux' }
            ]
        },
        {
            type: 'input',
            message: 'Author',
            name: 'author'
        },
        {
            type: 'input',
            message: 'Company Name : (Your name if individual)',
            name: 'companyName'
        },
        {
            type: 'input',
            message: 'License',
            name: 'license',
            initial: 'MIT'
        },
        {
            type: 'input',
            message: 'Description',
            name: 'description',
        },
        {
            type: 'autocomplete',
            message: 'template',
            name: 'template',
            required: true,
            initial: 0,
            choices: [
                { name: 'Full', value: 'full' },
                { name: 'Base', value: 'base' },
                // { name: 'Minimal', value: 'minimal' },
                // { name: 'Custom', value: 'custom' }
            ]

        }
    ]);
    return response
}
