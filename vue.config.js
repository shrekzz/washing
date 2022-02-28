
module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions : {
                "appId": "com.shrekz",
                "win": {
                  "icon": "build/logo2.ico",
                },
                "extraResources": {
                    "from": "./extraResources/",
                    "to": "../"
                },
                "icon": "build/logo2.ico",
                "nsis": {
                  "oneClick": "false",
                  "allowToChangeInstallationDirectory": "true"
                },
                "asar": false
            }
        },
    },
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true,
                }
            }
        }
    }
}
