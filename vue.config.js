
module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions : {
                "appId": "com.shrekz",
                "win": {
                  "icon": "build/logo.png"
                },
                "icon": "build/logo.png",
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
