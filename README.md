# washing

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 使用

### 产线数据处理

按步骤操作

### AP数据处理

将AP导出的xlsx直接拖进来即可处理

### 自动输入FAQ

选择ANC工具的类型，默认BES，可选wuqi、Airoda

将窗口置顶，鼠标放在第一个输出窗口按下ctrl+Q即可开始
#开发记录

## 开发记录

### 打包优化 

#### webpack-bundle-analyzer 分析体积
```
chainWebpack: config => {
  config
  .plugin('webpack-bundle-analyzer')
  .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
}
```
- 1.antd组件按需加载

- 2.优化掉没用上的 @ant-design/icons

    antd v2增加了按需引入

- 3.优化掉没用的 lodash

参考：

https://www.jianshu.com/p/cd7fd063e07d 
    
https://juejin.cn/post/6913531130180272142/#heading-2
