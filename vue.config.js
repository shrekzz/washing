const path = require('path')
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin")
module.exports = {
    chainWebpack: config => {
        // 打包分析
        // config
        // .plugin('webpack-bundle-analyzer')
        // .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        // 优化 lodash 80k -> 35k
        config
        .plugin('loadshReplace')
        .use(new LodashModuleReplacementPlugin())
        // 优化 @ant-design/icons
        config
        .resolve
        .alias
        .set(['@ant-design/icons/lib/dist$'], path.resolve(__dirname,'./src/utils/icons.js'))
    },
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
                "asar": true
            }
        }
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
