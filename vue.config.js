
module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions : {
                "appId": "com.shrekz",
                "win": {
                  "icon": "build/logo.ico"
                },
                "icon": "build/logo.ico",
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
    }, 
}
