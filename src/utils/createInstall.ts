import type { LinuxScaffoldPayload } from "./createDesktopFile"

export const createLinuxInstaller = (payload: LinuxScaffoldPayload) => {

    const { APP_NAME, APP_ICON, APP_ICON_PATH, APP_PATH, APP_EXEC, APP_BASEPATH } = payload
    const installerScript = `#!/bin/bash

    echo "Installing ..."
    cd ..
    mkdir ${APP_PATH}
    cp -r ${APP_NAME} ${APP_BASEPATH}
    
    cd ${APP_NAME}
    chmod +x ${APP_EXEC}
    cp ${APP_ICON} ${APP_ICON_PATH}
    cp ${APP_NAME}.desktop /usr/share/applications/${APP_NAME}.desktop
    
    read -p "Delete original files? (y/n): " answer
    if [[ $answer == "y" ]]; then
    echo "Deleting ..."
    cd ..
    rm -rf ${APP_NAME}
    fi
    
    echo "DONE."`
    return installerScript
}
