
module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions : {
                "appId": "com.shrekz",
                "win": {
                  "icon": "build/logo2.ico"
                },
                "icon": "build/logo2.ico",
                "nsis": {
                  "oneClick": "false",
                  "allowToChangeInstallationDirectory": "true"
                }
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
