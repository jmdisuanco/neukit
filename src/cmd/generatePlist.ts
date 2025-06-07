import type { NUETRALINO_CONFIG } from "../../types"

export const generatePlist = (config: NUETRALINO_CONFIG) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        <key>NSHighResolutionCapable</key>
        <true/>
        <key>CFBundleExecutable</key>
        <string>bootstrap</string>
        <key>CFBundleGetInfoString</key>
        <string>${config.buildScript?.mac?.appName}</string>
        <key>CFBundleIconFile</key>
        <string>icon.icns</string>
        <key>CFBundleIdentifier</key>
        <string>${config.applicationId}</string>
        <key>CFBundleName</key>
        <string>${config.buildScript?.mac?.appBundleName}</string>
        <key>CFBundleShortVersionString</key>
        <string>${config.version}</string>
        <key>CFBundleGetInfoString</key>
        <string>${config.buildScript?.mac?.appName} ${config.version}</string>
        <key>CFBundlePackageType</key>
        <string>APPL</string>
        <key>LSMinimumSystemVersion</key>
        <string>${config.buildScript?.mac?.minimumOS}</string>
        <key>NSAppTransportSecurity</key>
        <dict>
            <key>NSAllowsArbitraryLoads</key>
            <true/>
        </dict>
    </dict>
    </plist>`
}