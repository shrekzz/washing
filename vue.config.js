
module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
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
    }, 
}
