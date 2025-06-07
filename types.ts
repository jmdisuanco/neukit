import type { StringMappingType } from "typescript";

export type options = {
    pack: boolean;
    create: boolean;
    verbose: boolean;
    target: 'mac' | 'linux' | 'win'
}

export type createOptions = {
    type: 'slim' | 'full'
    force: boolean
}

export enum BUILDTARGET {
    MAC = 'mac',
    LINUX = 'linux',
    WIN = 'win',
    ALL = 'all'
}

export enum MAC_ARCH {
    X64 = 'x64',
    ARM64 = 'arm64',
}

export enum LINUX_ARCH {
    X64 = 'x64',
    ARM64 = 'arm64',
    ARMHF = 'armhf',
}

export enum WINDOWS_ARCH {
    X64 = 'x64',
}

export type paths = {
    projectRoot: string,
    wd: string
}

export type OSBuild = {
    architecture: string[],
    minimumOS?: string,
    appName: string,
    appBundleName: string,
    appIdentifier?: string,
    appIcon: string,
    appPath?: string,
    appIconPath?: string,
};

export type NUETRALINO_CONFIG = {
    applicationId: string,
    version: string,
    defaultMode: string,
    documentRoot: string,
    port: number,
    url: string,
    enableServer: boolean,
    enableNativeAPI: boolean,
    tokenSecurity: string,
    exportAuthInfo: boolean,
    distributionPath: string,
    enableExtensions: boolean,
    logging: {
        enabled: boolean,
        writeToLogFile: boolean,
    },
    nativeAllowList: string[] | [],
    modes: {
        window: {
            title: string,
            icon: string,
            width: number,
            height: number,
            minWidth: number,
            minHeight: number,
            center?: boolean,
            fullScreen?: boolean,
            alwaysOnTop?: boolean,
            enableInspector?: boolean,
            borderless?: boolean,
            maximize?: boolean,
            hidden?: boolean,
            resizable?: boolean,
            exitProcessOnClose?: boolean,
            injectGlobals?: boolean,
        },
    },
    buildScript?: {
        [key: string]: OSBuild
    },
    cli: {
        binaryName: string,
        resourcesPath: string,
        extensionsPath: string,
        binaryVersion: string,
        clientVersion: string,
        frontendLibrary?: {
            patchFile?: string,
            devUrl?: string,
            projectPath?: string,
            initCommand: string,
            devCommand: string,
            buildCommand: StringMappingType,
            waitTimeout: number,
        },
    },
    extensions?: [
        {
            id: string,
            commandDarwin: string,
            commandLinux: string,
            commandWindows: string,
        }
    ],
}
