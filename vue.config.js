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
    pages: {
        //主页面
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'washing',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
        //第二个页面
        worker: {
            // entry for the page
            entry: 'src/worker.js',
            // the source template
            // template: 'public/subpage.html',
            // output as dist/index.html
            filename: 'worker.html',
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Worker Page',
            // chunks to include on this page, by default includes
            // extracted common chunks and vendor chunks.
            chunks: ['chunk-vendors', 'chunk-common', 'worker'],
            templateParameters(compilation, assets, options) {
                return {
                  compilation: compilation,
                  webpack: compilation.getStats().toJson(),
                  webpackConfig: compilation.options,
                  htmlWebpackPlugin: {
                    files: assets,
                    options: options
                  },
                  process,
                };
            },
            nodeModules: process.env.NODE_ENV !== 'production'
            ? path.resolve(__dirname, '../node_modules')
            : false
        }
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            externals: ['serialport'],
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
                  "allowToChangeInstallationDirectory": "true",
                  "perMachine": "true"
                },
                "asar": true,
                "publish": ['github']
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
