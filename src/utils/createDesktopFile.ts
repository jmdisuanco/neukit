import type { NEUKIT_CONFIG } from "../../types"


export type LinuxScaffoldPayload = {
    APP_NAME: string
    APP_ICON: string
    APP_ICON_PATH: string
    APP_VERSION: string
    APP_BINARY: string
    APP_BASEPATH: string
    APP_PATH: string
    APP_EXEC: string
}


export const prepareEntries = (config: NEUKIT_CONFIG, appExec: string) => {
    if (!config.buildScript?.linux) return undefined

    const payload: LinuxScaffoldPayload = {
        APP_NAME: config.buildScript?.linux?.appName,
        APP_VERSION: config.version,
        APP_BINARY: config.cli.binaryName,
        APP_ICON: config.buildScript?.linux?.appIcon,
        APP_ICON_PATH: config.buildScript?.linux?.appIconPath,
        APP_PATH: config.buildScript?.linux?.appPath,
        APP_BASEPATH: `${config.buildScript?.linux?.appPath}/${config.buildScript?.linux?.appName}`,
        APP_EXEC: `${appExec}`
    }

    return payload
}

export const createDesktopFile = (payload: LinuxScaffoldPayload) => {
    const { APP_NAME, APP_ICON_PATH, APP_PATH, APP_EXEC } = payload
    const desktop = `[Desktop Entry]
    Version=1.0
    Encoding=UTF-8
    Name=${APP_NAME}
    Icon=${APP_ICON_PATH}
    Exec=${APP_EXEC}
    Path=${APP_PATH}
    Terminal=false
    Type=Application
    `
    return desktop
}